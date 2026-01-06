# Milestones and Development Status

**Target Platform**: Unity 2023 LTS (2D, mobile-first)
**Current Version**: 0.1.0 (Pre-Alpha)
**Last Updated**: January 2025

---

## Current Implementation Status

### Completed Components

| Component | Status | Files | Lines |
|-----------|--------|-------|-------|
| SimCore Engine | ✅ Complete | 4 | ~1,200 |
| Content System | ✅ Complete | 4 JSON | - |
| CLI Runner | ✅ Complete | 1 | 68 |
| Unity Scripts | ✅ Complete | 21 | ~1,300 |
| Unity Project Config | ✅ Complete | 6 | - |
| **Total** | | **36 files** | **~2,500** |

### SimCore Implementation (100%)

- [x] Deterministic turn loop with seeded RNG (xorshift32)
- [x] WorldState with regions, factions, progress metrics
- [x] FactionState with 8 resource types and 4 meters
- [x] RegionState with 7 stats per region
- [x] Effect system (6 effect types)
- [x] Action system with costs and requirements
- [x] Event system with weighted selection and options
- [x] Win/loss condition evaluation
- [x] SimplePolicyPicker for AI decision making
- [x] ContentLoader with JSON parsing
- [x] String-based loading for Unity Resources

### Content Implementation (100% for MVP)

- [x] 10 regions with distinct stat distributions
- [x] 17 actions (10 AI, 7 Human) - expanded for balance
- [x] 10 upgrades (5 AI, 5 Human)
- [x] 10 events with dual-choice options
- [x] Scenario definition with starting values

### Unity Scripts Implementation (100%)

**Core (5 files)**
- [x] GameManager.cs - Central game state manager
- [x] ContentLoader.cs - JSON loading from Resources
- [x] Simulation.cs - Turn execution
- [x] WorldState.cs - State model
- [x] SimDefinitions.cs - Data structures

**Managers (3 files)**
- [x] GameSceneManager.cs - Scene initialization
- [x] SaveManager.cs - Save/load system
- [x] AudioManager.cs - Audio management (placeholder)

**UI Controllers (13 files)**
- [x] WorldMapController.cs - Map management
- [x] RegionView.cs - Region visualization
- [x] RegionInfoPanel.cs - Region details
- [x] ActionBarController.cs - Action bar
- [x] ActionCard.cs - Action cards
- [x] EventPopup.cs - Event dialog
- [x] ProgressDisplay.cs - Progress meters
- [x] OverlayToggle.cs - Map overlays
- [x] NewsTicker.cs - Event log
- [x] GameEndScreen.cs - Victory/defeat
- [x] MainMenuController.cs - Main menu
- [x] PauseMenu.cs - Pause menu
- [x] TutorialOverlay.cs - Tutorial system

### Not Yet Implemented

- [ ] Unity scenes (MainMenu.unity, GameScene.unity)
- [ ] Unity prefabs (RegionView, ActionCard, EventOptionButton)
- [ ] Visual assets (sprites, icons)
- [ ] Audio assets (music, SFX)
- [ ] Player action selection (currently auto-picks)

---

## Milestone Definitions

### Milestone 0 — Preproduction Prototype ✅ COMPLETE

**Goal**: Prove core game loop with headless simulation

| Task | Status |
|------|--------|
| 10-region world model | ✅ Done |
| Deterministic turn loop | ✅ Done |
| Both factions playable (auto) | ✅ Done |
| 10 events with options | ✅ Done |
| 10 upgrades | ✅ Done |
| 10 actions | ✅ Done |
| Core resources system | ✅ Done |
| Win/loss conditions | ✅ Done |
| CLI runner for testing | ✅ Done |
| Unity script foundation | ✅ Done |

**Test Results (after balance fix v0.1.2)**:
```
100-seed test: AI 44% vs Human 56%
Games last 10-15 turns with competitive gameplay
```

**Balance Changes Applied**:
- Tuned AI autonomy gain rate (base 0.008 + FCI scaling 0.006 + compute bonus 0.02)
- Human faction Coordination/Trust contribute more to safety progress
- Added 5 new aggressive AI actions (Recursive Self-Improvement, Autonomous Scaling, etc.)
- Added 2 new Human actions (International Coordination, Compute Monitoring)
- Suspicion penalty increased (0.4 multiplier) to give Human faction more counterplay

---

### Milestone 1 — Playable Unity Build 🔄 IN PROGRESS

**Goal**: First playable build with full UI

| Task | Status | Priority |
|------|--------|----------|
| Create MainMenu scene | ❌ Pending | High |
| Create GameScene scene | ❌ Pending | High |
| Create RegionView prefab | ❌ Pending | High |
| Create ActionCard prefab | ❌ Pending | High |
| Create EventOptionButton prefab | ❌ Pending | High |
| Wire up all UI references | ❌ Pending | High |
| Add placeholder sprites | ❌ Pending | Medium |
| Player action selection | ❌ Pending | High |
| Test full game loop in Unity | ❌ Pending | High |
| Balance adjustments | ✅ Done | Medium |

**Deliverable**: APK/IPA that runs complete game from menu to victory screen

---

### Milestone 2 — Content Expansion

**Goal**: Enough content for engaging gameplay

