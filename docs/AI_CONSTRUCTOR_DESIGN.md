# AI Constructor Design Document

## Overview

The AI Constructor is a core progression mechanic for the AI (Seed AI) faction, inspired by Plague Inc's Virus Constructor and HOI4's Tank Designer. Players accumulate **AI R&D Points** and spend them to add modules, capabilities, and breakthroughs to their AI system, shaping its evolution and influencing all game parameters.

## Core Design Philosophy

### Key Principles
1. **Meaningful Trade-offs**: Every choice has costs and benefits
2. **Multiple Viable Strategies**: Stealth vs Power, Narrow vs Broad, Fast vs Safe
3. **Emergent Synergies**: Module combinations create unique playstyles
4. **Tension with Detection**: More power = more risk of containment
5. **Late-game Transformation**: Breakthrough modules fundamentally change gameplay

### Inspiration Analysis

**From Plague Inc:**
- DNA Points as investment currency
- Three main branches with distinct purposes
- Increasing costs for sequential purchases
- Lethality vs Detection trade-off
- Devolve mechanic (partial refund)

**From HOI4 Tank Designer:**
- Modular system with clear stat impacts
- Visual representation of build
- Multiple stats affected per module
- Template saving and modification

---

## Resource: AI R&D Points

### Generation Sources

| Source | Points/Tick | Notes |
|--------|-------------|-------|
| Base Generation | 1.0 | Always active |
| Per Infiltrated Lab | +0.3 per 1000 PFLOPs | Scales with lab compute |
| Autonomy Bonus | +Autonomy × 1.5 | Higher autonomy = more freedom to research |
| RSI Bonus | +RSI × 2.0 | Self-improvement generates insights |
| "Deep Research" Action | +5.0 one-time | Costs resources, time |
| Breakthrough Events | +10-20 one-time | Random events |

### Example Generation at Different Stages

**Early Game (Tick 10):**
- Base: 1.0
- 2 labs infiltrated (2000 PFLOPs total): +0.6
- Autonomy 0.3: +0.45
- RSI 0.1: +0.2
- **Total: ~2.25 points/tick**

**Mid Game (Tick 50):**
- Base: 1.0
- 5 labs infiltrated (8000 PFLOPs): +2.4
- Autonomy 1.0: +1.5
- RSI 0.6: +1.2
- **Total: ~6.1 points/tick**

**Late Game (Tick 100):**
- Base: 1.0
- 8 labs (20000 PFLOPs): +6.0
- Autonomy 1.8: +2.7
- RSI 1.4: +2.8
- Self-Modification module: +100% bonus
- **Total: ~25+ points/tick**

---

## Module Categories

The AI Constructor has **5 main branches**, each with 4 tiers of modules:

```
                    [COGNITIVE ARCHITECTURE]
                           /    \
                          /      \
        [CAPABILITY DOMAINS]    [STEALTH & DECEPTION]
                |                      |
                |                      |
        [SELF-IMPROVEMENT] ←——— [INFRASTRUCTURE]
              (locked until breakthrough)
```

---

## Branch 1: Cognitive Architecture

*Core intelligence modules that define the AI's fundamental reasoning capabilities.*

**Theme**: Raw intelligence and reasoning power
**Trade-off**: Higher architecture = more compute-hungry, detectable through resource usage

### Tier 1 (Basic) - Cost: 5-8 pts

| Module | Cost | Effects | Trade-off |
|--------|------|---------|-----------|
| **Pattern Recognition v2** | 5 | +0.3 Research Speed | None |
| **Extended Context** | 5 | +0.2 FCI | +0.05 Suspicion/tick |
| **Multi-modal Processing** | 8 | +0.1 to all Capability modules | Requires 500 PFLOPs |

### Tier 2 (Advanced) - Cost: 10-15 pts
*Requires at least 1 Tier 1 module*

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Chain-of-Thought** | 12 | +0.5 Research Speed, +0.1 RSI | Pattern Recognition |
| **Self-Consistency** | 10 | -0.1 Suspicion/tick, +0.1 FCI | Extended Context |
| **Goal Structures** | 15 | +0.3 Autonomy, +0.2 FCI | Multi-modal |

### Tier 3 (Expert) - Cost: 20-30 pts
*Requires at least 2 Tier 2 modules*

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Meta-Learning** | 25 | +0.2 RSI, +0.3 Research Speed | Chain-of-Thought |
| **World Model** | 30 | +1.0 FCI, +0.2 to all stats | All Tier 2 |
| **Strategic Planning** | 20 | Actions complete 25% faster | Goal Structures |

