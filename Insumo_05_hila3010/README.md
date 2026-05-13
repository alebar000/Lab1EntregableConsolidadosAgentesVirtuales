# PF-3312 Proyecto 1 — Selección y Preparación de Modelos de Agentes Virtuales

**Curso:** PF-3312 Laboratorio de Agentes Virtuales Inteligentes  
**Proyecto:** Proyecto 1 — Selección y Preparación de Modelos de Agentes Virtuales  
**Estudiante:** Hilary Madrigal Valverde  
**Motor gráfico:** Unity 2022.3 LTS  
**Video demo:** https://youtu.be/KVhc_EbD4ZI

---

## 1. Descripción general

Este repositorio contiene el proyecto desarrollado para el Proyecto 1 del curso **PF-3312 Laboratorio de Agentes Virtuales Inteligentes**.

El objetivo del proyecto fue seleccionar, preparar y demostrar tres modelos 3D de agentes virtuales dentro de Unity, validando aspectos visuales y técnicos necesarios para su uso como base de agentes virtuales inteligentes.

El proyecto incluye:

- Tres modelos 3D distintos.
- Justificación estética y funcional de cada agente.
- Configuración técnica dentro de Unity.
- Validación de rigging humanoide.
- Configuración de animaciones corporales.
- Pruebas de audio y lip-sync.
- Comparación técnica entre modelos.
- Video demo con los tres agentes en funcionamiento.

---

## 2. Video de demostración

El video demo del proyecto se encuentra disponible en YouTube como enlace no listado:

**URL:** https://youtu.be/KVhc_EbD4ZI

En el video se muestran los tres modelos en Unity, incluyendo animaciones, reproducción de audio, sincronización labial o respuesta visual al audio y transiciones entre estados.

---

## 3. Modelos incluidos

### Modelo 1 — Agente profesional-amigable

El primer modelo corresponde a un agente virtual profesional-amigable, diseñado para contextos de asistencia informativa, orientación al usuario y atención en servicios digitales.

Este modelo fue creado en **VRoid Studio**, exportado en formato **VRM** e importado en Unity mediante **UniVRM**.

Características principales:

- Avatar humanoide femenino adulto.
- Estética profesional, clara y cercana.
- Rigging humanoide funcional.
- Animación corporal de saludo y transición a idle.
- Lip-sync avanzado mediante **uLipSync**.
- Uso de **U Lip Sync Expression VRM**.
- Perfil personalizado de lip-sync.
- Vocales A, E, I, O y U calibradas individualmente.
- Mapeo de fonemas a expresiones VRM: `aa`, `ee`, `ih`, `oh`, `ou`.

Datos técnicos medidos en Unity:

- Mallas únicas: 3.
- Vértices: 26,219.
- Triángulos: 38,063.

---

### Modelo 2 — Agente juvenil de exploración y recomendación de experiencias

El segundo modelo corresponde a un agente juvenil, dinámico y aventurero, pensado para escenarios de exploración, recomendación de experiencias, recorridos, entretenimiento o actividades recreativas.

El modelo fue obtenido desde una fuente externa tipo Sketchfab/Ready Player Me y se trabajó con su versión original para conservar mejor su estructura técnica.

Características principales:

- Avatar humanoide juvenil.
- Estética casual, temática y cercana.
- Formato original GLB.
- Importación inicial mediante glTFast.
- Conversión a FBX mediante Blender para facilitar animaciones humanoides.
- Rigging humanoide funcional.
- Animación corporal de saludo y transición a estado de reposo.
- Blendshapes faciales identificados en la malla de la cabeza.
- Lip-sync básico mediante apertura de boca asociada al volumen del audio.
- Audio generado externamente con ElevenLabs.

Datos técnicos medidos en Unity:

- Mallas únicas: 10.
- Vértices: 8,416.
- Triángulos: 13,218.

---

### Modelo 3 — Agente casual de asistencia general

El tercer modelo corresponde a un agente casual de asistencia general. Su intención es representar un asistente sencillo, cotidiano y directo para interacciones rápidas o guías básicas.

Características principales:

- Avatar humanoide masculino casual.
- Apariencia sencilla y cotidiana.
- Formato FBX.
- Importación mediante el importador nativo de Unity.
- Rigging humanoide funcional.
- Animaciones corporales configuradas.
- Materiales y texturas ajustadas manualmente.
- Lip-sync básico mediante apertura de boca asociada al volumen del audio.
- Audio generado externamente con ElevenLabs.

Datos técnicos medidos en Unity:

- Mallas únicas: 1.
- Vértices: 3,471.
- Triángulos: 4,431.

---

## 4. Herramientas y paquetes utilizados

El proyecto utiliza las siguientes herramientas y dependencias:

- **Unity 2022.3 LTS** — Motor gráfico principal.
- **VRoid Studio** — Creación del Modelo 1.
- **UniVRM** — Importación y manejo de modelos VRM.
- **uLipSync** — Sincronización labial del Modelo 1.
- **Burst** — Dependencia requerida para uLipSync.
- **Mixamo** — Fuente de animaciones corporales.
- **Blender** — Conversión de GLB a FBX para el Modelo 2.
- **glTFast** — Importación inicial de modelos GLB.
- **ElevenLabs** — Generación de voces utilizadas en la demo.

---

## 5. Estructura general del proyecto

La estructura del proyecto se organizó por tipo de recurso y por modelo:

```text
Assets/
├── Animations/
│   ├── Modelo_1/
│   ├── Modelo_2/
│   └── Modelo_3/
├── Audio/
├── Models/
│   ├── Modelo_1_Profesional/
│   ├── Modelo_2_Harry/
│   ├── Modelo_2_Sketchfab_Student/
│   └── Modelo_3_Casual/
├── Scenes/
├── Scripts/
├── uLipSync/
└── uLipSyncProfiles/
```

> Nota: algunas carpetas pueden contener versiones de trabajo o pruebas utilizadas durante el proceso de importación, conversión y validación técnica.

---

## 6. Escenas del proyecto

La escena principal de demostración contiene los modelos configurados para evidenciar:

- Visualización dentro del motor gráfico.
- Animaciones corporales.
- Reproducción de audio.
- Lip-sync avanzado o básico según el modelo.
- Transiciones entre estados.

Si el proyecto contiene más de una escena, se recomienda abrir primero la escena principal ubicada en:

```text
Assets/Scenes/
```

---

## 7. Instrucciones para abrir y ejecutar

1. Clonar o descargar este repositorio.
2. Abrir Unity Hub.
3. Seleccionar **Add project from disk**.
4. Escoger la carpeta raíz del proyecto, es decir, la carpeta que contiene `Assets`, `Packages` y `ProjectSettings`.
5. Abrir el proyecto con **Unity 2022.3 LTS**.
6. Esperar a que Unity importe los paquetes y assets.
7. Abrir la escena principal ubicada en `Assets/Scenes/`.
8. Presionar **Play** para ejecutar la demo.

---

## 8. Consideraciones técnicas

### Lip-sync

El proyecto implementa dos niveles de sincronización labial:

1. **Lip-sync avanzado en el Modelo 1**  
   Se utilizó uLipSync con un perfil personalizado y calibración individual de vocales. Los fonemas detectados se conectan con expresiones VRM mediante `U Lip Sync Expression VRM`.

2. **Lip-sync básico en los Modelos 2 y 3**  
   Se utilizó una estrategia simplificada basada en volumen de audio. Un script analiza la intensidad del audio y modifica un blendshape de apertura de boca, generando una respuesta visual sincronizada con la voz.

### Animaciones

Las animaciones corporales fueron configuradas mediante Animator Controllers. Los modelos incluyen estados como saludo, idle, talking o animaciones equivalentes, dependiendo de las capacidades de cada avatar.

### Materiales

Algunos modelos externos requirieron ajustes manuales de materiales y texturas dentro de Unity, especialmente después de conversiones entre GLB y FBX.

---

## 9. Créditos y licencias

Los modelos y herramientas utilizadas provienen de fuentes públicas, herramientas gratuitas o creación propia. Se respetan los créditos y licencias correspondientes a cada fuente.

- Modelo 1: creado por la autora mediante VRoid Studio.
- Modelo 2: modelo externo descargado desde Sketchfab, con estructura tipo Ready Player Me/Wolf3D.
- Modelo 3: modelo humanoide tipo Wolf3D/Ready Player Me.
- Animaciones: Mixamo.
- Motor gráfico: Unity.
- Sincronización labial: uLipSync.
- Voces: ElevenLabs.
- Conversión de modelos: Blender.
- Importación GLB: glTFast.

---

## 10. Estado final

El proyecto incluye tres modelos preparados y funcionales dentro de Unity. Cada modelo presenta un perfil distinto, una intención estética específica y una configuración técnica adaptada a sus capacidades.

Resumen:

| Modelo | Rol | Rigging | Animación | Lip-sync |
|---|---|---|---|---|
| Modelo 1 | Profesional-amigable | Sí | Sí | Avanzado con uLipSync |
| Modelo 2 | Juvenil / exploración de experiencias | Sí | Sí | Básico por volumen |
| Modelo 3 | Casual / asistencia general | Sí | Sí | Básico por volumen |

---

## 11. Observaciones

El desarrollo permitió comprobar que no basta con que un modelo 3D tenga buena apariencia visual. Para utilizarlo como agente virtual es necesario validar su estructura técnica, especialmente:

- Rigging humanoide.
- Blendshapes faciales.
- Compatibilidad con lip-sync.
- Materiales y texturas.
- Conteo de polígonos.
- Compatibilidad con animaciones externas.
- Reproducibilidad dentro del motor gráfico.

Este repositorio contiene la base técnica preparada para continuar con futuras etapas de integración de agentes virtuales inteligentes.
