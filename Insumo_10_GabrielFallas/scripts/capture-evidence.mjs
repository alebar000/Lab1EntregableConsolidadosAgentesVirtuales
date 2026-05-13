import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

function parseArgs(argv) {
	const args = new Map();
	for (let i = 0; i < argv.length; i += 1) {
		const token = argv[i];
		if (!token?.startsWith("--")) continue;
		const key = token.slice(2);
		const value = argv[i + 1];
		if (value && !value.startsWith("--")) {
			args.set(key, value);
			i += 1;
		} else {
			args.set(key, true);
		}
	}
	return args;
}

async function fileExists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

async function resolveBrowserPath() {
	const fromEnv = process.env.BROWSER_PATH;
	if (fromEnv) return fromEnv;

	const candidates = [
		// Edge
		"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
		"C:/Program Files/Microsoft/Edge/Application/msedge.exe",
		// Chrome (if present)
		"C:/Program Files/Google/Chrome/Application/chrome.exe",
		"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
		"C:/Users/" + process.env.USERNAME + "/AppData/Local/Google/Chrome/Application/chrome.exe",
	];

	for (const c of candidates) {
		const normalized = c.replaceAll("/", path.sep);
		if (await fileExists(normalized)) return normalized;
	}

	throw new Error(
		"No se encontró un navegador instalado. Configura BROWSER_PATH apuntando a msedge.exe o chrome.exe.",
	);
}

async function ensureEvidenceDir(rootDir) {
	const dir = path.join(rootDir, "docs", "evidence");
	await fs.mkdir(dir, { recursive: true });
	return dir;
}

async function waitForIdleStatus(page) {
	const status = page.locator("#status");
	await status.waitFor({ state: "visible", timeout: 30000 });
	await page.waitForFunction(() => {
		const el = document.querySelector("#status");
		if (!el) return false;
		return (el.textContent ?? "").trim().length === 0;
	});
	await page.waitForTimeout(250);
}

async function setModel(page, id) {
	await page.selectOption("select#model", id);
	await waitForIdleStatus(page);
}

async function ensureIdleNeutral(page) {
	await clickAction(page, "idle");
	await clickExpression(page, "neutral");
	// Let procedural weights settle and the renderer present a stable frame.
	await page.waitForTimeout(900);
}

async function clickAction(page, action) {
	await page.click(`button[data-action="${action}"]`);
	await page.waitForTimeout(action === "walk" ? 650 : 350);
}

async function clickExpression(page, expr) {
	await page.click(`button[data-expression="${expr}"]`);
	await page.waitForTimeout(350);
}

async function screenshot(page, outFile) {
	await page.screenshot({ path: outFile, fullPage: false });
}

async function removeOldEvidence(evidenceDir) {
	const entries = await fs.readdir(evidenceDir);
	const legacyPrefixes = ["seed-san-", "vrm1-constraint-", "alicia-solid-"];
	const toDelete = entries.filter((name) =>
		legacyPrefixes.some((p) => name.startsWith(p) && name.endsWith(".png")),
	);
	await Promise.all(
		toDelete.map((name) => fs.unlink(path.join(evidenceDir, name)).catch(() => {})),
	);
}

const args = parseArgs(process.argv.slice(2));
const url = args.get("url");
if (!url || typeof url !== "string") {
	console.error("Uso: node scripts/capture-evidence.mjs --url http://127.0.0.1:4173/");
	process.exit(1);
}

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const AGENTS = [
	{ id: "zed", prefix: "zed" },
	{ id: "yuki", prefix: "yuki" },
	{ id: "alicia", prefix: "alicia" },
];

const only = args.get("only");
const selectedAgents =
	only && typeof only === "string"
		? AGENTS.filter((a) => a.id === only || a.prefix === only)
		: AGENTS;

const ACTIONS = ["wave", "nod", "point", "walk"];
const EXPRESSIONS = [
	{ id: "joy", suffix: "joy" },
	{ id: "sad", suffix: "sad" },
	{ id: "doubt", suffix: "doubt" },
];

const browserPath = await resolveBrowserPath();
const evidenceDir = await ensureEvidenceDir(ROOT_DIR);

const browser = await chromium.launch({
	headless: true,
	executablePath: browserPath,
	args: ["--disable-dev-shm-usage"],
});

const context = await browser.newContext({
	viewport: { width: 1400, height: 820 },
	deviceScaleFactor: 1,
});

const page = await context.newPage();
page.setDefaultTimeout(30000);

try {
	await page.goto(url, { waitUntil: "domcontentloaded" });
	await page.waitForSelector("canvas#vrm-canvas", { state: "visible" });
	await page.waitForSelector("select#model", { state: "visible" });
	// The app loads a default model on startup. If we switch models before that
	// finishes, two concurrent loads can race and leave the first model behind.
	await waitForIdleStatus(page);

	await removeOldEvidence(evidenceDir);

	for (const agent of selectedAgents) {
		await setModel(page, agent.id);
		await ensureIdleNeutral(page);
		await screenshot(page, path.join(evidenceDir, `${agent.prefix}-view.png`));

		for (const action of ACTIONS) {
			await clickAction(page, action);
			await screenshot(page, path.join(evidenceDir, `${agent.prefix}-${action}.png`));
		}

		// Reset action/expression before expressions.
		await ensureIdleNeutral(page);

		for (const expr of EXPRESSIONS) {
			await clickExpression(page, expr.id);
			await screenshot(
				page,
				path.join(evidenceDir, `${agent.prefix}-expr-${expr.suffix}.png`),
			);
		}
	}

	console.log(`OK: Evidencias generadas en ${evidenceDir}`);
} finally {
	await page.close().catch(() => {});
	await context.close().catch(() => {});
	await browser.close().catch(() => {});
}
