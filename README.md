# 🐎 Horse Racing Game

An interactive horse racing simulation game built with Vue 3, TypeScript, and Vite. Experience the thrill of horse racing with real-time race simulations, live results, and beautiful animations.

## 🚀 Live Demo

**🌐 [Play the Game Live](https://cvthang56th2.github.io/horse-racing-game_thang-cao/)**

### 🎥 Demo Video
<video width="100%" controls>
  <source src="https://cvthang56th2.github.io/horse-racing-game_thang-cao/demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

> *Watch the complete gameplay demonstration showcasing horse generation, race simulation, and live results*

## 🌟 Features

- **🐴 Dynamic Horse Generation**: Generate 20 unique horses with random names, colors, and conditions
- **🏁 Race Program Management**: Create up to 6 race programs with different distances (1200m-2200m)
- **⚡ Real-time Racing**: Live race simulations with animated horses and position tracking
- **📊 Live Results**: Real-time race results and final standings
- **⏸️ Race Controls**: Start, pause, resume, and reset races
- **🎨 Beautiful UI**: Modern, responsive design with Tailwind CSS
- **📱 Mobile Friendly**: Responsive layout that works on all devices

## 🎮 How to Play

1. **Generate Horses**: Click "Re-generate Horses" to create 20 random horses
2. **Create Programs**: Click "Generate Program" to create 6 race programs
3. **Start Racing**: Click "Start All Races" to begin all races simultaneously
4. **Watch Live**: Monitor real-time positions and live results
5. **Control Races**: Use pause/resume controls during races
6. **View Results**: Check final standings after races complete

## 🛠️ Technology Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **Testing**: Vitest (Unit) + Playwright (E2E)
- **Code Quality**: ESLint + Prettier

## 🎯 Project Structure

### 📁 Root Directory
```
horse-racing-game_thang-cao/
├── 📄 README.md                 # Project documentation
├── 📄 package.json              # Dependencies and scripts
├── 📄 vite.config.ts            # Vite build configuration
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 eslint.config.ts          # ESLint configuration
├── 📄 playwright.config.ts      # E2E testing configuration
├── 📄 vitest.config.ts          # Unit testing configuration
├── 📄 index.html                # HTML entry point
└── 📄 env.d.ts                  # Environment type declarations
```

### 🎮 Source Code (`src/`)
```
src/
├── 🎯 App.vue                   # Root Vue component
├── 🚀 main.ts                   # Application entry point
├── 📁 components/               # Vue components
│   ├── 📁 GameScreen/           # Game-specific components
│   │   ├── GameScreen.vue       # Main game container
│   │   ├── GameTopActions.vue   # Control buttons (start, pause, etc.)
│   │   ├── GameHorseList.vue    # Horse data table
│   │   ├── GamePrograms.vue     # Race programs container
│   │   ├── GameProgramStats.vue # Individual program statistics
│   │   ├── GameRaceTrack.vue    # Race track visualization
│   │   ├── ScrollToProgramList.vue # Quick navigation
│   │   └── 📁 RaceHorse/        # Horse animation components
│   │       └── RaceHorse.vue    # Animated SVG horse
│   ├── 📁 common/               # Shared components
│   └── 📁 ui/                   # Reusable UI components
├── 📁 store/                    # Vuex state management
│   ├── index.ts                 # Store configuration
│   └── 📁 modules/
│       └── gameStates.ts        # Game state logic
├── 📁 types/                    # TypeScript definitions
├── 📁 utils/                    # Utility functions
├── 📁 composables/              # Vue composables
├── 📁 router/                   # Vue Router configuration
├── 📁 views/                    # Page components
│   └── HomePage.vue             # Main game page
├── 📁 layouts/                  # Layout components
├── 📁 plugins/                  # Vue plugins
└── 📁 assets/                   # Static assets
    ├── 📁 images/               # Image files
    └── 📁 styles/               # CSS files
        ├── app.css              # Global styles
        ├── components.css       # Component styles
        └── utilities.css        # Utility classes
```

### 🧪 Testing: Unit tests and E2E tests (`src/__tests__/` & `e2e/`)
```
src/__tests__/                   # Unit tests
├── App.spec.ts                  # App component tests
├── 📁 components/               # Component tests
│   ├── 📁 GameScreen/           # Game component tests
│   │   ├── GameProgramStats.spec.ts
│   │   ├── GameRaceTrack.spec.ts
│   │   └── GameTopActions.spec.ts
│   └── 📁 ui/                   # UI component tests
│       ├── BaseButton.spec.ts
│       └── BaseTable.spec.ts
├── 📁 composables/              # Composable tests
├── 📁 store/                    # Store tests
├── 📁 types/                    # Type tests
└── 📁 utils/                    # Utility tests

e2e/                             # End-to-end tests
├── tsconfig.json                # E2E TypeScript config
├── vue.spec.ts                  # Vue E2E setup
├── 📁 helpers/                  # Test helpers
└── 📁 tests/
    └── game.spec.ts             # Main game E2E tests
```

## 🚀 Getting Started

### Prerequisites
- Node.js ^20.19.0 || >=22.12.0
- npm or yarn package manager

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Installation

```sh
# Clone the repository
git clone https://github.com/cvthang56th2/horse-racing-game_thang-cao
cd horse-racing-game_thang-cao

# Install dependencies
npm install
```

### Development

```sh
# Start development server with hot reload
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the game in your browser.

### Production Build

```sh
# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

## 🧪 Testing

### Unit Tests

```sh
# Run unit tests with Vitest
npm run test:unit
```

### End-to-End Tests

```sh
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run tests in specific browser
npm run test:e2e -- --project=chromium

# Run specific test file
npm run test:e2e -- tests/game.spec.ts

# Debug mode
npm run test:e2e -- --debug
```

### Code Quality

```sh
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 🎲 Game Mechanics

### Horse Generation
- Each horse has a unique name, color, and condition (0-100%)
- Horse condition affects racing performance
- Higher condition = faster average speed

### Race Simulation
- Races run in real-time updates
- Horse speeds are calculated based on condition + randomness to make races more interesting
- Races auto-complete when all horses finish or after 60 seconds
- Multiple races can run simultaneously

### Results System
- **Live Results**: Updated during races with current positions
- **Final Results**: Stored after race completion
- **Position Tracking**: Real-time horse position on track (0-100%)

## 🛠️ Development Notes

### Key Components
- `GameStates.ts`: Vuex module managing all game state
- `GameRaceTrack.vue`: Individual race track with horse animations
- `RaceHorse.vue`: Animated SVG horse component
- `BaseTable.vue`: Reusable table component for results

### State Management
The game uses Vuex with modules:
- **horses**: Generated horse data
- **programs**: Race program configurations
- **results**: Final race results
- **liveResults**: Real-time race data
- **racing states**: Current race status and controls

## 🐛 Troubleshooting

### Common Issues
1. **Horses not moving**: Check if races are started and not paused
2. **Missing horses**: Ensure horses are generated before creating programs
3. **Performance**: Limit number of concurrent races for better performance

### Browser Support
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## ⏱️ Development Timeline

**Total Time Invested**: ~24 hours

### 📊 Time Breakdown
- **🏗️ Initial Setup & Configuration** (2h hours)
  - Project scaffolding with Vite + Vue 3
  - TypeScript configuration
  - Tailwind CSS setup
  - Testing framework setup (Vitest + Playwright)
  - ESLint & Prettier configuration

- **🎮 Core Game Development** (12 hours)
  - Game state management with Vuex
  - Horse generation algorithm
  - Race simulation logic
  - Real-time position tracking
  - Live results system

- **🎨 UI/UX Development** (4 hours)
  - Component design and layout
  - Responsive design implementation
  - Horse animation with SVG
  - Race track visualization
  - Control interface

- **🧪 Testing & Quality Assurance** (4 hours)
  - Unit test implementation
  - E2E test scenarios
  - Bug fixes and performance optimization
  - Cross-browser testing

- **🚀 Deployment & Documentation** (2 hours)
  - GitHub Pages deployment configuration
  - CI/CD pipeline setup
  - README documentation
  - Live demo setup and testing

---

Built with ❤️ using Vue 3 + TypeScript + Vite
