# Proyecto Unity - Modelos de Agentes Virtuales

## Descripción

Este proyecto incluye tres modelos 3D de agentes virtuales: un robot estilizado (**Chippy**), un agente animal (**Rover**) y una figura humana realista (**Jessica**). Los modelos están diseñados para ser utilizados en Unity, mostrando animaciones, lip-sync y comportamiento básico.

Se utiliza **uLipSync** para la sincronización labial y **ElevenLabs** para generar la voz sintética de cada avatar. El objetivo es explorar la interacción multimodal, con audio y representaciones visuales de los agentes.

## Instrucciones

1. **Abrir el proyecto en Unity:**
   - Clonar o descargar el repositorio.
   - Abrir Unity Hub y seleccionar la carpeta del proyecto descargado.
   - Asegurarse de tener la versión recomendada de Unity (2023.1.0f1 o superior).

2. **Seleccionar el modelo:**
   - Ir a `Assets/Scenes`.
   - Se puede cambiar entre los modelos **Chippy**, **Rover** o **Jessica** directamente en la escena.

3. **Reproducir la escena:**
   - Hacer clic en **Play** en Unity para iniciar la simulación.
   - El modelo seleccionado comenzará a interactuar con animaciones y sincronización labial basadas en los audios pregrabados.

## Modelos incluidos

- **Chippy (Robot)**: Un modelo simple y expresivo que funciona como un asistente virtual amigable.  
   [FRIET256 - Chippy](https://booth.pm/en/items/3775741)

- **Rover (Animal)**: Un avatar animal antropomórfico, adecuado para aplicaciones educativas o acompañamiento.  
   [Rover - Animal Crossing](https://sketchfab.com/3d-models/rover-animal-crossing-2852315661704ce0aa69d1cd986d68f0)

- **Jessica (Humano Realista)**: Un agente humano realista, ideal para contextos formales como soporte al cliente.  
   [RH011 - Jessica](https://www.cgtrader.com/free-3d-models/character/woman/unity-digital-human-rh011)

## Notas

- **Rover** no cuenta con blendshapes para sincronización labial, por lo que se utiliza **reemplazo dinámico de texturas** para las animaciones faciales.
- Asegurarse de que **uLipSync** esté configurado correctamente en el proyecto para que la sincronización labial funcione adecuadamente.

## Video de demostración

**Enlace al video de demostración:**  
[Video de demostración en YouTube](https://www.youtube.com/watch?v=1E1UAC7VLGU)  
Este video muestra cómo interactúan los tres modelos en Unity con animaciones, voz generada y sincronización labial.

## Referencias y recursos

- **uLipSync**: [Repositorio de uLipSync en GitHub](https://github.com/hecomi/uLipSync)
- **ElevenLabs**: [Página oficial de ElevenLabs](https://www.elevenlabs.io/)
- **Modelos 3D utilizados**: 
   - [FRIET256 (Chippy)](https://booth.pm/en/items/3775741)
   - [RH011 (Jessica)](https://www.cgtrader.com/free-3d-models/character/woman/unity-digital-human-rh011)
   - [Rover Animal Crossing](https://sketchfab.com/3d-models/rover-animal-crossing-2852315661704ce0aa69d1cd986d68f0)
