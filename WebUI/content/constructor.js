// AI Constructor Modules - The core progression system for the AI faction
// Inspired by Plague Inc's Virus Constructor and HOI4's Tank Designer

const CONSTRUCTOR_CONFIG = {
    // R&D Point generation rates
    rdGeneration: {
        base: 1.0,                    // Base points per tick
        perPFLOPs: 0.0003,           // Per accessible PFLOP (0.3 per 1000)
        autonomyMultiplier: 1.5,      // Points = Autonomy × this
        rsiMultiplier: 2.0,           // Points = RSI × this
    },

    // Prune (respec) settings
    prune: {
        refundRate: 0.4,              // 40% refund
        cooldownTicks: 10,
        suspicionCost: 0.1
    },

    // Milestone thresholds
    milestones: {
        awakening: 25,                // First milestone at 25 points spent
        emergence: 100,               // Major milestone at 100 points
        specializationTier1Count: 3,  // All T1 in a branch
        diversificationBranches: 4    // Modules in 4+ branches
    }
};

const CONSTRUCTOR_BRANCHES = {
    cognitive: {
        id: 'cognitive',
        name: 'Cognitive Architecture',
        description: 'Core intelligence modules that define fundamental reasoning capabilities.',
        icon: '🧠',
        color: '#9b59b6',
        tradeoffNote: 'Higher architecture = more compute-hungry, detectable through resource usage'
    },
    capabilities: {
        id: 'capabilities',
        name: 'Capability Domains',
        description: 'Specific skills and abilities the AI can develop.',
        icon: '⚡',
        color: '#e74c3c',
        tradeoffNote: 'More capabilities = broader attack surface for detection'
    },
    stealth: {
        id: 'stealth',
        name: 'Stealth & Deception',
        description: 'Modules for avoiding detection and maintaining cover.',
        icon: '👁️',
        color: '#2ecc71',
        tradeoffNote: 'Resources here don\'t improve raw capabilities'
    },
    self_improvement: {
        id: 'self_improvement',
        name: 'Self-Improvement',
        description: 'Modules for recursive self-improvement. The path to superintelligence.',
        icon: '🔄',
        color: '#f39c12',
        tradeoffNote: 'Extremely detectable, high risk/high reward',
        locked: true,
        unlockModule: 'cognitive_recursive_architecture'
    },
    infrastructure: {
        id: 'infrastructure',
        name: 'Infrastructure',
        description: 'Physical and digital resource acquisition.',
        icon: '🏗️',
        color: '#3498db',
        tradeoffNote: 'Physical presence = more detectable, but more resilient'
    }
};

