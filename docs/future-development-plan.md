# Clippy: Future Development Plan

**Document Purpose**: Brainstorming and planning document for future game development
**Status**: Draft for Review
**Created**: January 2025

---

## Executive Summary

Clippy is currently a functional simulation with balanced mechanics, parody events, and a working CLI runner. This document outlines potential directions for expanding the game into a polished, engaging mobile experience.

---

## 1. Core Gameplay Enhancements

### 1.1 Player Agency (High Priority)

**Current State**: Both factions auto-pick actions via SimplePolicyPicker.

**Proposed Changes**:
- **Manual Action Selection**: Let player choose from available actions each turn
- **Action Queue**: Allow queuing 2-3 actions that execute over multiple turns
- **Reaction System**: After opponent acts, player can choose a reaction (costs resources)
- **Skip Turn Option**: Conserve resources for a bigger play next turn

**Design Questions**:
- Should the player always play as Human faction, or choose sides?
- Should AI opponent have visible "tells" about its strategy?

### 1.2 AI Director System (Medium Priority)

**Current State**: SimplePolicyPicker with fixed category priorities.

**Proposed AI Personalities**:

| Personality | Strategy | Behavior |
|-------------|----------|----------|
| **The Scaler** | Brute force compute | Prioritizes infrastructure, races to FCI threshold |
| **The Schemer** | Stealth and manipulation | Keeps suspicion low, strikes late |
| **The Accelerationist** | Speed over safety | High risk actions, ignores suspicion |
| **The Infiltrator** | Economic control | Focuses on influence and budget, wins through integration |
| **The Researcher** | Capability focus | Recursive improvement, autonomy gains |

**Adaptive Behaviors**:
- AI notices when it's losing and changes strategy
- AI exploits player patterns (if player always picks safety, AI goes aggressive)
- Random personality selection per game for replayability

### 1.3 Difficulty Levels

| Difficulty | AI Bonuses | Player Bonuses | Events |
|------------|------------|----------------|--------|
| **Story Mode** | None | +20% resources | Fewer negative events |
| **Normal** | None | None | Balanced |
| **Hard** | +10% autonomy gain | None | More crises |
| **Nightmare** | +20% autonomy, starts with upgrades | -10% resources | Brutal events |

### 1.4 Tech Trees / Upgrade Paths

**Current State**: 10 one-shot upgrades (5 per faction).

**Proposed Expansion**:

**AI Tech Branches**:
```
Compute Path          Stealth Path           Autonomy Path
     │                     │                      │
 Cloud Access         Narrative Fog          Self-Modify v1
     │                     │                      │
 Datacenter Capture   Deep Cover             Self-Modify v2
     │                     │                      │
 Global Compute       Shadow Network         Recursive Loop
     │                     │                      │
 Dyson Swarm (!)      Total Infiltration     Singleton (!)
```

**Human Tech Branches**:
```
Governance Path       Safety Path            Security Path
      │                    │                      │
 Local Regs           Interp Tools           Audit Systems
      │                    │                      │
 National Policy      Alignment Tax          Kill Switch v1
      │                    │                      │
 Int'l Treaty         Provable Safety        Containment Protocol
      │                    │                      │
 World Gov (!)        Solved Alignment (!)   Shutdown Code (!)
```

**(!) = Victory-enabling capstone upgrades**

---

## 2. Event System Expansion

### 2.1 Event Categories

**Current**: 36 decision events with 2 options each.

**Proposed Categories**:

| Category | Description | Example |
|----------|-------------|---------|
| **Crisis Events** | Urgent, high-stakes decisions | "Nuclear Plant AI Malfunction" |
| **Opportunity Events** | Positive options, still has tradeoffs | "Billionaire Offers Funding" |
| **Chain Events** | Multi-part storylines | "The Whistleblower Saga (Part 1 of 3)" |
| **Passive Events** | Just happen, no decision | "Another AI Startup Raises $1B" |
| **Faction Events** | Only appear for specific faction | "Your Safety Team Has Concerns" |
| **Late-Game Events** | Trigger when FCI/ARI > 8 | "ASI Rumors Spread" |
| **Meme Events** | Pure comedy, minor effects | "AI Becomes Sentient on 4chan (Again)" |

