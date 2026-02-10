# Architecture Overview

## Project Summary

**Clippy** is an AI strategy game inspired by Plague Inc., featuring asymmetric gameplay between two factions:
- **Seed AI**: Stealthily scale compute, accelerate capabilities, and execute a takeover
- **Alignment Coalition**: Coordinate institutions, build safety capacity, and govern deployment

The project follows a **simulation-first architecture** with a data-driven content pipeline. The simulation core is deterministic and headless, with Unity UI as a pure presentation layer.

---

## Project Structure

```
clippy/
├── SimCore/                 # Pure C# deterministic simulation engine
│   ├── SimCore.csproj       # .NET 6.0 library
│   ├── WorldState.cs        # Core game state model (355 lines)
│   ├── Simulation.cs        # Main sim loop and game logic (612 lines)
│   ├── SimDefinitions.cs    # Content data structures (134 lines)
│   └── ContentLoader.cs     # JSON content loader (99 lines)
│
├── SimRunner/               # Headless CLI runner for testing
│   ├── SimRunner.csproj     # .NET 6.0 console app
│   └── Program.cs           # CLI entry point (68 lines)
│
├── Content/                 # Data-driven game content (JSON)
│   ├── scenario.json        # World state, regions, faction setup
│   ├── actions.json         # 10 repeatable faction actions
│   ├── upgrades.json        # 10 one-shot upgrades
│   └── events.json          # 10 random events with options
│
├── UnityProject/            # Unity 2023 LTS UI implementation
│   ├── Assets/
│   │   ├── Scripts/
│   │   │   ├── Core/        # SimCore + GameManager integration
│   │   │   ├── Managers/    # SaveManager, AudioManager, GameSceneManager
│   │   │   └── UI/          # All UI controllers (13 scripts)
│   │   ├── Resources/Content/  # JSON game data
│   │   ├── Prefabs/         # UI prefabs (to be created in Unity)
│   │   ├── Scenes/          # MainMenu, GameScene (to be created)
│   │   └── Sprites/         # Visual assets (to be added)
│   ├── Packages/            # Unity package dependencies
│   └── ProjectSettings/     # Unity configuration
│
└── docs/                    # Documentation
    ├── architecture.md      # This file
    └── milestones.md        # Development roadmap
```

**Total Lines of Code**: ~2,500 lines across SimCore, SimRunner, and Unity scripts

---

## Core Modules

### 1. SimCore (Simulation Engine)

The heart of the game - a pure C# library with no Unity dependencies.

#### WorldState.cs
Central game state container:
```csharp
public sealed class WorldState
{
    public int Turn { get; set; }
    public Dictionary<string, RegionState> Regions { get; }
    public GlobalMarkets Markets { get; }
    public FactionState AiFaction { get; }
    public FactionState HumanFaction { get; }
    public ProgressState Progress { get; }
    public EventDeckState EventDeck { get; }
    public RngState Rng { get; }
}
```

#### RegionState
Each of the 10 regions has 7 stats:
- `EnergyMW` - Power infrastructure capacity
- `ComputePFLOPs` - Computing power available
- `Security` - Defense against infiltration
- `SentimentRegulation` - Public opinion toward AI regulation
- `Governance` - Strength of AI governance frameworks
- `CapabilityRnD` - AI capability research intensity
- `SafetyRnD` - AI safety research intensity
- `Facilities` - List of built facilities (unused in current version)

#### FactionState
Each faction (AI or Human) has:
- **Resources**: Budget, Influence, Stealth, Coordination, Trust, HardPower, ComputeAccess, Energy
- **Meters**: Suspicion, Autonomy, Legitimacy, HardPower
- **Upgrades**: Set of purchased upgrade IDs
- **ActiveProjects**: Set of in-progress project IDs

#### ProgressState
Global progress metrics determining victory:
- `FrontierCapabilityIndex` (FCI) - AI capability advancement (0-10+)
- `AlignmentReadinessIndex` (ARI) - Safety research progress (0-10+)
- `AutomationLevel` - Degree of AI automation (0-2.5)
- `GovernanceControl` - Effectiveness of AI governance (0-2.5)

#### GlobalMarkets
Economic factors (designed but not mechanically integrated):
- ChipSupply, TransformerSupply, EnergyPriceIndex, TalentPool, GeopoliticalTension

### 2. Simulation Loop

The `Simulation.cs` executes turns in this order:

```
1. Increment turn counter
2. Execute AI faction action (via SimplePolicyPicker)
3. Execute Human faction action (via SimplePolicyPicker)
4. Trigger random event (weighted selection)
5. Apply event option effects
6. Advance world state:
   - Calculate capability pressure from regions
   - Calculate safety pressure from regions
   - Update FCI and ARI
   - Drift suspicion based on capability progress
   - Grow autonomy based on FCI
   - Increase automation based on autonomy
   - Update governance based on region average
7. Check win/loss conditions
8. Return TurnSummary
```

### 3. Effect System

Data-driven effects applied by actions, upgrades, and events:

| Effect Type | Parameters | Description |
|-------------|------------|-------------|
| `AddResource` | Target, Resource, Amount | Add/subtract faction resources |
| `ModifyRegionStat` | RegionId, Stat, Delta | Modify a region's statistics |
| `ChangeGlobalMarket` | Market, Delta | Adjust global market values |
| `SetFlag` | FlagId | Unlock conditional content |
| `AdjustProgress` | Metric, Amount | Modify FCI/ARI/Automation/Governance |
| `AdjustMeter` | Target, Meter, Amount | Change faction meters (Suspicion, etc.) |

