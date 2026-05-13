import "./style.css";

import { AGENTS, type AgentAction, type AgentExpression } from "./agentModels";
import { VrmAgentViewer } from "./vrmAgentViewer";

const appEl = document.querySelector<HTMLDivElement>("#app");
if (!appEl) {
	throw new Error("No se encontró #app");
}

appEl.innerHTML = `
  <div class="app">
    <section class="viewer" aria-label="Vista 3D">
      <canvas id="vrm-canvas"></canvas>
      <div class="overlay">
        <div id="status" class="status" role="status" aria-live="polite"></div>
      </div>
    </section>

    <aside class="panel" aria-label="Controles">
      <header class="panel__header">
	        <p class="eyebrow">PF-3312 / Three.js + VRM</p>
		        <h1>Alicia, Zed y Yuki</h1>
		        <p class="panel__intro">Tres perfiles con roles definidos, voces diferenciadas y evidencia tecnica visible dentro del motor grafico.</p>
      </header>

      <div class="panel__section">
	        <label for="model">Modelo activo</label>
        <select id="model" name="model"></select>
	        <div class="state-bar">
	          <span id="current-action" class="pill">Accion: Idle</span>
	          <span id="current-expression" class="pill">Expresion: Neutral</span>
	          <span class="pill pill--ok">Rigging listo</span>
	          <span class="pill pill--ok">Blendshapes listos</span>
	        </div>
        <p id="credit" class="muted"></p>
	        <div class="link-row">
	          <a id="source" class="link" href="#" target="_blank" rel="noreferrer">Fuente del modelo</a>
	          <a id="license" class="link" href="#" target="_blank" rel="noreferrer">Licencia</a>
	        </div>
	      </div>

	      <div class="panel__section">
	        <article class="info-card">
	          <h2>Perfil del agente</h2>
	          <p id="profile-title" class="panel__lead"></p>
	          <p id="profile-role" class="body-copy"></p>
	          <p id="profile-personality" class="body-copy"></p>
	          <p id="profile-context" class="body-copy"></p>
	        </article>
	      </div>

	      <div class="panel__section">
	        <article class="info-card">
	          <h2>Justificacion de apariencia</h2>
	          <p id="appearance-why" class="body-copy"></p>
	          <p id="voice-profile" class="body-copy"></p>
	        </article>
      </div>

      <div class="panel__section">
        <h2>Acciones</h2>
        <div class="row">
          <button type="button" class="btn" data-action="idle">Idle</button>
          <button type="button" class="btn" data-action="wave">Saludar</button>
          <button type="button" class="btn" data-action="nod">Asentir</button>
          <button type="button" class="btn" data-action="point">Señalar</button>
					<button type="button" class="btn" data-action="walk">Caminar</button>
        </div>
      </div>

      <div class="panel__section">
        <h2>Expresiones</h2>
        <div class="row">
          <button type="button" class="btn" data-expression="neutral">Neutral</button>
          <button type="button" class="btn" data-expression="joy">Alegría</button>
          <button type="button" class="btn" data-expression="sad">Tristeza</button>
          <button type="button" class="btn" data-expression="doubt">Duda</button>
        </div>
      </div>

      <div class="panel__section">
        <h2>Lip-sync</h2>
        <div class="row">
          <button id="speak" type="button" class="btn">Hablar (audio)</button>
          <button id="stop" type="button" class="btn">Detener</button>
        </div>
      </div>

      <div class="panel__section">
        <h2>Datos técnicos</h2>
	        <p id="analysis-summary" class="body-copy body-copy--compact"></p>
        <pre id="tech" class="tech"></pre>
      </div>
    </aside>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#vrm-canvas");
const statusEl = document.querySelector<HTMLDivElement>("#status");
const modelSelect = document.querySelector<HTMLSelectElement>("#model");
const currentActionEl =
	document.querySelector<HTMLSpanElement>("#current-action");
const currentExpressionEl = document.querySelector<HTMLSpanElement>(
	"#current-expression",
);
const profileTitleEl =
	document.querySelector<HTMLParagraphElement>("#profile-title");
const profileRoleEl =
	document.querySelector<HTMLParagraphElement>("#profile-role");
const profilePersonalityEl = document.querySelector<HTMLParagraphElement>(
	"#profile-personality",
);
const profileContextEl =
	document.querySelector<HTMLParagraphElement>("#profile-context");
const appearanceWhyEl =
	document.querySelector<HTMLParagraphElement>("#appearance-why");
const voiceProfileEl =
	document.querySelector<HTMLParagraphElement>("#voice-profile");
const analysisSummaryEl =
	document.querySelector<HTMLParagraphElement>("#analysis-summary");
const techEl = document.querySelector<HTMLPreElement>("#tech");
const creditEl = document.querySelector<HTMLParagraphElement>("#credit");
const sourceEl = document.querySelector<HTMLAnchorElement>("#source");
const licenseEl = document.querySelector<HTMLAnchorElement>("#license");
const speakBtn = document.querySelector<HTMLButtonElement>("#speak");
const stopBtn = document.querySelector<HTMLButtonElement>("#stop");

if (
	!canvas ||
	!statusEl ||
	!modelSelect ||
	!currentActionEl ||
	!currentExpressionEl ||
	!profileTitleEl ||
	!profileRoleEl ||
	!profilePersonalityEl ||
	!profileContextEl ||
	!appearanceWhyEl ||
	!voiceProfileEl ||
	!analysisSummaryEl ||
	!techEl ||
	!creditEl ||
	!sourceEl ||
	!licenseEl ||
	!speakBtn ||
	!stopBtn
) {
	throw new Error("Faltan elementos del DOM");
}

const status = statusEl;
const model = modelSelect;
const currentAction = currentActionEl;
const currentExpression = currentExpressionEl;
const profileTitle = profileTitleEl;
const profileRole = profileRoleEl;
const profilePersonality = profilePersonalityEl;
const profileContext = profileContextEl;
const appearanceWhy = appearanceWhyEl;
const voiceProfile = voiceProfileEl;
const analysisSummary = analysisSummaryEl;
const techPre = techEl;
const credit = creditEl;
const source = sourceEl;
const license = licenseEl;

const viewer = new VrmAgentViewer(canvas);

const viewerEl = canvas.closest<HTMLElement>(".viewer");
if (viewerEl) {
	const ro = new ResizeObserver((entries) => {
		const entry = entries[0];
		if (!entry) return;
		const { width, height } = entry.contentRect;
		viewer.resize(Math.floor(width), Math.floor(height));
	});
	ro.observe(viewerEl);
}

function setStatus(message: string): void {
	status.textContent = message;
}

function setCurrentActionLabel(label: string): void {
	currentAction.textContent = `Accion: ${label}`;
}

function setCurrentExpressionLabel(label: string): void {
	currentExpression.textContent = `Expresion: ${label}`;
}

function summarizeTechnicalInfo(
	info: Awaited<ReturnType<VrmAgentViewer["loadAgent"]>>,
): string {
	return `Rig humanoide detectado con ${info.skinnedMeshes} skinned meshes, ${info.maxJoints} joints maximos y ${info.expressions.length} blendshapes o presets disponibles.`;
}

function formatTech(
	info: Awaited<ReturnType<VrmAgentViewer["loadAgent"]>>,
): string {
	return [
		`triangles: ${info.triangles}`,
		`vertices: ${info.vertices}`,
		`skinnedMeshes: ${info.skinnedMeshes}`,
		`maxJoints: ${info.maxJoints}`,
		"",
		"expressions:",
		...info.expressions.map((x) => `- ${x}`),
		"",
		"resolvedPresets:",
		`- mouth: ${info.resolvedPresets.mouth ?? "(no)"} `,
		`- joy: ${info.resolvedPresets.joy ?? "(no)"} `,
		`- sad: ${info.resolvedPresets.sad ?? "(no)"} `,
		`- doubtPrimary: ${info.resolvedPresets.doubtPrimary ?? "(no)"} `,
		`- doubtSecondary: ${info.resolvedPresets.doubtSecondary ?? "(no)"} `,
	].join("\n");
}

function setActiveButton(
	groupSelector: string,
	attr: string,
	value: string,
): void {
	const buttons = document.querySelectorAll<HTMLButtonElement>(
		`${groupSelector} .btn[${attr}]`,
	);
	for (const btn of buttons) {
		const isActive = btn.getAttribute(attr) === value;
		btn.classList.toggle("btn--active", isActive);
	}
}

function isAgentAction(value: string): value is AgentAction {
	return (
		value === "idle" ||
		value === "wave" ||
		value === "nod" ||
		value === "point" ||
		value === "walk"
	);
}

function isAgentExpression(value: string): value is AgentExpression {
	return (
		value === "neutral" ||
		value === "joy" ||
		value === "sad" ||
		value === "doubt"
	);
}

async function loadSelectedAgent(): Promise<void> {
	const id = model.value;
	const agent = AGENTS.find((a) => a.id === id);
	if (!agent) return;

	profileTitle.textContent = agent.profileTitle;
	profileRole.textContent = `Rol: ${agent.roleSummary}`;
	profilePersonality.textContent = `Personalidad: ${agent.personalitySummary}`;
	profileContext.textContent = `Contexto de uso: ${agent.interactionContext}`;
	appearanceWhy.textContent = agent.appearanceJustification;
	voiceProfile.textContent = `Voz y lip-sync: ${agent.voiceProfile}`;
	credit.textContent = `Créditos: ${agent.authorCredit}`;
	source.href = agent.sourceUrl;
	source.textContent = "Fuente del modelo";
	license.href = agent.licenseUrl;
	license.textContent = `Licencia: ${agent.licenseName}`;
	setCurrentActionLabel("Idle");
	setCurrentExpressionLabel("Neutral");

	setStatus("Cargando modelo…");
	analysisSummary.textContent = "";
	techPre.textContent = "";

	try {
		const techInfo = await viewer.loadAgent(agent);
		analysisSummary.textContent = summarizeTechnicalInfo(techInfo);
		techPre.textContent = formatTech(techInfo);
		setStatus("");
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		setStatus(`Error: ${msg}`);
	}
}

for (const agent of AGENTS) {
	const opt = document.createElement("option");
	opt.value = agent.id;
	opt.textContent = agent.displayName;
	model.append(opt);
}

model.addEventListener("change", () => {
	void loadSelectedAgent();
});

document.addEventListener("click", (ev) => {
	const target = ev.target;
	if (!(target instanceof HTMLElement)) return;

	const action = target.dataset.action;
	if (action && isAgentAction(action)) {
		viewer.setAction(action);
		setActiveButton(".panel", "data-action", action);
		const labelMap: Record<AgentAction, string> = {
			idle: "Idle",
			wave: "Saludar",
			nod: "Asentir",
			point: "Senalar",
			walk: "Caminar",
		};
		setCurrentActionLabel(labelMap[action]);
		return;
	}

	const expression = target.dataset.expression;
	if (expression && isAgentExpression(expression)) {
		viewer.setExpression(expression);
		setActiveButton(".panel", "data-expression", expression);
		const labelMap: Record<AgentExpression, string> = {
			neutral: "Neutral",
			joy: "Alegria",
			sad: "Tristeza",
			doubt: "Duda",
		};
		setCurrentExpressionLabel(labelMap[expression]);
	}
});

speakBtn.addEventListener("click", () => {
	void viewer.speak();
});

stopBtn.addEventListener("click", () => {
	viewer.stopSpeaking();
});

// Defaults.
model.value = AGENTS[0].id;
setActiveButton(".panel", "data-action", "idle");
setActiveButton(".panel", "data-expression", "neutral");
setCurrentActionLabel("Idle");
setCurrentExpressionLabel("Neutral");
await loadSelectedAgent();