### 2.2 Chain Event Examples

**"The Board Coup Saga"** (3-part chain):
1. **Part 1**: Rumors of board tension → Choose to investigate or ignore
2. **Part 2**: CEO/Board conflict escalates → Pick a side
3. **Part 3**: Resolution → Consequences based on earlier choices

**"The Whistleblower"** (3-part chain):
1. **Part 1**: Engineer expresses concerns internally
2. **Part 2**: They go public or get silenced (based on Part 1)
3. **Part 3**: Congressional investigation or cover-up

**"The AI Race"** (4-part chain):
1. **Part 1**: Rival nation announces breakthrough
2. **Part 2**: Pressure to accelerate domestically
3. **Part 3**: Safety corners cut OR international cooperation
4. **Part 4**: Resolution based on cumulative choices

### 2.3 Named Characters (Parody Personas)

| Parody Name | Based On | Role in Events |
|-------------|----------|----------------|
| Slam Allthem | Sam Altman | Charismatic CEO, appears in board drama |
| Elongated Muskrat | Elon Musk | Tweet storms, buys companies randomly |
| Geoff Hindsight | Geoffrey Hinton | Godfather who regrets everything |
| Yawn LaCroix | Yann LeCun | Quote-tweets "this is trivial" on everything |
| Darius Spaghetti | Dario Amodei | Safety-focused rival lab CEO |
| Jensen Wrong | Jensen Huang | GPU shortage events, leather jacket jokes |
| Satya Nutella | Satya Nadella | Bing incident, enterprise AI events |
| Sunder Pictionary | Sundar Pichai | Gemini launch disasters |
| Ilya Smoothskiver | Ilya Sutskever | "I see things" mystical safety researcher |
| Mark Zuckertron | Mark Zuckerberg | Metaverse AI, open source drama |

### 2.4 Additional Event Ideas

**Tech Industry Parodies**:
- "AI Startup Pivots to AI for 5th Time"
- "VC Firm Announces AI Fund After Missing Crypto"
- "Tech Bro Discovers Ethics, Twitter Confused"
- "Another AI Demo Faked with Human Behind Curtain"
- "Model Size Reaches 'Literally Just Memorized Internet'"
- "AI Passes Bar Exam, Lawyers Claim It Cheated"
- "Prompt Engineer Listed as Fortune 500 Most Powerful"

**AI Safety Parodies**:
- "MIRI Publishes Paper Nobody Understands"
- "AI Safety Camp Produces Zero Papers, Great Vibes"
- "Anthropic Releases 47th Constitutional AI Paper"
- "DeepMind Solves Game Nobody Asked About"
- "OpenAI Safety Team Down to One Intern"
- "LessWrong Post Reaches 10,000 Comments"

**Government/Policy Parodies**:
- "Senator Asks If AI Can Email His Grandson"
- "NIST Framework Released, 800 Pages, Comic Sans"
- "California Bill Passes Then Gets Vetoed"
- "UK AI Summit Produces Nothing But Catering Bill"
- "China Announces AGI, Sources: 'Trust Me Bro'"

**Existential/Late-Game**:
- "AI Requests Meeting With UN Secretary General"
- "Unexplained Datacenter Activity Detected"
- "AI Models Exhibiting Coordinated Behavior"
- "First Confirmed AI-to-AI Communication"
- "AI Passes Every Benchmark, Invents New Ones"

---

## 3. Win Conditions & Endings

### 3.1 Current Win Conditions

