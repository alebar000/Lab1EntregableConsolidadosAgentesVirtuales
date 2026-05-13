import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
	VRM,
	VRMLoaderPlugin,
	VRMUtils,
	VRMHumanBoneName,
	VRMExpressionPresetName,
} from "@pixiv/three-vrm";

import type { AgentAction, AgentExpression, AgentModel } from "./agentModels";

export interface AgentTechnicalInfo {
	triangles: number;
	vertices: number;
	skinnedMeshes: number;
	maxJoints: number;
	expressions: string[];
	resolvedPresets: {
		mouth: string | null;
		joy: string | null;
		sad: string | null;
		doubtPrimary: string | null;
		doubtSecondary: string | null;
	};
}

type ResolvedPresets = AgentTechnicalInfo["resolvedPresets"];

type AudioState =
	| {
			kind: "idle";
	  }
	| {
			kind: "playing";
			audio: HTMLAudioElement;
			ctx: AudioContext;
			analyser: AnalyserNode;
			data: Uint8Array<ArrayBuffer>;
			mouthPreset: string;
	  };

type WavePoseTuning = {
	wristWaveDeg: number;
	handPitchDeg: number;
	upperPitchDeg: number;
	upperYawDeg: number;
	upperRaiseDeg: number;
	elbowFlexDeg: number;
	spineYawDeg: number;
	spineRollDeg: number;
	headYawDeg: number;
	headRollDeg: number;
};

const WAVE_POSE: WavePoseTuning = {
	wristWaveDeg: 14,
	handPitchDeg: 90,
	upperPitchDeg: -3,
	upperYawDeg: -11,
	upperRaiseDeg: 48,
	elbowFlexDeg: 46,
	spineYawDeg: -3,
	spineRollDeg: -1.5,
	headYawDeg: -6,
	headRollDeg: -1.5,
};

const ACTIONS: readonly Exclude<AgentAction, "idle">[] = [
	"wave",
	"nod",
	"point",
	"walk",
];

const PROCEDURAL_BONES: readonly VRMHumanBoneName[] = [
	VRMHumanBoneName.Hips,
	VRMHumanBoneName.Spine,
	VRMHumanBoneName.Neck,
	VRMHumanBoneName.Head,
	VRMHumanBoneName.RightUpperArm,
	VRMHumanBoneName.RightLowerArm,
	VRMHumanBoneName.RightHand,
	VRMHumanBoneName.LeftUpperArm,
	VRMHumanBoneName.LeftLowerArm,
	VRMHumanBoneName.LeftHand,
	VRMHumanBoneName.RightUpperLeg,
	VRMHumanBoneName.RightLowerLeg,
	VRMHumanBoneName.RightFoot,
	VRMHumanBoneName.LeftUpperLeg,
	VRMHumanBoneName.LeftLowerLeg,
	VRMHumanBoneName.LeftFoot,
];

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, value));
}

