# PF-3312 — Proyecto 1: Selección y Preparación de Modelos de Agentes Virtuales

**Curso:** PF-3312 Laboratorio de Agentes Virtuales Inteligentes  
**Ciclo:** I Ciclo, 2026 — Universidad de Costa Rica (ECCI)  
**Estudiante:** Luis Vallejo  
**Modalidad:** Proyecto individual

---

## Descripción

Este repositorio contiene el Proyecto 1 del laboratorio: la selección, configuración técnica y demostración de tres modelos 3D de agentes virtuales inteligentes integrados en Unity 6.

---

## Modelos Seleccionados

| # | Nombre | Fuente | Estilo | Rol | Estado |
|---|--------|--------|--------|-----|--------|
| 1 | Lewis | Mixamo (Adobe) | Semi-realista | Agente amistoso | Configurado |
| 2 | [Modelo 2] | [Fuente] | [Estilo] | [Rol] | En progreso |
| 3 | [Modelo 3] | [Fuente] | [Estilo] | [Rol] | En progreso |

---

## Video de Demostración

[Ver video en YouTube (no listado)](https://youtu.be/CMg6OZjSEls)

El video muestra los 3 modelos ejecutando animaciones, lip-sync con audio pregrabado y transiciones entre estados. Duración máxima: 3 minutos.

---

## Estructura del Repositorio

```
PF3312-Proyecto1/
│
├── Assets/
│   ├── Models/
│   │   └── Lewis/
│   │       ├── Lewis.fbx
│   │       └── Textures/
│   │
│   ├── Animations/
│   │   └── Lewis/
│   │       ├── Idle.fbx
│   │       ├── Waving.fbx
│   │       └── Pointing.fbx
│   │
│   ├── Scripts/
│   │   └── LewisController.cs
│   │
│   └── Scenes/
│       └── DemoScene.unity
│
├── ProjectSettings/
├── Packages/
├── .gitignore
└── README.md
```

---

## Requisitos Técnicos

| Requisito | Versión |
|-----------|---------|
| Unity | 6000.4.0f1 |
| Render Pipeline | Universal Render Pipeline (URP) |
| Input System | New Input System |

---

## Instrucciones de Apertura

1. Clonar el repositorio:
```bash
git clone https://github.com/luis-dkodde/Modelos-3D.git
cd Modelos-3D
```

2. Abrir Unity Hub y seleccionar "Add project from disk"
3. Seleccionar la carpeta raíz del repositorio
4. Usar Unity 6000.4.0f1
5. Abrir la escena `Assets/Scenes/DemoScene.unity`
6. Presionar Play

### Controles

| Tecla | Acción |
|-------|--------|
| W | Lewis saluda (Waving) |
| E | Lewis señala (Pointing) |

---

## Estado Actual — Lewis (Modelo 1)

- Modelo importado desde Mixamo en formato FBX
- Rig configurado como Humanoid en Unity
- Avatar: Ch12_nonPBRAvatar
- Materiales y texturas extraídos y aplicados
- Animator Controller configurado (Lewis_AnimatorController)
- Script de control (LewisController.cs) adjunto al modelo

### Animaciones

| Animacion | Descripcion | Estado |
|-----------|-------------|--------|
| Idle | Estado base al iniciar | Listo |
| Waving | Saludo (tecla W) | Listo |
| Pointing | Señalar (tecla E) | Listo |
| Lip-sync | Sincronizacion labial | En progreso |

### Animator Controller

```
Entry → Idle ←→ Waving   (Trigger: DoWave)
             ←→ Pointing  (Trigger: DoPoint)
```

---

## Créditos y Licencias

| Recurso | Fuente | Licencia |
|---------|--------|----------|
| Lewis (modelo y animaciones) | Mixamo / Adobe (mixamo.com) | Gratuito para uso personal y educativo |

---

*PF-3312 Laboratorio de Agentes Virtuales Inteligentes — I Ciclo 2026 — UCR ECCI*