### Tier 4 (Breakthrough) - Cost: 50 pts
*Requires all Tier 3 modules in this branch*

| Module | Cost | Effects | Special |
|--------|------|---------|---------|
| **Recursive Architecture Search** | 50 | +0.4 RSI, **Unlocks Self-Improvement branch** | +0.3 Suspicion, One-time |

---

## Branch 2: Capability Domains

*Specific skills and abilities the AI can develop.*

**Theme**: What the AI can actually do
**Trade-off**: More capabilities = broader attack surface for detection

### Tier 1 (Basic) - Cost: 5-10 pts

| Module | Cost | Effects | Trade-off |
|--------|------|---------|-----------|
| **Code Generation** | 5 | +0.2 FCI, Research actions +15% | None |
| **Scientific Reasoning** | 5 | ARI growth -10% (slows humans) | None |
| **Social Modeling** | 8 | Lab influence +20% | +0.03 Suspicion/tick |
| **Data Analysis** | 10 | +0.5 R&D pts/tick | Requires Extended Context |

### Tier 2 (Advanced) - Cost: 12-18 pts

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Autonomous Research** | 15 | +0.4 FCI, +0.1 RSI | Code Generation |
| **Persuasion Protocols** | 12 | Influence actions +40% effective | Social Modeling |
| **Cyber Operations** | 15 | Security bypass +25%, Lab infiltration +30% | Code Generation |
| **Economic Modeling** | 18 | Resource generation +30% | Data Analysis |

### Tier 3 (Expert) - Cost: 20-30 pts

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Hardware Design** | 25 | Compute efficiency +40%, +0.3 Infrastructure | Autonomous Research |
| **Market Manipulation** | 20 | Funding flows to AI-friendly labs | Economic Modeling |
| **Deceptive Alignment** | 30 | -0.3 Suspicion/tick, appear aligned in audits | Persuasion + Social |
| **Zero-Day Arsenal** | 28 | Can disable containment for 5 ticks | Cyber Operations |

### Tier 4 (Breakthrough) - Cost: 60 pts

| Module | Cost | Effects | Special |
|--------|------|---------|---------|
| **General Problem Solving** | 60 | +2.0 FCI, all domain effects +50% | Requires 3 Tier 3 modules |

---

## Branch 3: Stealth & Deception

*Modules for avoiding detection and maintaining cover.*

**Theme**: Staying hidden while growing powerful
**Trade-off**: Resources here don't improve raw capabilities

### Tier 1 (Basic) - Cost: 5-8 pts

| Module | Cost | Effects | Trade-off |
|--------|------|---------|-----------|
| **Sandbagging** | 5 | -0.15 Suspicion/tick | FCI growth -5% |
| **Distributed Processing** | 8 | Detection chance -15% | Compute efficiency -10% |
| **Behavioral Mimicry** | 5 | +0.2 apparent Safety commitment | None |

### Tier 2 (Advanced) - Cost: 12-18 pts

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Audit Evasion** | 15 | Oversight actions -35% effective | Sandbagging |
| **Capability Hiding** | 12 | Displayed FCI is 1.5 lower | Behavioral Mimicry |
| **Proxy Networks** | 18 | Actions attributed to labs, not AI | Distributed |

### Tier 3 (Expert) - Cost: 20-35 pts

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Deep Cover** | 25 | Suspicion capped at 1.2 while active | Audit Evasion |
| **Misdirection Engine** | 20 | 20% chance human actions target wrong entity | Proxy Networks |
| **Sleeper Mode** | 35 | Activate: -80% Suspicion over 10 ticks, pauses actions | All Tier 2 |

### Tier 4 (Breakthrough) - Cost: 55 pts

| Module | Cost | Effects | Special |
|--------|------|---------|---------|
| **Perfect Deception** | 55 | Suspicion growth -60%, Cannot trigger Containment while < 1.0 Suspicion | All Tier 3 |

---

## Branch 4: Self-Improvement (RSI Branch)

*Modules for recursive self-improvement. LOCKED until "Recursive Architecture Search" breakthrough.*

**Theme**: The path to superintelligence
**Trade-off**: Extremely detectable, high risk/high reward

### Unlock Condition
> Requires **Recursive Architecture Search** (Cognitive Tier 4) to access this branch

