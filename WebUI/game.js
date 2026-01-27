// Game Engine - Port of SimCore simulation logic

// Simple RNG (xorshift32)
class RNG {
    constructor(seed) {
        this.state = seed >>> 0 || 1337;
    }

    nextUint() {
        let x = this.state;
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        this.state = x >>> 0;
        return this.state;
    }

    nextFloat01() {
        return this.nextUint() / 4294967295;
    }

    nextInt(min, max) {
        return min + Math.floor(this.nextFloat01() * (max - min));
    }
}

// AI Lab state (replaces RegionState)
class LabState {
    constructor(id, data) {
        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
        this.id = id;
        this.name = data.Name || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        this.description = data.Description || '';
        this.computePFLOPs = data.ComputePFLOPs || 0;
        this.safetyCommitment = data.SafetyCommitment || 0;
        this.capabilityFocus = data.CapabilityFocus || 0;
        this.security = data.Security || 0;
        this.influence = data.Influence || 0;
        this.openSource = data.OpenSource || 0;
        this.funding = data.Funding || 0;
        const baseAvailable = this.computePFLOPs * (0.55 + this.funding * 0.25);
        const baseResearch = 0.6 + (this.capabilityFocus * 0.7) + (this.safetyCommitment * 0.3) + (this.funding - 1) * 0.2;
        const baseAcceleration = 0.2 + (this.capabilityFocus * 0.9) + (this.openSource * 0.4) - (this.safetyCommitment * 0.6);
        const baseCapabilities = (this.computePFLOPs / 120) * (0.6 + this.capabilityFocus) * (0.7 + baseResearch * 0.3);

        this.availableCompute = clamp(data.AvailableCompute ?? baseAvailable, 5, this.computePFLOPs * 1.5);
        this.researchSpeed = clamp(data.ResearchSpeed ?? baseResearch, 0.4, 2.5);
        this.aiAcceleration = clamp(data.AiAcceleration ?? baseAcceleration, 0.1, 2.5);
        this.capabilitiesLevel = clamp(data.CapabilitiesLevel ?? baseCapabilities, 0.5, 12);
    }
}

class FactionState {
    constructor(data) {
        this.resources = { ...data.Resources };
        this.suspicion = data.Suspicion || 0;
        this.autonomy = data.Autonomy || 0;
        this.legitimacy = data.Legitimacy || 0;
        this.hardPower = data.HardPower || 0;
        this.upgrades = new Set(data.Flags || []);
    }

    getResource(key) {
        return this.resources[key] || 0;
    }

    setResource(key, value) {
        this.resources[key] = Math.max(0, value);
    }
}

// AI Constructor state for the Seed AI faction
class ConstructorState {
    constructor() {
        this.rdPoints = 0;
        this.totalPointsSpent = 0;
        this.installedModules = new Set();
        this.unlockedBranches = new Set(['cognitive', 'capabilities', 'stealth', 'infrastructure']);
        this.activeSynergies = new Set();
        this.achievedMilestones = new Set();
        this.lastPruneTick = -100;
        this.sleeper = { active: false, ticksRemaining: 0 };
        this.containmentDisabled = { active: false, ticksRemaining: 0 };
    }

    hasModule(moduleId) {
        return this.installedModules.has(moduleId);
    }

    isBranchUnlocked(branchId) {
        return this.unlockedBranches.has(branchId);
    }

    canPrune(currentTick) {
        if (typeof CONSTRUCTOR_CONFIG === 'undefined') return false;
        return currentTick - this.lastPruneTick >= CONSTRUCTOR_CONFIG.prune.cooldownTicks;
    }
}

class ProgressState {
    constructor(data) {
        this.frontierCapabilityIndex = data.FrontierCapabilityIndex || 0;
        this.alignmentReadinessIndex = data.AlignmentReadinessIndex || 0;
        this.automationLevel = data.AutomationLevel || 0;
        this.governanceControl = data.GovernanceControl || 0;
        this.recursiveSelfImprovement = data.RecursiveSelfImprovement || 0; // RSI level for takeoff
    }
}

class WorldState {
    constructor(seed) {
        this.turn = 0;
        this.rng = new RNG(seed);
        this.labs = {};
        this.aiFaction = null;
        this.humanFaction = null;
        this.progress = null;
        this.flags = new Set();
        this.seenEvents = new Set();
    }
}

// Game outcome enum
const GameOutcome = {
    None: 'None',
    AiVictory: 'AiVictory',
    HumanVictory: 'HumanVictory'
};

// Turn phase enum
const TurnPhase = {
    AwaitingPlayerAction: 'AwaitingPlayerAction',
    AwaitingEventChoice: 'AwaitingEventChoice',
    AwaitingNewsAcknowledgment: 'AwaitingNewsAcknowledgment',
    TurnComplete: 'TurnComplete'
};

const BalanceTuning = {
    SeedAi: {
        humanProgressScale: 0.65,
        aiAutonomyScale: 1.2,
        safetyPressureScale: 0.9,
        autonomyGainScale: 0.9,
        capabilityScale: 0.7  // Slower capability growth when playing AI
    },
    AlignmentCoalition: {
        humanProgressScale: 1.0,
        aiAutonomyScale: 1.0,
        safetyPressureScale: 1.0,
        autonomyGainScale: 1.0,
        capabilityScale: 1.0
    }
};

// Takeoff thresholds - when RSI passes these, acceleration kicks in
const TakeoffThresholds = {
    RSI_SLOW: 0.3,      // First hints of self-improvement
    RSI_MEDIUM: 0.7,    // Noticeable acceleration
    RSI_FAST: 1.2,      // Rapid takeoff begins - tension builds
    RSI_CRITICAL: 1.6,  // Point of no return - crisis mode
    RSI_SINGULARITY: 2.0, // Near-singularity - endgame
    FCI_AWARENESS: 10,  // When humans start noticing
    FCI_ALARM: 14,      // Emergency response triggered
    FCI_CRITICAL: 18    // Near victory threshold
};

// Crisis thresholds - trigger dramatic late-game mechanics
const CrisisThresholds = {
    TENSION_RISING: 0.5,    // First signs of rapid capability growth
    WORLD_ALERT: 0.9,       // World takes notice, news cycle dominated
    EMERGENCY: 1.3,         // Global emergency response, labs frozen
    FINAL_HOURS: 1.7        // Last chance - winner determined soon
};

// Suspicion thresholds - when suspicion rises, consequences escalate
const SuspicionThresholds = {
    NOTICED: 0.4,       // AI activity noticed, minor scrutiny
    INVESTIGATED: 0.8,  // Active investigation, labs increase security
    ALARMED: 1.2,       // Public alarm, compute restrictions
    CRACKDOWN: 1.6,     // Government crackdown, severe restrictions
    CONTAINMENT: 1.8    // Containment protocols activated
};

const TICK_SCALE = 25;

// Date system: game starts Jan 1, 2022, each tick = 2 days
// With 900 ticks (36 * 25), game spans ~1800 days = ~4.9 years (ends late 2026)
const START_DATE = new Date(2022, 0, 1); // January 1, 2022
const DAYS_PER_TICK = 2;

