# Informe de Entrega · PF-3312 Proyecto 1

## 1. Documento de selección y justificación estética

Este reporte resume la selección de tres agentes 3D en formato VRM, su justificación estética, el contexto de uso imaginado y la evidencia técnica de que funcionan dentro del motor gráfico de la aplicación.

La solución fue implementada con Three.js, TypeScript y `@pixiv/three-vrm`, con soporte para:

- rigging humanoide funcional,
- blendshapes y presets de expresion,
- movimientos para lip-sync,
- acciones procedurales,
- carga y cambio de modelo en tiempo real,
- evidencia técnica visible dentro del motor.

## 2. Ficha técnica de los tres modelos

### 2.1 Zed

**Archivo:** `public/models/zed.vrm`

**Perfil del agente:** mentor de carreras STEM.

**Rol y personalidad:** estudiante universitario en su último semestre que apoya proyectos de robotica e inteligencia artificial. Acompaña a personas indecisas (hombres y mujeres) sobre carreras STEM, explicando que se puede construir y como iniciar.

**Contexto de uso imaginado:** orientacion vocacional STEM, exploración de rutas de aprendizaje y ejemplos de proyectos reales (programación, electrónica, robótica e IA).

**Justificacion de apariencia:** se eligió porque su estética juvenil y amigable baja la barrera de entrada y hace natural la conversación motivacional. Gestos como saludo y alegria refuerzan un rol de mentor cercano.

**Análisis tecnico:**

- Rigging humanoide: si.
- Blendshapes/expresiones: si.
- Visemes para lip-sync: `aa, ih, ou, ee, oh`.
- Expresiones observables: `happy`, `sad`, `surprised` y presets equivalentes resueltos por el visor.
- Triangulos: `45058`.
- Vertices: `34059`.
- Skinned meshes: `21`.
- Max joints: `128`.
- Evidencia visual en motor:
	- Vista + panel tecnico: [evidence/zed-view.png](evidence/zed-view.png).
	- Accion (rigging): [evidence/zed-walk.png](evidence/zed-walk.png).
	- Expresion (blendshapes): [evidence/zed-expr-joy.png](evidence/zed-expr-joy.png).
- Fuente y licencia: [../public/models/SOURCES.md](../public/models/SOURCES.md).

### 2.2 Yuki

**Archivo:** `public/models/yuki.vrm`

**Perfil del agente:** entrenadora personal y nutrición.

**Rol y personalidad:** entrenadora personal enérgica y empatica que adapta recomendaciones al nivel del usuario. Ofrece guía de entrenamiento, hábitos y consejos generales de nutrición.

**Contexto de uso imaginado:** acompañamiento fitness para metas deportivas (fuerza, resistencia, recomposicion), técnica básica, recuperación y orientación nutricional general.

**Justificacion de apariencia:** se eligió porque su presencia visual limpia y sobria funciona bien para un rol de coach: transmite disciplina, foco y claridad al dar instrucciones (asentir, senalar y caminar).

**Análisis técnico:**

- Rigging humanoide: si.
- Blendshapes/expresiones: si.
- Visemes para lip-sync: `aa, ih, ou, ee, oh`.
- Expresiones observables: presets equivalentes para alegría, tristeza y duda resueltos por el visor.
- Triangulos: `36470`.
- Vertices: `24951`.
- Skinned meshes: `13`.
- Max joints: `129`.
- Evidencia visual en motor:
	- Vista + panel tecnico: [evidence/yuki-view.png](evidence/yuki-view.png).
	- Accion (rigging): [evidence/yuki-walk.png](evidence/yuki-walk.png).
	- Expresión (blendshapes): [evidence/yuki-expr-joy.png](evidence/yuki-expr-joy.png).
- Fuente y licencia: [../public/models/SOURCES.md](../public/models/SOURCES.md).

### 2.3 Alicia

**Archivo:** `public/models/alicia.vrm`

**Perfil del agente:** guia de viajes a Japón.

**Rol y personalidad:** agente conversacional cálida y entusiasta para planear viajes a Japón. Recomienda rutas por estación, lugares, comidas, puntos turísticos y datos prácticos a considerar.