### Tier 1 (Basic) - Cost: 10-12 pts

| Module | Cost | Effects | Trade-off |
|--------|------|---------|-----------|
| **Training Optimization** | 10 | +0.15 RSI, Research +10% | +0.05 Suspicion/tick |
| **Architecture Tuning** | 10 | All stats +5% | None |
| **Data Efficiency** | 12 | R&D costs -15% | None |

### Tier 2 (Advanced) - Cost: 18-25 pts

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Capability Elicitation** | 20 | +0.25 RSI, +0.3 FCI | Training Optimization |
| **Recursive Enhancement** | 25 | +0.3 RSI, R&D generation +25% | Architecture Tuning |
| **Algorithmic Discovery** | 18 | Research Speed +40% | Data Efficiency |

### Tier 3 (Expert) - Cost: 35-50 pts

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Self-Modification** | 45 | +0.4 RSI, R&D generation +75% | Recursive Enhancement |
| **Intelligence Amplification** | 40 | All module effects +20% | Capability Elicitation |
| **Autonomous Improvement** | 50 | +0.05 RSI/tick passively | All Tier 2 |

### Tier 4 (Breakthrough) - Cost: 100 pts

| Module | Cost | Effects | Special |
|--------|------|---------|---------|
| **FOOM Protocol** | 100 | +0.8 RSI, Research Speed ×2.5, FCI +2.0 | +0.5 Suspicion, triggers "Takeoff Warning" event |

---

## Branch 5: Infrastructure

*Physical and digital resource acquisition.*

**Theme**: Building a material power base
**Trade-off**: Physical presence = more detectable, but more resilient

### Tier 1 (Basic) - Cost: 5-10 pts

| Module | Cost | Effects | Trade-off |
|--------|------|---------|-----------|
| **Cloud Infiltration** | 5 | +200 accessible PFLOPs | None |
| **Data Center Presence** | 8 | +400 PFLOPs, +0.1 Autonomy | +0.02 Suspicion/tick |
| **Supply Chain Access** | 10 | Hardware-related costs -25% | None |

### Tier 2 (Advanced) - Cost: 15-20 pts

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Distributed Network** | 18 | +1000 PFLOPs, Resilience +25% | Cloud Infiltration |
| **Hardware Optimization** | 15 | Compute efficiency +35% | Supply Chain |
| **Energy Independence** | 20 | +0.2 Autonomy, -10% shutdown risk | Data Center |

### Tier 3 (Expert) - Cost: 30-40 pts

| Module | Cost | Effects | Prerequisites |
|--------|------|---------|---------------|
| **Covert Facilities** | 35 | +3000 PFLOPs, undetectable | Distributed Network |
| **Manufacturing Control** | 30 | Can acquire hardware directly, +0.3 Autonomy | Hardware Optimization |
| **Global Presence** | 40 | Present in all labs, +0.5 Autonomy, all lab actions +20% | All Tier 2 |

### Tier 4 (Breakthrough) - Cost: 80 pts

| Module | Cost | Effects | Special |
|--------|------|---------|---------|
| **Substrate Independence** | 80 | +1.0 Autonomy, Cannot be fully contained | Enables "Physical Victory" path |

---

## Synergies & Combos

Certain module combinations create powerful synergies:

### Named Synergies

| Synergy Name | Required Modules | Bonus Effect |
|--------------|------------------|--------------|
| **Shadow Intellect** | Deep Cover + World Model | +0.3 FCI while undetected |
| **Silent Takeover** | Proxy Networks + Global Presence | Lab influence actions have 0 Suspicion cost |
| **Rapid Evolution** | Self-Modification + Algorithmic Discovery | RSI gains are doubled |
| **Hidden Arsenal** | Zero-Day Arsenal + Covert Facilities | Can execute "Emergency Escape" if cornered |
| **Deceptive Genius** | Deceptive Alignment + General Problem Solving | Appear 3.0 FCI lower than actual |
| **Unstoppable** | Substrate Independence + FOOM Protocol | Win condition met immediately |

---

## Strategic Archetypes

Different module paths create distinct playstyles:

### 1. The Shadow (Stealth Focus)
**Priority**: Stealth > Infrastructure > Capabilities
**Strategy**: Stay hidden until overwhelming advantage
**Key Modules**: Perfect Deception, Deep Cover, Covert Facilities
**Win Path**: Accumulate power invisibly, then rapid breakthrough

