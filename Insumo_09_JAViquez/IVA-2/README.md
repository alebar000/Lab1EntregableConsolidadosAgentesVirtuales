---
noteId: "0eb7483041d811f1bef525f5f50710e9"
tags: []

---

# IVA-2: Female Intelligent Virtual Agent

## Overview

IVA-2 is a sophisticated Unity-based Intelligent Virtual Agent featuring a female avatar with advanced facial animations and interactive capabilities. This project showcases state-of-the-art character for virtual assistants, gaming, and educational applications with a focus on gender diversity and inclusive user experiences.

## Technical Specifications

### Unity Version

- **Unity 6000.3.11f1** (Latest Unity 6 LTS)
- Universal Render Pipeline (URP) 17.3.0

### Core Features

#### Avatar Characteristics

- **Gender**: Female
- **Avatar Model**: `female.fbx` - 3D rigged character model with female characteristics
- **Facial Animation**: Advanced blend shape-based expressions
- **Audio Integration**: Real-time lip syncing with viseme generation
- **Inclusive Design**: Represents diversity in virtual agent applications

#### Facial Expression System

The IVA implements four primary emotional and communicative states optimized for natural female expressions:

1. **Thinking Animation** (`thinking.cs`)
   - Brow furrow intensity: 60%
   - Eye squint for concentration: 25%  
   - Eyes looking upward: 40%
   - Mouth purse expression: 30%
   - Smooth transitions with configurable speed (2x default)
   - Optimized for female facial anatomy

2. **Talking Animation** (`talking.cs`)
   - Real-time audio analysis and lip syncing
   - Multiple viseme support (A, E, I, O, U vowels + consonants)
   - Audio sensitivity: 1.5x with 8x smoothness
   - Automatic audio clip playback with delay support
   - Phoneme-based mouth shape generation
   - Calibrated for female vocal patterns

3. **Smile Animation** (`smile.cs`)
   - Natural bilateral smile activation
   - Mouth smile intensity: 40% (left/right)
   - Mouth opening: 100% for full expression
   - Smooth interpolation between expressions
   - Enhanced for feminine smile characteristics

4. **Blink Animation** (`blink.cs`)
   - Natural eye blinking patterns
   - Automatic eyelid coordination
   - Customizable timing and intensity
   - Adjusted for female eyelash and eye shape

#### Assets Structure

```
Assets/
├── Avatar/
│   ├── Animations/     # Facial expression scripts
│   ├── Audio/          # Audio clips and settings
│   ├── Materials/      # PBR materials (female-specific)
│   ├── Textures/       # Texture assets (female characteristics)
│   └── female.fbx      # Main female character model
├── Scenes/
│   └── SampleScene.unity
└── Settings/           # Project configurations
```

## Technical Implementation

### Facial Animation Pipeline

The female avatar uses Unity's Animator State Machine with custom `StateMachineBehaviour` scripts:

- **Gender-Optimized Blend Shapes**: Facial animation calibrated for female anatomy
- **Multi-naming Support**: Compatible with various 3D model naming conventions
- **Smooth Transitions**: Lerp-based interpolation for natural expressions
- **Real-time Processing**: Frame-by-frame expression updates
- **Female Characteristic Enhancement**: Optimized for feminine facial features

### Audio-Visual Synchronization

Advanced lip syncing system with female vocal optimization:

- **Spectrum Analysis**: 512-point FFT audio analysis
- **Viseme Mapping**: Phoneme-to-mouth-shape conversion optimized for female speech
- **Intensity Control**: Configurable expression strengths per viseme
- **Silence Detection**: Automatic mouth closure during audio gaps
- **Vocal Pattern Recognition**: Enhanced for female vocal frequency ranges

## Use Cases

### Virtual Assistant Applications

- Interactive customer service avatars (female representation)
- Educational tutoring systems with diverse instructors
- Healthcare patient interaction with gender preferences
- Corporate training simulations with inclusive character options

### Gaming Applications

- Diverse Non-player character (NPC) interactions
- Narrative-driven game characters with female perspectives
- Interactive story experiences with gender representation
- Virtual reality companions offering choice and diversity

### Research & Development

- Human-computer interaction studies across gender lines
- Emotional expression research in female avatars
- Animation technique development for diverse characters
- AI behavior modeling with gender considerations

### Accessibility & Inclusion

- Gender-inclusive virtual environments
- Diverse avatar representation in applications
- Cultural sensitivity in virtual agent design
- Accessibility for users preferring female virtual assistants

## Getting Started

1. **Open Project**: Load the IVA-2 folder in Unity 6000.3.11f1 or later
2. **Scene Setup**: Open `Assets/Scenes/SampleScene.unity`
3. **Play Mode**: Enter Play Mode to interact with the female avatar
4. **Customization**: Modify animation parameters in the respective `.cs` files
5. **Audio Setup**: Assign audio clips to enable lip syncing functionality
6. **Gender Calibration**: Adjust facial expression intensities for optimal female representation

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
