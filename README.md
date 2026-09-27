# PlacementOS ⚡

> **Deterministic Placement Preparation & Adaptive Readiness Engine for Engineering Students**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-black?style=for-the-badge&logo=githubpages&logoColor=white)](https://nitish-r-g.github.io/PlacementOS/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/NITISH-R-G/PlacementOS)
[![Tests](https://img.shields.io/badge/Vitest-65%2F65%20Passing-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/NITISH-R-G/PlacementOS)
[![Build](https://img.shields.io/badge/Production%20Build-Passing%20(2.0s)-success?style=for-the-badge&logo=vite&logoColor=white)](https://github.com/NITISH-R-G/PlacementOS)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20Strict-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/NITISH-R-G/PlacementOS)
[![Security](https://img.shields.io/badge/Vulnerabilities-0-emerald?style=for-the-badge&logo=security&logoColor=white)](https://github.com/NITISH-R-G/PlacementOS)

---

## 📌 Executive Summary

**PlacementOS** is an intelligent, high-contrast placement readiness and recommendation platform designed to eliminate the ambiguity of campus recruitment for engineering students. Instead of generic, one-size-fits-all roadmaps, PlacementOS runs an industry-calibrated **Deterministic Recommendation Engine** that calculates role-specific deficits, allocates daily time budgets, schedules high-yield drills, and tracks placement readiness velocity across 10 core engineering dimensions.

---

## 🚀 Live Demo & Deployment

| Environment | URL | Deployment Pipeline |
| :--- | :--- | :--- |
| **Production Application** | [https://nitish-r-g.github.io/PlacementOS/](https://nitish-r-g.github.io/PlacementOS/) | Automated GitHub Actions CI/CD (`deploy.yml`) on push to `main` |
| **Source Code Repository** | [https://github.com/NITISH-R-G/PlacementOS](https://github.com/NITISH-R-G/PlacementOS) | Continuous linting, type-checking, and unit test suites |

---

## 🧩 Architectural Overview

PlacementOS decouples presentation from recommendation logic through a modular pipeline:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PLACEMENTOS ARCHITECTURE                        │
└────────────────────────────────────────────────────────────────────────┘

    [ Student Input & Constraints ]
       ├── Target Role (SDE, Frontend, Backend, Data Analyst, etc.)
       ├── Available Hours / Day (1.0h - 4.0h)
       ├── Placement Countdown (Days remaining)
       └── Initial Self-Assessed Skill Level
                       │
                       ▼
    [ Diagnostic Assessment Engine ]
       ├── Multidimensional Engineering Quiz (DSA, OS, DBMS, SQL, OOP)
       ├── Instant Concept Evaluation & Explanations
       └── Empirical Baseline Score Assignment
                       │
                       ▼
    [ Deterministic Recommendation Engine (recommendationEngine.ts) ]
       ├── Role Weight Matrix (Normalizes 10 dimensional competencies)
       ├── Skill Gap Calculation (Urgency = Weight × (100 - Score))
       ├── 4-Phase Adaptive Timeline Calibration (Foundations → Speed → Projects → Mocks)
       ├── Today's High-Leverage Plan (Greedy packing into available minute budget)
       └── Curated Resource Matching (Excluding previously mastered topics)
                       │
                       ▼
    [ Interactive Feature Workspace ]
       ├── Dashboard View (Countdown, Readiness Index, What Matters Today)
       ├── 4-Phase Roadmap View (Sequenced milestones and deliverable timelines)
       ├── Practice Lab & Evaluator (Asymptotic complexity & rubric critique)
       ├── STAR Behavioral Interview Studio (Situation, Task, Action, Result)
       ├── Normalized Curriculum Catalog (Search, source filters, empty state recovery)
       └── Telemetry & Velocity Analytics (Recharts 10-dimension competency breakdown)
```

---

## 🎨 Visual Identity & Design System

PlacementOS features a disciplined, monochrome high-contrast aesthetic:

* **Display Typography**: Stylized pixel/dot display headers (`BubbledotICG`, `Geist Pixel Circle`) paired with clean geometric `Inter` for body copy and `tabular-nums` monospace numbers.
* **Atmospheric Contrast**: Deep obsidian surfaces (`#000000`, `#090a0f`, `#111218`) contrasted against crisp `#ffffff` primary pills and glowing ambient accents.
* **Restrained Glassmorphism**: Subtly frosted 1px borders (`border-white/[0.08]`), backdrop blur filters, and micro-hover lifts.
* **Pill Navigation**: Minimalist floating navigation pills with tactile active dot markers.
* **Accessibility**: Fully keyboard operable, screen-reader compliant (`role="progressbar"`, `aria-label` coverage on all interactive inputs and textareas), and respect for `prefers-reduced-motion`.

---

## 🛠️ Tech Stack & Engineering Standards

* **Framework**: React 19 + TypeScript
* **Build System**: Vite 8 (Rolldown engine) with optimized manual chunks (`vendor-react`, `recharts`, `lucide`, `app`)
* **Styling**: Tailwind CSS v3 + CSS custom design tokens
* **State Management**: Zustand with persistent storage synchronization
* **Data Visualization**: Recharts (Custom themed dark charts)
* **Iconography**: Lucide React
* **Testing**: Vitest + React Testing Library + `@testing-library/jest-dom` in JSDOM
* **Linter**: Oxlint (Sub-100ms ultra-fast static analysis)

---

## 🧪 Quality & Test Verification

PlacementOS includes **13 comprehensive test suites (65 tests)** covering the entire student journey without artificial or shallow assertions:

```text
 ✓ src/store/usePlacementStore.test.ts (7 tests)
 ✓ src/lib/recommendationEngine.test.ts (10 tests)
 ✓ src/components/ui/uiComponents.test.tsx (7 tests)
 ✓ src/pages/LandingPage.test.tsx (3 tests)
 ✓ src/features/roadmap/RoadmapView.test.tsx (3 tests)
 ✓ src/features/onboarding/OnboardingFlow.test.tsx (4 tests)
 ✓ src/features/analytics/AnalyticsView.test.tsx (2 tests)
 ✓ src/features/dashboard/DashboardView.test.tsx (5 tests)
 ✓ src/features/resources/ResourcesView.test.tsx (4 tests)
 ✓ src/features/interviews/InterviewView.test.tsx (3 tests)
 ✓ src/lib/utils.test.ts (4 tests)
 ✓ src/features/practice/PracticeView.test.tsx (5 tests)
 ✓ src/utils/formatters.test.ts (8 tests)

 Test Files  13 passed (13)
      Tests  65 passed (65)
   Duration  8.01s
```

---

## 📦 Local Development

### Prerequisites
* Node.js 20+ (Node 22 LTS recommended)
* npm 10+

### Setup
```bash
# Clone the repository
git clone https://github.com/NITISH-R-G/PlacementOS.git

# Navigate to project root
cd PlacementOS

# Install dependencies
npm install

# Start local development server
npm run dev

# Run comprehensive test suite
npm run test

# Run linter
npm run lint

# Validate TypeScript compilation
npx tsc -b

# Produce optimized production bundle
npm run build
```

---

## 🛡️ License & Attributions

PlacementOS references accredited open-source computer science curricula and learning sheets:
* **freeCodeCamp** (CC-BY-SA 4.0)
* **OSSU Computer Science** (MIT License)
* **takeUforward / Striver A2Z DSA Sheet** (Educational Reference)

PlacementOS indexes structured metadata and deep-links to accredited original sources, maintaining lightweight repository size and respecting author licensing.
