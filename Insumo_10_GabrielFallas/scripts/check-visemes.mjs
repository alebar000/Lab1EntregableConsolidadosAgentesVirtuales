import fs from "node:fs/promises";
import path from "node:path";

const VRM_FILES = [
	{ id: "zed", file: "public/models/zed.vrm" },
	{
		id: "yuki",
		file: "public/models/yuki.vrm",
	},
	{ id: "alicia", file: "public/models/alicia.vrm" },
];

function sortStrings(values) {
	return values.toSorted((left, right) => left.localeCompare(right));
}

function readUint32LE(buffer, offset) {
	return buffer.readUInt32LE(offset);
}

function parseGlbJson(buffer) {
	const magic = buffer.toString("utf8", 0, 4);
	if (magic !== "glTF") throw new Error(`Not a GLB/VRM file (magic=${magic})`);

	let offset = 12;
	while (offset < buffer.length) {
		const chunkLength = readUint32LE(buffer, offset);
		const chunkType = readUint32LE(buffer, offset + 4);
		offset += 8;

		const chunkData = buffer.subarray(offset, offset + chunkLength);
		offset += chunkLength;

		if (chunkType === 0x4e4f534a) {
			const jsonText = new TextDecoder("utf-8").decode(chunkData);
			return JSON.parse(jsonText);
		}
	}

	throw new Error("GLB missing JSON chunk");
}

function getVisemeInfo(json) {
	const ext = json?.extensions ?? {};

	// VRM 1.0
	if (ext.VRMC_vrm?.expressions) {
		const presets = ext.VRMC_vrm.expressions.preset ?? {};
		const presetKeys = Object.keys(presets);
		const visemeKeys = ["aa", "ih", "ou", "ee", "oh"].filter((k) =>
			presetKeys.includes(k),
		);
		return { version: "VRM1", presetKeys: sortStrings(presetKeys), visemeKeys };
	}

	// VRM 0.x
	if (ext.VRM?.blendShapeMaster?.blendShapeGroups) {
		const groups = ext.VRM.blendShapeMaster.blendShapeGroups;
		const presetNames = groups
			.map((g) => g.presetName)
			.filter(Boolean)
			.map(String);

		// Common VRM0 viseme preset names are a/i/u/e/o.
		const visemeKeys = ["a", "i", "u", "e", "o"].filter((k) =>
			presetNames.includes(k),
		);

		return {
			version: "VRM0",
			presetKeys: sortStrings(Array.from(new Set(presetNames))),
			visemeKeys,
		};
	}

	return { version: "unknown", presetKeys: [], visemeKeys: [] };
}

for (const f of VRM_FILES) {
	const abs = path.resolve(f.file);
	const buf = await fs.readFile(abs);
	const json = parseGlbJson(buf);
	const info = getVisemeInfo(json);

	console.log(`\n=== ${f.id} (${info.version}) ===`);
	console.log(
		JSON.stringify(
			{
				visemeKeys: info.visemeKeys,
				samplePresets: info.presetKeys.slice(0, 25),
				presetCount: info.presetKeys.length,
			},
			null,
			2,
		),
	);
}