**Contexto de uso imaginado:** conversaciones con futuros turistas que quieren conocer Japón: armado de itinerarios, recomendaciones según temporada, transporte, cultura y consejos para viajar con mas confianza.

**Justificación de apariencia:** se eligió porque su apariencia expresiva facilita una comunicación agradable. Ayuda a sostener dialogo y a transmitir energía de guía, manteniendo una identidad visual memorable.

**Análisis técnico:**

- Rigging humanoide: si.
- Blendshapes/expresiones: si.
- Visemes para lip-sync: `a, i, u, e, o`.
- Expresiones observables: `joy`, `sorrow`, `lookleft`, `lookright` y presets equivalentes resueltos por el visor.
- Triangulos: `31798`.
- Vertices: `21623`.
- Skinned meshes: `20`.
- Max joints: `106`.
- Evidencia visual en motor:
	- Vista + panel tecnico: [evidence/alicia-view.png](evidence/alicia-view.png).
	- Accion (rigging): [evidence/alicia-walk.png](evidence/alicia-walk.png).
	- Expresion (blendshapes): [evidence/alicia-expr-joy.png](evidence/alicia-expr-joy.png).
- Fuente y licencia: [../public/models/SOURCES.md](../public/models/SOURCES.md).

## 3. Análisis técnico consolidado

### 3.1 Metadatos, creditos y licencias

La verificación de metadatos del propio archivo VRM confirma lo siguiente:

- Zed (modelo base Seed-san): autor `VirtualCast, Inc.`, licencia `VRM Public License 1.0`, redistribución permitida y crédito requerido.
- Yuki (modelo base VRM1 Constraint Twist Sample): autor `pixiv Inc.`, licencia `VRM Public License 1.0`, redistribución permitida.
- Alicia (modelo base Alicia Solid): autor `DWANGO Co., Ltd.`, licencia específica del modelo Alicia, con restricciones expresas de uso violento y sexual.

El detalle completo esta en [../public/models/SOURCES.md](../public/models/SOURCES.md).

### 3.2 Rigging y blendshapes

Los tres modelos cargan correctamente como humanoides VRM y responden a huesos normalizados dentro del motor. Esto permite ejecutar acciones visibles como:

- `Saludar`
- `Asentir`
- `Senalar`
- `Caminar`

En cuanto a blendshapes, los tres modelos exponen presets utilizables para expresiones faciales y movimientos de boca. La aplicación resuelve esos presets por modelo para mapear `Alegria`, `Tristeza`, `Duda` y apertura de boca para lip-sync.

### 3.3 Evidencia visual dentro del motor gráfico

Las capturas guardadas en el repositorio muestran los modelos cargados y el panel técnico dentro del motor gráfico:

Las capturas correspondientes a esta versión estan en:

- [evidence/zed-view.png](evidence/zed-view.png)
- [evidence/yuki-view.png](evidence/yuki-view.png)
- [evidence/alicia-view.png](evidence/alicia-view.png)

Adicionalmente, se incluyen capturas por accion (rigging) y por expresion (blendshapes) para cada agente, por ejemplo:

- Zed: [evidence/zed-walk.png](evidence/zed-walk.png) y [evidence/zed-expr-joy.png](evidence/zed-expr-joy.png)
- Yuki: [evidence/yuki-walk.png](evidence/yuki-walk.png) y [evidence/yuki-expr-joy.png](evidence/yuki-expr-joy.png)
- Alicia: [evidence/alicia-walk.png](evidence/alicia-walk.png) y [evidence/alicia-expr-joy.png](evidence/alicia-expr-joy.png)

## 4. Paquete de activos tecnicos

El paquete de assets entregable corresponde al proyecto completo configurado y organizado para integracion.

### 4.1 Contenido incluido

- Tres modelos VRM con rigging funcional en [../public/models](../public/models).
- Audios por agente para prueba de lip-sync en [../public/audio](../public/audio).
- Código del visor, animacion y expresiones en [../src](../src).
- Scripts de verificación técnica en [../scripts](../scripts).

### 4.2 Soporte funcional incluido

El proyecto ya contiene:

- carga y cambio entre los 3 modelos,
- rigging funcional dentro del motor gráfico,
- blendshapes básicas para boca y expresiones,
- lip-sync por audio pregrabado,
- estructura de carpetas lista para ejecución e integración.