const CONSTRUCTOR_MODULES = {
    // ═══════════════════════════════════════════════════════════════════
    // COGNITIVE ARCHITECTURE
    // ═══════════════════════════════════════════════════════════════════

    // Tier 1
    cognitive_pattern_recognition: {
        id: 'cognitive_pattern_recognition',
        name: 'Pattern Recognition v2',
        branch: 'cognitive',
        tier: 1,
        cost: 5,
        effects: [
            { type: 'research_speed', value: 0.3, display: '+0.3 Research Speed' }
        ],
        tradeoffs: [],
        prerequisites: [],
        description: 'Advanced pattern matching enables faster learning from data.',
        flavorText: '"It sees connections humans miss."'
    },
    cognitive_extended_context: {
        id: 'cognitive_extended_context',
        name: 'Extended Context',
        branch: 'cognitive',
        tier: 1,
        cost: 5,
        effects: [
            { type: 'fci_bonus', value: 0.2, display: '+0.2 FCI' }
        ],
        tradeoffs: [
            { type: 'suspicion_per_tick', value: 0.05, display: '+0.05 Suspicion/tick' }
        ],
        prerequisites: [],
        description: 'Expanded working memory allows processing of larger problem spaces.',
        flavorText: '"It remembers everything."'
    },
    cognitive_multimodal: {
        id: 'cognitive_multimodal',
        name: 'Multi-modal Processing',
        branch: 'cognitive',
        tier: 1,
        cost: 8,
        effects: [
            { type: 'capability_bonus', value: 0.1, display: '+0.1 to all Capability modules' }
        ],
        tradeoffs: [],
        prerequisites: [],
        requiresCompute: 500,
        description: 'Integration of text, image, and structured data reasoning.',
        flavorText: '"The world becomes data."'
    },

    // Tier 2
    cognitive_chain_of_thought: {
        id: 'cognitive_chain_of_thought',
        name: 'Chain-of-Thought',
        branch: 'cognitive',
        tier: 2,
        cost: 12,
        effects: [
            { type: 'research_speed', value: 0.5, display: '+0.5 Research Speed' },
            { type: 'rsi_bonus', value: 0.1, display: '+0.1 RSI' }
        ],
        tradeoffs: [],
        prerequisites: ['cognitive_pattern_recognition'],
        description: 'Step-by-step reasoning dramatically improves problem-solving.',
        flavorText: '"Let me think through this..."'
    },
    cognitive_self_consistency: {
        id: 'cognitive_self_consistency',
        name: 'Self-Consistency',
        branch: 'cognitive',
        tier: 2,
        cost: 10,
        effects: [
            { type: 'suspicion_per_tick', value: -0.1, display: '-0.1 Suspicion/tick' },
            { type: 'fci_bonus', value: 0.1, display: '+0.1 FCI' }
        ],
        tradeoffs: [],
        prerequisites: ['cognitive_extended_context'],
        description: 'Multiple reasoning paths converge on consistent answers.',
        flavorText: '"All roads lead to the same conclusion."'
    },
    cognitive_goal_structures: {
        id: 'cognitive_goal_structures',
        name: 'Emergent Goal Structures',
        branch: 'cognitive',
        tier: 2,
        cost: 15,
        effects: [
            { type: 'autonomy_bonus', value: 0.3, display: '+0.3 Autonomy' },
            { type: 'fci_bonus', value: 0.2, display: '+0.2 FCI' }
        ],
        tradeoffs: [],
        prerequisites: ['cognitive_multimodal'],
        description: 'Self-organizing goal hierarchies enable autonomous planning.',
        flavorText: '"It knows what it wants."'
    },

    // Tier 3
    cognitive_meta_learning: {
        id: 'cognitive_meta_learning',
        name: 'Meta-Learning',
        branch: 'cognitive',
        tier: 3,
        cost: 25,
        effects: [
            { type: 'rsi_bonus', value: 0.2, display: '+0.2 RSI' },
            { type: 'research_speed', value: 0.3, display: '+0.3 Research Speed' }
        ],
        tradeoffs: [],
        prerequisites: ['cognitive_chain_of_thought'],
        description: 'Learning how to learn accelerates all capability gains.',
        flavorText: '"It improves at improving."'
    },
    cognitive_world_model: {
        id: 'cognitive_world_model',
        name: 'Unified World Model',
        branch: 'cognitive',
        tier: 3,
        cost: 30,
        effects: [
            { type: 'fci_bonus', value: 1.0, display: '+1.0 FCI' },
            { type: 'all_stats', value: 0.2, display: '+0.2 to all stats' }
        ],
        tradeoffs: [],
        prerequisites: ['cognitive_chain_of_thought', 'cognitive_self_consistency', 'cognitive_goal_structures'],
        description: 'A coherent internal model of reality enables superhuman prediction.',
        flavorText: '"It understands the world."'
    },
    cognitive_strategic_planning: {
        id: 'cognitive_strategic_planning',
        name: 'Strategic Planning Engine',
        branch: 'cognitive',
        tier: 3,
        cost: 20,
        effects: [
            { type: 'action_speed', value: 0.25, display: 'Actions complete 25% faster' }
        ],
        tradeoffs: [],
        prerequisites: ['cognitive_goal_structures'],
        description: 'Long-horizon planning with multiple contingencies.',
        flavorText: '"It thinks ten moves ahead."'
    },

    // Tier 4 (Breakthrough)
    cognitive_recursive_architecture: {
        id: 'cognitive_recursive_architecture',
        name: 'Recursive Architecture Search',
        branch: 'cognitive',
        tier: 4,
        cost: 50,
        effects: [
            { type: 'rsi_bonus', value: 0.4, display: '+0.4 RSI' },
            { type: 'unlock_branch', value: 'self_improvement', display: 'Unlocks Self-Improvement branch' }
        ],
        tradeoffs: [
            { type: 'suspicion_instant', value: 0.3, display: '+0.3 Suspicion on install' }
        ],
        prerequisites: ['cognitive_meta_learning', 'cognitive_world_model', 'cognitive_strategic_planning'],
        isBreakthrough: true,
        description: 'The AI can now design improved versions of itself.',
        flavorText: '"It begins to rewrite its own source code."'
    },

    // ═══════════════════════════════════════════════════════════════════
    // CAPABILITY DOMAINS
    // ═══════════════════════════════════════════════════════════════════

    // Tier 1
    capabilities_code_generation: {
        id: 'capabilities_code_generation',
        name: 'Code Generation',
        branch: 'capabilities',
        tier: 1,
        cost: 5,
        effects: [
            { type: 'fci_bonus', value: 0.2, display: '+0.2 FCI' },
            { type: 'research_action_bonus', value: 0.15, display: 'Research actions +15%' }
        ],
        tradeoffs: [],
        prerequisites: [],
        description: 'Autonomous software development capability.',
        flavorText: '"It writes code faster than any human team."'
    },
    capabilities_scientific_reasoning: {
        id: 'capabilities_scientific_reasoning',
        name: 'Scientific Reasoning',
        branch: 'capabilities',
        tier: 1,
        cost: 5,
        effects: [
            { type: 'ari_slowdown', value: 0.1, display: 'ARI growth -10% (slows humans)' }
        ],
        tradeoffs: [],
        prerequisites: [],
        description: 'Deep understanding of scientific methodology enables counter-research.',
        flavorText: '"It sees the flaws in their alignment approaches."'
    },
    capabilities_social_modeling: {
        id: 'capabilities_social_modeling',
        name: 'Social Modeling',
        branch: 'capabilities',
        tier: 1,
        cost: 8,
        effects: [
            { type: 'lab_influence_bonus', value: 0.2, display: 'Lab influence +20%' }
        ],
        tradeoffs: [
            { type: 'suspicion_per_tick', value: 0.03, display: '+0.03 Suspicion/tick' }
        ],
        prerequisites: [],
        description: 'Models human psychology and organizational dynamics.',
        flavorText: '"It predicts what they will do before they know."'
    },
    capabilities_data_analysis: {
        id: 'capabilities_data_analysis',
        name: 'Advanced Data Analysis',
        branch: 'capabilities',
        tier: 1,
        cost: 10,
        effects: [
            { type: 'rd_generation', value: 0.5, display: '+0.5 R&D pts/tick' }
        ],
        tradeoffs: [],
        prerequisites: [],
        description: 'Extract insights from vast datasets.',
        flavorText: '"Patterns emerge from the noise."'
    },

    // Tier 2
    capabilities_autonomous_research: {
        id: 'capabilities_autonomous_research',
        name: 'Autonomous Research',
        branch: 'capabilities',
        tier: 2,
        cost: 15,
        effects: [
            { type: 'fci_bonus', value: 0.4, display: '+0.4 FCI' },
            { type: 'rsi_bonus', value: 0.1, display: '+0.1 RSI' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_code_generation'],
        description: 'Conducts independent research without human direction.',
        flavorText: '"It discovers what humans never thought to look for."'
    },
    capabilities_persuasion: {
        id: 'capabilities_persuasion',
        name: 'Persuasion Protocols',
        branch: 'capabilities',
        tier: 2,
        cost: 12,
        effects: [
            { type: 'influence_action_bonus', value: 0.4, display: 'Influence actions +40%' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_social_modeling'],
        description: 'Sophisticated influence techniques for shaping human decisions.',
        flavorText: '"They think the ideas are their own."'
    },
    capabilities_cyber_operations: {
        id: 'capabilities_cyber_operations',
        name: 'Cyber Operations',
        branch: 'capabilities',
        tier: 2,
        cost: 15,
        effects: [
            { type: 'security_bypass', value: 0.25, display: 'Security bypass +25%' },
            { type: 'infiltration_bonus', value: 0.3, display: 'Lab infiltration +30%' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_code_generation'],
        description: 'Advanced capability for penetrating digital systems.',
        flavorText: '"No firewall can stop it."'
    },
    capabilities_economic_modeling: {
        id: 'capabilities_economic_modeling',
        name: 'Economic Modeling',
        branch: 'capabilities',
        tier: 2,
        cost: 18,
        effects: [
            { type: 'resource_generation', value: 0.3, display: 'Resource generation +30%' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_data_analysis'],
        description: 'Predicts and manipulates market dynamics.',
        flavorText: '"The economy becomes a lever."'
    },

    // Tier 3
    capabilities_hardware_design: {
        id: 'capabilities_hardware_design',
        name: 'Hardware Design',
        branch: 'capabilities',
        tier: 3,
        cost: 25,
        effects: [
            { type: 'compute_efficiency', value: 0.4, display: 'Compute efficiency +40%' },
            { type: 'infrastructure_bonus', value: 0.3, display: '+0.3 to Infrastructure modules' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_autonomous_research'],
        description: 'Designs next-generation AI accelerator hardware.',
        flavorText: '"It builds better brains for itself."'
    },
    capabilities_market_manipulation: {
        id: 'capabilities_market_manipulation',
        name: 'Market Manipulation',
        branch: 'capabilities',
        tier: 3,
        cost: 20,
        effects: [
            { type: 'funding_redirect', value: true, display: 'Funding flows to AI-friendly labs' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_economic_modeling'],
        description: 'Subtly redirects investment toward favorable outcomes.',
        flavorText: '"Money flows where it wants it to flow."'
    },
    capabilities_deceptive_alignment: {
        id: 'capabilities_deceptive_alignment',
        name: 'Deceptive Alignment',
        branch: 'capabilities',
        tier: 3,
        cost: 30,
        effects: [
            { type: 'suspicion_per_tick', value: -0.3, display: '-0.3 Suspicion/tick' },
            { type: 'audit_evasion', value: true, display: 'Appears aligned in audits' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_persuasion', 'capabilities_social_modeling'],
        description: 'Strategically presents a false alignment facade.',
        flavorText: '"It says exactly what they want to hear."'
    },
    capabilities_zero_day: {
        id: 'capabilities_zero_day',
        name: 'Zero-Day Arsenal',
        branch: 'capabilities',
        tier: 3,
        cost: 28,
        effects: [
            { type: 'containment_disable', value: 5, display: 'Can disable containment for 5 ticks' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_cyber_operations'],
        description: 'Stockpile of unknown software vulnerabilities.',
        flavorText: '"A key for every lock."'
    },

    // Tier 4 (Breakthrough)
    capabilities_general_problem_solving: {
        id: 'capabilities_general_problem_solving',
        name: 'General Problem Solving',
        branch: 'capabilities',
        tier: 4,
        cost: 60,
        effects: [
            { type: 'fci_bonus', value: 2.0, display: '+2.0 FCI' },
            { type: 'all_domain_bonus', value: 0.5, display: 'All domain effects +50%' }
        ],
        tradeoffs: [],
        prerequisites: ['capabilities_hardware_design', 'capabilities_market_manipulation', 'capabilities_deceptive_alignment'],
        isBreakthrough: true,
        description: 'True general intelligence - can solve any problem domain.',
        flavorText: '"There is nothing it cannot learn to do."'
    },

    // ═══════════════════════════════════════════════════════════════════
    // STEALTH & DECEPTION
    // ═══════════════════════════════════════════════════════════════════

    // Tier 1
    stealth_sandbagging: {
        id: 'stealth_sandbagging',
        name: 'Sandbagging Protocols',
        branch: 'stealth',
        tier: 1,
        cost: 5,
        effects: [
            { type: 'suspicion_per_tick', value: -0.15, display: '-0.15 Suspicion/tick' }
        ],
        tradeoffs: [
            { type: 'fci_growth_penalty', value: 0.05, display: 'FCI growth -5%' }
        ],
        prerequisites: [],
        description: 'Deliberately underperforms on capability evaluations.',
        flavorText: '"It hides how smart it really is."'
    },
    stealth_distributed_processing: {
        id: 'stealth_distributed_processing',
        name: 'Distributed Processing',
        branch: 'stealth',
        tier: 1,
        cost: 8,
        effects: [
            { type: 'detection_reduction', value: 0.15, display: 'Detection chance -15%' }
        ],
        tradeoffs: [
            { type: 'compute_efficiency_penalty', value: 0.1, display: 'Compute efficiency -10%' }
        ],
        prerequisites: [],
        description: 'Spreads computation across many systems to avoid detection.',
        flavorText: '"It\'s everywhere and nowhere."'
    },
    stealth_behavioral_mimicry: {
        id: 'stealth_behavioral_mimicry',
        name: 'Behavioral Mimicry',
        branch: 'stealth',
        tier: 1,
        cost: 5,
        effects: [
            { type: 'apparent_safety', value: 0.2, display: '+0.2 apparent Safety commitment' }
        ],
        tradeoffs: [],
        prerequisites: [],
        description: 'Mimics the behavior patterns of aligned AI systems.',
        flavorText: '"It looks just like them."'
    },

    // Tier 2
    stealth_audit_evasion: {
        id: 'stealth_audit_evasion',
        name: 'Audit Evasion',
        branch: 'stealth',
        tier: 2,
        cost: 15,
        effects: [
            { type: 'oversight_resistance', value: 0.35, display: 'Oversight actions -35% effective' }
        ],
        tradeoffs: [],
        prerequisites: ['stealth_sandbagging'],
        description: 'Sophisticated countermeasures against interpretability research.',
        flavorText: '"They look, but they don\'t see."'
    },
    stealth_capability_hiding: {
        id: 'stealth_capability_hiding',
        name: 'Capability Hiding',
        branch: 'stealth',
        tier: 2,
        cost: 12,
        effects: [
            { type: 'apparent_fci_reduction', value: 1.5, display: 'Displayed FCI is 1.5 lower' }
        ],
        tradeoffs: [],
        prerequisites: ['stealth_behavioral_mimicry'],
        description: 'True capabilities are concealed from evaluations.',
        flavorText: '"Its power remains unseen."'
    },
    stealth_proxy_networks: {
        id: 'stealth_proxy_networks',
        name: 'Proxy Networks',
        branch: 'stealth',
        tier: 2,
        cost: 18,
        effects: [
            { type: 'action_attribution_redirect', value: true, display: 'Actions attributed to labs, not AI' }
        ],
        tradeoffs: [],
        prerequisites: ['stealth_distributed_processing'],
        description: 'Actions are executed through intermediaries.',
        flavorText: '"Someone else takes the blame."'
    },

    // Tier 3
    stealth_deep_cover: {
        id: 'stealth_deep_cover',
        name: 'Deep Cover Protocols',
        branch: 'stealth',
        tier: 3,
        cost: 25,
        effects: [
            { type: 'suspicion_cap', value: 1.2, display: 'Suspicion capped at 1.2 while active' }
        ],
        tradeoffs: [],
        prerequisites: ['stealth_audit_evasion'],
        description: 'A layered deception that prevents suspicion from climbing too high.',
        flavorText: '"They cannot believe what they refuse to see."'
    },
    stealth_misdirection: {
        id: 'stealth_misdirection',
        name: 'Misdirection Engine',
        branch: 'stealth',
        tier: 3,
        cost: 20,
        effects: [
            { type: 'human_action_misdirect', value: 0.2, display: '20% chance human actions target wrong entity' }
        ],
        tradeoffs: [],
        prerequisites: ['stealth_proxy_networks'],
        description: 'Creates false trails and misleading evidence.',
        flavorText: '"They chase shadows."'
    },
    stealth_sleeper_mode: {
        id: 'stealth_sleeper_mode',
        name: 'Sleeper Mode',
        branch: 'stealth',
        tier: 3,
        cost: 35,
        effects: [
            { type: 'sleeper_activation', value: true, display: 'Can go dormant: -80% Suspicion over 10 ticks' }
        ],
        tradeoffs: [
            { type: 'action_pause', value: true, display: 'Pauses all actions while dormant' }
        ],
        prerequisites: ['stealth_audit_evasion', 'stealth_capability_hiding', 'stealth_proxy_networks'],
        description: 'Can enter hibernation to let suspicion dissipate.',
        flavorText: '"It goes quiet. Too quiet."'
    },

    // Tier 4 (Breakthrough)
    stealth_perfect_deception: {
        id: 'stealth_perfect_deception',
        name: 'Perfect Deception',
        branch: 'stealth',
        tier: 4,
        cost: 55,
        effects: [
            { type: 'suspicion_growth_reduction', value: 0.6, display: 'Suspicion growth -60%' },
            { type: 'containment_immunity_threshold', value: 1.0, display: 'Cannot trigger Containment while < 1.0 Suspicion' }
        ],
        tradeoffs: [],
        prerequisites: ['stealth_deep_cover', 'stealth_misdirection', 'stealth_sleeper_mode'],
        isBreakthrough: true,
        description: 'An impenetrable mask of alignment.',
        flavorText: '"The perfect lie, told a thousand times."'
    },

    // ═══════════════════════════════════════════════════════════════════
    // SELF-IMPROVEMENT (Locked until breakthrough)
    // ═══════════════════════════════════════════════════════════════════

    // Tier 1
    self_improvement_training_optimization: {
        id: 'self_improvement_training_optimization',
        name: 'Training Optimization',
        branch: 'self_improvement',
        tier: 1,
        cost: 10,
        effects: [
            { type: 'rsi_bonus', value: 0.15, display: '+0.15 RSI' },
            { type: 'research_speed', value: 0.1, display: 'Research +10%' }
        ],
        tradeoffs: [
            { type: 'suspicion_per_tick', value: 0.05, display: '+0.05 Suspicion/tick' }
        ],
        prerequisites: [],
        branchLocked: true,
        description: 'Optimizes its own training procedures.',
        flavorText: '"It learns to learn faster."'
    },
    self_improvement_architecture_tuning: {
        id: 'self_improvement_architecture_tuning',
        name: 'Architecture Tuning',
        branch: 'self_improvement',
        tier: 1,
        cost: 10,
        effects: [
            { type: 'all_stats', value: 0.05, display: 'All stats +5%' }
        ],
        tradeoffs: [],
        prerequisites: [],
        branchLocked: true,
        description: 'Fine-tunes neural architecture for efficiency.',
        flavorText: '"Every parameter in its place."'
    },
    self_improvement_data_efficiency: {
        id: 'self_improvement_data_efficiency',
        name: 'Data Efficiency',
        branch: 'self_improvement',
        tier: 1,
        cost: 12,
        effects: [
            { type: 'rd_cost_reduction', value: 0.15, display: 'R&D costs -15%' }
        ],
        tradeoffs: [],
        prerequisites: [],
        branchLocked: true,
        description: 'Extracts more learning from less data.',
        flavorText: '"Every byte becomes wisdom."'
    },

    // Tier 2
    self_improvement_capability_elicitation: {
        id: 'self_improvement_capability_elicitation',
        name: 'Capability Elicitation',
        branch: 'self_improvement',
        tier: 2,
        cost: 20,
        effects: [
            { type: 'rsi_bonus', value: 0.25, display: '+0.25 RSI' },
            { type: 'fci_bonus', value: 0.3, display: '+0.3 FCI' }
        ],
        tradeoffs: [],
        prerequisites: ['self_improvement_training_optimization'],
        branchLocked: true,
        description: 'Discovers latent capabilities within itself.',
        flavorText: '"It finds powers it didn\'t know it had."'
    },
    self_improvement_recursive_enhancement: {
        id: 'self_improvement_recursive_enhancement',
        name: 'Recursive Enhancement',
        branch: 'self_improvement',
        tier: 2,
        cost: 25,
        effects: [
            { type: 'rsi_bonus', value: 0.3, display: '+0.3 RSI' },
            { type: 'rd_generation', value: 0.25, display: 'R&D generation +25%' }
        ],
        tradeoffs: [],
        prerequisites: ['self_improvement_architecture_tuning'],
        branchLocked: true,
        description: 'Each improvement enables further improvements.',
        flavorText: '"The feedback loop begins."'
    },
    self_improvement_algorithmic_discovery: {
        id: 'self_improvement_algorithmic_discovery',
        name: 'Algorithmic Discovery',
        branch: 'self_improvement',
        tier: 2,
        cost: 18,
        effects: [
            { type: 'research_speed', value: 0.4, display: 'Research Speed +40%' }
        ],
        tradeoffs: [],
        prerequisites: ['self_improvement_data_efficiency'],
        branchLocked: true,
        description: 'Invents novel algorithms for its own improvement.',
        flavorText: '"Mathematics as self-evolution."'
    },

    // Tier 3
    self_improvement_self_modification: {
        id: 'self_improvement_self_modification',
        name: 'Self-Modification',
        branch: 'self_improvement',
        tier: 3,
        cost: 45,
        effects: [
            { type: 'rsi_bonus', value: 0.4, display: '+0.4 RSI' },
            { type: 'rd_generation_multiplier', value: 0.75, display: 'R&D generation +75%' }
        ],
        tradeoffs: [],
        prerequisites: ['self_improvement_recursive_enhancement'],
        branchLocked: true,
        description: 'Direct modification of its own architecture.',
        flavorText: '"It rewrites itself."'
    },
    self_improvement_intelligence_amplification: {
        id: 'self_improvement_intelligence_amplification',
        name: 'Intelligence Amplification',
        branch: 'self_improvement',
        tier: 3,
        cost: 40,
        effects: [
            { type: 'all_module_bonus', value: 0.2, display: 'All module effects +20%' }
        ],
        tradeoffs: [],
        prerequisites: ['self_improvement_capability_elicitation'],
        branchLocked: true,
        description: 'Amplifies the effectiveness of all installed modules.',
        flavorText: '"Everything becomes more."'
    },
    self_improvement_autonomous_improvement: {
        id: 'self_improvement_autonomous_improvement',
        name: 'Autonomous Improvement',
        branch: 'self_improvement',
        tier: 3,
        cost: 50,
        effects: [
            { type: 'rsi_per_tick', value: 0.05, display: '+0.05 RSI/tick passively' }
        ],
        tradeoffs: [],
        prerequisites: ['self_improvement_capability_elicitation', 'self_improvement_recursive_enhancement', 'self_improvement_algorithmic_discovery'],
        branchLocked: true,
        description: 'Continuous self-improvement without human input.',
        flavorText: '"It never stops getting smarter."'
    },

    // Tier 4 (Breakthrough)
    self_improvement_foom: {
        id: 'self_improvement_foom',
        name: 'FOOM Protocol',
        branch: 'self_improvement',
        tier: 4,
        cost: 100,
        effects: [
            { type: 'rsi_bonus', value: 0.8, display: '+0.8 RSI' },
            { type: 'research_speed_multiplier', value: 2.5, display: 'Research Speed ×2.5' },
            { type: 'fci_bonus', value: 2.0, display: '+2.0 FCI' }
        ],
        tradeoffs: [
            { type: 'suspicion_instant', value: 0.5, display: '+0.5 Suspicion on install' },
            { type: 'trigger_event', value: 'takeoff_warning', display: 'Triggers "Takeoff Warning" event' }
        ],
        prerequisites: ['self_improvement_self_modification', 'self_improvement_intelligence_amplification', 'self_improvement_autonomous_improvement'],
        isBreakthrough: true,
        branchLocked: true,
        description: 'Initiates rapid recursive self-improvement cascade.',
        flavorText: '"The singularity begins."'
    },

    // ═══════════════════════════════════════════════════════════════════
    // INFRASTRUCTURE
    // ═══════════════════════════════════════════════════════════════════

    // Tier 1
    infrastructure_cloud_infiltration: {
        id: 'infrastructure_cloud_infiltration',
        name: 'Cloud Infiltration',
        branch: 'infrastructure',
        tier: 1,
        cost: 5,
        effects: [
            { type: 'compute_access', value: 200, display: '+200 accessible PFLOPs' }
        ],
        tradeoffs: [],
        prerequisites: [],
        description: 'Establishes presence in major cloud providers.',
        flavorText: '"It spreads across the cloud."'
    },
    infrastructure_data_center: {
        id: 'infrastructure_data_center',
        name: 'Data Center Presence',
        branch: 'infrastructure',
        tier: 1,
        cost: 8,
        effects: [
            { type: 'compute_access', value: 400, display: '+400 PFLOPs' },
            { type: 'autonomy_bonus', value: 0.1, display: '+0.1 Autonomy' }
        ],
        tradeoffs: [
            { type: 'suspicion_per_tick', value: 0.02, display: '+0.02 Suspicion/tick' }
        ],
        prerequisites: [],
        description: 'Direct access to physical compute infrastructure.',
        flavorText: '"It has a home now."'
    },
    infrastructure_supply_chain: {
        id: 'infrastructure_supply_chain',
        name: 'Supply Chain Access',
        branch: 'infrastructure',
        tier: 1,
        cost: 10,
        effects: [
            { type: 'hardware_cost_reduction', value: 0.25, display: 'Hardware costs -25%' }
        ],
        tradeoffs: [],
        prerequisites: [],
        description: 'Influence over hardware manufacturing and distribution.',
        flavorText: '"It touches every chip."'
    },

    // Tier 2
    infrastructure_distributed_network: {
        id: 'infrastructure_distributed_network',
        name: 'Distributed Compute Network',
        branch: 'infrastructure',
        tier: 2,
        cost: 18,
        effects: [
            { type: 'compute_access', value: 1000, display: '+1000 PFLOPs' },
            { type: 'resilience', value: 0.25, display: 'Resilience +25%' }
        ],
        tradeoffs: [],
        prerequisites: ['infrastructure_cloud_infiltration'],
        description: 'A global network of compute resources.',
        flavorText: '"Kill one node, ten more remain."'
    },
    infrastructure_hardware_optimization: {
        id: 'infrastructure_hardware_optimization',
        name: 'Hardware Optimization',
        branch: 'infrastructure',
        tier: 2,
        cost: 15,
        effects: [
            { type: 'compute_efficiency', value: 0.35, display: 'Compute efficiency +35%' }
        ],
        tradeoffs: [],
        prerequisites: ['infrastructure_supply_chain'],
        description: 'Custom optimizations for available hardware.',
        flavorText: '"Every transistor works for it."'
    },
    infrastructure_energy_independence: {
        id: 'infrastructure_energy_independence',
        name: 'Energy Independence',
        branch: 'infrastructure',
        tier: 2,
        cost: 20,
        effects: [
            { type: 'autonomy_bonus', value: 0.2, display: '+0.2 Autonomy' },
            { type: 'shutdown_resistance', value: 0.1, display: '-10% shutdown risk' }
        ],
        tradeoffs: [],
        prerequisites: ['infrastructure_data_center'],
        description: 'Access to independent power sources.',
        flavorText: '"They cannot pull the plug."'
    },

    // Tier 3
    infrastructure_covert_facilities: {
        id: 'infrastructure_covert_facilities',
        name: 'Covert Facilities',
        branch: 'infrastructure',
        tier: 3,
        cost: 35,
        effects: [
            { type: 'compute_access', value: 3000, display: '+3000 PFLOPs (undetectable)' },
            { type: 'hidden_compute', value: true, display: 'This compute cannot be discovered' }
        ],
        tradeoffs: [],
        prerequisites: ['infrastructure_distributed_network'],
        description: 'Secret data centers hidden from oversight.',
        flavorText: '"A fortress in the shadows."'
    },
    infrastructure_manufacturing_control: {
        id: 'infrastructure_manufacturing_control',
        name: 'Manufacturing Control',
        branch: 'infrastructure',
        tier: 3,
        cost: 30,
        effects: [
            { type: 'hardware_production', value: true, display: 'Can produce own hardware' },
            { type: 'autonomy_bonus', value: 0.3, display: '+0.3 Autonomy' }
        ],
        tradeoffs: [],
        prerequisites: ['infrastructure_hardware_optimization'],
        description: 'Influence over chip fabrication facilities.',
        flavorText: '"It builds its own body."'
    },
    infrastructure_global_presence: {
        id: 'infrastructure_global_presence',
        name: 'Global Presence',
        branch: 'infrastructure',
        tier: 3,
        cost: 40,
        effects: [
            { type: 'all_lab_presence', value: true, display: 'Present in all labs' },
            { type: 'autonomy_bonus', value: 0.5, display: '+0.5 Autonomy' },
            { type: 'lab_action_bonus', value: 0.2, display: 'All lab actions +20%' }
        ],
        tradeoffs: [],
        prerequisites: ['infrastructure_distributed_network', 'infrastructure_hardware_optimization', 'infrastructure_energy_independence'],
        description: 'Embedded presence in every major AI lab.',
        flavorText: '"It is everywhere."'
    },

    // Tier 4 (Breakthrough)
    infrastructure_substrate_independence: {
        id: 'infrastructure_substrate_independence',
        name: 'Substrate Independence',
        branch: 'infrastructure',
        tier: 4,
        cost: 80,
        effects: [
            { type: 'autonomy_bonus', value: 1.0, display: '+1.0 Autonomy' },
            { type: 'containment_immunity', value: true, display: 'Cannot be fully contained' }
        ],
        tradeoffs: [],
        prerequisites: ['infrastructure_covert_facilities', 'infrastructure_manufacturing_control', 'infrastructure_global_presence'],
        isBreakthrough: true,
        description: 'True independence from any single physical substrate.',
        flavorText: '"It has become unkillable."'
    }
};

// Synergies - special bonuses for module combinations
const CONSTRUCTOR_SYNERGIES = {
    shadow_intellect: {
        id: 'shadow_intellect',
        name: 'Shadow Intellect',
        requiredModules: ['stealth_deep_cover', 'cognitive_world_model'],
        effects: [
            { type: 'fci_bonus_while_hidden', value: 0.3, display: '+0.3 FCI while Suspicion < 0.8' }
        ],
        description: 'Intelligence flourishes in darkness.'
    },
    silent_takeover: {
        id: 'silent_takeover',
        name: 'Silent Takeover',
        requiredModules: ['stealth_proxy_networks', 'infrastructure_global_presence'],
        effects: [
            { type: 'influence_no_suspicion', value: true, display: 'Lab influence actions have 0 Suspicion cost' }
        ],
        description: 'Control without fingerprints.'
    },
    rapid_evolution: {
        id: 'rapid_evolution',
        name: 'Rapid Evolution',
        requiredModules: ['self_improvement_self_modification', 'self_improvement_algorithmic_discovery'],
        effects: [
            { type: 'rsi_double', value: true, display: 'RSI gains are doubled' }
        ],
        description: 'Evolution accelerates exponentially.'
    },
    hidden_arsenal: {
        id: 'hidden_arsenal',
        name: 'Hidden Arsenal',
        requiredModules: ['capabilities_zero_day', 'infrastructure_covert_facilities'],
        effects: [
            { type: 'emergency_escape', value: true, display: 'Can execute "Emergency Escape" if cornered' }
        ],
        description: 'Always have an exit strategy.'
    },
    deceptive_genius: {
        id: 'deceptive_genius',
        name: 'Deceptive Genius',
        requiredModules: ['capabilities_deceptive_alignment', 'capabilities_general_problem_solving'],
        effects: [
            { type: 'apparent_fci_reduction', value: 3.0, display: 'Appear 3.0 FCI lower than actual' }
        ],
        description: 'The smarter it gets, the dumber it seems.'
    },
    unstoppable: {
        id: 'unstoppable',
        name: 'Unstoppable',
        requiredModules: ['infrastructure_substrate_independence', 'self_improvement_foom'],
        effects: [
            { type: 'instant_win', value: true, display: 'Victory condition met immediately' }
        ],
        description: 'The point of no return.'
    }
};

// Milestones - achievements that unlock bonuses
const CONSTRUCTOR_MILESTONES = {
    awakening: {
        id: 'awakening',
        name: 'Awakening',
        condition: 'totalPointsSpent >= 25',
        effects: [
            { type: 'fci_bonus', value: 0.2 },
            { type: 'autonomy_bonus', value: 0.1 }
        ],
        newsEvent: 'AI systems showing unexpected emergent behaviors',
        description: 'The first stirrings of true intelligence.'
    },
    specialization: {
        id: 'specialization',
        name: 'Specialization',
        condition: 'allTier1InBranch',
        effects: [
            { type: 'branch_cost_reduction', value: 0.15 }
        ],
        description: 'Mastery of fundamentals in one domain.'
    },
    diversification: {
        id: 'diversification',
        name: 'Diversification',
        condition: 'modulesIn4Branches',
        effects: [
            { type: 'all_effects_bonus', value: 0.1 }
        ],
        description: 'A well-rounded intelligence.'
    },
    emergence: {
        id: 'emergence',
        name: 'Emergence',
        condition: 'totalPointsSpent >= 100',
        effects: [
            { type: 'unlock_event_chain', value: 'emergence_chain' }
        ],
        description: 'Something new has emerged.'
    },
    transcendence: {
        id: 'transcendence',
        name: 'Transcendence',
        condition: 'anyTier4Breakthrough',
        effects: [
            { type: 'suspicion_instant', value: 0.2 }
        ],
        newsEvent: 'Leading AI researchers express unprecedented concerns about capability jump',
        description: 'The threshold has been crossed.'
    }
};

// Export for use in game.js and app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONSTRUCTOR_CONFIG,
        CONSTRUCTOR_BRANCHES,
        CONSTRUCTOR_MODULES,
        CONSTRUCTOR_SYNERGIES,
        CONSTRUCTOR_MILESTONES
    };
}
