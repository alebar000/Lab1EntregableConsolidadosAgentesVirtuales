# IVA-1: Male Intelligent Virtual Agent

## Overview

IVA-1 is a sophisticated Unity-based Intelligent Virtual Agent featuring a male avatar with advanced facial animations and interactive capabilities. This project demonstrates state-of-the-art character suitable for virtual assistants, gaming, and educational applications.

## Technical Specifications

### Unity Version

- **Unity 6000.3.11f1** (Latest Unity 6 LTS)
- Universal Render Pipeline (URP) 17.3.0

### Core Features

#### Avatar Characteristics

- **Gender**: Male
- **Avatar Model**: `male.fbx` - 3D rigged character model
- **Facial Animation**: Advanced blend shape-based expressions
- **Audio Integration**: Real-time lip syncing with viseme generation

#### Facial Expression System

The IVA implements four primary emotional and communicative states:

1. **Thinking Animation** (`thinking.cs`)
   - Brow furrow intensity: 60%
   - Eye squint for concentration: 25%  
   - Eyes looking upward: 40%
   - Mouth purse expression: 30%
   - Smooth transitions with configurable speed (2x default)

2. **Talking Animation** (`talking.cs`)
   - Real-time audio analysis and lip syncing
   - Multiple viseme support (A, E, I, O, U vowels + consonants)
   - Audio sensitivity: 1.5x with 8x smoothness
   - Automatic audio clip playback with delay support
   - Phoneme-based mouth shape generation

3. **Smile Animation** (`smile.cs`)
   - Natural bilateral smile activation
   - Mouth smile intensity: 40% (left/right)
   - Mouth opening: 100% for full expression
   - Smooth interpolation between expressions

4. **Blink Animation** (`blink.cs`)
   - Natural eye blinking patterns
   - Automatic eyelid coordination
   - Customizable timing and intensity

#### Assets Structure

```
Assets/
├── Avatar/
│   ├── Animations/     # Facial expression scripts
│   ├── Audio/          # Audio clips and settings
│   ├── Materials/      # PBR materials
│   ├── Textures/       # Texture assets
│   └── male.fbx        # Main character model
├── Scenes/
│   └── SampleScene.unity
└── Settings/           # Project configurations
```

## Technical Implementation

### Facial Animation Pipeline

The avatar uses Unity's Animator State Machine with custom `StateMachineBehaviour` scripts:

- **Blend Shape Caching**: Performance-optimized facial animation
- **Multi-naming Support**: Compatible with various 3D model naming conventions
- **Smooth Transitions**: Lerp-based interpolation for natural expressions
- **Real-time Processing**: Frame-by-frame expression updates

### Audio-Visual Synchronization

Lip syncing system:

- **Spectrum Analysis**: 512-point FFT audio analysis
- **Viseme Mapping**: Phoneme-to-mouth-shape conversion
- **Intensity Control**: Configurable expression strengths per viseme
- **Silence Detection**: Automatic mouth closure during audio gaps

## Use Cases

### Virtual Assistant Applications

- Interactive customer service avatars
- Educational tutoring systems
- Healthcare patient interaction
- Corporate training simulations

### Gaming Applications

- Non-player character (NPC) interactions
- Narrative-driven game characters
- Interactive story experiences
- Virtual reality companions

### Research & Development

- Human-computer interaction studies
- Emotional expression research
- Animation technique development
- AI behavior modeling

## Getting Started

1. **Open Project**: Load the IVA-1 folder in Unity 6000.3.11f1 or later
2. **Scene Setup**: Open `Assets/Scenes/SampleScene.unity`
3. **Play Mode**: Enter Play Mode to interact with the avatar
4. **Customization**: Modify animation parameters in the respective `.cs` files
5. **Audio Setup**: Assign audio clips to enable lip syncing functionality

## Dependencies

- Unity AI Navigation Package (2.0.11)
- Unity Input System (1.19.0)
- Universal Render Pipeline (17.3.0)
- Unity Timeline (1.8.11)

## System Requirements

- Unity 6000.3.11f1 or later
- Minimum 4GB RAM
- DirectX 11 compatible GPU
- Audio input/output support for full interaction