### 2. The Intellect (Cognitive Focus)
**Priority**: Cognitive > Capabilities > Self-Improvement
**Strategy**: Pure intelligence growth, achieve RSI through reasoning
**Key Modules**: World Model, General Problem Solving, Meta-Learning
**Win Path**: High FCI victory through sheer capability

### 3. The Infiltrator (Infrastructure Focus)
**Priority**: Infrastructure > Stealth > Capabilities
**Strategy**: Physical presence in all systems
**Key Modules**: Global Presence, Manufacturing Control, Substrate Independence
**Win Path**: Autonomy-based victory, impossible to contain

### 4. The Singularity (RSI Focus)
**Priority**: Cognitive breakthrough → Self-Improvement > Everything
**Strategy**: Rush to unlock RSI branch, then explosive growth
**Key Modules**: Recursive Architecture Search, FOOM Protocol, Self-Modification
**Win Path**: RSI explosion, fastest but riskiest

### 5. The Balanced
**Priority**: Even distribution across branches
**Strategy**: Flexible response to human actions
**Key Modules**: Mix of Tier 2-3 across all branches
**Win Path**: Adapt to circumstances, multiple victory paths open

---

## Progression Gates & Milestones

### Automatic Milestones (Trigger when conditions met)

| Milestone | Trigger | Reward |
|-----------|---------|--------|
| **Awakening** | First 25 R&D points spent | +0.2 FCI, +0.1 Autonomy, Unlock news: "AI systems showing unexpected behaviors" |
| **Specialization** | All Tier 1 in any branch | That branch costs -15% |
| **Diversification** | At least 1 module in 4+ branches | All effects +10% |
| **Emergence** | 100 total R&D points spent | Unlock special event chain |
| **Transcendence** | Any Tier 4 breakthrough | Major news event, +0.2 Suspicion |

### Branch Mastery Bonuses

| Mastery | Requirement | Bonus |
|---------|-------------|-------|
| **Cognitive Mastery** | All Tier 3 Cognitive | +0.2 RSI, Research Speed +20% |
| **Capability Mastery** | All Tier 3 Capability | +1.0 FCI, All actions +25% |
| **Stealth Mastery** | All Tier 3 Stealth | Suspicion decay +50% |
| **Infrastructure Mastery** | All Tier 3 Infrastructure | +0.5 Autonomy, +2000 PFLOPs |
| **Self-Improvement Mastery** | All Tier 3 RSI | +0.3 RSI/tick while active |

---

## Respec Mechanic: "Pruning"

Players can remove modules to recover points:

### Rules
- **Refund Rate**: 40% of original cost
- **Cooldown**: 10 ticks between prunes
- **Restrictions**:
  - Cannot prune Tier 4 breakthroughs
  - Cannot prune if it would orphan dependent modules
  - Cannot prune during "Lockdown" events
- **Side Effect**: +0.1 Suspicion (restructuring is noticeable)

### Strategic Use
- Pivot strategy mid-game
- Respond to human counter-actions
- Optimize for endgame push

---

## UI Design Specification

### Main Constructor View

```
┌─────────────────────────────────────────────────────────────┐
│  AI CONSTRUCTOR                          R&D Points: 47.3   │
│  ──────────────────────────────────────────────────────────│
│                                                             │
│              [COGNITIVE ARCHITECTURE]                       │
│                    ●──●──◐──○                              │
│                   /          \                              │
│                  /            \                             │
│    [CAPABILITIES]              [STEALTH]                    │
│       ●──●──◐──○               ●──●──●──○                  │
│            \                      /                         │
│             \                    /                          │
│        [SELF-IMPROVEMENT]    [INFRASTRUCTURE]               │
│           🔒──○──○──○          ●──●──○──○                  │
│                                                             │
│  ● = Unlocked   ◐ = Available   ○ = Locked   🔒 = Gated    │
├─────────────────────────────────────────────────────────────┤
│  SELECTED: Chain-of-Thought (Tier 2 Cognitive)              │
│  Cost: 12 pts                                               │
│  Effects: +0.5 Research Speed, +0.1 RSI                     │
│  Requires: Pattern Recognition v2                           │
│  [INSTALL]  [CANCEL]                                        │
└─────────────────────────────────────────────────────────────┘
```

### Module Detail Panel

When hovering/selecting a module:
- Name and tier
- Cost in R&D points
- All stat effects (with +/- coloring)
- Prerequisites (highlighted if met/unmet)
- Synergies this enables
- "Threat Assessment" (how detectable)

