# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: `../CLAUDE.md` for full project context (SimCore, Unity, balance testing).

## Running & Testing

```bash
# Open in browser (no build required)
open index.html

# Validate JavaScript syntax
node --check game.js
node --check app.js
node --check content/*.js
```

## Architecture

**Two-class architecture:**
- `game.js` - Game engine: simulation logic ported from C# SimCore
- `app.js` - UI layer: rendering, event handlers, DOM manipulation

**Content files** (`content/`): Data-only JS modules defining game content as global constants
- `scenario.js` - `SCENARIO_DATA`: labs, factions, initial state
- `actions.js` - `ACTIONS_DATA`: player actions with costs/effects
- `upgrades.js` - `UPGRADES_DATA`: one-time faction upgrades
- `events.js` - `EVENTS_DATA`: random events with faction-specific options
- `constructor.js` - `CONSTRUCTOR_CONFIG`, `CONSTRUCTOR_BRANCHES`, `CONSTRUCTOR_MODULES`: AI Constructor tech tree
- `news.js` - `NEWS_TEMPLATES`: procedural news ticker content

## Key Classes

**game.js:**
- `Game` - Main game state, turn loop, win condition checks
- `RNG` - xorshift32 deterministic RNG (matches SimCore)
- `LabState` - Individual AI lab with computed stats
- `FactionState` - Player faction resources/meters
- `ProgressState` - Global progress metrics (FCI, ARI, Automation, RSI, Governance)
- `ConstructorState` - AI Constructor R&D points and installed modules

**app.js:**
- `App` - Singleton handling all UI: rendering, tick loop, event popups, overlays

## JavaScript Conventions

- 4-space indent
- Class-based architecture (no frameworks)
- Global content constants: `SCENARIO_DATA`, `ACTIONS_DATA`, `CONSTRUCTOR_MODULES`, etc.
- Reserved property warning: Never use `this.constructor` as a property name (JS reserved)

## Effect System

Actions/events apply effects via `Game.applyEffect()`:
- `AddResource` - Modify faction resources
- `ModifyLabStat` - Change lab stats (compute, safety, security, etc.)
- `AdjustProgress` - Change global metrics
- `AdjustMeter` - Change faction meters (Suspicion, Autonomy)
- `SetFlag` - Set boolean game flags

## Content Sync

WebUI content must stay in sync with:
- `../Content/*.json` (C# SimCore)
- `../UnityProject/Assets/Resources/Content/` (Unity)
