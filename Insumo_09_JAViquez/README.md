# PF3312 Lab: Intelligent Virtual Agent (IVA) Project Suite

## Overview

This repository contains a comprehensive collection of three Intelligent Virtual Agent (IVA) implementations built with Unity 6000.3.11f1. Each IVA demonstrates advanced facial animation, real-time lip syncing, and interactive capabilities suitable for various applications including virtual assistants, gaming, educational systems, and accessibility tools.

## Project Structure

The repository is organized into three distinct IVA implementations, each with unique characteristics and optimizations. Also, have a folder with documentation about the model selection and some specs about it. In that same documentation you can find a link to a recorded demo of the models which you can access it by clicking [here](https://youtu.be/WwUQYq2eU3I).

```text
pf3312-lab/
├── docs            # Documentation about the model selection and specs.
├── IVA-1/          # Male Intelligent Virtual Agent
├── IVA-2/          # Female Intelligent Virtual Agent  
├── IVA-3/          # Male Intelligent Virtual Agent
└── README.md       # This overview document
```

## IVA Project Summary

### 🚹 [IVA-1: Male Intelligent Virtual Agent](IVA-1/README.md)

**Target**: Full-featured male avatar with comprehensive emotional expressions

**Key Features**:

- **Complete Expression Set**: Four animation states (thinking, talking, smile, blinking)
- **Advanced Facial Animation**: Sophisticated blend shape control with precise intensity settings
- **Male Avatar Model**: Optimized `male.fbx` with masculine characteristics
- **Real-time Lip Sync**: Audio analysis with viseme generation for natural speech

### 🚺 [IVA-2: Female Intelligent Virtual Agent](IVA-2/README.md)

**Target**: Full-featured female avatar promoting diversity and inclusion

**Key Features**:

- **Identical Technical Capabilities**: Same four animation states as IVA-1
- **Female-Optimized Design**: `female.fbx` model calibrated for feminine characteristics
- **Inclusive Representation**: Focused on gender diversity in virtual environments
- **Enhanced Vocal Processing**: Lip sync optimization for female speech patterns
- **Cultural Sensitivity**: Design considerations for diverse user preferences

### ⚪ [IVA-3: Intelligent Virtual Agent](IVA-3/README.md)

**Target**: Full-featured male avatar with comprehensive emotional expressions

**Key Features**:

- **Minimalist Design**: Two focused animation states (talking, basic blinking)
- **Enhanced Audio Control**: Superior talking system with independent AudioSource management
- **Advanced Animation Control**: Animator parameter management and blend shape protection
- **Modular Architecture**: Easy integration into existing systems
  
## Technical Specifications

### Shared Technology Stack

All IVAs are built on the same robust foundation:

- **Unity Version**: 6000.3.11f1 (Unity 6 LTS)
- **Rendering Pipeline**: Universal Render Pipeline (URP) 17.3.0
- **Animation System**: Unity Timeline 1.8.11

## Getting Started

### Prerequisites

- Unity 6000.3.11f1 or later
- Minimum 4GB RAM
- Audio input/output capabilities

### Quick Start Guide

1. **Choose Your IVA**: Select the appropriate IVA based on your project requirements
2. **Clone Repository**: Download the complete project suite
3. **Open in Unity**: Load the desired IVA folder in Unity 6000.3.11f1+
4. **Scene Setup**: Open the `SampleScene.unity` in the Assets/Scenes folder
5. **Configure Audio**: Set up audio clips for lip syncing functionality
6. **Test Interactions**: Enter Play Mode to test avatar functionality
7. **Customize Parameters**: Modify animation settings in the respective script files

### Detailed Documentation

Each IVA includes comprehensive documentation:

- **[IVA-1 Complete Guide](IVA-1/README.md)** - Male avatar implementation details
- **[IVA-2 Complete Guide](IVA-2/README.md)** - Female avatar with inclusion features  
- **[IVA-3 Complete Guide](IVA-3/README.md)** - Male avatar implementation details