| Task | Status | Target |
|------|--------|--------|
| Expand events | ❌ Pending | 50+ events |
| Expand actions | ❌ Pending | 20+ actions |
| Expand upgrades | ❌ Pending | 30+ upgrades |
| Add region adjacency | ❌ Pending | - |
| Difficulty levels | ❌ Pending | Easy/Normal/Hard |
| Tutorial improvements | ❌ Pending | - |
| Balance via batch testing | ❌ Pending | 10k seeds |

---

### Milestone 3 — AI Director

**Goal**: Intelligent opponent with varied playstyles

| Task | Status |
|------|--------|
| Personality system (Scaler, Schemer, etc.) | ❌ Pending |
| Long-term planning | ❌ Pending |
| Adaptive difficulty | ❌ Pending |
| Multiple AI strategies | ❌ Pending |

---

### Milestone 4 — Polish & Launch

**Goal**: Store-ready release

| Task | Status |
|------|--------|
| Visual polish | ❌ Pending |
| Sound design | ❌ Pending |
| Music | ❌ Pending |
| Performance optimization | ❌ Pending |
| Localization | ❌ Pending |
| Analytics integration | ❌ Pending |
| Store assets | ❌ Pending |
| Beta testing | ❌ Pending |

---

## Immediate Next Steps

### Priority 1: Unity Scene Setup
1. Open UnityProject in Unity 2023 LTS
2. Create `MainMenu.unity` scene
3. Create `GameScene.unity` scene
4. Set up Canvas with proper scaling

### Priority 2: Prefab Creation
1. Create RegionView prefab with all UI elements
2. Create ActionCard prefab
3. Create EventOptionButton prefab
4. Wire prefabs to controllers

### Priority 3: Integration Testing
1. Test new game flow
2. Test turn execution
3. Test event popups
4. Test victory/defeat screens
5. Test save/load

### Priority 4: Balance Fixes ✅ COMPLETE
1. ~~Lower starting FCI/ARI values~~ (kept as-is, balanced via other changes)
2. ✅ Increase AI Autonomy gain rate
3. ✅ Reduced Human resource impact (instead of raising thresholds)
4. ✅ Add more aggressive AI actions (5 new actions)
5. ✅ Tested with multiple seeds (AI now wins in 10-13 turns)

---

## File Inventory

### SimCore/
```
SimCore.csproj          - .NET 6.0 library project
WorldState.cs           - Core state model (355 lines)
Simulation.cs           - Turn loop and logic (612 lines)
SimDefinitions.cs       - Data structures (134 lines)
ContentLoader.cs        - JSON loading (99 lines)
```

### SimRunner/
```
SimRunner.csproj        - .NET 6.0 console app
Program.cs              - CLI entry point (68 lines)
```

### Content/
```
scenario.json           - World setup, 10 regions
actions.json            - 17 faction actions (10 AI, 7 Human)
upgrades.json           - 10 one-shot upgrades
events.json             - 10 random events
```

### UnityProject/Assets/Scripts/Core/
```
GameManager.cs          - Unity-SimCore bridge
ContentLoader.cs        - Copy from SimCore
Simulation.cs           - Copy from SimCore
WorldState.cs           - Copy from SimCore
SimDefinitions.cs       - Copy from SimCore
```

### UnityProject/Assets/Scripts/Managers/
```
GameSceneManager.cs     - Scene init, keyboard shortcuts
SaveManager.cs          - Save/load system
AudioManager.cs         - Audio placeholder
```

### UnityProject/Assets/Scripts/UI/
```
WorldMapController.cs   - Map and regions
RegionView.cs           - Single region display
RegionInfoPanel.cs      - Region details panel
ActionBarController.cs  - Bottom action bar
ActionCard.cs           - Action card UI
EventPopup.cs           - Event dialog
ProgressDisplay.cs      - Progress meters
OverlayToggle.cs        - Map overlay buttons
NewsTicker.cs           - Event log
GameEndScreen.cs        - Victory/defeat
MainMenuController.cs   - Main menu
PauseMenu.cs            - Pause menu
TutorialOverlay.cs      - Tutorial system
```

### UnityProject/ProjectSettings/
```
ProjectSettings.asset   - Unity project settings
EditorBuildSettings.asset - Scene list
InputManager.asset      - Input configuration
TagManager.asset        - Tags and layers
QualitySettings.asset   - Graphics quality
```

### UnityProject/
```
Packages/manifest.json  - Package dependencies
Assets/Scripts/Clippy.Unity.asmdef - Assembly definition
README.md               - Unity setup instructions
```

---

## Testing Commands

```bash
# Run simulation with default settings
cd SimRunner
dotnet run

# Run with specific turns and seed
dotnet run -- --turns=20 --seed=12345

# Run with custom seed for balance testing
dotnet run -- --turns=50 --seed=42
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.2 | Jan 2025 | Balance tuning: 44% AI / 56% Human win rate across 100 seeds |
| 0.1.1 | Jan 2025 | Balance fix: AI autonomy gain, 7 new actions, competitive gameplay |
| 0.1.0 | Jan 2025 | Initial SimCore, CLI runner, Unity scripts |

---

## Contributors

- SimCore: Deterministic simulation engine
- Content: Game balance and content design
- Unity: UI implementation and integration
