# Repository Guidelines

## Project Structure & Module Organization
- `SimCore/` contains the deterministic .NET 6 simulation engine (world state, sim loop, content models).
- `SimRunner/` is the headless CLI runner for local simulation and balance checks.
- `Content/` holds the JSON game data (scenario, actions, upgrades, events, characters).
- `UnityProject/` is the Unity 2023 LTS client; scripts live in `Assets/Scripts/{Core,Managers,UI}` and runtime content is in `Assets/Resources/Content/`.
- `docs/` provides architecture notes and milestones.

## Build, Test, and Development Commands
- `dotnet build SimCore/SimCore.csproj` — build the sim library.
- `dotnet run --project SimRunner -- --turns=20 --seed=1337` — run a deterministic headless sim.
- `bash test_balance.sh` / `bash test_balance_100.sh` — batch balance runs; update the hardcoded dotnet and project paths if your setup differs.
- Unity: open `UnityProject/` in Unity Hub (2023 LTS) and press Play once scenes/prefabs are wired (see `UnityProject/README.md`).

## Coding Style & Naming Conventions
- C#: 4-space indentation, braces on new lines, PascalCase for types/properties/methods, camelCase locals/parameters.
- JSON: 2-space indentation, PascalCase field names matching `SimCore/SimDefinitions.cs`.
- IDs in content files use lowercase with underscores (e.g., `ai_compute_infiltration`).
- Script files use `PascalCase.cs` and stay under `Clippy.*` namespaces.

## Testing Guidelines
- No unit/integration test projects are defined in this repo.
- Use deterministic seeds (`--seed=12345`) to reproduce bugs and validate balance.
- When editing content, run at least one headless sim and the balance scripts for tuning changes.

## Commit & Pull Request Guidelines
- Git history is not available in this checkout, so commit conventions cannot be inferred.
- Suggested format: short imperative summary with optional scope (e.g., `SimCore: tweak suspicion drift`).
- PRs should describe gameplay impact, list updated content files, and include screenshots/GIFs for Unity UI changes.

## Content Sync & Generated Artifacts
- Keep `Content/` and `UnityProject/Assets/Resources/Content/` in sync when changing gameplay data.
- Avoid editing generated outputs under `*/bin/` and `*/obj/`; rebuild instead.