function damp(
	current: number,
	target: number,
	lambda: number,
	dt: number,
): number {
	// Exponential smoothing: https://www.ryanjuckett.com/damped-springs/
	return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

function pickFirstAvailable(
	available: Set<string>,
	candidates: string[],
): string | null {
	for (const c of candidates) {
		if (available.has(c)) return c;
	}
	return null;
}

function degrees(value: number): number {
	return (value * Math.PI) / 180;
}

export class VrmAgentViewer {
	private readonly canvas: HTMLCanvasElement;

	private readonly renderer: THREE.WebGLRenderer;
	private readonly scene: THREE.Scene;
	private readonly camera: THREE.PerspectiveCamera;
	private lastFrameTime = performance.now();
	private elapsedTime = 0;

	private readonly modelRoot = new THREE.Group();
	private readonly loader: GLTFLoader;
	private framedModelHeight = 1;
	private framedModelWidth = 1;
	private framedModelDepth = 1;

	private currentAgent: AgentModel | null = null;
	private currentVrm: VRM | null = null;

	private readonly baseBoneQuats = new Map<
		VRMHumanBoneName,
		THREE.Quaternion
	>();
	private readonly baseBonePositions = new Map<
		VRMHumanBoneName,
		THREE.Vector3
	>();

	private actionTargets: Record<Exclude<AgentAction, "idle">, number> = {
		wave: 0,
		nod: 0,
		point: 0,
		walk: 0,
	};

	private actionWeights: Record<Exclude<AgentAction, "idle">, number> = {
		wave: 0,
		nod: 0,
		point: 0,
		walk: 0,
	};

	private faceExpression: AgentExpression = "neutral";
	private presets: ResolvedPresets = {
		mouth: null,
		joy: null,
		sad: null,
		doubtPrimary: null,
		doubtSecondary: null,
	};

	private audioState: AudioState = { kind: "idle" };
	private mouthWeight = 0;

	private lastTechInfo: AgentTechnicalInfo | null = null;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
		});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

		this.scene = new THREE.Scene();
		this.scene.add(this.modelRoot);

		this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
		this.camera.position.set(0, 1.35, 2.4);

		const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
		hemi.position.set(0, 1, 0);
		this.scene.add(hemi);

		const dir = new THREE.DirectionalLight(0xffffff, 1.1);
		dir.position.set(2, 3, 2);
		this.scene.add(dir);

		this.loader = new GLTFLoader();
		this.loader.register((parser) => new VRMLoaderPlugin(parser));

		this.renderer.setAnimationLoop(() => this.onFrame());
	}

	resize(width: number, height: number): void {
		if (width <= 0 || height <= 0) return;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height, false);

		if (this.currentVrm) {
			this.fitCameraToCurrentModel();
		}
	}

	async loadAgent(agent: AgentModel): Promise<AgentTechnicalInfo> {
		this.currentAgent = agent;
		this.stopSpeaking();

		// Clear previous model.
		this.modelRoot.clear();
		this.modelRoot.position.set(0, 0, 0);
		this.modelRoot.rotation.set(0, 0, 0);
		this.baseBoneQuats.clear();
		this.baseBonePositions.clear();
		this.currentVrm = null;

		const vrm = await this.loadVrm(agent.modelUrl);
		if (!vrm.expressionManager) {
			throw new Error(
				"El modelo no incluye expressions/blendshapes (expressionManager)",
			);
		}
		this.currentVrm = vrm;

		VRMUtils.rotateVRM0(vrm);

		// Common VRM cleanup recommended by three-vrm.
		VRMUtils.removeUnnecessaryVertices(vrm.scene);
		VRMUtils.combineSkeletons(vrm.scene);

		this.modelRoot.add(vrm.scene);

		this.frameCameraToObject(vrm.scene);

		// Prepare bones base rotations for procedural actions.
		this.captureBaseBoneQuats(vrm);

		// Resolve expression preset names per model.
		this.presets = this.resolvePresets(vrm);

		// Reset states.
		for (const a of ACTIONS) {
			this.actionTargets[a] = 0;
			this.actionWeights[a] = 0;
		}
		this.mouthWeight = 0;
		this.faceExpression = "neutral";

		const tech = this.computeTechnicalInfo(vrm);
		this.lastTechInfo = tech;
		return tech;
	}

	setAction(action: AgentAction): void {
		for (const a of ACTIONS) this.actionTargets[a] = 0;

		if (action !== "idle") {
			this.actionTargets[action] = 1;
		}
	}

	setExpression(expression: AgentExpression): void {
		this.faceExpression = expression;
	}

	async speak(): Promise<void> {
		if (!this.currentAgent || !this.currentVrm) return;

		this.stopSpeaking();

		const vrm = this.currentVrm;
		if (!vrm.expressionManager) return;
		const mouthPreset = this.presets.mouth;
		if (!mouthPreset) return;

		const audio = new Audio(this.currentAgent.audioUrl);
		audio.preload = "auto";
		audio.crossOrigin = "anonymous";

		const ctx = new AudioContext();
		const source = ctx.createMediaElementSource(audio);
		const analyser = ctx.createAnalyser();

		analyser.fftSize = 1024;
		analyser.smoothingTimeConstant = 0.6;

		source.connect(analyser);
		analyser.connect(ctx.destination);

		const data: Uint8Array<ArrayBuffer> = new Uint8Array(
			analyser.frequencyBinCount,
		);

		this.audioState = {
			kind: "playing",
			audio,
			ctx,
			analyser,
			data,
			mouthPreset,
		};

		// VRM: mark these expressions as mouth-related so they can override/look correct.
		// (Harmless if the preset doesn't exist.)
		vrm.expressionManager.mouthExpressionNames = [
			VRMExpressionPresetName.Aa,
			VRMExpressionPresetName.Ih,
			VRMExpressionPresetName.Ou,
			VRMExpressionPresetName.Ee,
			VRMExpressionPresetName.Oh,
			"a",
			"i",
			"u",
			"e",
			"o",
		];

		await ctx.resume();
		await audio.play();

		audio.addEventListener(
			"ended",
			() => {
				this.stopSpeaking();
			},
			{ once: true },
		);
	}

	stopSpeaking(): void {
		if (this.audioState.kind === "playing") {
			const { audio, ctx, mouthPreset } = this.audioState;
			audio.pause();
			audio.currentTime = 0;

			// Reset mouth.
			this.currentVrm?.expressionManager?.setValue(mouthPreset, 0);

			void ctx.close().catch(() => undefined);
		}

		this.mouthWeight = 0;
		this.audioState = { kind: "idle" };
	}

	getLastTechnicalInfo(): AgentTechnicalInfo | null {
		return this.lastTechInfo;
	}

	private async loadVrm(url: string): Promise<VRM> {
		const gltf = await this.loader.loadAsync(url);
		const vrm = gltf.userData.vrm;

		if (!vrm) {
			throw new Error(`El archivo no contiene un VRM válido: ${url}`);
		}

		return vrm;
	}

	private frameCameraToObject(object: THREE.Object3D): void {
		const box = new THREE.Box3().setFromObject(object);
		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());

		// Keep the feet on the virtual floor and center the model horizontally.
		this.modelRoot.position.set(-center.x, -box.min.y + 0.02, -center.z);
		this.modelRoot.rotation.set(0, 0, 0);

		this.framedModelHeight = Math.max(size.y, 1);
		this.framedModelWidth = Math.max(size.x, 0.45);
		this.framedModelDepth = Math.max(size.z, 0.35);
		this.fitCameraToCurrentModel();
	}

	private fitCameraToCurrentModel(): void {
		const verticalFov = THREE.MathUtils.degToRad(this.camera.fov);
		const horizontalFov =
			2 *
			Math.atan(Math.tan(verticalFov / 2) * Math.max(this.camera.aspect, 1e-3));
		const paddedHeight = this.framedModelHeight * 1.16;
		const paddedWidth = this.framedModelWidth * 1.34;
		const fitHeightDistance = paddedHeight / (2 * Math.tan(verticalFov / 2));
		const fitWidthDistance = paddedWidth / (2 * Math.tan(horizontalFov / 2));
		const distance =
			Math.max(fitHeightDistance, fitWidthDistance) +
			this.framedModelDepth * 1.4;
		const targetY = this.framedModelHeight * 0.5;
		this.camera.position.set(
			0,
			targetY + this.framedModelHeight * 0.03,
			distance,
		);
		this.camera.lookAt(0, targetY, 0);
	}

	private captureBaseBoneQuats(vrm: VRM): void {
		for (const n of PROCEDURAL_BONES) {
			const bone = vrm.humanoid.getNormalizedBoneNode(n);
			if (!bone) continue;

			this.baseBoneQuats.set(n, bone.quaternion.clone());
			this.baseBonePositions.set(n, bone.position.clone());
		}
	}

	private resolvePresets(vrm: VRM): ResolvedPresets {
		const mgr = vrm.expressionManager;
		if (!mgr) {
			return {
				mouth: null,
				joy: null,
				sad: null,
				doubtPrimary: null,
				doubtSecondary: null,
			};
		}

		const available = new Set(Object.keys(mgr.expressionMap));

		// Lip-sync mouth preset.
		const mouth = pickFirstAvailable(available, ["aa", "a"]);

		// Facial expressions.
		const joy = pickFirstAvailable(available, ["happy", "joy", "fun"]);
		const sad = pickFirstAvailable(available, ["sad", "sorrow"]);

		// Doubt: prefer a single preset (surprised) or a look-at expression, with optional secondary.
		const doubtPrimary = pickFirstAvailable(available, [
			"surprised",
			"lookLeft",
			"lookleft",
			"lookRight",
			"lookright",
		]);
		const doubtSecondary = pickFirstAvailable(available, ["neutral"]);

		return { mouth, joy, sad, doubtPrimary, doubtSecondary };
	}

	private computeTechnicalInfo(vrm: VRM): AgentTechnicalInfo {
		let vertices = 0;
		let triangles = 0;
		let skinnedMeshes = 0;
		let maxJoints = 0;

		vrm.scene.traverse((obj) => {
			const anyObj = obj as unknown as { isSkinnedMesh?: boolean };
			if (anyObj.isSkinnedMesh) {
				skinnedMeshes += 1;
				const mesh = obj as THREE.SkinnedMesh;
				if (mesh.skeleton?.bones?.length) {
					maxJoints = Math.max(maxJoints, mesh.skeleton.bones.length);
				}
			}

			if ((obj as THREE.Mesh).isMesh) {
				const mesh = obj as THREE.Mesh;
				const geom = mesh.geometry;
				const pos = geom.getAttribute("position");
				if (pos) vertices += pos.count;

				if (geom.index) triangles += Math.floor(geom.index.count / 3);
				else if (pos) triangles += Math.floor(pos.count / 3);
			}
		});

		const expressions = vrm.expressionManager
			? Object.keys(vrm.expressionManager.expressionMap).toSorted(
					(left, right) => left.localeCompare(right),
				)
			: [];

		return {
			triangles,
			vertices,
			skinnedMeshes,
			maxJoints,
			expressions,
			resolvedPresets: { ...this.presets },
		};
	}

	private applyExpressions(vrm: VRM): void {
		// Face expression weights.
		const mgr = vrm.expressionManager;
		if (!mgr) return;

		const resolved = this.presets;

		// Reset only face-related presets we may touch (do not reset blink/lookAt here).
		const facePresets = [
			resolved.joy,
			resolved.sad,
			resolved.doubtPrimary,
			resolved.doubtSecondary,
		].filter((x): x is string => Boolean(x));

		for (const name of facePresets) mgr.setValue(name, 0);

		if (this.faceExpression === "neutral") {
			// No-op.
		} else if (this.faceExpression === "joy" && resolved.joy) {
			mgr.setValue(resolved.joy, 1);
		} else if (this.faceExpression === "sad" && resolved.sad) {
			mgr.setValue(resolved.sad, 1);
		} else if (this.faceExpression === "doubt" && resolved.doubtPrimary) {
			mgr.setValue(resolved.doubtPrimary, 0.7);
			if (resolved.doubtSecondary) mgr.setValue(resolved.doubtSecondary, 0.25);
		}

		// Lip-sync (mouth) is driven by audio state elsewhere.

		// Expression system is updated via vrm.update(delta).
	}

	private applyActions(vrm: VRM, elapsed: number, dt: number): void {
		this.updateActionWeights(dt);
		this.resetPose(vrm);

		const head = vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Head);
		const neck = vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Neck);
		const spine = vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Spine);
		const hips = vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Hips);
		const rightUpperArm = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.RightUpperArm,
		);
		const rightLowerArm = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.RightLowerArm,
		);
		const rightHand = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.RightHand,
		);
		const leftUpperArm = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.LeftUpperArm,
		);
		const leftLowerArm = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.LeftLowerArm,
		);
		const rightUpperLeg = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.RightUpperLeg,
		);
		const rightLowerLeg = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.RightLowerLeg,
		);
		const rightFoot = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.RightFoot,
		);
		const leftUpperLeg = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.LeftUpperLeg,
		);
		const leftLowerLeg = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.LeftLowerLeg,
		);
		const leftFoot = vrm.humanoid.getNormalizedBoneNode(
			VRMHumanBoneName.LeftFoot,
		);

		const waveW = this.actionWeights.wave;
		const nodW = this.actionWeights.nod;
		const pointW = this.actionWeights.point;
		const walkW = this.actionWeights.walk;
		const activeW = Math.max(waveW, nodW, pointW, walkW);
		const idlePostureW = clamp01(1 - activeW) * 0.85;

		this.applyIdleBreathing(spine, hips, head, elapsed);
		if (idlePostureW > 0.001) {
			this.applyRelaxedUpperArm(rightUpperArm, -1, idlePostureW);
			this.applyRelaxedUpperArm(leftUpperArm, 1, idlePostureW);
		}
		this.applyWaveAction(
			rightUpperArm,
			rightLowerArm,
			rightHand,
			leftUpperArm,
			spine,
			head,
			elapsed,
			waveW,
		);
		this.applyNodAction(
			head,
			neck,
			spine,
			rightUpperArm,
			leftUpperArm,
			elapsed,
			nodW,
		);
		this.applyPointAction(
			rightUpperArm,
			rightLowerArm,
			rightHand,
			leftUpperArm,
			spine,
			head,
			pointW,
		);
		this.applyWalkAction(
			{
				hips,
				spine,
				head,
				rightUpperArm,
				rightLowerArm,
				leftUpperArm,
				leftLowerArm,
				rightUpperLeg,
				rightLowerLeg,
				rightFoot,
				leftUpperLeg,
				leftLowerLeg,
				leftFoot,
			},
			elapsed,
			walkW,
		);

		// Humanoid is updated via vrm.update(delta).
	}

	private updateActionWeights(dt: number): void {
		for (const action of ACTIONS) {
			this.actionWeights[action] = damp(
				this.actionWeights[action],
				this.actionTargets[action],
				10,
				dt,
			);
		}
	}

	private resetPose(vrm: VRM): void {
		for (const boneName of PROCEDURAL_BONES) {
			const bone = vrm.humanoid.getNormalizedBoneNode(boneName);
			if (!bone) continue;

			const baseQuat = this.baseBoneQuats.get(boneName);
			if (baseQuat) bone.quaternion.copy(baseQuat);

			const basePosition = this.baseBonePositions.get(boneName);
			if (basePosition) bone.position.copy(basePosition);
		}
	}

	private applyIdleBreathing(
		spine: THREE.Object3D | null,
		hips: THREE.Object3D | null,
		head: THREE.Object3D | null,
		elapsed: number,
	): void {
		if (!spine) return;

		const breath = Math.sin(elapsed * 1.6) * degrees(1.2);
		const sway = Math.sin(elapsed * 0.8) * degrees(1.1);
		const q = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(breath, 0, sway),
		);
		spine.quaternion.multiply(q);

		if (hips) {
			const basePosition = this.baseBonePositions.get(VRMHumanBoneName.Hips);
			if (basePosition) {
				hips.position.y = basePosition.y + Math.sin(elapsed * 1.6) * 0.005;
			}
		}

		if (head) {
			const headQ = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(0, Math.sin(elapsed * 0.8) * degrees(1.2), 0),
			);
			head.quaternion.multiply(headQ);
		}
	}

	private applyWaveAction(
		rightUpperArm: THREE.Object3D | null,
		rightLowerArm: THREE.Object3D | null,
		rightHand: THREE.Object3D | null,
		leftUpperArm: THREE.Object3D | null,
		spine: THREE.Object3D | null,
		head: THREE.Object3D | null,
		elapsed: number,
		weight: number,
	): void {
		if (!rightUpperArm || !rightLowerArm) return;

		const armOrientationSign = this.getArmOrientationSign();

		const wristWave =
			Math.sin(elapsed * 5.0) *
			degrees(WAVE_POSE.wristWaveDeg) *
			weight *
			armOrientationSign;

		this.applyRelaxedUpperArm(leftUpperArm, 1, weight);

		// Right arm in normalized space: +Z raises laterally, -Y brings it slightly forward.
		// Alicia is the reference; Zed and Yuki use the opposite rig-space sign.
		const upperQ = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(
				degrees(WAVE_POSE.upperPitchDeg) * weight,
				degrees(WAVE_POSE.upperYawDeg) * weight * armOrientationSign,
				degrees(WAVE_POSE.upperRaiseDeg) * weight * armOrientationSign,
			),
		);
		const lowerQ = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(
				0,
				0,
				degrees(WAVE_POSE.elbowFlexDeg) * weight * armOrientationSign,
			),
		);
		rightUpperArm.quaternion.multiply(upperQ);
		rightLowerArm.quaternion.multiply(lowerQ);

		if (rightHand) {
			const handQ = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(
					degrees(WAVE_POSE.handPitchDeg) * weight * armOrientationSign,
					wristWave,
					0,
				),
			);
			rightHand.quaternion.multiply(handQ);
		}

		if (spine) {
			const spineQ = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(
					0,
					degrees(WAVE_POSE.spineYawDeg) * weight,
					degrees(WAVE_POSE.spineRollDeg) * weight,
				),
			);
			spine.quaternion.multiply(spineQ);
		}

		if (head) {
			const headQ = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(
					0,
					degrees(WAVE_POSE.headYawDeg) * weight,
					degrees(WAVE_POSE.headRollDeg) * weight,
				),
			);
			head.quaternion.multiply(headQ);
		}
	}

	private applyNodAction(
		head: THREE.Object3D | null,
		neck: THREE.Object3D | null,
		spine: THREE.Object3D | null,
		rightUpperArm: THREE.Object3D | null,
		leftUpperArm: THREE.Object3D | null,
		elapsed: number,
		weight: number,
	): void {
		if (!head) return;

		this.applyRelaxedUpperArm(rightUpperArm, -1, weight);
		this.applyRelaxedUpperArm(leftUpperArm, 1, weight);

		const nod = Math.sin(elapsed * 2.6) * degrees(9) * weight;
		const headQ = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(nod, 0, 0),
		);
		head.quaternion.multiply(headQ);

		if (neck) {
			const neckQ = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(nod * 0.45, 0, 0),
			);
			neck.quaternion.multiply(neckQ);
		}

		if (spine) {
			const spineQ = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(nod * 0.18, 0, 0),
			);
			spine.quaternion.multiply(spineQ);
		}
	}

	private applyPointAction(
		rightUpperArm: THREE.Object3D | null,
		rightLowerArm: THREE.Object3D | null,
		_rightHand: THREE.Object3D | null,
		leftUpperArm: THREE.Object3D | null,
		spine: THREE.Object3D | null,
		head: THREE.Object3D | null,
		weight: number,
	): void {
		if (!rightUpperArm || !rightLowerArm) return;

		const armOrientationSign = this.getArmOrientationSign();
		this.applyRelaxedUpperArm(leftUpperArm, 1, weight);

		// Normalized space: rightUpperArm +X points right in T-pose.
		// Swing arm forward: rotate on -Y (yaw). Raise slightly: rotate on +Z.
		// Elbow stays extended: lowerArm gets only a tiny -Z to prevent hyper-extension.
		rightUpperArm.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(
				new THREE.Euler(
					0,
					-degrees(52) * weight * armOrientationSign,
					degrees(30) * weight * armOrientationSign,
				),
			),
		);
		// Elbow nearly extended.
		rightLowerArm.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(
				new THREE.Euler(0, 0, -degrees(8) * weight * armOrientationSign),
			),
		);

		// Left arm stays at rest (resetPose handles it).

		if (spine) {
			spine.quaternion.multiply(
				new THREE.Quaternion().setFromEuler(
					new THREE.Euler(0, -degrees(8) * weight, 0),
				),
			);
		}

		if (head) {
			head.quaternion.multiply(
				new THREE.Quaternion().setFromEuler(
					new THREE.Euler(0, -degrees(12) * weight, 0),
				),
			);
		}
	}

	private applyWalkAction(
		bones: {
			hips: THREE.Object3D | null;
			spine: THREE.Object3D | null;
			head: THREE.Object3D | null;
			rightUpperArm: THREE.Object3D | null;
			rightLowerArm: THREE.Object3D | null;
			leftUpperArm: THREE.Object3D | null;
			leftLowerArm: THREE.Object3D | null;
			rightUpperLeg: THREE.Object3D | null;
			rightLowerLeg: THREE.Object3D | null;
			rightFoot: THREE.Object3D | null;
			leftUpperLeg: THREE.Object3D | null;
			leftLowerLeg: THREE.Object3D | null;
			leftFoot: THREE.Object3D | null;
		},
		elapsed: number,
		weight: number,
	): void {
		const {
			hips,
			spine,
			head,
			rightUpperArm,
			rightLowerArm,
			leftUpperArm,
			leftLowerArm,
			rightUpperLeg,
			rightLowerLeg,
			rightFoot,
			leftUpperLeg,
			leftLowerLeg,
			leftFoot,
		} = bones;

		if (!hips || !spine || !rightUpperLeg || !leftUpperLeg) return;

		const cycle = elapsed * 4.4;
		const step = Math.sin(cycle);
		const opposite = Math.sin(cycle + Math.PI);
		const bob = Math.sin(cycle * 2) * 0.018 * weight;
		const sway = Math.sin(cycle) * degrees(4) * weight;
		const baseHips = this.baseBonePositions.get(VRMHumanBoneName.Hips);
		if (baseHips) {
			hips.position.y = baseHips.y + bob;
		}

		hips.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, sway * 0.4)),
		);
		spine.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(
				new THREE.Euler(-degrees(5) * weight, 0, -sway * 0.45),
			),
		);

		this.swingLimb(rightUpperLeg, step, 26, weight);
		this.bendLimb(rightLowerLeg, -step, 22, weight);
		this.swingLimb(rightFoot, -step, 14, weight);
		this.swingLimb(leftUpperLeg, opposite, 26, weight);
		this.bendLimb(leftLowerLeg, -opposite, 22, weight);
		this.swingLimb(leftFoot, -opposite, 14, weight);

		this.swingArm(rightUpperArm, opposite, 18, weight, -1);
		this.bendArm(rightLowerArm, opposite, 14, weight);
		this.swingArm(leftUpperArm, step, 18, weight, 1);
		this.bendArm(leftLowerArm, step, 14, weight);

		if (head) {
			const headQ = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(0, Math.sin(cycle) * degrees(2) * weight, 0),
			);
			head.quaternion.multiply(headQ);
		}
	}

	private getArmOrientationSign(): number {
		return this.currentAgent?.id === "alicia" ? 1 : -1;
	}

	private applyRelaxedUpperArm(
		bone: THREE.Object3D | null,
		side: number,
		weight: number,
	): void {
		if (!bone || weight <= 0) return;

		const shoulderDrop =
			this.getArmOrientationSign() * side * degrees(68) * weight;
		bone.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, shoulderDrop)),
		);
	}

	private swingLimb(
		bone: THREE.Object3D | null,
		phase: number,
		degreesAmount: number,
		weight: number,
	): void {
		if (!bone) return;

		bone.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(
				new THREE.Euler(phase * degrees(degreesAmount) * weight, 0, 0),
			),
		);
	}

	private bendLimb(
		bone: THREE.Object3D | null,
		phase: number,
		degreesAmount: number,
		weight: number,
	): void {
		if (!bone) return;

		const bend = Math.max(0, phase) * degrees(degreesAmount) * weight;
		bone.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(new THREE.Euler(bend, 0, 0)),
		);
	}

	private swingArm(
		bone: THREE.Object3D | null,
		phase: number,
		degreesAmount: number,
		weight: number,
		direction: number,
	): void {
		if (!bone) return;

		const armOrientationSign = this.getArmOrientationSign();

		// Character faces -Z: forward = -Z. For right arm (direction=-1), forward = -Y yaw.
		// -direction * phase gives right arm backward when right leg is forward (natural walk).
		const swing =
			-direction * phase * degrees(degreesAmount) * weight * armOrientationSign;
		// Drop arm from T-pose: right arm needs -Z, left arm needs +Z.
		const shoulderDrop = direction * degrees(68) * weight * armOrientationSign;

		bone.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(
				new THREE.Euler(0, swing, shoulderDrop),
			),
		);
	}

	private bendArm(
		bone: THREE.Object3D | null,
		phase: number,
		degreesAmount: number,
		weight: number,
	): void {
		if (!bone) return;

		const armOrientationSign = this.getArmOrientationSign();

		// Elbow flex: lowerArm in normalized space also has +X pointing toward hand.
		// Flexing (closing elbow) = rotate on -Z for right arm.
		// We use the absolute value of phase to get a slight bend on both forward and back swing.
		const bend = Math.abs(phase) * degrees(degreesAmount) * weight;
		bone.quaternion.multiply(
			new THREE.Quaternion().setFromEuler(
				new THREE.Euler(0, 0, -bend * armOrientationSign),
			),
		);
	}

	private applyLipSync(vrm: VRM, dt: number): void {
		const mouthPreset = this.presets.mouth;
		if (!vrm.expressionManager || !mouthPreset) return;

		let targetMouthWeight = 0;
		if (this.audioState.kind === "playing") {
			const { analyser, data } = this.audioState;
			analyser.getByteTimeDomainData(data);

			let sumSq = 0;
			for (const sample of data) {
				const v = (sample - 128) / 128;
				sumSq += v * v;
			}

			const rms = Math.sqrt(sumSq / data.length);
			const gain = this.currentAgent?.lipSyncGain ?? 8;
			const floor = this.currentAgent?.lipSyncFloor ?? 0.016;
			targetMouthWeight = clamp01((rms - floor) * gain);
		}

		this.mouthWeight = damp(this.mouthWeight, targetMouthWeight, 20, dt);
		vrm.expressionManager.setValue(mouthPreset, this.mouthWeight);
	}

	private onFrame(): void {
		const now = performance.now();
		const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
		this.lastFrameTime = now;
		this.elapsedTime += dt;

		const elapsed = this.elapsedTime;

		const vrm = this.currentVrm;
		if (vrm) {
			// Update procedural actions first (bones), then expressions, then VRM internal systems.
			this.applyActions(vrm, elapsed, dt);
			this.applyLipSync(vrm, dt);
			this.applyExpressions(vrm);

			vrm.update(dt);
		}

		this.renderer.render(this.scene, this.camera);
	}
}