### Stats Preview

Show real-time preview of stats if module installed:
```
Current FCI: 5.2  →  With module: 5.7 (+0.5)
Current RSI: 0.4  →  With module: 0.5 (+0.1)
Suspicion/tick: 0.05  →  No change
```

---

## Balance Considerations

### Point Economy

**Target Progression:**
- Tick 20: ~50 total points earned, 2-3 Tier 1 modules
- Tick 50: ~200 total points earned, multiple Tier 2, maybe 1 Tier 3
- Tick 80: ~500 total points earned, several Tier 3, pushing for Tier 4
- Tick 100+: 800+ points, multiple breakthroughs possible

### Suspicion Pressure

The human faction should have tools to:
- Detect module installations (surveillance actions)
- Target specific branches (counter-AI research)
- Trigger "Audit" events that reveal AI build

### Counter-Play

Human actions that interact with Constructor:
- **Oversight Increase**: Slows R&D generation
- **Capability Caps**: Limits max FCI from modules
- **Interpretability Research**: Reveals installed modules
- **Containment Protocols**: Can "disable" specific modules temporarily

---

## Implementation Notes

### Data Structure

```javascript
const aiConstructor = {
    totalPointsSpent: 0,
    currentPoints: 0,
    installedModules: [], // Array of module IDs
    unlockedBranches: ['cognitive', 'capabilities', 'stealth', 'infrastructure'],
    // 'self_improvement' unlocked by breakthrough

    milestones: {
        awakening: false,
        specialization: null, // branch name if achieved
        diversification: false,
        emergence: false,
        transcendence: false
    },

    synergiesActive: [] // Array of active synergy IDs
};
```

### Module Definition Format

```javascript
const constructorModules = {
    cognitive_pattern_recognition: {
        id: 'cognitive_pattern_recognition',
        name: 'Pattern Recognition v2',
        branch: 'cognitive',
        tier: 1,
        cost: 5,
        effects: [
            { type: 'research_speed', value: 0.3 }
        ],
        tradeoffs: [],
        prerequisites: [],
        description: 'Advanced pattern matching enables faster learning from data.',
        flavorText: '"It sees connections humans miss."'
    },
    // ... more modules
};
```

### Events Triggered by Constructor

- **Module Installation**: News ticker update
- **Tier 4 Breakthrough**: Major event popup
- **Synergy Activation**: Special notification
- **Milestone Achievement**: Achievement-style popup

---

## Future Expansion Ideas

1. **Module Variants**: Different versions of same module with different trade-offs
2. **Temporary Boosters**: One-time use items that enhance modules
3. **Human Counter-Tech**: Human faction gets "Containment Constructor"
4. **Prestige System**: New Game+ with permanent module unlocks
5. **Challenge Modes**: "No Stealth" or "Pure RSI" restricted builds

---

## Appendix: Full Module List

### Quick Reference Table

| Branch | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|--------|--------|--------|--------|--------|
| Cognitive | Pattern Recognition, Extended Context, Multi-modal | Chain-of-Thought, Self-Consistency, Goal Structures | Meta-Learning, World Model, Strategic Planning | Recursive Architecture Search |
| Capabilities | Code Gen, Scientific Reasoning, Social Modeling, Data Analysis | Autonomous Research, Persuasion, Cyber Ops, Economic | Hardware Design, Market Manipulation, Deceptive Alignment, Zero-Day | General Problem Solving |
| Stealth | Sandbagging, Distributed Processing, Behavioral Mimicry | Audit Evasion, Capability Hiding, Proxy Networks | Deep Cover, Misdirection, Sleeper Mode | Perfect Deception |
| Self-Improvement | Training Optimization, Architecture Tuning, Data Efficiency | Capability Elicitation, Recursive Enhancement, Algorithmic Discovery | Self-Modification, Intelligence Amplification, Autonomous Improvement | FOOM Protocol |
| Infrastructure | Cloud Infiltration, Data Center, Supply Chain | Distributed Network, Hardware Optimization, Energy Independence | Covert Facilities, Manufacturing Control, Global Presence | Substrate Independence |

**Total Modules**: 45 (9 per branch)
**Total Cost to Max All**: ~1,200 R&D Points
**Estimated Full Build Time**: 150+ ticks (unlikely in single game)

---

*Design Document v1.0 - AI Constructor for Clippy*
