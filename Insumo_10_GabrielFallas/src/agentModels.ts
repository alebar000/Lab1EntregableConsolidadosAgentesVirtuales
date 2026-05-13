export type AgentId = "alicia" | "zed" | "yuki";

export type AgentAction = "idle" | "wave" | "nod" | "point" | "walk";

export type AgentExpression = "neutral" | "joy" | "sad" | "doubt";

export interface AgentModel {
	id: AgentId;
	displayName: string;
	modelUrl: string;
	audioUrl: string;
	profileTitle: string;
	roleSummary: string;
	personalitySummary: string;
	interactionContext: string;
	appearanceJustification: string;
	voiceProfile: string;
	lipSyncGain: number;
	lipSyncFloor: number;

	// For documentation/reporting.
	sourceUrl: string;
	licenseUrl: string;
	licenseName: string;
	authorCredit: string;
}

export const AGENTS: readonly AgentModel[] = [
	{
		id: "alicia",
		displayName: "Alicia",
		modelUrl: "/models/alicia.vrm",
		audioUrl: "/audio/alicia.wav?v=20260509-english-lines",
		profileTitle: "Guia de viajes a Japon",
		roleSummary:
			"Agente conversacional enfocada en viajes a Japon: recomienda rutas por estacion, lugares, comidas, puntos turisticos y datos practicos para planificar un viaje.",
		personalitySummary:
			"Calida, entusiasta y clara; prioriza una comunicacion agradable y sugerencias concretas para distintos tipos de viajero.",
		interactionContext:
			"Conversaciones con futuros turistas que desean conocer Japon: armado de itinerarios, recomendaciones segun temporada, transporte, cultura, etiquetas y consejos a tener en cuenta.",
		appearanceJustification:
			"Su apariencia expresiva y estilizada ayuda a sostener una conversacion amena y a transmitir energia de guia; refuerza la sensacion de acompaniamiento durante la planificacion del viaje.",
		voiceProfile:
			"Voz Karen (en_AU), tono femenino calido y natural para una guia conversacional. Lip-sync ajustado para habla fluida.",
		lipSyncGain: 9.6,
		lipSyncFloor: 0.015,
		sourceUrl:
			"https://github.com/vrm-c/UniVRM/tree/master/Tests/Models/Alicia_vrm-0.51",
		licenseUrl: "https://3d.nicovideo.jp/alicia/rule.html",
		licenseName: "Licencia especifica de Alicia / DWANGO",
		authorCredit: "© DWANGO Co., Ltd.",
	},
	{
		id: "zed",
		displayName: "Zed",
		modelUrl: "/models/zed.vrm",
		audioUrl: "/audio/zed.wav?v=20260509-english-lines",
		profileTitle: "Mentor de carreras STEM",
		roleSummary:
			"Estudiante universitario en su ultimo semestre que apoya a profesores en proyectos de robotica e inteligencia artificial. Su rol es acercar las carreras STEM a personas indecisas (hombres y mujeres) y guiarlas sobre lo que pueden llegar a realizar.",
		personalitySummary:
			"Cercano, motivador y practico; explica con ejemplos reales de proyectos y sugiere caminos de aprendizaje paso a paso.",
		interactionContext:
			"Orientacion vocacional STEM: dudas sobre que estudiar, que habilidades se necesitan, como empezar con programacion/robotica, y que tipo de proyectos se pueden construir desde cero.",
		appearanceJustification:
			"Una estetica juvenil y amigable baja la barrera para hacer preguntas y ayuda a que el usuario se sienta acompanado al explorar opciones academicas y profesionales en STEM.",
		voiceProfile:
			"Voz Daniel (en_GB), tono de hombre joven, claro y amable para un mentor academico. Lip-sync ajustado para diccion y ritmo conversacional.",
		lipSyncGain: 8.8,
		lipSyncFloor: 0.016,
		sourceUrl:
			"https://github.com/vrm-c/vrm-specification/tree/master/samples/Seed-san",
		licenseUrl: "https://vrm.dev/licenses/1.0/",
		licenseName: "VRM Public License 1.0",
		authorCredit: "VirtualCast, Inc.",
	},
	{
		id: "yuki",
		displayName: "Yuki",
		modelUrl: "/models/yuki.vrm",
		audioUrl: "/audio/yuki.wav?v=20260509-english-lines",
		profileTitle: "Entrenadora personal y nutricion",
		roleSummary:
			"Entrenadora personal que ayuda a personas de cualquier nivel a lograr metas deportivas. Ofrece guia de entrenamiento, habitos y consejos generales de nutricion para sostener el progreso.",
		personalitySummary:
			"Energica, empatica y constante; adapta recomendaciones al nivel del usuario, celebra avances y responde dudas con claridad.",
		interactionContext:
			"Acompanamiento fitness: planes de entrenamiento por objetivo (fuerza, resistencia, recomposicion), tecnica basica, recuperacion, y orientacion nutricional general para apoyar el rendimiento.",
		appearanceJustification:
			"Una presencia limpia y sobria funciona bien para un rol de coach: transmite disciplina y foco, y hace que gestos como asentir y senalar se perciban como instrucciones de entrenamiento.",
		voiceProfile:
			"Voz Samantha (en_US), joven y profesional para una entrenadora que guia con seguridad. Lip-sync ajustado para instrucciones cortas y claras.",
		lipSyncGain: 9.2,
		lipSyncFloor: 0.016,
		sourceUrl:
			"https://github.com/vrm-c/vrm-specification/tree/master/samples/VRM1_Constraint_Twist_Sample",
		licenseUrl: "https://vrm.dev/licenses/1.0/",
		licenseName: "VRM Public License 1.0",
		authorCredit: "pixiv Inc.",
	},
] as const;

