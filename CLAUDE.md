# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
# Build simulation library
dotnet build SimCore/SimCore.csproj

# Run headless simulation (for testing/balance)
dotnet run --project SimRunner -- --turns=20 --seed=1337

# Run terminal UI (interactive game)
dotnet run --project TerminalUI

# Balance testing (run 30 or 100 seeds)
bash test_balance.sh
bash test_balance_100.sh

# Web UI: open WebUI/index.html in a browser
# Unity: open UnityProject/ in Unity Hub (2023 LTS) and press Play
```

## Testing

No unit test framework. Testing relies on deterministic seeded simulation:
- Same seed always produces identical game outcome
- Use `--seed=<N>` to reproduce specific scenarios
- Balance testing: run 30-100 seeds, check AI vs Human win rates
- Web UI: validate JavaScript with `node --check <file>.js`

## Architecture

**Simulation-first design**: Pure C# SimCore with zero Unity dependencies. WebUI/Unity/TerminalUI are presentation layers only.

```
SimCore/        # Deterministic simulation engine (.NET 6.0 library)
├── WorldState.cs      # Core state: Labs, Factions, Progress, RNG
├── Simulation.cs      # Turn loop, win conditions, effect execution
├── SimDefinitions.cs  # Data structures for JSON content
└── ContentLoader.cs   # Loads scenario/actions/events/upgrades

SimRunner/      # CLI headless runner for testing
TerminalUI/     # Spectre.Console terminal UI (interactive play)
WebUI/          # Browser-based game UI (JavaScript)
├── index.html         # Main HTML structure
├── styles.css         # Dark-themed CSS
├── game.js            # Game engine (ported from SimCore)
├── app.js             # UI rendering and interaction
└── content/           # Game data (JS modules)
    ├── scenario.js    # Labs, factions, initial state
    ├── actions.js     # Player actions
    ├── upgrades.js    # One-time upgrades
    └── events.js      # Random events with faction-specific options
UnityProject/   # Unity 2023 LTS client (in progress)
Content/        # JSON game data (scenario, actions, upgrades, events, characters)
```

**Turn flow**: AI action → Human action → Random event → World advancement → Win check

**Effect system**: Actions/events apply effects defined in content files:
- `AddResource` - Add/subtract faction resources
- `ModifyLabStat` - Modify AI lab stats (compute, safety, security, etc.)
- `AdjustProgress` - Change global progress metrics (FCI, ARI, Automation, Governance)
- `AdjustMeter` - Change faction meters (Suspicion, Autonomy, Legitimacy)
- `SetFlag` - Set boolean flags for game state

**Deterministic RNG**: xorshift32 seeded RNG for reproducible gameplay

## Key Game Mechanics

- **Two asymmetric factions**: Seed AI (stealth/capability) vs Alignment Coalition (governance/safety)
- **10 AI Labs** (parody names) with stats: ComputePFLOPs, SafetyCommitment, CapabilityFocus, Security, Influence, OpenSource, Funding
  - OpenMind, Anthropomorphic, DeepBrain, Macrohard AI, MetaMind, yAI, Sirocco Labs, Coherent AI, Volatility AI, Safe Superintelligence Inc
- **Progress metrics**: FCI (AI capability), ARI (alignment readiness), Automation, Governance
- **Win conditions**:
  - AI Victory: FCI ≥ 10 AND Autonomy ≥ 1.5
  - Human Victory: ARI ≥ 10 AND Governance ≥ 1.5
  - Containment: Suspicion ≥ 1.5 AND Governance ≥ 1.0
- **Faction-specific event options**: Events present different tradeoffs based on player faction
  - AI player sees AiOptions (two pro-AI choices)
  - Human player sees HumanOptions (two anti-AI choices)

## Coding Conventions

- C#: 4-space indent, braces on new lines, PascalCase types/methods, camelCase locals
- JavaScript: 4-space indent, class-based architecture, camelCase
- JSON/JS content: 2-space indent, PascalCase fields
- Content IDs: lowercase with underscores (e.g., `ai_infiltrate_openmind`)

## Content Sync

Keep content in sync across:
- `Content/` (C# SimCore)
- `WebUI/content/` (JavaScript WebUI)
- `UnityProject/Assets/Resources/Content/` (Unity)
