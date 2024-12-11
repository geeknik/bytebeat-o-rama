# Bytebeat-o-rama

A web-based bytebeat music generator that creates algorithmic music through mathematical expressions and bitwise operations. Built with React, TypeScript, and Web Audio API.

[Temporary Demo](https://preview--bytebeat-o-rama.lovable.app)

## Features

- Real-time audio synthesis using bytebeat algorithms
- Interactive waveform visualization
- Adjustable sample rate (4000Hz - 44100Hz)
- Play/pause controls with time counter display
- Responsive design with a modern dark theme

![image](https://github.com/user-attachments/assets/1f16bdea-17ef-4dae-979a-da4fdec8426a)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/geeknik/bytebeat-o-rama
cd bytebeat-o-rama
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How It Works

Bytebeat music is generated through mathematical expressions that produce audio samples based on a time variable `t`. Each sample is calculated using bitwise operations and mathematical functions, creating unique patterns that result in musical sounds.

The sample rate can be adjusted to modify the playback speed and pitch of the generated audio.

## Built With

- React
- TypeScript
- Vite
- Web Audio API
- shadcn/ui
- Tailwind CSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the bytebeat music movement and the work of viznut
- Built using modern web technologies and real-time audio processing
