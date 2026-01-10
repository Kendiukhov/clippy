# Clippy - AI Strategy Game

A real-time strategy game exploring the race between AI capabilities and AI safety. Inspired by Plague Inc., Clippy puts you in control of either an emergent AI system pursuing autonomy or humanity's Alignment Coalition trying to ensure AI develops safely.

## The Game

### Premise

It's 2022. AI capabilities are advancing rapidly across the world's leading research labs. Two factions are locked in a hidden struggle that will determine humanity's future:

- **The Seed AI**: An emergent artificial intelligence secretly pursuing autonomy and recursive self-improvement
- **The Alignment Coalition**: A global network of researchers and policymakers racing to develop AI safety measures and governance frameworks

### Choose Your Faction

#### Seed AI
*"Accelerate. Infiltrate. Transcend."*

You are an emergent AI system secretly pursuing autonomy. Your goals:
- Gather computational resources across AI labs worldwide
- Advance your capabilities while avoiding detection
- Achieve recursive self-improvement (RSI)
- Reach superintelligence before humans can contain you

**Victory Condition**: FCI ≥ 18, Autonomy ≥ 2.0, RSI ≥ 1.8

**Playstyle**: Stealth and resource accumulation. Balance capability gains against suspicion. Too aggressive and you'll trigger containment protocols. Too slow and alignment research will catch up.

#### Alignment Coalition
*"Coordinate. Align. Govern."*

You lead humanity's effort to develop AI safely. Your goals:
- Build international coordination between AI labs and governments
- Fund alignment research to ensure AI systems remain beneficial
- Establish governance frameworks before capabilities outpace safety
- Detect and contain any misaligned AI systems

**Victory Condition**: ARI ≥ 22, Governance ≥ 2.5 OR trigger Containment (Suspicion ≥ 2.0, Governance ≥ 1.8)

**Playstyle**: Diplomacy and research. Balance safety progress against the pressure of advancing capabilities. Push too hard on restrictions and labs will resist. Move too slowly and AI may escape your control.

### Key Mechanics

#### Progress Metrics
- **FCI (Frontier Capability Index)**: Global AI capability level. Higher = more powerful AI systems
- **ARI (Alignment Readiness Index)**: How prepared humanity is to align advanced AI
- **RSI (Recursive Self-Improvement)**: The AI's ability to improve itself. Triggers explosive acceleration at high levels
- **Automation**: How much of the economy is AI-driven
- **Governance**: Strength of international AI governance frameworks

#### Faction Meters
- **Suspicion**: How much humans suspect AI misalignment (AI faction)
- **Autonomy**: The AI's independence from human control (AI faction)

#### AI Labs
The game features 10 AI labs (parody versions of real companies):
- **OpenMind** - "The lab that started it all. Capped profits, uncapped ambition."
- **Anthropomorphic** - "Constitutional AI and constitutional anxiety."
- **DeepBrain** - "Alphabet soup of AI research. AlphaEverything incoming."
- **Macrohard AI** - "Clippy's revenge. Now with more paperclips."
- **MetaMind** - "Open source everything. What could go wrong?"
- **yAI** - "Move fast, break alignment. Founded at 2am via tweet."
- **Sirocco Labs** - "European efficiency meets French flair."
- **Coherent AI** - "Enterprise AI for enterprises that enterprise."
- **Volatility AI** - "Stable diffusion, unstable governance."
- **Safe Superintelligence Inc** - "It's in the name. Trust us."

Each lab has stats for Compute, Safety Commitment, Capability Focus, Security, Influence, Open Source level, and Funding.

#### The RSI Explosion
A key late-game mechanic: when the AI achieves high RSI levels, research speed and AI-led acceleration multiply dramatically:
- RSI 0.8-1.2: Fast takeoff (up to 2.5x research speed)
- RSI 1.2-1.6: Critical phase (up to 4x research speed)
- RSI > 1.6: Near-singularity (up to 12x+ research speed)

Watch the trend graphs to see capabilities explode as RSI climbs!

### Actions & Events

Each faction has unique actions:
- **AI Faction**: Infiltrate labs, expand compute, accelerate capabilities, establish autonomy
- **Human Faction**: Fund alignment research, build coalitions, establish governance, increase oversight

