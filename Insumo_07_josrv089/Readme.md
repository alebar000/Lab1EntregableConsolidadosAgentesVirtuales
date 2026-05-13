PF-3312 Laboratorio de Agentes Virtuales Inteligentes
Proyecto 1: Selección y Preparación de Modelos de Agentes Virtuales
Estudiante: Josué Rivas  
Curso: PF-3312 Laboratorio de Agentes Virtuales Inteligentes  
Entrega: Proyecto 1  
Motor gráfico: Unity  
Estado del proyecto: Demo funcional con tres modelos 3D configurados

URL del Video: [https://youtu.be/EU9Jyl04kxs]


1. Descripción general
Este repositorio contiene el proyecto desarrollado para el Proyecto 1 del curso PF-3312 Laboratorio de Agentes Virtuales Inteligentes. El objetivo principal del proyecto es seleccionar, preparar y demostrar tres modelos 3D que puedan funcionar como base visual y técnica para futuros agentes virtuales inteligentes.
La entrega incluye tres agentes virtuales distintos, cada uno con un perfil visual y conceptual diferente. Los modelos fueron importados y configurados dentro de Unity, verificando aspectos técnicos como rigging humanoide, blendshapes faciales, animaciones corporales y sincronización labial básica con audio pregrabado.
La demostración se ejecuta mediante una secuencia controlada en Unity, donde cada agente se activa en orden, realiza una animación inicial, reproduce un audio y mueve la boca mediante un sistema básico de lip-sync.
---
2. Modelos incluidos
Modelo 1: MikeAlger / Agente técnico-institucional
Fuente: Sketchfab  
Tipo: Humanoide masculino realista  
Rol propuesto: Agente técnico-institucional  
Formato original: FBX
Este modelo representa un agente masculino de apariencia realista y neutral. Fue seleccionado como una base técnica para validar rigging, animaciones corporales, blendshapes faciales y sincronización labial básica.
Características implementadas:
Modelo importado en Unity.
Configuración como Humanoid Avatar.
Rigging validado mediante Avatar Configuration.
Blendshapes faciales verificados en Skinned Mesh Renderer.
Animaciones corporales tipo saludo y gesto de conversación.
Audio pregrabado con sincronización labial básica.
Materiales y texturas corregidos manualmente en Unity.
---
Modelo 2: Model_02_VRoid_EducationalAgent / Agente educativa-conversacional
Fuente: Creación propia en VRoid Studio  
Tipo: Humanoide femenino estilizado  
Rol propuesto: Agente educativa y conversacional  
Formato original: VRM 0.x  
Importador utilizado: UniVRM
Este modelo fue creado en VRoid Studio para representar una agente más cercana, expresiva y educativa. Su objetivo es explorar una apariencia menos institucional y más conversacional, adecuada para contextos de aprendizaje, explicación de información u orientación guiada.
Características implementadas:
Modelo exportado desde VRoid Studio como VRM 0.x.
Importación en Unity mediante UniVRM.
Estructura humanoide funcional.
Blendshapes faciales verificados en el objeto Face.
Uso del blendshape `Fcl_MTH_A` para movimiento de boca.
Animaciones corporales de saludo, habla e idle.
Audio pregrabado con sincronización labial básica.
Integración en la secuencia general de demostración.
---
Modelo 3: Model_03_VRoid_WiseMentor / Agente mentor académico
Fuente: Creación propia en VRoid Studio  
Tipo: Humanoide masculino estilizado  
Rol propuesto: Mentor académico o guía reflexivo  
Formato original: VRM 0.x  
Importador utilizado: UniVRM
Este modelo representa un agente de apariencia más formal, madura y serena. Fue diseñado como un mentor académico, orientado a transmitir experiencia, calma y confianza durante una interacción virtual.
Características implementadas:
Modelo creado en VRoid Studio.
Exportación como VRM 0.x.
Importación en Unity mediante UniVRM.
Estructura humanoide funcional.
Blendshapes faciales verificados en el objeto Face.
Uso del blendshape `Fcl_MTH_A` para lip-sync básico.
Tres animaciones de habla configuradas en ciclo:
`Speaking_01`
`Speaking_02`
`Speaking_03`
Secuencia cíclica de habla:
`Speaking_01 → Speaking_02 → Speaking_03 → Speaking_01`
Transición final a `Idle` cuando termina el audio.
Integración como tercer agente dentro de la demo.
---
3. Video de demostración
Enlace al video no listado en YouTube:  
[Agregar aquí el enlace del video]
El video muestra la secuencia completa de la demo en Unity. En la demostración se evidencian:
Los tres modelos 3D en acción.
Animaciones corporales para cada agente.
Reproducción de audio pregrabado.
Movimiento de boca sincronizado con la voz.
Transición ordenada entre agentes.
Retorno a estado neutral o idle después de cada intervención.
---
4. Estructura general del proyecto
La estructura principal del proyecto es la siguiente:
```text
Assets/
├── Animations/
│   ├── Model_01/
│   ├── Model_02/
│   └── Model_03/
│
├── Audio/
│   ├── Model_01/
│   ├── Model_02/
│   └── Model_03/
│
├── DOCS/
│
├── Materials/
│
├── Models/
│   ├── Model_01_Sketchfab_Male/
│   ├── Model_02_VRoid_EducationalAgent/
│   └── Model_03_VRoid_WiseMentor/
│
│
└── Scripts/
```
Descripción de carpetas principales
Animations: contiene los Animator Controllers y animaciones corporales utilizadas por los agentes.
Audio: contiene los audios pregrabados utilizados para la sincronización labial.
Documentation: contiene documentación auxiliar del proyecto.
Materials: contiene materiales generales del proyecto.
Models: contiene los modelos 3D importados, organizados por agente.
Scenes: contiene la escena principal de demostración.
Screenshots: contiene capturas utilizadas para documentación y evidencia técnica.
Scripts: contiene los scripts utilizados para controlar lip-sync y la secuencia de la demo.
---
5. Escena principal
La escena principal de demostración se encuentra en:
```text
Assets/Scenes/[Agregar nombre exacto de la escena].unity
```
En caso de que aún no se haya renombrado la escena, puede aparecer como:
```text
SampleScene
```
La escena incluye:
Cámara principal.
Luz direccional.
Tres modelos de agentes virtuales.
Un objeto `DemoSequenceManager` encargado de controlar la secuencia de presentación.
---
6. Scripts principales
BasicLipSync.cs
Este script implementa una sincronización labial básica basada en la intensidad del audio. Durante la reproducción de un `AudioSource`, el script calcula la amplitud del sonido y modifica el peso de un blendshape de boca.
Uso general:
En el Modelo 1 se utiliza el blendshape `Jaw_Down`.
En los modelos VRoid se utiliza el blendshape `Fcl_MTH_A`.
Este enfoque no realiza una sincronización fonema por fonema, pero permite demostrar que los modelos cuentan con blendshapes faciales funcionales y que pueden simular habla a partir de audio pregrabado.
---
MultiAgentDemoSequenceController.cs
Este script controla la secuencia general de la demo. Permite configurar múltiples agentes y ejecutar sus intervenciones de forma ordenada.
Cada agente puede tener:
Objeto del agente.
Animator.
AudioSource.
Estado de saludo.
Estado de habla.
Estado idle.
Duración del saludo.
Configuración para ocultarse o congelarse después de terminar.
La lógica general es:
```text
1. Ocultar o preparar los agentes.
2. Activar el primer agente.
3. Ejecutar Greeting.
4. Ejecutar SpeakingLoop o estado de habla.
5. Reproducir audio.
6. Mantener animación mientras el audio está activo.
7. Pasar a Idle cuando termina el audio.
8. Continuar con el siguiente agente.
```
---
7. Configuración de estados de animación
Cada agente utiliza estados de animación con nombres definidos en su Animator Controller.
Estructura base recomendada
```text
Greeting
SpeakingLoop
Idle
```
Estructura especial del Modelo 3
El Modelo 3 utiliza tres estados de habla para evitar repetición visual durante un audio más largo:
```text
Greeting
Speaking_01
Speaking_02
Speaking_03
Idle
```
La secuencia configurada en el Animator Controller del Modelo 3 es:
```text
Speaking_01 → Speaking_02 → Speaking_03 → Speaking_01
```
El controlador general de la demo envía al agente al estado `Idle` cuando termina su audio.
---
8. Requisitos para abrir el proyecto
Para abrir y ejecutar este proyecto se requiere:
Unity instalado.
Versión recomendada: [Agregar versión exacta de Unity utilizada].
UniVRM instalado en el proyecto para soporte de modelos VRM.
Sistema operativo compatible con Unity.
No es necesario instalar herramientas externas para ejecutar la escena, siempre que el proyecto se abra desde Unity con sus assets incluidos.
---
9. Cómo ejecutar la demo
Clonar o descargar este repositorio.
Abrir Unity Hub.
Seleccionar Open Project.
Abrir la carpeta raíz del proyecto.
Esperar a que Unity importe los assets.
Abrir la escena principal ubicada en `Assets/Scenes/`.
Verificar que el objeto `DemoSequenceManager` esté activo.
Presionar Play.
Observar la secuencia de los tres agentes.
Durante la ejecución, los agentes se presentan de forma ordenada. Cada uno reproduce su audio, ejecuta animaciones corporales y utiliza sincronización labial básica.
---
10. Créditos y licencias
Modelo 1
Nombre: Rigged T-Pose Human Male w 50 Face Blendshapes  
Autor: Mike Alger  
Fuente: Sketchfab  
Licencia: Creative Commons Attribution  
Uso en el proyecto: Agente masculino realista utilizado para validación de rigging, blendshapes, animaciones corporales y sincronización labial básica.
Modelo 2
Nombre: Model_02_VRoid_EducationalAgent  
Fuente: Creación propia en VRoid Studio  
Autor: Josué Rivas  
Uso en el proyecto: Agente educativa-conversacional estilizada.
Modelo 3
Nombre: Model_03_VRoid_WiseMentor  
Fuente: Creación propia en VRoid Studio  
Autor: Josué Rivas  
Uso en el proyecto: Agente mentor académico o guía reflexivo.
Animaciones
Fuente: Mixamo  
Uso: Animaciones corporales aplicadas a modelos humanoides dentro de Unity.
Voces
Fuente: ElevenLabs  
Uso: Audios pregrabados utilizados para la demostración de sincronización labial.
---
11. Notas técnicas
Los modelos VRoid fueron exportados como VRM 0.x para mejorar compatibilidad con UniVRM.
Los audios no se reproducen automáticamente desde `Play On Awake`; son controlados mediante el script de secuencia.
La sincronización labial implementada es básica y se basa en la intensidad del audio.
Los estados de animación deben conservar los nombres configurados en el `DemoSequenceManager`.
Las carpetas generadas por Unity como `Library`, `Temp`, `Obj`, `Logs` y `UserSettings` no forman parte del repositorio.
---
12. Estado final de la entrega
El proyecto incluye:
Tres modelos 3D distintos.
Justificación estética documentada en PDF.
Rigging funcional en los modelos.
Blendshapes faciales verificados.
Animaciones corporales configuradas.
Sincronización labial básica con audio pregrabado.
Demo secuencial en Unity.
Video de demostración en YouTube no listado.
---
13. Pendientes antes de entrega final
Antes de entregar el enlace en Mediación Virtual, verificar:
[ ] El video fue grabado y subido como no listado a YouTube.
[ ] El enlace del video fue agregado en este README.
[ ] El PDF final fue agregado al repositorio o entregado según las instrucciones del curso.
[ ] La escena principal abre correctamente en Unity.
[ ] Los tres agentes ejecutan su secuencia en orden.
[ ] Los audios no se superponen.
[ ] Los labios se mueven durante la reproducción de cada audio.
[ ] El repositorio no contiene carpetas generadas innecesarias como `Library/`, `Temp/`, `Obj/`, `Logs/` o `UserSettings/`.