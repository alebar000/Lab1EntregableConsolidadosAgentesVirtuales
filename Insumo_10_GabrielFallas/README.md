# PF-3312 Proyecto 1 · Alicia, Zed y Yuki (VRM)

Aplicación web construida con Vite, Three.js y `@pixiv/three-vrm` para demostrar 3 agentes 3D distintos dentro de un motor gráfico, con rigging humanoide, expresiones faciales, lip-sync por audio y acciones controladas desde interfaz.

Este repositorio incluye, además, evidencias (capturas PNG) y documentación listas para exportarse a PDF.

## Objetivo

Demostrar en el navegador que tres modelos 3D distintos cumplen los puntos tecnicos solicitados por el enunciado:

- Carga correcta dentro del motor gráfico.
- Rigging funcional para animación.
- Blendshapes/expressions para alegría, tristeza y duda.
- Blendshapes/visemes para lip-sync.
- Interacción mediante interfaz gráfica.
- Documentación de fuentes, créditos, licencias y justificación estética.

## Avatares y roles

1. `Alicia`: guía de viajes a Japón (rutas por estación, comida, puntos turísticos y datos prácticos).
2. `Zed`: mentor de carreras STEM (robotica e IA) para orientar a personas indecisas.
3. `Yuki`: entrenadora personal que acompana metas deportivas y consejos generales de nutrición.

El detalle de fuentes y licencias esta en [public/models/SOURCES.md](public/models/SOURCES.md).

## Stack

- Vite
- TypeScript
- Three.js
- `@pixiv/three-vrm`

## Requisitos

- Node.js 18+ (recomendado) y npm.
- Un navegador Chromium instalado (Microsoft Edge o Google Chrome) para generar evidencias con Playwright.

## Estructura del proyecto

- `src/`: app (UI + visor VRM + acciones/expresiones + lip-sync).
- `public/models/`: modelos VRM (`alicia.vrm`, `zed.vrm`, `yuki.vrm`) y fuentes/licencias.
- `public/audio/`: audios por agente para probar lip-sync.
- `docs/informe-entrega.md`: informe listo para exportar a PDF.
- `docs/informe-entrega.pdf`: PDF exportado del informe.
- `docs/evidence/`: capturas PNG (evidencia dentro del motor gráfico).
- `scripts/`: scripts de verificación técnica y generación de evidencias.

## Ejecución local

```bash
npm install
npm run dev
```

Para fijar el puerto (util para evidencia automatizada):

```bash
npm run dev -- --host 127.0.0.1 --port 4173
```

## Scripts utiles

```bash
npm run build
npm run capture:evidence
npm run inspect:meta
npm run inspect:visemes
npm run verify:assets
```

### Qué valida cada script

- `npm run build`: compila TypeScript y genera el bundle de producción.
- `npm run capture:evidence`: genera capturas PNG en `docs/evidence/` usando `playwright-core` y el navegador instalado.
- `npm run inspect:meta`: extrae metadatos VRM de autores, licencias y permisos de redistribución.
- `npm run inspect:visemes`: verifica la presencia de visemes y expresiones base en los tres modelos.
- `npm run verify:assets`: ejecuta ambas inspecciones para dejar evidencia técnica repetible.

### Generar evidencias (capturas PNG)

1) Levanta la app (idealmente en el puerto 4173):

```bash
npm run dev -- --host 127.0.0.1 --port 4173
```

2) En otra terminal, genera evidencias:

```bash
npm run capture:evidence
```

Si el puerto cambia (por ejemplo, 4174), ejecuta el script manualmente con el URL correcto:

```bash
node scripts/capture-evidence.mjs --url http://127.0.0.1:4174/
```

Para generar evidencias de un solo agente:

```bash
node scripts/capture-evidence.mjs --url http://127.0.0.1:4173/ --only zed
```

Nota: el script espera a que la carga inicial termine para evitar que un modelo anterior quede en escena por una carrera de carga.

## Controles de la demo

- Selector de modelo.
- Acciones: `Idle`, `Saludar`, `Asentir`, `Senalar`, `Caminar`.
- Expresiones: `Neutral`, `Alegria`, `Tristeza`, `Duda`.
- Audio: `Hablar (audio)` y `Detener`.
- Panel técnico con triangulos, vertices, cantidad de skinned meshes, joints máximos y presets resueltos.

## Estado validado

Se confirmó que los tres modelos:

- cargan sin errores en la aplicación,
- exponen expresiones faciales utilizables,
- tienen visemes suficientes para lip-sync,
- responden a las acciones procedurales del visor,
- muestran informacion técnica dentro del motor gráfico.

La validación técnica base del repo puede repetirse con:

```bash
npm run build
npm run verify:assets
```

La validación interactiva del navegador queda cubierta por las capturas generadas en `docs/evidence/`, que prueban:

- cambio de modelo,
- acciones,
- expresiones,
- panel técnico visible,
- postura estable en capturas.

## Evidencia visual

Las capturas actuales generadas durante el recorrido E2E estan en:

- [docs/evidence/zed-view.png](docs/evidence/zed-view.png)
- [docs/evidence/yuki-view.png](docs/evidence/yuki-view.png)
- [docs/evidence/alicia-view.png](docs/evidence/alicia-view.png)

Adicionalmente, por agente se generan capturas de acciones (`*-wave.png`, `*-nod.png`, `*-point.png`, `*-walk.png`) y expresiones (`*-expr-joy.png`, `*-expr-sad.png`, `*-expr-doubt.png`).

## Entregables de apoyo

- [README.md](README.md)
- [docs/informe-entrega.md](docs/informe-entrega.md)
- [docs/evidence/zed-view.png](docs/evidence/zed-view.png)
- [docs/evidence/yuki-view.png](docs/evidence/yuki-view.png)
- [docs/evidence/alicia-view.png](docs/evidence/alicia-view.png)
- [public/models/SOURCES.md](public/models/SOURCES.md)

## Entregables finales

### 1. Documento de selección y justificación estética

El documento de selección y justificación estética se encuentra en [docs/informe-entrega.md](docs/informe-entrega.md) y su versión exportada a PDF en [docs/informe-entrega.pdf](docs/informe-entrega.pdf).

Ese documento  incluye:

- Ficha técnica de los tres modelos.
- Perfil del agente y contexto de uso.
- Justificación estetica.
- Análisis técnico.
- Capturas de evidencia dentro del motor gráfico.
- Resumen del paquete de assets.
- Guía breve para la demo en video.

### 2. Paquete de activos técnicos

- Modelos VRM: [public/models](public/models)
- Audios para lip-sync: [public/audio](public/audio)
- Código del visor y logica de animación/expresiones: [src](src)
- Scripts de verificación tecnica: [scripts](scripts)

### 3. Video de demostracion

- Enlace demo no listado: https://youtu.be/klyvhApxQ3Q