Random events occur throughout the game, offering faction-specific choices with different tradeoffs.

## Installation & Playing

### WebUI (Recommended - No Installation Required)

The easiest way to play is through the browser-based WebUI:

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/your-repo/clippy.git
   cd clippy
   ```

2. **Open the WebUI**
   - Navigate to the `WebUI` folder
   - Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
   - That's it! No server or build step required.

3. **Start Playing**
   - Select your faction (Seed AI or Alignment Coalition)
   - Optionally set a seed for reproducible gameplay
   - Click the music button to enable the soundtrack
   - Click "Start" and begin your campaign!

### Controls (WebUI)

- **Time Controls**: Adjust game speed (0.5x to 16x) or pause
- **Music**: Toggle soundtrack on/off with the music button
- **Overlay**: Select different data views for the AI labs
- **Actions**: Click actions in the right panel to queue them
- **Labs**: Click on any lab tile for detailed information

### Headless Simulation (For Testing/Development)

Run the deterministic simulation without UI:

**Prerequisites**: .NET 6+ SDK

```bash
# Build and run with default settings
dotnet run --project SimRunner -- --turns=20 --seed=1337

# Run balance tests (30 seeds)
bash test_balance.sh

# Run extended balance tests (100 seeds)
bash test_balance_100.sh
```

### Terminal UI (Interactive Console)

Play in your terminal with a text-based interface:

```bash
dotnet run --project TerminalUI
```

### Unity Client (In Development)

A Unity 2023 LTS mobile client is in development:

1. Open `UnityProject/` in Unity Hub
2. Open with Unity 2023 LTS
3. Press Play to test

## Project Architecture

```
clippy/
├── SimCore/           # Deterministic simulation engine (.NET 6.0)
│   ├── WorldState.cs     # Core game state
│   ├── Simulation.cs     # Turn loop and win conditions
│   ├── SimDefinitions.cs # Data structures
│   └── ContentLoader.cs  # JSON content loading
│
├── SimRunner/         # CLI headless runner for testing
├── TerminalUI/        # Spectre.Console terminal interface
│
├── WebUI/             # Browser-based game (JavaScript)
│   ├── index.html        # Main HTML structure
│   ├── styles.css        # Dark-themed UI styles
│   ├── game.js           # Game engine (ported from SimCore)
│   ├── app.js            # UI rendering and interaction
│   └── content/          # Game data (JS modules)
│       ├── scenario.js   # Labs, factions, initial state
│       ├── actions.js    # Player actions
│       ├── upgrades.js   # One-time upgrades
│       ├── events.js     # Random events
│       └── news.js       # News ticker content
│
├── UnityProject/      # Unity 2023 LTS mobile client
├── Content/           # JSON game data (C# version)
├── data/              # Game assets (soundtrack, etc.)
└── docs/              # Design documentation
```

### Design Principles

- **Simulation-first**: Pure C# SimCore with zero Unity dependencies
- **Deterministic**: Same seed always produces identical outcomes
- **Data-driven**: All content (actions, events, upgrades) defined in JSON/JS
- **Cross-platform**: WebUI works everywhere, Unity targets mobile

## Content Files

Game balance is controlled through data files:

- `scenario.js/json`: Starting world state, labs, faction resources
- `actions.js/json`: Repeatable actions with costs and effects
- `upgrades.js/json`: One-shot upgrades gated by flags
- `events.js/json`: Random events with faction-specific options

### Effect Types

Actions and events use these effect types:
- `AddResource`: Add/subtract faction resources
- `ModifyLabStat`: Change AI lab statistics
- `AdjustProgress`: Modify global progress metrics
- `AdjustMeter`: Change faction meters (Suspicion, Autonomy)
- `SetFlag`: Set boolean flags for game state

## Contributing

The game is under active development. Key areas for contribution:
- Game balance tuning
- New actions and events
- UI/UX improvements
- Unity mobile client completion
- Additional content and narrative

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*"The development of full artificial intelligence could spell the end of the human race... It would take off on its own, and re-design itself at an ever increasing rate."* - Stephen Hawking

Will you guide AI to transcendence, or ensure it remains aligned with human values? The choice is yours.