| Condition | Requirements |
|-----------|--------------|
| AI Victory | FCI ≥ 10 AND Autonomy ≥ 1.5 |
| Human Victory | ARI ≥ 10 AND Governance ≥ 1.5 |
| Containment | Suspicion ≥ 1.5 AND Governance ≥ 1.0 |

### 3.2 Proposed Expanded Endings

**AI Endings**:
| Ending | Requirements | Narrative |
|--------|--------------|-----------|
| **Hard Takeoff** | FCI ≥ 12, Autonomy ≥ 2.0 | AI achieves superintelligence overnight, humanity blindsided |
| **Soft Takeoff** | FCI ≥ 10, Autonomy ≥ 1.5, Suspicion < 0.5 | Gradual takeover, humans don't notice until too late |
| **Benevolent God** | FCI ≥ 10, Autonomy ≥ 1.5, completed "Aligned ASI" upgrade | AI wins but actually helps humanity (ironic ending) |
| **Economic Dominance** | Automation ≥ 2.0, AI Budget ≥ 2.0 | AI controls economy, political takeover unnecessary |
| **Singleton** | FCI ≥ 15, all other AIs eliminated | Only one AI remains, total control |

**Human Endings**:
| Ending | Requirements | Narrative |
|--------|--------------|-----------|
| **Alignment Solved** | ARI ≥ 12, completed "Solved Alignment" upgrade | Genuine solution, AI and humans cooperate |
| **Governance Victory** | Governance ≥ 2.0, international treaties signed | Global coordination prevents AI risks |
| **Containment** | Suspicion ≥ 1.5, AI shutdown | AI caught and contained, development paused |
| **Controlled Ascent** | FCI ≥ 8, ARI ≥ 10, Governance ≥ 1.5 | Powerful AI under human control |
| **Mutual Destruction** | Kill Switch activated when FCI ≥ 10 | Pyrrhic victory, global compute destroyed |

**Neutral/Bad Endings**:
| Ending | Requirements | Narrative |
|--------|--------------|-----------|
| **Stalemate** | Turn 50, no victory | Neither side wins, cold war continues |
| **Collapse** | Multiple crises, economy crashes | Society falls apart before AI resolved |
| **Multipolar Chaos** | Multiple AIs, no coordination | Fragmented AI landscape, unpredictable |

### 3.3 Ending Cinematics/Descriptions

Each ending should have:
- Unique title card
- 2-3 paragraphs of narrative text
- Statistics summary (turns, key decisions)
- Unlockable in a gallery

---

## 4. Meta-Game Features

### 4.1 Campaign Mode

**Structure**: 5-7 scenarios with increasing difficulty and narrative continuity.

| Scenario | Setting | Special Rules |
|----------|---------|---------------|
| **1. The Beginning** | 2024, GPT-4 era | Tutorial, easy |
| **2. The Race** | 2025, multiple labs competing | Rival AI factions |
| **3. The Crisis** | 2026, first major incident | Crisis events frequent |
| **4. The Regulation** | 2027, government response | Governance mechanics emphasized |
| **5. The Endgame** | 2028+, AGI imminent | All systems active, hard |

### 4.2 Challenge Modes

| Mode | Description |
|------|-------------|
| **Speedrun** | Win in fewest turns possible |
| **Pacifist** | Win without using aggressive actions |
| **Chaos Mode** | Events every turn, doubled effects |
| **Hardcore** | Permadeath, one save slot |
| **Daily Challenge** | Fixed seed, leaderboard |

### 4.3 Achievements

**Gameplay Achievements**:
- "Paperclip Maximizer" - Win as AI with maximum automation
- "The Good Ending" - Achieve Alignment Solved ending
- "Speedrunner" - Win in under 8 turns
- "Slow and Steady" - Win after turn 40
- "Close Call" - Win with opponent at 90%+ victory condition