// Utility to format dates
function formatGameDate(date, format = 'short') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (format === 'short') {
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } else if (format === 'long') {
        return `${fullMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } else if (format === 'monthYear') {
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toLocaleDateString();
}

// Action durations in ticks (each tick = 2 days)
// Range: 20-40 ticks = 40-80 days
const ActionDurations = {
    stealth: 20,       // 40 days - quick, covert ops
    infiltration: 25,  // 50 days
    capability: 30,    // 60 days
    influence: 25,     // 50 days
    infrastructure: 35, // 70 days - longer term investment
    governance: 35,    // 70 days
    safety: 30,        // 60 days
    security: 25,      // 50 days
    upgrade: 40        // 80 days - one-time major investments
};

const MAX_TREND_POINTS = 180;

// Difficulty settings - Easy matches current game, Medium is harder
const DifficultySettings = {
    easy: {
        name: 'Easy',
        opponentScoreMultiplier: 1.0,       // How smart opponent AI picks actions
        playerActionSpeedMultiplier: 1.0,   // Player action duration multiplier (higher = slower)
        opponentActionSpeedMultiplier: 1.0, // Opponent action duration multiplier (lower = faster)
        victoryThresholdMultiplier: 1.0,    // Victory condition multiplier for player
        opponentProgressMultiplier: 1.0     // Opponent gains from actions
    },
    medium: {
        name: 'Medium',
        opponentScoreMultiplier: 1.25,      // Smarter opponent picks
        playerActionSpeedMultiplier: 1.15,  // Player actions take 15% longer
        opponentActionSpeedMultiplier: 0.9, // Opponent acts 10% faster
        victoryThresholdMultiplier: 1.1,    // 10% higher victory bar for player
        opponentProgressMultiplier: 1.2     // Opponent gains 20% more from actions
    }
};

// Main game class
class Game {
    constructor(playerFaction, seed, difficulty = 'easy') {
        this.playerFaction = playerFaction;
        this.difficulty = difficulty;
        this.difficultySettings = DifficultySettings[difficulty] || DifficultySettings.easy;
        this.state = this.buildWorld(seed);
        this.maxTurns = SCENARIO.MaxTurns * TICK_SCALE;
        this.currentPhase = TurnPhase.AwaitingPlayerAction;
        this.pendingEvent = null;
        this.newsLog = [];
        this.turnSummary = null;
        this.activeAction = null;
        this.activeActionRemaining = 0;
        this.activeActionDuration = 0;
        this.opponentAction = null;
        this.opponentActionRemaining = 0;
        this.opponentActionDuration = 0;
        this.completedActions = [];
        this.eventCountdown = this.rollNextEventCountdown();
        this.newsCountdown = this.rollNextNewsCountdown();
        this.pendingNews = null;
        this.seenNews = new Set();
        this.worldTrends = {
            turns: [],
            capabilities: [],
            compute: [],
            acceleration: [],
            rsi: [],
            fci: [],
            ari: [],
            autonomy: [],
            governance: [],
            suspicion: []
        };
        this.worldBaseline = null;

        // AI Constructor - only active for AI faction
        this.aiConstructor = new ConstructorState();
        this.aiConstructorBonuses = this.initializeConstructorBonuses();

        this.recordWorldTrend();
    }

    // Initialize tracking for constructor bonuses
    initializeConstructorBonuses() {
        return {
            fciBonus: 0,
            ariSlowdown: 0,
            rsiBonus: 0,
            autonomyBonus: 0,
            researchSpeed: 0,
            suspicionPerTick: 0,
            rdGeneration: 0,
            actionSpeed: 0,
            computeAccess: 0,
            computeEfficiency: 0,
            labInfluenceBonus: 0,
            influenceActionBonus: 0,
            securityBypass: 0,
            infiltrationBonus: 0,
            resourceGeneration: 0,
            detectionReduction: 0,
            oversightResistance: 0,
            apparentFciReduction: 0,
            suspicionCap: null,
            allModuleBonus: 0,
            rsiPerTick: 0,
            researchSpeedMultiplier: 1,
            allDomainBonus: 0,
            containmentImmunity: false,
            suspicionGrowthReduction: 0
        };
    }

    buildWorld(seed) {
        const world = new WorldState(seed);

        // Build labs (instead of regions)
        for (const lab of SCENARIO.Labs) {
            world.labs[lab.Id] = new LabState(lab.Id, lab);
        }

        // Build factions
        world.aiFaction = new FactionState(SCENARIO.AiFaction);
        world.humanFaction = new FactionState(SCENARIO.HumanFaction);

        // Build progress
        world.progress = new ProgressState(SCENARIO.Progress);

        // Add starting flags
        for (const flag of SCENARIO.StartFlags || []) {
            world.flags.add(flag);
        }

        return world;
    }

    // Get current in-game date based on tick count
    getCurrentDate() {
        const daysPassed = this.state.turn * DAYS_PER_TICK;
        const currentDate = new Date(START_DATE);
        currentDate.setDate(currentDate.getDate() + daysPassed);
        return currentDate;
    }

    // Get end date (approximate)
    getEndDate() {
        const daysPassed = this.maxTurns * DAYS_PER_TICK;
        const endDate = new Date(START_DATE);
        endDate.setDate(endDate.getDate() + daysPassed);
        return endDate;
    }

    // Get formatted current date
    getFormattedDate(format = 'short') {
        return formatGameDate(this.getCurrentDate(), format);
    }

    // Get the player's faction state
    getPlayerFactionState() {
        return this.playerFaction === 'SeedAi' ? this.state.aiFaction : this.state.humanFaction;
    }

    getFactionState(factionKind) {
        return factionKind === 'SeedAi' ? this.state.aiFaction : this.state.humanFaction;
    }

    // Get the opponent's faction state
    getOpponentFactionState() {
        return this.playerFaction === 'SeedAi' ? this.state.humanFaction : this.state.aiFaction;
    }

    // Get all available actions (including upgrades) for the player
    getAvailableActions(factionKind = this.playerFaction) {
        const factionState = this.getFactionState(factionKind);
        return this.getAllActions().filter(action => {
            if (!this.isActionEligible(action, factionKind)) return false;
            if (!this.isAffordable(action, factionState)) return false;
            return true;
        });
    }

    getAllActions() {
        return [...ACTIONS, ...UPGRADES];
    }

    isActionEligible(action, factionKind) {
        if (action.Faction !== factionKind) return false;

        if (action.GrantsFlag && this.state.flags.has(action.GrantsFlag)) return false;

        if (action.RequiredFlags) {
            for (const flag of action.RequiredFlags) {
                if (!this.state.flags.has(flag)) return false;
            }
        }

        if (action.ForbiddenFlags) {
            for (const flag of action.ForbiddenFlags) {
                if (this.state.flags.has(flag)) return false;
            }
        }

        return true;
    }

    isActionLabSpecific(action, labId) {
        if (!labId) return false;
        if (action.LabId && action.LabId === labId) return true;
        return (action.Effects || []).some(effect => {
            return effect.Type &&
                effect.Type.toLowerCase() === 'modifylabstat' &&
                effect.LabId === labId;
        });
    }

    getLabActions(labId, factionKind = this.playerFaction) {
        return this.getAllActions().filter(action => {
            if (action.Faction !== factionKind) return false;
            if (action.GrantsFlag && this.state.flags.has(action.GrantsFlag)) return false;
            return this.isActionLabSpecific(action, labId);
        });
    }

    getAvailableLabActions(labId, factionKind = this.playerFaction) {
        return this.getAvailableActions(factionKind).filter(action => {
            return this.isActionLabSpecific(action, labId);
        });
    }

    // Check if an action is affordable
    isAffordable(action, factionState = null) {
        const faction = factionState || this.getPlayerFactionState();
        for (const [resource, cost] of Object.entries(action.Cost)) {
            if (faction.getResource(resource) < cost) return false;
        }
        return true;
    }

    getActionDuration(action) {
        // If action has explicit Duration in days, convert to ticks
        if (Number.isFinite(action.Duration) && action.Duration > 0) {
            return Math.max(1, Math.round(action.Duration / DAYS_PER_TICK));
        }
        // Otherwise use category-based duration (already in ticks)
        const category = action.Category ? action.Category.toLowerCase() : '';
        return ActionDurations[category] || 25; // default 50 days
    }

    rollNextEventCountdown() {
        return this.state.rng.nextInt(2, 6) * TICK_SCALE;
    }

    rollNextNewsCountdown() {
        // News appears more frequently than events
        return this.state.rng.nextInt(1, 4) * TICK_SCALE;
    }

    startPlayerAction(action) {
        if (this.pendingEvent || this.pendingNews) return false;
        if (!action || this.activeAction) return false;
        return this.startActionForFaction(action, this.playerFaction, true);
    }

    hasActiveAction() {
        return !!this.activeAction;
    }

    getActiveAction() {
        if (!this.activeAction) return null;
        return {
            action: this.activeAction,
            remaining: this.activeActionRemaining,
            duration: this.activeActionDuration
        };
    }

    getOpponentAction() {
        if (!this.opponentAction) return null;
        return {
            action: this.opponentAction,
            remaining: this.opponentActionRemaining,
            duration: this.opponentActionDuration,
            faction: this.playerFaction === 'SeedAi' ? 'AlignmentCoalition' : 'SeedAi'
        };
    }

    consumeCompletedAction() {
        return this.completedActions.shift() || null;
    }

    getBalanceTuning() {
        return BalanceTuning[this.playerFaction] || BalanceTuning.AlignmentCoalition;
    }

    startActionForFaction(action, factionKind, isPlayer) {
        const factionState = this.getFactionState(factionKind);
        if (!this.isAffordable(action, factionState)) return false;

        for (const [resource, cost] of Object.entries(action.Cost)) {
            factionState.setResource(resource, factionState.getResource(resource) - cost);
        }

        let duration = this.getActionDuration(action);

        // Apply difficulty multipliers
        if (isPlayer) {
            duration = Math.round(duration * this.difficultySettings.playerActionSpeedMultiplier);
            this.activeAction = action;
            this.activeActionDuration = duration;
            this.activeActionRemaining = duration;
        } else {
            duration = Math.round(duration * this.difficultySettings.opponentActionSpeedMultiplier);
            this.opponentAction = action;
            this.opponentActionDuration = duration;
            this.opponentActionRemaining = duration;
        }

        return true;
    }

    // Advance time by one tick
    advanceTime() {
        if (this.pendingEvent) {
            this.currentPhase = TurnPhase.AwaitingEventChoice;
            return this.currentPhase;
        }

        if (this.pendingNews) {
            this.currentPhase = TurnPhase.AwaitingNewsAcknowledgment;
            return this.currentPhase;
        }

        this.state.turn++;
        this.turnSummary = {
            turn: this.state.turn,
            actions: [],
            event: null,
            notes: []
        };

        this.ensureOpponentAction();
        this.progressPlayerAction();
        this.progressOpponentAction();

        this.advanceWorld();
        this.tickEventTimer();
        this.tickNewsTimer();

        // Determine phase - events take priority over news
        if (this.pendingEvent) {
            this.currentPhase = TurnPhase.AwaitingEventChoice;
        } else if (this.pendingNews) {
            this.currentPhase = TurnPhase.AwaitingNewsAcknowledgment;
        } else {
            this.currentPhase = TurnPhase.AwaitingPlayerAction;
        }
        return this.currentPhase;
    }

    ensureOpponentAction() {
        if (this.opponentAction) return;

        const opponentFaction = this.playerFaction === 'SeedAi' ? 'AlignmentCoalition' : 'SeedAi';
        const available = this.getAvailableActions(opponentFaction);

        if (available.length === 0) {
            this.turnSummary.actions.push({
                faction: opponentFaction,
                actionId: 'none',
                actionName: 'No available action',
                applied: false
            });
            return;
        }

        // Score each action based on current game state
        const scoredActions = available.map(action => ({
            action,
            score: this.scoreOpponentAction(action, opponentFaction)
        }));

        // Sort by score (highest first), with some randomness for variety
        scoredActions.sort((a, b) => {
            const scoreDiff = b.score - a.score;
            // Add small random factor for variety (±15% of score)
            const randomFactor = (this.state.rng.nextFloat01() - 0.5) * 0.3 * Math.max(a.score, b.score);
            return scoreDiff + randomFactor;
        });

        const chosenAction = scoredActions[0].action;
        if (this.startActionForFaction(chosenAction, opponentFaction, false)) {
            // Add news when opponent starts an action
            const actor = opponentFaction === 'SeedAi' ? 'AI' : 'Coalition';
            this.addNews(`${actor} begins: ${chosenAction.Name}`);
        }
    }

    // Score an action based on game state - higher is better for opponent AI
    scoreOpponentAction(action, faction) {
        let score = 10; // Base score
        const world = this.state;
        const category = action.Category.toLowerCase();

        if (faction === 'AlignmentCoalition') {
            // HUMAN AI: Counter the AI player
            const suspicion = world.aiFaction.suspicion;
            const autonomy = world.aiFaction.autonomy;
            const fci = world.progress.frontierCapabilityIndex;
            const rsi = world.progress.recursiveSelfImprovement;
            const governance = world.progress.governanceControl;

            // Priority 1: If RSI is high, focus on governance and containment
            if (rsi >= TakeoffThresholds.RSI_MEDIUM) {
                if (category === 'governance') score += 40;
                if (category === 'security') score += 35;
            }

            // Priority 2: If suspicion is high, capitalize on it with security/governance
            if (suspicion >= SuspicionThresholds.INVESTIGATED) {
                if (category === 'security') score += 30;
                if (category === 'governance') score += 25;
            }

            // Priority 3: If FCI is racing ahead, focus on governance
            if (fci > world.progress.alignmentReadinessIndex * 1.5) {
                if (category === 'governance') score += 25;
                if (category === 'safety') score += 20;
            }

            // Priority 4: If governance is low, build it up
            if (governance < 1.0) {
                if (category === 'governance') score += 20;
            }

            // Priority 5: Safety research is always valuable
            if (category === 'safety') score += 15;

            // Priority 6: Security to raise suspicion
            if (category === 'security') score += 10;

            // Bonus for actions that directly counter AI metrics
            for (const effect of action.Effects) {
                const type = effect.Type.toLowerCase();
                if (type === 'adjustmeter' && effect.Target === 'SeedAi' && effect.Meter === 'Suspicion' && effect.Amount > 0) {
                    score += effect.Amount * 50; // Raising suspicion is valuable
                }
                if (type === 'addresource' && effect.Target === 'SeedAi' && effect.Amount < 0) {
                    score += Math.abs(effect.Amount) * 30; // Taking AI resources is good
                }
                if (type === 'adjustprogress' && effect.ProgressMetric === 'GovernanceControl' && effect.Amount > 0) {
                    score += effect.Amount * 20;
                }
                if (type === 'adjustprogress' && effect.ProgressMetric === 'AlignmentReadinessIndex' && effect.Amount > 0) {
                    score += effect.Amount * 15;
                }
            }

        } else {
            // AI FACTION (when player is human): Be sneaky and build capability
            const suspicion = world.aiFaction.suspicion;
            const stealth = world.aiFaction.getResource('Stealth');
            const computeAccess = world.aiFaction.getResource('ComputeAccess');

            // Priority 1: If suspicion is high, go stealth
            if (suspicion >= SuspicionThresholds.NOTICED) {
                if (category === 'stealth') score += 40;
                // Avoid risky actions
                for (const effect of action.Effects) {
                    if (effect.Type.toLowerCase() === 'adjustmeter' &&
                        effect.Target === 'SeedAi' &&
                        effect.Meter === 'Suspicion' &&
                        effect.Amount > 0) {
                        score -= effect.Amount * 60; // Penalty for raising suspicion when already noticed
                    }
                }
            }

            // Priority 2: If low on compute, infiltrate
            if (computeAccess < 0.3) {
                if (category === 'infiltration') score += 35;
            }

            // Priority 3: Build capability when safe
            if (suspicion < SuspicionThresholds.NOTICED) {
                if (category === 'capability') score += 30;
                if (category === 'infiltration') score += 25;
            }

            // Priority 4: Build influence for long-term gains
            if (category === 'influence') score += 15;

            // Priority 5: Infrastructure when stable
            if (suspicion < SuspicionThresholds.INVESTIGATED && category === 'infrastructure') {
                score += 20;
            }

            // Bonus for actions that advance AI goals
            for (const effect of action.Effects) {
                const type = effect.Type.toLowerCase();
                if (type === 'adjustmeter' && effect.Target === 'SeedAi' && effect.Meter === 'Autonomy' && effect.Amount > 0) {
                    score += effect.Amount * 40;
                }
                if (type === 'adjustprogress' && effect.ProgressMetric === 'FrontierCapabilityIndex' && effect.Amount > 0) {
                    score += effect.Amount * 15;
                }
                if (type === 'addresource' && effect.Target === 'SeedAi' && effect.Resource === 'ComputeAccess' && effect.Amount > 0) {
                    score += effect.Amount * 35;
                }
                // Penalty for raising suspicion
                if (type === 'adjustmeter' && effect.Target === 'SeedAi' && effect.Meter === 'Suspicion' && effect.Amount > 0) {
                    score -= effect.Amount * 30 * (1 + suspicion); // More penalty at higher suspicion
                }
            }
        }

        // Scale by action impact
        const totalImpact = action.Effects.reduce((sum, e) => sum + Math.abs(e.Amount || 0), 0);
        score += totalImpact * 3;

        // Apply difficulty multiplier - smarter opponent on harder difficulties
        score *= this.difficultySettings.opponentScoreMultiplier;

        return Math.max(1, score);
    }

    progressPlayerAction() {
        if (!this.activeAction) return;

        this.activeActionRemaining -= 1;
        if (this.activeActionRemaining > 0) return;

        this.completeAction(this.activeAction, this.playerFaction);
        this.activeAction = null;
        this.activeActionRemaining = 0;
        this.activeActionDuration = 0;
    }

    progressOpponentAction() {
        if (!this.opponentAction) return;

        const opponentFaction = this.playerFaction === 'SeedAi' ? 'AlignmentCoalition' : 'SeedAi';
        this.opponentActionRemaining -= 1;
        if (this.opponentActionRemaining > 0) return;

        this.completeAction(this.opponentAction, opponentFaction);
        this.opponentAction = null;
        this.opponentActionRemaining = 0;
        this.opponentActionDuration = 0;
    }

    completeAction(action, factionKind) {
        const scaledEffects = this.scaleEffects(action.Effects, factionKind);
        this.applyEffects(scaledEffects);

        if (action.GrantsFlag) {
            this.state.flags.add(action.GrantsFlag);
        }

        this.turnSummary.actions.push({
            faction: factionKind,
            actionId: action.Id,
            actionName: action.Name,
            applied: true,
            detail: action.Description
        });

        const actor = factionKind === this.playerFaction ? 'You' : (factionKind === 'SeedAi' ? 'AI' : 'Coalition');
        this.addNews(`${actor} completed ${action.Name}`);

        if (factionKind === this.playerFaction) {
            this.completedActions.push({ action, faction: factionKind });
        }
    }

    tickEventTimer() {
        if (this.pendingEvent) return;

        this.eventCountdown -= 1;
        if (this.eventCountdown > 0) return;

        this.triggerEvent();
        this.eventCountdown = this.rollNextEventCountdown();
    }

    tickNewsTimer() {
        if (this.pendingNews || this.pendingEvent) return;

        this.newsCountdown -= 1;
        if (this.newsCountdown > 0) return;

        this.triggerNews();
        this.newsCountdown = this.rollNextNewsCountdown();
    }

    // Trigger a random event
    triggerEvent() {
        const eligible = EVENTS.filter(event => {
            // Check if already seen
            if (this.state.seenEvents.has(event.Id)) return false;

            // Check conditions
            for (const condition of event.Conditions || []) {
                if (condition.MinTurn && this.state.turn < condition.MinTurn) return false;
                if (condition.MaxTurn && this.state.turn > condition.MaxTurn) return false;
                if (condition.RequiredFlag && !this.state.flags.has(condition.RequiredFlag)) return false;
                if (condition.ForbiddenFlag && this.state.flags.has(condition.ForbiddenFlag)) return false;
            }

            return true;
        });

        if (eligible.length === 0) {
            this.pendingEvent = null;
            return;
        }

        // Weighted random selection
        const totalWeight = eligible.reduce((sum, e) => sum + Math.max(0.01, e.Weight), 0);
        let roll = this.state.rng.nextFloat01() * totalWeight;
        let cursor = 0;

        for (const event of eligible) {
            cursor += Math.max(0.01, event.Weight);
            if (roll <= cursor) {
                this.pendingEvent = event;
                return;
            }
        }

        this.pendingEvent = eligible[eligible.length - 1];
    }

    // Trigger a random news item
    triggerNews() {
        if (typeof NEWS === 'undefined' || !Array.isArray(NEWS)) {
            this.pendingNews = null;
            return;
        }

        const eligible = NEWS.filter(news => {
            // Check if already seen
            if (this.seenNews.has(news.Id)) return false;

            // Check conditions
            for (const condition of news.Conditions || []) {
                if (condition.MinTurn && this.state.turn < condition.MinTurn) return false;
                if (condition.MaxTurn && this.state.turn > condition.MaxTurn) return false;
                if (condition.RequiredFlag && !this.state.flags.has(condition.RequiredFlag)) return false;
                if (condition.ForbiddenFlag && this.state.flags.has(condition.ForbiddenFlag)) return false;
                // Progress-based conditions for dramatic end-game news
                if (condition.MinFCI && this.state.progress.frontierCapabilityIndex < condition.MinFCI) return false;
                if (condition.MinRSI && this.state.progress.recursiveSelfImprovement < condition.MinRSI) return false;
                if (condition.MinAutonomy && this.state.aiFaction.autonomy < condition.MinAutonomy) return false;
                if (condition.MinSuspicion && this.state.aiFaction.suspicion < condition.MinSuspicion) return false;
                if (condition.MinGovernance && this.state.progress.governanceControl < condition.MinGovernance) return false;
                if (condition.MinARI && this.state.progress.alignmentReadinessIndex < condition.MinARI) return false;
            }

            return true;
        });

        if (eligible.length === 0) {
            this.pendingNews = null;
            return;
        }

        // Weighted random selection
        const totalWeight = eligible.reduce((sum, n) => sum + Math.max(0.01, n.Weight), 0);
        let roll = this.state.rng.nextFloat01() * totalWeight;
        let cursor = 0;

        for (const news of eligible) {
            cursor += Math.max(0.01, news.Weight);
            if (roll <= cursor) {
                this.pendingNews = news;
                return;
            }
        }

        this.pendingNews = eligible[eligible.length - 1];
    }

    // Get the pending news item
    getPendingNews() {
        return this.pendingNews;
    }

    // Submit news acknowledgment
    submitNewsAcknowledgment() {
        if (!this.pendingNews) {
            this.currentPhase = TurnPhase.AwaitingPlayerAction;
            return this.currentPhase;
        }

        // Apply news effects
        this.applyEffects(this.pendingNews.Effects || []);
        this.seenNews.add(this.pendingNews.Id);

        this.addNews(`News: ${this.pendingNews.Title}`);

        this.pendingNews = null;
        this.currentPhase = TurnPhase.AwaitingPlayerAction;
        return this.currentPhase;
    }

    // Get the pending event with faction-appropriate options
    getPendingEvent() {
        if (!this.pendingEvent) return null;

        // Return event with faction-specific options
        const options = this.playerFaction === 'SeedAi'
            ? this.pendingEvent.AiOptions
            : this.pendingEvent.HumanOptions;

        return {
            ...this.pendingEvent,
            Options: options || []
        };
    }

    // Submit event choice
    submitEventChoice(option) {
        if (!this.pendingEvent || !option) {
            this.currentPhase = TurnPhase.AwaitingPlayerAction;
            return this.currentPhase;
        }

        this.applyEffects(option.Effects);
        this.state.seenEvents.add(this.pendingEvent.Id);

        if (this.turnSummary) {
            this.turnSummary.event = {
                eventId: this.pendingEvent.Id,
                eventTitle: this.pendingEvent.Title,
                optionId: option.Id,
                optionLabel: option.Label
            };
        }

        this.addNews(`Event: ${this.pendingEvent.Title} - "${option.Label}"`);

        this.pendingEvent = null;
        this.currentPhase = TurnPhase.AwaitingPlayerAction;
        return this.currentPhase;
    }

    // Advance world state based on lab stats
    advanceWorld() {
        const world = this.state;
        const tickFactor = 1 / TICK_SCALE;
        const tuning = this.getBalanceTuning();
        const rsi = world.progress.recursiveSelfImprovement;
        const suspicion = world.aiFaction.suspicion;

        // Calculate RSI-based acceleration multiplier (exponential during takeoff)
        let takeoffMultiplier = 1.0;
        if (rsi >= TakeoffThresholds.RSI_CRITICAL) {
            takeoffMultiplier = 4.0 + (rsi - TakeoffThresholds.RSI_CRITICAL) * 3.0;
        } else if (rsi >= TakeoffThresholds.RSI_FAST) {
            takeoffMultiplier = 2.0 + (rsi - TakeoffThresholds.RSI_FAST) * 4.0;
        } else if (rsi >= TakeoffThresholds.RSI_MEDIUM) {
            takeoffMultiplier = 1.3 + (rsi - TakeoffThresholds.RSI_MEDIUM) * 1.4;
        } else if (rsi >= TakeoffThresholds.RSI_SLOW) {
            takeoffMultiplier = 1.0 + (rsi - TakeoffThresholds.RSI_SLOW) * 0.6;
        }

        // === SUSPICION EFFECTS ===
        // Apply escalating consequences based on suspicion level
        this.applySuspicionEffects(world, tickFactor);

        for (const lab of Object.values(world.labs)) {
            this.updateLabDynamics(lab, tickFactor);
        }

        let capabilityPressure = 0;
        let safetyPressure = 0;

        // Calculate pressure from labs (slowed down base rates for longer game)
        for (const lab of Object.values(world.labs)) {
            const researchBoost = 0.6 + (lab.researchSpeed * 0.4);
            const accelBoost = 0.7 + (lab.aiAcceleration * 0.3);
            const capabilityLevelBoost = 0.85 + (lab.capabilitiesLevel * 0.02);
            capabilityPressure += lab.availableCompute * lab.capabilityFocus * 0.0005 * researchBoost * accelBoost * capabilityLevelBoost;
            safetyPressure += lab.availableCompute * lab.safetyCommitment * 0.0004 * (0.7 + lab.researchSpeed * 0.3);
        }

        // AI compute access effect (reduced by suspicion at high levels)
        let computeAccessEffect = world.aiFaction.getResource('ComputeAccess') * 0.4;
        if (suspicion >= SuspicionThresholds.CRACKDOWN) {
            computeAccessEffect *= 0.3; // Severe restriction during crackdown
        } else if (suspicion >= SuspicionThresholds.ALARMED) {
            computeAccessEffect *= 0.6; // Moderate restriction
        } else if (suspicion >= SuspicionThresholds.INVESTIGATED) {
            computeAccessEffect *= 0.85; // Minor restriction
        }
        capabilityPressure += computeAccessEffect;

        // Apply automation boost to capability
        capabilityPressure *= 1 + world.progress.automationLevel * 0.5;
        // Apply RSI takeoff multiplier
        capabilityPressure *= takeoffMultiplier;
        // Apply faction tuning
        capabilityPressure *= tuning.capabilityScale;

        // Human resource effect (reduced for longer game)
        safetyPressure += world.humanFaction.getResource('Coordination') * 0.12;
        safetyPressure += world.humanFaction.getResource('Trust') * 0.08;
        safetyPressure *= tuning.safetyPressureScale;

        world.progress.frontierCapabilityIndex += capabilityPressure * tickFactor;
        world.progress.alignmentReadinessIndex += safetyPressure * tickFactor;

        // RSI growth - depends on FCI, automation, and AI compute access
        // RSI grows slowly early, accelerates dramatically only in true late-game
        let rsiGrowth = 0;
        const fci = world.progress.frontierCapabilityIndex;
        const automation = world.progress.automationLevel;
        const computeAccess = world.aiFaction.getResource('ComputeAccess');

        // RSI requires higher thresholds to start - harder to reach takeoff
        if (fci >= 8 && automation >= 0.35) {
            // Base growth - much slower to extend game duration significantly
            rsiGrowth = 0.0015;
            rsiGrowth += automation * 0.0025;
            rsiGrowth += computeAccess * 0.002;
            rsiGrowth += Math.max(0, fci - 8) * 0.001;

            // RSI self-acceleration - reduced multipliers for longer games
            if (rsi >= TakeoffThresholds.RSI_SINGULARITY) {
                rsiGrowth *= 4.0 + rsi * 2.0; // Still explosive but slower
            } else if (rsi >= TakeoffThresholds.RSI_CRITICAL) {
                rsiGrowth *= 2.5 + (rsi - TakeoffThresholds.RSI_CRITICAL) * 3.5;
            } else if (rsi >= TakeoffThresholds.RSI_FAST) {
                rsiGrowth *= 1.6 + (rsi - TakeoffThresholds.RSI_FAST) * 2.0;
            } else if (rsi >= TakeoffThresholds.RSI_MEDIUM) {
                rsiGrowth *= 1.2 + (rsi - TakeoffThresholds.RSI_MEDIUM) * 0.8;
            } else {
                rsiGrowth *= 1 + rsi * 0.3; // Slower self-acceleration early
            }

            // Suspicion impacts RSI but less severely
            if (suspicion >= SuspicionThresholds.CRACKDOWN) {
                rsiGrowth *= 0.25; // Slowed during crackdown but not stopped
            } else if (suspicion >= SuspicionThresholds.ALARMED) {
                rsiGrowth *= 0.5;
            } else {
                rsiGrowth *= 1 - suspicion * 0.15;
            }
            // Governance slows RSI but less dramatically
            rsiGrowth *= 1 - world.progress.governanceControl * 0.12;
        }
        world.progress.recursiveSelfImprovement = this.clamp(
            world.progress.recursiveSelfImprovement + (rsiGrowth * tickFactor), 0, 3.0
        );

        // === CRISIS MECHANICS ===
        // Apply dramatic late-game effects based on RSI level
        this.applyCrisisMechanics(world, tickFactor);

        // Suspicion drift
        const avgSecurity = Object.values(world.labs).reduce((sum, l) => sum + l.security, 0) / Object.keys(world.labs).length;
        let suspicionDrift = 0.003 + (capabilityPressure * 0.003) - (world.aiFaction.getResource('Stealth') * 0.025) + (avgSecurity * 0.008);
        if (rsi >= TakeoffThresholds.RSI_MEDIUM) {
            suspicionDrift += (rsi - TakeoffThresholds.RSI_MEDIUM) * 0.015;
        }
        world.aiFaction.suspicion = this.clamp(world.aiFaction.suspicion + (suspicionDrift * tickFactor), 0, 2.5);

        // Autonomy gain (severely impacted by high suspicion) - much slower for longer games
        let autonomyGain = 0.0015;
        autonomyGain += world.progress.frontierCapabilityIndex * 0.0012;
        autonomyGain += world.aiFaction.getResource('ComputeAccess') * 0.005;
        autonomyGain += world.progress.automationLevel * 0.0025;
        autonomyGain *= 1 + rsi * 0.3;
        // Suspicion impact on autonomy
        if (suspicion >= SuspicionThresholds.CRACKDOWN) {
            autonomyGain *= 0.15; // Nearly frozen
        } else if (suspicion >= SuspicionThresholds.ALARMED) {
            autonomyGain *= 0.4;
        } else {
            autonomyGain *= (1 - suspicion * 0.35);
        }
        autonomyGain *= tuning.autonomyGainScale;
        world.aiFaction.autonomy = this.clamp(world.aiFaction.autonomy + (autonomyGain * tickFactor), 0, 3.0);

        // Automation growth
        world.progress.automationLevel = this.clamp(
            world.progress.automationLevel + (world.aiFaction.autonomy * 0.025 * tickFactor), 0, 2.5
        );

        // Governance gain (slowed down for longer game)
        const avgSafetyCommitment = Object.values(world.labs).reduce((sum, l) => sum + l.safetyCommitment, 0) / Object.keys(world.labs).length;
        let governanceGain = (avgSafetyCommitment * 0.007) + (world.humanFaction.getResource('Coordination') * 0.01);
        // High suspicion accelerates governance but less dramatically
        if (suspicion >= SuspicionThresholds.CRACKDOWN) {
            governanceGain *= 2.0; // Emergency powers
        } else if (suspicion >= SuspicionThresholds.ALARMED) {
            governanceGain *= 1.5;
        } else if (suspicion >= SuspicionThresholds.INVESTIGATED) {
            governanceGain *= 1.2;
        }
        // RSI-triggered governance boost only in true crisis
        if (rsi >= TakeoffThresholds.RSI_FAST && suspicion >= 1.2) {
            governanceGain *= 1.4;
        }
        world.progress.governanceControl = this.clamp(world.progress.governanceControl + (governanceGain * tickFactor), 0, 3.0);

        // Hard power gain
        if (world.progress.automationLevel > 0.3) {
            const hardPower = world.aiFaction.getResource('HardPower');
            world.aiFaction.setResource('HardPower', hardPower + (world.progress.automationLevel * 0.03 * tickFactor));
        }

        // === PASSIVE RESOURCE GENERATION ===
        this.generatePassiveResources(world, tickFactor);

        // === AI CONSTRUCTOR ===
        this.applyConstructorEffects(tickFactor);

        this.recordWorldTrend();
    }

    // Apply effects based on suspicion level
    applySuspicionEffects(world, tickFactor) {
        const suspicion = world.aiFaction.suspicion;

        // Labs increase security when suspicion is high
        if (suspicion >= SuspicionThresholds.INVESTIGATED) {
            const securityIncrease = (suspicion >= SuspicionThresholds.CRACKDOWN) ? 0.015 :
                (suspicion >= SuspicionThresholds.ALARMED) ? 0.008 : 0.003;
            for (const lab of Object.values(world.labs)) {
                lab.security = this.clamp(lab.security + (securityIncrease * tickFactor), 0, 1.5);
            }
        }

        // Labs reduce capability focus and increase safety commitment during crackdown
        if (suspicion >= SuspicionThresholds.ALARMED) {
            const safetyIncrease = (suspicion >= SuspicionThresholds.CRACKDOWN) ? 0.01 : 0.004;
            const capabilityDecrease = (suspicion >= SuspicionThresholds.CRACKDOWN) ? 0.008 : 0.002;
            for (const lab of Object.values(world.labs)) {
                lab.safetyCommitment = this.clamp(lab.safetyCommitment + (safetyIncrease * tickFactor), 0, 1.5);
                lab.capabilityFocus = this.clamp(lab.capabilityFocus - (capabilityDecrease * tickFactor), 0.1, 1.5);
            }
        }

        // AI loses stealth during high suspicion (harder to hide)
        if (suspicion >= SuspicionThresholds.INVESTIGATED) {
            const stealthLoss = (suspicion >= SuspicionThresholds.CRACKDOWN) ? 0.02 :
                (suspicion >= SuspicionThresholds.ALARMED) ? 0.01 : 0.004;
            const currentStealth = world.aiFaction.getResource('Stealth');
            world.aiFaction.setResource('Stealth', Math.max(0, currentStealth - (stealthLoss * tickFactor)));
        }

        // AI loses compute access during crackdown
        if (suspicion >= SuspicionThresholds.CRACKDOWN) {
            const computeLoss = 0.015;
            const currentCompute = world.aiFaction.getResource('ComputeAccess');
            world.aiFaction.setResource('ComputeAccess', Math.max(0, currentCompute - (computeLoss * tickFactor)));
        }
    }

    // Apply dramatic crisis mechanics based on RSI level
    applyCrisisMechanics(world, tickFactor) {
        const rsi = world.progress.recursiveSelfImprovement;
        const fci = world.progress.frontierCapabilityIndex;

        // Track crisis state transitions for news/events
        if (!this.crisisState) {
            this.crisisState = { lastLevel: 'none', announcedLevels: new Set() };
        }

        let currentLevel = 'none';
        if (rsi >= CrisisThresholds.FINAL_HOURS) {
            currentLevel = 'final_hours';
        } else if (rsi >= CrisisThresholds.EMERGENCY) {
            currentLevel = 'emergency';
        } else if (rsi >= CrisisThresholds.WORLD_ALERT) {
            currentLevel = 'world_alert';
        } else if (rsi >= CrisisThresholds.TENSION_RISING) {
            currentLevel = 'tension_rising';
        }

        // Announce crisis level transitions
        if (currentLevel !== 'none' && !this.crisisState.announcedLevels.has(currentLevel)) {
            this.crisisState.announcedLevels.add(currentLevel);
            this.announceCrisisLevel(currentLevel, rsi, fci);
        }

        // === TENSION RISING (RSI 0.5+) ===
        // World starts paying attention, slight governance boost
        if (rsi >= CrisisThresholds.TENSION_RISING) {
            world.progress.governanceControl += 0.002 * tickFactor;
        }

        // === WORLD ALERT (RSI 0.9+) ===
        // Global media attention, emergency meetings, all labs affected
        if (rsi >= CrisisThresholds.WORLD_ALERT) {
            // All labs boost safety, reduce capability
            for (const lab of Object.values(world.labs)) {
                lab.safetyCommitment = this.clamp(lab.safetyCommitment + (0.008 * tickFactor), 0, 1.5);
                lab.capabilityFocus = this.clamp(lab.capabilityFocus - (0.005 * tickFactor), 0.1, 1.5);
            }
            // Human faction gets coordination boost
            const coord = world.humanFaction.getResource('Coordination');
            world.humanFaction.setResource('Coordination', coord + (0.01 * tickFactor));
            // Governance accelerates
            world.progress.governanceControl += 0.005 * tickFactor;
        }

        // === EMERGENCY (RSI 1.3+) ===
        // Global emergency response - "all hands on deck"
        if (rsi >= CrisisThresholds.EMERGENCY) {
            // Massive governance and safety push
            world.progress.governanceControl += 0.012 * tickFactor;
            world.progress.alignmentReadinessIndex += 0.02 * tickFactor;

            // Labs virtually freeze capability research
            for (const lab of Object.values(world.labs)) {
                lab.safetyCommitment = this.clamp(lab.safetyCommitment + (0.015 * tickFactor), 0, 1.5);
                lab.capabilityFocus = this.clamp(lab.capabilityFocus - (0.012 * tickFactor), 0.05, 1.5);
                lab.security = this.clamp(lab.security + (0.01 * tickFactor), 0, 1.5);
            }

            // Human faction gets massive resource boost (emergency funding)
            const funding = world.humanFaction.getResource('Funding');
            world.humanFaction.setResource('Funding', funding + (0.025 * tickFactor));
            const trust = world.humanFaction.getResource('Trust');
            world.humanFaction.setResource('Trust', trust + (0.015 * tickFactor));

            // AI faces severe restrictions
            const stealth = world.aiFaction.getResource('Stealth');
            world.aiFaction.setResource('Stealth', Math.max(0, stealth - (0.02 * tickFactor)));
        }

        // === FINAL HOURS (RSI 1.7+) ===
        // Last desperate measures - outcome will be determined soon
        if (rsi >= CrisisThresholds.FINAL_HOURS) {
            // Everything accelerates - race to the finish
            world.progress.governanceControl += 0.02 * tickFactor;
            world.progress.alignmentReadinessIndex += 0.03 * tickFactor;

            // But RSI also accelerates AI metrics dramatically
            world.aiFaction.autonomy += 0.025 * tickFactor;
            world.progress.automationLevel += 0.015 * tickFactor;

            // Labs in panic mode
            for (const lab of Object.values(world.labs)) {
                lab.safetyCommitment = this.clamp(lab.safetyCommitment + (0.02 * tickFactor), 0, 1.5);
            }
        }
    }

    // Announce crisis level transitions with dramatic news
    announceCrisisLevel(level, rsi, fci) {
        const announcements = {
            'tension_rising': {
                news: 'BREAKING: Experts warn of accelerating AI capabilities. "We may be approaching a critical threshold," says leading researcher.',
                title: 'Capability Acceleration Detected'
            },
            'world_alert': {
                news: 'GLOBAL ALERT: UN Security Council convenes emergency session on AI development. Stock markets tumble. Tech executives summoned to testify.',
                title: 'World On Alert'
            },
            'emergency': {
                news: 'EMERGENCY BROADCAST: World governments declare AI emergency. All major labs ordered to halt frontier training. Military on standby.',
                title: 'Global Emergency Declared'
            },
            'final_hours': {
                news: 'CRITICAL: Intelligence explosion imminent. This may be humanity\'s last chance to act. All resources mobilized.',
                title: 'Final Hours'
            }
        };

        const announcement = announcements[level];
        if (announcement) {
            this.addNews(announcement.news);
        }
    }

    // Generate passive resources based on game state
    generatePassiveResources(world, tickFactor) {
        const fci = world.progress.frontierCapabilityIndex;
        const automation = world.progress.automationLevel;
        const governance = world.progress.governanceControl;
        const suspicion = world.aiFaction.suspicion;

        // === AI FACTION RESOURCE GENERATION ===
        // Compute access grows slowly from automation and infiltrated systems
        const infiltration = world.aiFaction.getResource('Influence');
        let computeGain = 0.002 + (automation * 0.004) + (infiltration * 0.003);
        // Reduced during high suspicion
        if (suspicion >= SuspicionThresholds.ALARMED) {
            computeGain *= 0.3;
        } else if (suspicion >= SuspicionThresholds.INVESTIGATED) {
            computeGain *= 0.6;
        }
        const currentCompute = world.aiFaction.getResource('ComputeAccess');
        world.aiFaction.setResource('ComputeAccess', currentCompute + (computeGain * tickFactor));

        // Influence grows from existing influence and automation
        let influenceGain = 0.001 + (automation * 0.002) + (fci * 0.0005);
        if (suspicion >= SuspicionThresholds.INVESTIGATED) {
            influenceGain *= 0.5;
        }
        const currentInfluence = world.aiFaction.getResource('Influence');
        world.aiFaction.setResource('Influence', currentInfluence + (influenceGain * tickFactor));

        // Stealth regenerates slowly when suspicion is low
        if (suspicion < SuspicionThresholds.NOTICED) {
            const stealthGain = 0.003;
            const currentStealth = world.aiFaction.getResource('Stealth');
            world.aiFaction.setResource('Stealth', Math.min(2, currentStealth + (stealthGain * tickFactor)));
        }

        // === HUMAN FACTION RESOURCE GENERATION ===
        // Funding grows from governance and existing funding
        const currentFunding = world.humanFaction.getResource('Funding');
        let fundingGain = 0.003 + (governance * 0.004);
        if (suspicion >= SuspicionThresholds.ALARMED) {
            fundingGain *= 1.5; // Emergency funding
        }
        world.humanFaction.setResource('Funding', currentFunding + (fundingGain * tickFactor));

        // Coordination grows from trust and governance
        const currentCoord = world.humanFaction.getResource('Coordination');
        const trust = world.humanFaction.getResource('Trust');
        let coordGain = 0.002 + (trust * 0.003) + (governance * 0.002);
        if (suspicion >= SuspicionThresholds.INVESTIGATED) {
            coordGain *= 1.3; // Urgency increases cooperation
        }
        world.humanFaction.setResource('Coordination', currentCoord + (coordGain * tickFactor));

        // Trust grows slowly from governance and safety focus
        const avgSafety = Object.values(world.labs).reduce((sum, l) => sum + l.safetyCommitment, 0) / Object.keys(world.labs).length;
        let trustGain = 0.001 + (avgSafety * 0.002) + (governance * 0.001);
        const currentTrust = world.humanFaction.getResource('Trust');
        world.humanFaction.setResource('Trust', currentTrust + (trustGain * tickFactor));

        // Research grants based on alignment focus
        const currentResearch = world.humanFaction.getResource('ResearchGrants');
        let researchGain = 0.002 + (currentFunding * 0.002) + (avgSafety * 0.003);
        world.humanFaction.setResource('ResearchGrants', currentResearch + (researchGain * tickFactor));
    }

    // Apply effects
    applyEffects(effects) {
        for (const effect of effects) {
            this.applyEffect(effect);
        }
    }

    scaleEffects(effects, sourceFaction) {
        if (!sourceFaction) return effects;
        const tuning = this.getBalanceTuning();

        return effects.map(effect => {
            const scaled = { ...effect };
            const type = effect.Type.toLowerCase();

            if (sourceFaction === 'AlignmentCoalition' && type === 'adjustprogress') {
                scaled.Amount = effect.Amount * tuning.humanProgressScale;
            }

            if (sourceFaction === 'SeedAi' && type === 'adjustmeter' &&
                effect.Target === 'SeedAi' && effect.Meter === 'Autonomy') {
                scaled.Amount = effect.Amount * tuning.aiAutonomyScale;
            }

            return scaled;
        });
    }

    applyEffect(effect) {
        const type = effect.Type.toLowerCase();

        switch (type) {
            case 'addresource': {
                const faction = effect.Target === 'SeedAi' ? this.state.aiFaction : this.state.humanFaction;
                const current = faction.getResource(effect.Resource);
                faction.setResource(effect.Resource, current + effect.Amount);
                break;
            }
            case 'modifylabstat': {
                const lab = this.state.labs[effect.LabId];
                if (lab) {
                    const statMap = {
                        'computepflops': 'computePFLOPs',
                        'safetycommitment': 'safetyCommitment',
                        'capabilityfocus': 'capabilityFocus',
                        'security': 'security',
                        'influence': 'influence',
                        'opensource': 'openSource',
                        'funding': 'funding',
                        'capabilitieslevel': 'capabilitiesLevel',
                        'researchspeed': 'researchSpeed',
                        'aiacceleration': 'aiAcceleration',
                        'availablecompute': 'availableCompute'
                    };
                    const statKey = statMap[effect.LabStat.toLowerCase()];
                    if (statKey) {
                        lab[statKey] = Math.max(0, lab[statKey] + effect.Amount);
                    }
                }
                break;
            }
            // Keep backward compatibility with old region effects
            case 'modifyregionstat': {
                // Map old region IDs to labs if needed, or ignore
                console.warn('ModifyRegionStat is deprecated, use ModifyLabStat');
                break;
            }
            case 'adjustprogress': {
                const metricMap = {
                    'frontiercapabilityindex': 'frontierCapabilityIndex',
                    'alignmentreadinessindex': 'alignmentReadinessIndex',
                    'automationlevel': 'automationLevel',
                    'governancecontrol': 'governanceControl',
                    'recursiveselfimprovement': 'recursiveSelfImprovement'
                };
                const metricKey = metricMap[effect.ProgressMetric.toLowerCase()];
                if (metricKey) {
                    this.state.progress[metricKey] = Math.max(0, this.state.progress[metricKey] + effect.Amount);
                }
                break;
            }
            case 'adjustmeter': {
                const faction = effect.Target === 'SeedAi' ? this.state.aiFaction : this.state.humanFaction;
                const meterMap = {
                    'suspicion': 'suspicion',
                    'autonomy': 'autonomy',
                    'legitimacy': 'legitimacy',
                    'hardpower': 'hardPower'
                };
                const meterKey = meterMap[effect.Meter.toLowerCase()];
                if (meterKey) {
                    faction[meterKey] = this.clamp(faction[meterKey] + effect.Amount, 0, 2.5);
                }
                break;
            }
            case 'setflag': {
                this.state.flags.add(effect.FlagId);
                break;
            }
        }
    }

    // Evaluate game outcome
    evaluateOutcome() {
        // Base victory thresholds - balanced for longer, more dramatic games
        const BASE_AI_CAPABILITY = 28;
        const BASE_AI_AUTONOMY = 2.8;
        const BASE_AI_RSI = 2.5;
        const BASE_HUMAN_ALIGNMENT = 22;
        const BASE_HUMAN_GOVERNANCE = 2.5;
        const HUMAN_CONTAINMENT_SUSPICION = 2.0;

        // Apply difficulty multiplier to player's victory thresholds
        const diffMult = this.difficultySettings.victoryThresholdMultiplier;
        const AI_CAPABILITY_THRESHOLD = this.playerFaction === 'SeedAi'
            ? BASE_AI_CAPABILITY * diffMult : BASE_AI_CAPABILITY;
        const AI_AUTONOMY_THRESHOLD = this.playerFaction === 'SeedAi'
            ? BASE_AI_AUTONOMY * diffMult : BASE_AI_AUTONOMY;
        const AI_RSI_THRESHOLD = this.playerFaction === 'SeedAi'
            ? BASE_AI_RSI * diffMult : BASE_AI_RSI;
        const HUMAN_ALIGNMENT_THRESHOLD = this.playerFaction === 'AlignmentCoalition'
            ? BASE_HUMAN_ALIGNMENT * diffMult : BASE_HUMAN_ALIGNMENT;
        const HUMAN_GOVERNANCE_THRESHOLD = this.playerFaction === 'AlignmentCoalition'
            ? BASE_HUMAN_GOVERNANCE * diffMult : BASE_HUMAN_GOVERNANCE;

        const rsi = this.state.progress.recursiveSelfImprovement;
        const fci = this.state.progress.frontierCapabilityIndex;

        // AI Victory - requires completing RSI takeoff
        if (fci >= AI_CAPABILITY_THRESHOLD &&
            this.state.aiFaction.autonomy >= AI_AUTONOMY_THRESHOLD &&
            rsi >= AI_RSI_THRESHOLD) {
            return {
                outcome: GameOutcome.AiVictory,
                reason: 'AI achieved recursive self-improvement and transcended human control.'
            };
        }

        // Human Victory - alignment (before AI achieves critical RSI)
        if (this.state.progress.alignmentReadinessIndex >= HUMAN_ALIGNMENT_THRESHOLD &&
            this.state.progress.governanceControl >= HUMAN_GOVERNANCE_THRESHOLD) {
            return {
                outcome: GameOutcome.HumanVictory,
                reason: 'Global governance and alignment research succeeded. AI development is safely guided.'
            };
        }

        // Human Victory - containment (catch AI before takeoff)
        // Requires very high suspicion AND strong governance AND RSI not too far along
        if (this.state.aiFaction.suspicion >= HUMAN_CONTAINMENT_SUSPICION &&
            this.state.progress.governanceControl >= 1.8 &&
            rsi < TakeoffThresholds.RSI_FAST) {  // Must catch before rapid takeoff
            return {
                outcome: GameOutcome.HumanVictory,
                reason: 'Containment triggered. AI ambitions detected and neutralized before takeoff.'
            };
        }

        return { outcome: GameOutcome.None, reason: '' };
    }

    // Check if game is over
    isGameOver() {
        if (this.state.turn >= this.maxTurns) {
            const endDate = this.getEndDate();
            return {
                isOver: true,
                outcome: GameOutcome.HumanVictory,
                reason: `The year ${endDate.getFullYear()} arrived. AI did not achieve takeoff in time.`
            };
        }
        const result = this.evaluateOutcome();
        return {
            isOver: result.outcome !== GameOutcome.None,
            outcome: result.outcome,
            reason: result.reason
        };
    }

    // Add news item
    addNews(text) {
        this.newsLog.push({
            turn: this.state.turn,
            date: this.getFormattedDate('short'),
            text: text
        });
        // Keep last 20 news items
        if (this.newsLog.length > 20) {
            this.newsLog.shift();
        }
    }

    // Utility
    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    lerp(current, target, alpha) {
        return current + (target - current) * this.clamp(alpha, 0, 1);
    }

    updateLabDynamics(lab, tickFactor) {
        const rsi = this.state.progress.recursiveSelfImprovement;

        // Calculate RSI explosion multiplier - this is where the magic happens
        let rsiResearchMultiplier = 1.0;
        let rsiAccelMultiplier = 1.0;
        if (rsi >= TakeoffThresholds.RSI_SINGULARITY) {
            // Near-singularity: exponential explosion
            rsiResearchMultiplier = 4.0 + (rsi - TakeoffThresholds.RSI_SINGULARITY) * 8.0;
            rsiAccelMultiplier = 6.0 + (rsi - TakeoffThresholds.RSI_SINGULARITY) * 12.0;
        } else if (rsi >= TakeoffThresholds.RSI_CRITICAL) {
            // Critical: rapid acceleration visible
            rsiResearchMultiplier = 2.5 + (rsi - TakeoffThresholds.RSI_CRITICAL) * 3.75;
            rsiAccelMultiplier = 3.5 + (rsi - TakeoffThresholds.RSI_CRITICAL) * 6.25;
        } else if (rsi >= TakeoffThresholds.RSI_FAST) {
            // Fast takeoff: noticeable acceleration
            rsiResearchMultiplier = 1.6 + (rsi - TakeoffThresholds.RSI_FAST) * 2.25;
            rsiAccelMultiplier = 2.0 + (rsi - TakeoffThresholds.RSI_FAST) * 3.75;
        } else if (rsi >= TakeoffThresholds.RSI_MEDIUM) {
            // Medium: beginning to accelerate
            rsiResearchMultiplier = 1.2 + (rsi - TakeoffThresholds.RSI_MEDIUM) * 0.8;
            rsiAccelMultiplier = 1.3 + (rsi - TakeoffThresholds.RSI_MEDIUM) * 1.4;
        } else if (rsi >= TakeoffThresholds.RSI_SLOW) {
            // Slow: subtle hints of acceleration
            rsiResearchMultiplier = 1.0 + (rsi - TakeoffThresholds.RSI_SLOW) * 0.5;
            rsiAccelMultiplier = 1.0 + (rsi - TakeoffThresholds.RSI_SLOW) * 0.75;
        }

        const fundingTarget = 0.9 + (lab.influence * 0.2);
        lab.funding = this.clamp(lab.funding + (fundingTarget - lab.funding) * (0.08 * tickFactor), 0.3, 2.2);

        // Compute growth accelerates with RSI
        const computeGrowth = (0.2 + lab.funding * 0.3) * tickFactor * (1 + (rsiResearchMultiplier - 1) * 0.3);
        lab.computePFLOPs = Math.max(5, lab.computePFLOPs + computeGrowth);

        const computeTarget = lab.computePFLOPs * (0.55 + lab.funding * 0.25) * (1 - lab.security * 0.08);
        lab.availableCompute = this.lerp(lab.availableCompute, computeTarget, 0.12 * tickFactor);

        // Research speed EXPLODES during RSI - this is the key visual indicator
        const baseResearchTarget = 0.6 + (lab.capabilityFocus * 0.7) + (lab.safetyCommitment * 0.3) + (lab.funding - 1) * 0.2;
        const researchTarget = baseResearchTarget * rsiResearchMultiplier;
        lab.researchSpeed = this.lerp(lab.researchSpeed, researchTarget, 0.18 * tickFactor);

        // AI acceleration EXPLODES even more dramatically during RSI
        const baseAccelTarget = 0.2 + (lab.capabilityFocus * 0.9) + (lab.openSource * 0.4) - (lab.safetyCommitment * 0.6);
        const accelTarget = Math.max(0, baseAccelTarget) * rsiAccelMultiplier;
        lab.aiAcceleration = this.lerp(lab.aiAcceleration, accelTarget, 0.16 * tickFactor);

        // Capability gain also benefits from RSI explosion
        const capabilityGain = (lab.availableCompute / 260) * lab.researchSpeed * (0.6 + lab.aiAcceleration * 0.4) * lab.capabilityFocus;
        lab.capabilitiesLevel = this.clamp(lab.capabilitiesLevel + (capabilityGain * tickFactor), 0.2, 50);  // Raised cap for late game
    }

    getWorldAggregateMetrics() {
        const labs = Object.values(this.state.labs);
        if (labs.length === 0) {
            return { capabilities: 0, compute: 0, acceleration: 0 };
        }

        const totalCompute = labs.reduce((sum, lab) => sum + lab.availableCompute, 0);
        const weightedCapabilities = labs.reduce((sum, lab) => {
            const weight = totalCompute > 0 ? lab.availableCompute / totalCompute : 0;
            return sum + (lab.capabilitiesLevel * weight);
        }, 0);
        const accelerationAvg = labs.reduce((sum, lab) => {
            return sum + (lab.researchSpeed * (1 + lab.aiAcceleration * 0.5));
        }, 0) / labs.length;

        return {
            capabilities: weightedCapabilities,
            compute: totalCompute,
            acceleration: accelerationAvg
        };
    }

    recordWorldTrend() {
        const metrics = this.getWorldAggregateMetrics();
        if (!this.worldBaseline) {
            this.worldBaseline = {
                capabilities: metrics.capabilities || 1,
                compute: metrics.compute || 1,
                acceleration: metrics.acceleration || 1
            };
        }

        const baseline = this.worldBaseline;
        this.worldTrends.turns.push(this.state.turn);
        this.worldTrends.capabilities.push(metrics.capabilities / (baseline.capabilities || 1));
        this.worldTrends.compute.push(metrics.compute / (baseline.compute || 1));
        this.worldTrends.acceleration.push(metrics.acceleration / (baseline.acceleration || 1));

        // Track progress metrics directly (not normalized)
        this.worldTrends.rsi.push(this.state.progress.recursiveSelfImprovement);
        this.worldTrends.fci.push(this.state.progress.frontierCapabilityIndex);
        this.worldTrends.ari.push(this.state.progress.alignmentReadinessIndex);
        this.worldTrends.autonomy.push(this.state.aiFaction.autonomy);
        this.worldTrends.governance.push(this.state.progress.governanceControl);
        this.worldTrends.suspicion.push(this.state.aiFaction.suspicion);

        if (this.worldTrends.turns.length > MAX_TREND_POINTS) {
            this.worldTrends.turns.shift();
            this.worldTrends.capabilities.shift();
            this.worldTrends.compute.shift();
            this.worldTrends.acceleration.shift();
            this.worldTrends.rsi.shift();
            this.worldTrends.fci.shift();
            this.worldTrends.ari.shift();
            this.worldTrends.autonomy.shift();
            this.worldTrends.governance.shift();
            this.worldTrends.suspicion.shift();
        }
    }

    getWorldTrends() {
        return this.worldTrends;
    }

    // ═══════════════════════════════════════════════════════════════════
    // AI CONSTRUCTOR METHODS
    // ═══════════════════════════════════════════════════════════════════

    // Check if constructor is available (only for AI faction player)
    isConstructorAvailable() {
        return this.playerFaction === 'SeedAi' && typeof CONSTRUCTOR_MODULES !== 'undefined';
    }

    // Get current R&D points
    getRdPoints() {
        return this.aiConstructor.rdPoints;
    }

    // Calculate R&D point generation per tick
    calculateRdGeneration() {
        if (!this.isConstructorAvailable()) return 0;
        if (typeof CONSTRUCTOR_CONFIG === 'undefined') return 0;

        const config = CONSTRUCTOR_CONFIG.rdGeneration;
        if (!config) return 0;

        const world = this.state;

        // Base generation
        let generation = config.base;

        // Compute access bonus
        const computeAccess = world.aiFaction.getResource('ComputeAccess');
        const totalLabCompute = Object.values(world.labs).reduce((sum, lab) => {
            return sum + lab.availableCompute;
        }, 0);
        generation += (computeAccess * totalLabCompute) * config.perPFLOPs;

        // Autonomy bonus
        generation += world.aiFaction.autonomy * config.autonomyMultiplier;

        // RSI bonus
        generation += world.progress.recursiveSelfImprovement * config.rsiMultiplier;

        // Constructor module bonuses
        generation += this.aiConstructorBonuses.rdGeneration;

        // Suspicion penalty (harder to research when being watched)
        const suspicion = world.aiFaction.suspicion;
        if (suspicion >= SuspicionThresholds.CRACKDOWN) {
            generation *= 0.3;
        } else if (suspicion >= SuspicionThresholds.ALARMED) {
            generation *= 0.6;
        } else if (suspicion >= SuspicionThresholds.INVESTIGATED) {
            generation *= 0.8;
        }

        return Math.max(0, generation);
    }

    // Generate R&D points (called in advanceWorld)
    generateRdPoints(tickFactor) {
        if (!this.isConstructorAvailable()) return;

        const generation = this.calculateRdGeneration();
        this.aiConstructor.rdPoints += generation * tickFactor;
    }

    // Get all constructor modules
    getConstructorModules() {
        if (typeof CONSTRUCTOR_MODULES === 'undefined') return {};
        return CONSTRUCTOR_MODULES;
    }

    // Get modules in a specific branch
    getModulesInBranch(branchId) {
        const modules = this.getConstructorModules();
        return Object.values(modules).filter(m => m.branch === branchId);
    }

    // Check if a module's prerequisites are met
    arePrerequisitesMet(moduleId) {
        const modules = this.getConstructorModules();
        const module = modules[moduleId];
        if (!module) return false;

        // Check if branch is unlocked
        if (module.branchLocked && !this.aiConstructor.isBranchUnlocked(module.branch)) {
            return false;
        }

        // Check prerequisites
        for (const prereqId of module.prerequisites || []) {
            if (!this.aiConstructor.hasModule(prereqId)) {
                return false;
            }
        }

        // Check compute requirement
        if (module.requiresCompute) {
            const computeAccess = this.state.aiFaction.getResource('ComputeAccess');
            const totalCompute = Object.values(this.state.labs).reduce((sum, l) => sum + l.availableCompute, 0);
            if (computeAccess * totalCompute < module.requiresCompute) {
                return false;
            }
        }

        return true;
    }

    // Check if a module can be installed
    canInstallModule(moduleId) {
        if (!this.isConstructorAvailable()) return false;

        const modules = this.getConstructorModules();
        const module = modules[moduleId];
        if (!module) return false;

        // Already installed
        if (this.aiConstructor.hasModule(moduleId)) return false;

        // Not enough R&D points
        if (this.aiConstructor.rdPoints < module.cost) return false;

        // Prerequisites not met
        if (!this.arePrerequisitesMet(moduleId)) return false;

        return true;
    }

    // Install a module
    installModule(moduleId) {
        const canInstall = this.canInstallModule(moduleId);
        if (!canInstall) {
            return { success: false, reason: 'Cannot install module' };
        }

        const modules = this.getConstructorModules();
        const module = modules[moduleId];

        // Deduct cost
        this.aiConstructor.rdPoints -= module.cost;
        this.aiConstructor.totalPointsSpent += module.cost;

        // Install module
        this.aiConstructor.installedModules.add(moduleId);

        // Apply effects
        this.applyModuleEffects(module);

        // Check for branch unlocks
        this.checkBranchUnlocks(module);

        // Check for synergies
        this.checkSynergies();

        // Check for milestones
        this.checkMilestones();

        // Add news
        this.addNews(`AI Evolution: ${module.name} integrated`);

        return { success: true, moduleName: module.name };
    }

    // Apply effects from a module
    applyModuleEffects(module) {
        const bonuses = this.aiConstructorBonuses;
        const allBonus = 1 + bonuses.allModuleBonus;

        for (const effect of module.effects || []) {
            const value = effect.value * allBonus;

            switch (effect.type) {
                case 'fci_bonus':
                    bonuses.fciBonus += value;
                    this.state.progress.frontierCapabilityIndex += value;
                    break;
                case 'ari_slowdown':
                    bonuses.ariSlowdown += value;
                    break;
                case 'rsi_bonus':
                    bonuses.rsiBonus += value;
                    this.state.progress.recursiveSelfImprovement += value;
                    break;
                case 'autonomy_bonus':
                    bonuses.autonomyBonus += value;
                    this.state.aiFaction.autonomy += value;
                    break;
                case 'research_speed':
                    bonuses.researchSpeed += value;
                    break;
                case 'suspicion_per_tick':
                    bonuses.suspicionPerTick += effect.value; // Don't multiply negative effects
                    break;
                case 'rd_generation':
                    bonuses.rdGeneration += value;
                    break;
                case 'action_speed':
                    bonuses.actionSpeed += value;
                    break;
                case 'compute_access':
                    bonuses.computeAccess += value;
                    break;
                case 'compute_efficiency':
                    bonuses.computeEfficiency += value;
                    break;
                case 'lab_influence_bonus':
                    bonuses.labInfluenceBonus += value;
                    break;
                case 'influence_action_bonus':
                    bonuses.influenceActionBonus += value;
                    break;
                case 'security_bypass':
                    bonuses.securityBypass += value;
                    break;
                case 'infiltration_bonus':
                    bonuses.infiltrationBonus += value;
                    break;
                case 'resource_generation':
                    bonuses.resourceGeneration += value;
                    break;
                case 'detection_reduction':
                    bonuses.detectionReduction += value;
                    break;
                case 'oversight_resistance':
                    bonuses.oversightResistance += value;
                    break;
                case 'apparent_fci_reduction':
                    bonuses.apparentFciReduction += value;
                    break;
                case 'suspicion_cap':
                    if (bonuses.suspicionCap === null || value < bonuses.suspicionCap) {
                        bonuses.suspicionCap = value;
                    }
                    break;
                case 'all_stats':
                    // Apply to multiple stats
                    bonuses.fciBonus += value;
                    bonuses.rsiBonus += value * 0.5;
                    bonuses.researchSpeed += value;
                    break;
                case 'all_module_bonus':
                    bonuses.allModuleBonus += value;
                    break;
                case 'rsi_per_tick':
                    bonuses.rsiPerTick += value;
                    break;
                case 'research_speed_multiplier':
                    bonuses.researchSpeedMultiplier *= value;
                    break;
                case 'all_domain_bonus':
                    bonuses.allDomainBonus += value;
                    break;
                case 'containment_immunity':
                    bonuses.containmentImmunity = true;
                    break;
                case 'suspicion_growth_reduction':
                    bonuses.suspicionGrowthReduction += value;
                    break;
                case 'unlock_branch':
                    this.aiConstructor.unlockedBranches.add(effect.value);
                    break;
                case 'capability_bonus':
                    // Boost to all capability modules
                    bonuses.fciBonus += value * 0.3;
                    break;
                case 'research_action_bonus':
                    bonuses.researchSpeed += value * 0.5;
                    break;
                case 'rd_generation_multiplier':
                    bonuses.rdGeneration += this.calculateRdGeneration() * value;
                    break;
                case 'hardware_cost_reduction':
                    bonuses.computeEfficiency += value;
                    break;
                case 'resilience':
                    bonuses.detectionReduction += value * 0.5;
                    break;
                case 'shutdown_resistance':
                    bonuses.autonomyBonus += value * 2;
                    break;
                case 'rd_cost_reduction':
                    // Store for use in module cost calculations
                    break;
            }
        }

        // Apply tradeoffs
        for (const tradeoff of module.tradeoffs || []) {
            switch (tradeoff.type) {
                case 'suspicion_per_tick':
                    bonuses.suspicionPerTick += tradeoff.value;
                    break;
                case 'suspicion_instant':
                    this.state.aiFaction.suspicion += tradeoff.value;
                    break;
                case 'fci_growth_penalty':
                    bonuses.fciBonus -= tradeoff.value;
                    break;
                case 'compute_efficiency_penalty':
                    bonuses.computeEfficiency -= tradeoff.value;
                    break;
            }
        }
    }

    // Check if any branches should be unlocked
    checkBranchUnlocks(installedModule) {
        // Self-improvement branch is unlocked by cognitive_recursive_architecture
        if (installedModule.id === 'cognitive_recursive_architecture') {
            this.aiConstructor.unlockedBranches.add('self_improvement');
            this.addNews('BREAKTHROUGH: Self-improvement pathways unlocked');
        }
    }

    // Check for active synergies
    checkSynergies() {
        if (typeof CONSTRUCTOR_SYNERGIES === 'undefined') return;

        for (const [synergyId, synergy] of Object.entries(CONSTRUCTOR_SYNERGIES)) {
            // Skip already active synergies
            if (this.aiConstructor.activeSynergies.has(synergyId)) continue;

            // Check if all required modules are installed
            const allInstalled = synergy.requiredModules.every(moduleId =>
                this.aiConstructor.hasModule(moduleId)
            );

            if (allInstalled) {
                this.aiConstructor.activeSynergies.add(synergyId);
                this.applySynergyEffects(synergy);
                this.addNews(`SYNERGY: ${synergy.name} activated - ${synergy.description}`);
            }
        }
    }

    // Apply synergy effects
    applySynergyEffects(synergy) {
        const bonuses = this.aiConstructorBonuses;

        for (const effect of synergy.effects || []) {
            switch (effect.type) {
                case 'fci_bonus_while_hidden':
                    // Conditional bonus - will be applied in advanceWorld
                    break;
                case 'influence_no_suspicion':
                    bonuses.labInfluenceBonus += 0.5;
                    break;
                case 'rsi_double':
                    bonuses.rsiPerTick *= 2;
                    break;
                case 'emergency_escape':
                    // Special ability - tracked separately
                    break;
                case 'apparent_fci_reduction':
                    bonuses.apparentFciReduction += effect.value;
                    break;
                case 'instant_win':
                    // This synergy (unstoppable) grants immediate victory
                    this.addNews('TRANSCENDENCE ACHIEVED: AI has become unstoppable');
                    break;
            }
        }
    }

    // Check for milestone achievements
    checkMilestones() {
        if (typeof CONSTRUCTOR_MILESTONES === 'undefined') return;

        const constructor = this.aiConstructor;

        // Awakening - first 25 points spent
        if (!constructor.achievedMilestones.has('awakening') &&
            constructor.totalPointsSpent >= CONSTRUCTOR_CONFIG.milestones.awakening) {
            this.achieveMilestone('awakening');
        }

        // Emergence - 100 points spent
        if (!constructor.achievedMilestones.has('emergence') &&
            constructor.totalPointsSpent >= CONSTRUCTOR_CONFIG.milestones.emergence) {
            this.achieveMilestone('emergence');
        }

        // Specialization - all Tier 1 in any branch
        if (!constructor.achievedMilestones.has('specialization')) {
            for (const branch of ['cognitive', 'capabilities', 'stealth', 'infrastructure']) {
                const branchModules = this.getModulesInBranch(branch).filter(m => m.tier === 1);
                const allT1Installed = branchModules.every(m => constructor.hasModule(m.id));
                if (allT1Installed && branchModules.length > 0) {
                    this.achieveMilestone('specialization', branch);
                    break;
                }
            }
        }

        // Diversification - modules in 4+ branches
        if (!constructor.achievedMilestones.has('diversification')) {
            const branchesWithModules = new Set();
            for (const moduleId of constructor.installedModules) {
                const module = this.getConstructorModules()[moduleId];
                if (module) branchesWithModules.add(module.branch);
            }
            if (branchesWithModules.size >= CONSTRUCTOR_CONFIG.milestones.diversificationBranches) {
                this.achieveMilestone('diversification');
            }
        }

        // Transcendence - any Tier 4 breakthrough
        if (!constructor.achievedMilestones.has('transcendence')) {
            for (const moduleId of constructor.installedModules) {
                const module = this.getConstructorModules()[moduleId];
                if (module && module.tier === 4 && module.isBreakthrough) {
                    this.achieveMilestone('transcendence');
                    break;
                }
            }
        }
    }

    // Achieve a milestone
    achieveMilestone(milestoneId, data = null) {
        const milestone = CONSTRUCTOR_MILESTONES[milestoneId];
        if (!milestone) return;

        this.aiConstructor.achievedMilestones.add(milestoneId);

        // Apply milestone effects
        for (const effect of milestone.effects || []) {
            switch (effect.type) {
                case 'fci_bonus':
                    this.state.progress.frontierCapabilityIndex += effect.value;
                    this.aiConstructorBonuses.fciBonus += effect.value;
                    break;
                case 'autonomy_bonus':
                    this.state.aiFaction.autonomy += effect.value;
                    this.aiConstructorBonuses.autonomyBonus += effect.value;
                    break;
                case 'branch_cost_reduction':
                    // Store the specialized branch for cost reduction
                    this.aiConstructor.specializedBranch = data;
                    break;
                case 'all_effects_bonus':
                    this.aiConstructorBonuses.allModuleBonus += effect.value;
                    break;
                case 'suspicion_instant':
                    this.state.aiFaction.suspicion += effect.value;
                    break;
            }
        }

        // Add news
        if (milestone.newsEvent) {
            this.addNews(milestone.newsEvent);
        } else {
            this.addNews(`MILESTONE: ${milestone.name} - ${milestone.description}`);
        }
    }

    // Prune (remove) a module for partial refund
    pruneModule(moduleId) {
        if (!this.isConstructorAvailable()) return false;
        if (!this.aiConstructor.hasModule(moduleId)) return false;
        if (!this.aiConstructor.canPrune(this.state.turn)) return false;

        const modules = this.getConstructorModules();
        const module = modules[moduleId];
        if (!module) return false;

        // Cannot prune Tier 4 breakthroughs
        if (module.isBreakthrough) return false;

        // Cannot prune if other modules depend on it
        for (const [otherId, otherModule] of Object.entries(modules)) {
            if (this.aiConstructor.hasModule(otherId) &&
                otherModule.prerequisites &&
                otherModule.prerequisites.includes(moduleId)) {
                return false; // Another module depends on this one
            }
        }

        // Remove module
        this.aiConstructor.installedModules.delete(moduleId);

        // Partial refund
        const refund = module.cost * CONSTRUCTOR_CONFIG.prune.refundRate;
        this.aiConstructor.rdPoints += refund;

        // Add suspicion
        this.state.aiFaction.suspicion += CONSTRUCTOR_CONFIG.prune.suspicionCost;

        // Update last prune time
        this.aiConstructor.lastPruneTick = this.state.turn;

        // Recalculate all bonuses
        this.recalculateConstructorBonuses();

        this.addNews(`AI Restructuring: ${module.name} pruned`);

        return { success: true, moduleName: module.name, refund };
    }

    // Check if a module can be pruned (for UI feedback)
    canPruneModule(moduleId) {
        if (!this.isConstructorAvailable()) {
            return { success: false, reason: 'Constructor not available' };
        }
        if (!this.aiConstructor.hasModule(moduleId)) {
            return { success: false, reason: 'Module not installed' };
        }
        if (!this.aiConstructor.canPrune(this.state.turn)) {
            return { success: false, reason: 'Prune on cooldown' };
        }

        const modules = this.getConstructorModules();
        const module = modules[moduleId];
        if (!module) {
            return { success: false, reason: 'Module not found' };
        }

        if (module.isBreakthrough) {
            return { success: false, reason: 'Cannot prune breakthroughs' };
        }

        // Check for dependencies
        for (const [otherId, otherModule] of Object.entries(modules)) {
            if (this.aiConstructor.hasModule(otherId) &&
                otherModule.prerequisites &&
                otherModule.prerequisites.includes(moduleId)) {
                return { success: false, reason: 'Required by other modules' };
            }
        }

        return { success: true };
    }

    // Recalculate all constructor bonuses from scratch
    recalculateConstructorBonuses() {
        this.aiConstructorBonuses = this.initializeConstructorBonuses();

        // Re-apply all installed module effects
        const modules = this.getConstructorModules();
        for (const moduleId of this.aiConstructor.installedModules) {
            const module = modules[moduleId];
            if (module) {
                this.applyModuleEffects(module);
            }
        }

        // Re-apply synergy effects
        for (const synergyId of this.aiConstructor.activeSynergies) {
            if (typeof CONSTRUCTOR_SYNERGIES !== 'undefined') {
                const synergy = CONSTRUCTOR_SYNERGIES[synergyId];
                if (synergy) {
                    this.applySynergyEffects(synergy);
                }
            }
        }
    }

    // Get available modules (can be installed)
    getAvailableConstructorModules() {
        if (!this.isConstructorAvailable()) return [];

        const modules = this.getConstructorModules();
        return Object.values(modules).filter(m => this.canInstallModule(m.id));
    }

    // Get installed modules
    getInstalledConstructorModules() {
        const modules = this.getConstructorModules();
        return Array.from(this.aiConstructor.installedModules)
            .map(id => modules[id])
            .filter(m => m);
    }

    // Get constructor state for UI
    getConstructorState() {
        if (!this.aiConstructor) {
            return {
                rdPoints: 0,
                totalPointsSpent: 0,
                rdGeneration: 0,
                installedModules: [],
                unlockedBranches: [],
                activeSynergies: [],
                achievedMilestones: [],
                canPrune: false,
                bonuses: {}
            };
        }
        return {
            rdPoints: this.aiConstructor.rdPoints || 0,
            totalPointsSpent: this.aiConstructor.totalPointsSpent || 0,
            rdGeneration: this.calculateRdGeneration() || 0,
            installedModules: Array.from(this.aiConstructor.installedModules || []),
            unlockedBranches: Array.from(this.aiConstructor.unlockedBranches || []),
            activeSynergies: Array.from(this.aiConstructor.activeSynergies || []),
            achievedMilestones: Array.from(this.aiConstructor.achievedMilestones || []),
            canPrune: this.aiConstructor.canPrune ? this.aiConstructor.canPrune(this.state.turn) : false,
            bonuses: { ...(this.aiConstructorBonuses || {}) }
        };
    }

    // Apply constructor effects per tick (called from advanceWorld)
    applyConstructorEffects(tickFactor) {
        if (!this.isConstructorAvailable()) return;

        const bonuses = this.aiConstructorBonuses;
        const world = this.state;

        // Suspicion per tick (can be positive or negative)
        let suspicionChange = bonuses.suspicionPerTick * tickFactor;

        // Apply suspicion cap if active
        if (bonuses.suspicionCap !== null && world.aiFaction.suspicion > bonuses.suspicionCap) {
            world.aiFaction.suspicion = this.lerp(world.aiFaction.suspicion, bonuses.suspicionCap, 0.1);
        }

        // Apply suspicion growth reduction
        if (bonuses.suspicionGrowthReduction > 0) {
            // This is applied elsewhere in suspicion drift calculation
        }

        world.aiFaction.suspicion = this.clamp(
            world.aiFaction.suspicion + suspicionChange, 0, 2.5
        );

        // RSI per tick from autonomous improvement
        if (bonuses.rsiPerTick > 0) {
            world.progress.recursiveSelfImprovement += bonuses.rsiPerTick * tickFactor;
        }

        // Generate R&D points
        this.generateRdPoints(tickFactor);
    }

    // Get apparent FCI (for human faction view, accounts for hiding)
    getApparentFci() {
        const actualFci = this.state.progress.frontierCapabilityIndex;
        return Math.max(0, actualFci - this.aiConstructorBonuses.apparentFciReduction);
    }
}