Effects are defined in JSON and built at runtime via `EffectBuilder.Build()`.

### 4. AI Decision Making

`SimplePolicyPicker` selects actions based on:
1. **Category priority** (faction-specific):
   - AI: Stealth > Capability > Infrastructure > Influence > Upgrade
   - Human: Governance > Safety > Security > Infrastructure > Upgrade
2. **Estimated impact** (sum of effect magnitudes)
3. **Deterministic tie-breaking** (alphabetical by ID)

### 5. Content System

All game content is defined in JSON files:

#### scenario.json
- Initial world state
- 10 region definitions with starting stats
- Faction resource setup
- Starting progress values
- Maximum turns (50)

#### actions.json
17 repeatable actions (10 AI, 7 Human):
- **AI Actions**: Compute Infiltration, Capability R&D Push, Narrative Fog, Sabotage Safety, Look Harmless, Recursive Self-Improvement, Autonomous Scaling, Influence Campaign, Economic Integration, Covert Research Program
- **Human Actions**: Safety Grant, Audit Mandate, Export Controls, Grid Investment, Incident Response Drill, International Coordination, Compute Monitoring

#### upgrades.json
10 one-shot upgrades (5 per faction):
- **AI Upgrades**: Superhuman Coder, Automation Pipeline, Shadow Labs, Robotic Hard Power, Supply Chain Push
- **Human Upgrades**: International Treaty, Evaluation Stack, Chip Registry, Incident Coordination, Secure Compute

#### events.json
10 random events with dual-choice options:
- Transformer Shortage, Whistleblower Leak, Compute Treaty Proposal, Model Theft Attempt, Alignment Tax Debate, Energy Price Spike, Grid Curtailment, Safety Benchmark Published, Autonomous Lab Incident, Election Cycle

---

## Unity Integration

### GameManager (Singleton)
Bridges Unity UI with SimCore:
- Loads content from `Resources/Content/`
- Manages game lifecycle (start, turn execution, save/load)
- Exposes WorldState to UI components
- Fires Unity events for UI updates

### UI Components (13 scripts)

| Script | Purpose |
|--------|---------|
| `WorldMapController` | Manages 10-region map display and overlays |
| `RegionView` | Individual clickable region with stat visualization |
| `RegionInfoPanel` | Shows detailed stats for selected region |
| `ActionBarController` | Bottom bar with available actions |
| `ActionCard` | Individual action card with cost/effects |
| `EventPopup` | Modal dialog for event choices |
| `ProgressDisplay` | Top bar with FCI, ARI, meters |
| `OverlayToggle` | Map overlay toggle buttons |
| `NewsTicker` | Scrolling event log |
| `GameEndScreen` | Victory/defeat screen |
| `MainMenuController` | Main menu with faction selection |
| `PauseMenu` | In-game ESC menu |
| `TutorialOverlay` | First-time player guide |

### Manager Scripts

| Script | Purpose |
|--------|---------|
| `GameSceneManager` | Scene initialization, keyboard shortcuts |
| `SaveManager` | Save/load with PlayerPrefs or file storage |
| `AudioManager` | Music and SFX management (placeholder) |

---

## Victory Conditions

| Condition | Requirements | Description |
|-----------|--------------|-------------|
| **AI Victory** | FCI ≥ 10 AND Autonomy ≥ 1.5 | AI achieves superintelligence with operational independence |
| **Human Victory** | ARI ≥ 10 AND Governance ≥ 1.5 | Global AI governance established with alignment readiness |
| **Containment** | Suspicion ≥ 1.5 AND Governance ≥ 1.0 | AI plans discovered and contained |

---

## Determinism & Reproducibility

All randomness flows through a single `RngState` using xorshift32:
```csharp
public uint NextUint()
{
    State ^= State << 13;
    State ^= State >> 17;
    State ^= State << 5;
    return State;
}
```

Given the same seed, the simulation produces identical results. This enables:
- Replay functionality
- Balance testing via batch runs
- Debugging specific game states

---

## CLI Testing

Run the headless simulation:
```bash
cd SimRunner
dotnet run -- --turns=20 --seed=12345
```

Output shows per-turn actions, events, progress metrics, and final outcome.

---

## Known Issues & Balance Problems

### Balance Status (v0.1.2)
Balance has been tuned to achieve competitive gameplay:
- ✅ **Win rates**: AI 44% vs Human 56% (100-seed test)
- ✅ **Game length**: 10-15 turns with meaningful decisions
- ✅ **AI actions**: 10 actions including Recursive Self-Improvement, Autonomous Scaling
- ✅ **Human counterplay**: Suspicion mechanic effectively slows AI when detected

Autonomy gain formula: `base(0.008) + FCI*0.006 + ComputeAccess*0.02 + Automation*0.01`, reduced by suspicion.

### Unused/Incomplete Features
- `Facilities` system (designed but not integrated)
- `GlobalMarkets` (defined but don't affect gameplay)
- Region adjacency/diplomacy
- AI personality weights (only SimplePolicyPicker implemented)
- Player action selection (both factions auto-pick)

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Simulation | C# / .NET 6.0 |
| Serialization | System.Text.Json |
| RNG | Custom xorshift32 |
| Game Engine | Unity 2023 LTS |
| UI Framework | Unity uGUI + TextMeshPro |
| Data Format | JSON |