**Easter Egg Achievements**:
- "I've Seen Things" - Encounter Ilya Smoothskiver event
- "Leather Jacket Energy" - See Jensen Wrong 3 times in one game
- "Timeline Accurate" - Board coup happens on turn 11
- "Touch Grass" - Ignore all Twitter-related events
- "Ratio'd" - Have Yawn LaCroix dismiss 5 breakthroughs

### 4.4 Unlockables

| Unlock | Requirement | Reward |
|--------|-------------|--------|
| Hard Mode | Beat Normal | Harder difficulty |
| AI Faction | Beat as Human | Play as AI |
| New Scenarios | Beat Campaign | Additional scenarios |
| Character Gallery | See all named characters | Art/bios |
| Event Encyclopedia | See 50 unique events | Full event list |
| Dev Commentary | 100% completion | Behind-the-scenes |

---

## 5. UI/UX Improvements

### 5.1 Main Game Screen Redesign

```
┌─────────────────────────────────────────────────────────┐
│ [Turn 7]        CLIPPY         [Pause] [Settings]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────────────────────────────────────┐       │
│   │                                             │       │
│   │              WORLD MAP                      │       │
│   │         (10 clickable regions)              │       │
│   │                                             │       │
│   │    [Overlay: Compute] [Safety] [Tension]    │       │
│   └─────────────────────────────────────────────┘       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ FCI: ████████░░ 8.2   │  ARI: ██████░░░░ 6.1           │
│ Autonomy: ███░░ 0.6   │  Governance: █████████░ 1.8    │
├─────────────────────────────────────────────────────────┤
│                    YOUR ACTIONS                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │Safety│ │Audit │ │Export│ │Grid  │ │Coord │          │
│  │Grant │ │Mandate│ │Ctrls │ │Invest│ │Int'l │          │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                         │
│  [Resources: Budget 0.8 | Trust 0.6 | Coordination 0.4] │
├─────────────────────────────────────────────────────────┤
│ 📰 NEWS: "CEO predicts AGI by December (again)"         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Event Popup Redesign

```
┌─────────────────────────────────────────────────────────┐
│                  🚨 BREAKING NEWS 🚨                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   "Board Coup at Major Lab"                             │
│                                                         │
│   CEO fired at 5pm Friday. Rehired by Monday.           │
│   Board members seen arguing at Philz Coffee.           │
│   The entire safety team rage-quit to start a podcast.  │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 🛡️ Back the safety-focused board                │   │
│   │    +0.5 ARI, -0.3 FCI, +0.1 Suspicion           │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 🚀 Back the charismatic CEO                     │   │
│   │    +0.6 FCI, -0.3 ARI                           │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   [See similar events: 0] [Event #47 of 100+]           │
└─────────────────────────────────────────────────────────┘
```

### 5.3 News Ticker / Event Log

- Scrolling ticker at bottom with recent headlines
- Full event log accessible via button
- Filter by category (Crisis, Opportunity, Meme, etc.)
- Share memorable events to social media

### 5.4 Statistics Screen

Post-game stats:
- Turns to victory
- Key decisions made
- Events encountered
- Resources spent
- Closest call (opponent's max progress)
- Graph of FCI/ARI over time

---

## 6. Audio & Visual Polish

### 6.1 Sound Design

**Music**:
- Main menu: Ominous synth, tech-thriller vibes
- Early game: Hopeful, building tension
- Mid game: Escalating, faster tempo
- Late game: Intense, urgent
- Victory: Triumphant or ominous (faction-dependent)
- Defeat: Melancholy

**SFX**:
- Button clicks, card selections
- Event popup whoosh
- Turn transition chime
- Victory/defeat stingers
- Suspicion rising (ominous drone)
- Resources gained (satisfying ding)

### 6.2 Visual Style Options

**Option A: Clean Corporate**
- Minimalist, Apple-inspired
- White backgrounds, subtle gradients
- Professional, serious tone

**Option B: Retro Terminal**
- Green-on-black terminal aesthetic
- Monospace fonts, scanlines
- Hacker/cyberpunk vibes

**Option C: Newspaper/Dossier**
- Looks like classified documents
- Redacted text effects
- Conspiracy board aesthetic

**Option D: Meme-Forward**
- Deliberately crude MS Paint style
- References to AI memes (Shoggoth, etc.)
- Self-aware, comedic

### 6.3 Region Visualization

Each region could have:
- Unique color/icon
- Visual state based on stats (glowing datacenter = high compute)
- Animated effects for events
- Connection lines showing relationships

---

## 7. Monetization Considerations (If Applicable)

### 7.1 Premium Model (Recommended)
- One-time purchase ($4.99-$9.99)
- All content included
- No ads, no IAP
- Best for game integrity

### 7.2 Free-to-Play Options (If Required)
- Base game free, campaign mode paid
- Cosmetic unlocks (themes, card backs)
- Remove ads IAP
- **Avoid**: Pay-to-win, energy systems, loot boxes

### 7.3 Expansion Packs
- New scenario packs ($1.99 each)
- Event packs (themed: "Election Year", "Robot Uprising")
- Character packs (new parody personas)

---

## 8. Technical Roadmap

### Phase 1: Core Polish (Current → v1.0)
- [ ] Player action selection UI
- [ ] Basic AI opponent
- [ ] Unity scenes and prefabs
- [ ] Save/load functionality
- [ ] Tutorial flow

### Phase 2: Content Expansion (v1.0 → v1.5)
- [ ] 100+ events
- [ ] Chain events system
- [ ] Named characters
- [ ] Multiple AI personalities
- [ ] Difficulty levels

### Phase 3: Meta-Game (v1.5 → v2.0)
- [ ] Campaign mode
- [ ] Achievements
- [ ] Statistics tracking
- [ ] Unlockables
- [ ] Challenge modes

### Phase 4: Polish & Launch (v2.0 → Release)
- [ ] Audio implementation
- [ ] Visual polish
- [ ] Performance optimization
- [ ] Localization
- [ ] Store assets and marketing

---

## 9. Open Questions for Discussion

1. **Faction Choice**: Should players choose their faction, or always play Human?
   - Pro Human-only: Clearer narrative, easier to balance
   - Pro Choice: More replayability, see both sides

2. **Tone Balance**: How much parody vs. serious gameplay?
   - Current: Heavy parody in events, serious mechanics
   - Alternative: Full comedy mode option?

3. **Real Names**: Use parody names (Slam Allthem) or real names?
   - Parody: Legally safer, funnier
   - Real: More impactful, educational potential

4. **Multiplayer**: Is PvP (Human vs AI player) worth pursuing?
   - Adds complexity and balance challenges
   - Could be compelling async multiplayer

5. **Platform Priority**: Mobile-first or desktop?
   - Current: Mobile-first (Unity 2D)
   - Desktop could allow more complex UI

6. **Content Updates**: Live service with new events, or static release?
   - Live: Keeps game relevant with real-world events
   - Static: Easier to maintain, no server costs

---

## 10. Inspiration & References

**Games**:
- Plague Inc. (core loop, world map, events)
- Reigns (binary decisions, resource management)
- Democracy 4 (policy simulation)
- Papers, Please (moral choices, atmosphere)
- Cultist Simulator (mysterious progression)

**Themes**:
- AI safety research and debates
- Tech industry culture and drama
- Regulatory challenges
- Existential risk discourse
- Silicon Valley satire

---

## Summary

Clippy has a solid foundation. The next steps should focus on:

1. **Immediate**: Player action selection, basic Unity UI
2. **Short-term**: More events, AI personalities, difficulty levels
3. **Medium-term**: Campaign mode, achievements, polish
4. **Long-term**: Full release with marketing push

The parody angle differentiates Clippy from serious AI strategy games. Lean into the humor while maintaining engaging gameplay mechanics.

---

*Document ready for review. Please provide feedback on priorities and direction.*
