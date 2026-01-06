# Clippy — AI Strategy Game Prototype

Cross-platform mobile strategy game inspired by Plague Inc., centered on competing paths to AI doom or salvation. Two asymmetric campaigns:
- Seed Misaligned AI: stealthily scale compute, accelerate capabilities, and execute a takeover.
- Alignment Coalition: coordinate institutions, build safety capacity, and govern deployment before runaway autonomy.

This repo tracks the simulation-first architecture, data-driven content pipeline, and milestone plan to ship a playable slice in Unity 2023 LTS (2D, mobile-first).

## Repo layout (planned)
- `SimCore/` deterministic simulation and data models (pure C#).
- `Content/` ScriptableObjects and JSON balance tables.
- `UI/` map overlays, action bar, news feed.
- `docs/` design notes, balancing plans, and production roadmap.

## Development priorities
- Deterministic turn-based sim with seeded RNG.
- World map of coarse regions with energy/compute/governance overlays.
- Asymmetric mechanics for AI vs Alignment factions.
- Data-driven events/upgrades for rapid balancing.

See `docs/architecture.md` and `docs/milestones.md` for actionable next steps.

## Quickstart: headless sim
Prereq: install .NET 6+ SDK locally.

```bash
dotnet run --project SimRunner -- --turns=20 --seed=1337
```

The console runner loads `Content/` JSON, runs the deterministic sim, and prints per-turn actions, events, and progress meters (FCI/ARI/Automation/Governance/Suspicion).

## Content files
- `Content/scenario.json`: starting world state (regions, resources, progress, max turns, seed).
- `Content/actions.json`: repeatable faction actions with costs, categories, and effects.
- `Content/upgrades.json`: one-shot upgrades gated by flags.
- `Content/events.json`: weighted events with options that apply effects.

Supported effect types (data-driven): `AddResource`, `ModifyRegionStat`, `ChangeGlobalMarket`, `SetFlag`, `AdjustProgress`, `AdjustMeter`. See `SimCore/SimDefinitions.cs` for field names and enums.
