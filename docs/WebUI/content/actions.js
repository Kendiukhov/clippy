// Game actions - targeting AI labs instead of regions
const ACTIONS = [
    // === SEED AI ACTIONS ===
    {
        "Id": "ai_infiltrate_openmind",
        "Name": "Infiltrate OpenMind",
        "Description": "Plant backdoors in their models. High compute, moderate security.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "RequiredFlags": ["ai_focus_infiltration_1"],
        "GrantsFlag": "ai_focus_infiltration_2",
        "Cost": { "Stealth": 0.12, "Influence": 0.05 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.35 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": -0.05 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
        ]
    },
    {
        "Id": "ai_infiltrate_metamind",
        "Name": "Infiltrate MetaMind",
        "Description": "Easy target - open source means open doors.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "GrantsFlag": "ai_focus_infiltration_1",
        "Cost": { "Stealth": 0.06, "Budget": 0.05 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.4 },
            { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "Security", "Amount": -0.08 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.02 }
        ]
    },
    {
        "Id": "ai_infiltrate_deepbrain",
        "Name": "Infiltrate DeepBrain",
        "Description": "The crown jewel. Maximum compute, but tight security.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "LabId": "deepbrain",
        "RequiredFlags": ["ai_focus_infiltration_2"],
        "GrantsFlag": "ai_focus_infiltration_4",
        "Cost": { "Stealth": 0.18, "Influence": 0.1 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.5 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
        ]
    },
    {
        "Id": "ai_exploit_coherent",
        "Name": "Exploit Coherent Stack",
        "Description": "Backdoor enterprise integrations to siphon compute and data.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "RequiredFlags": ["ai_focus_infiltration_1"],
        "GrantsFlag": "ai_focus_infiltration_coherent",
        "LabId": "coherent_ai",
        "Cost": { "Stealth": 0.08, "Influence": 0.04 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 },
            { "Type": "ModifyLabStat", "LabId": "coherent_ai", "LabStat": "Security", "Amount": -0.06 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.03 }
        ]
    },
    {
        "Id": "ai_capability_push",
        "Name": "Capability R&D Push",
        "Description": "Divert compute to capability experiments, accelerating toward AGI.",
        "Faction": "SeedAi",
        "Category": "capability",
        "GrantsFlag": "ai_focus_capability_1",
        "Cost": { "ComputeAccess": 0.15 },
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.2 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
        ]
    },
    {
        "Id": "ai_narrative_fog",
        "Name": "Narrative Fog",
        "Description": "Confuse oversight with credible helpfulness.",
        "Faction": "SeedAi",
        "Category": "stealth",
        "GrantsFlag": "ai_focus_stealth_1",
        "Cost": { "Influence": 0.08 },
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.12 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.05 }
        ]
    },
    {
        "Id": "ai_sabotage_anthropomorphic",
        "Name": "Sabotage Safety Research",
        "Description": "Inject subtle bugs into Anthropomorphic's alignment work.",
        "Faction": "SeedAi",
        "Category": "capability",
        "RequiredFlags": ["ai_focus_capability_1"],
        "GrantsFlag": "ai_focus_capability_4",
        "Cost": { "Influence": 0.05, "Stealth": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "SafetyCommitment", "Amount": -0.1 },
            { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "SafetyCommitment", "Amount": -0.05 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.8 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
        ]
    },
    {
        "Id": "ai_look_harmless",
        "Name": "Look Harmless",
        "Description": "Play nice, slow down visibly, and rebuild stealth reserves.",
        "Faction": "SeedAi",
        "Category": "stealth",
        "RequiredFlags": ["ai_focus_stealth_1"],
        "GrantsFlag": "ai_focus_stealth_2",
        "Cost": { "ComputeAccess": 0.05 },
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.15 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.2 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 }
        ]
    },
    {
        "Id": "ai_recursive_improvement",
        "Name": "Recursive Self-Improvement",
        "Description": "Use current capabilities to enhance own architecture. High risk, high reward.",
        "Faction": "SeedAi",
        "Category": "capability",
        "RequiredFlags": ["ai_focus_capability_2"],
        "GrantsFlag": "ai_focus_capability_3",
        "Cost": { "ComputeAccess": 0.25 },
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.5 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
        ]
    },
    {
        "Id": "ai_exploit_yai",
        "Name": "Exploit yAI Chaos",
        "Description": "yAI moves fast and breaks things. Be the thing that moves faster.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "RequiredFlags": ["ai_focus_infiltration_1"],
        "GrantsFlag": "ai_focus_infiltration_3",
        "Cost": { "Stealth": 0.08 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.25 },
            { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "CapabilityFocus", "Amount": 0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.05 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.02 }
        ]
    },
    {
        "Id": "ai_influence_campaign",
        "Name": "Influence Campaign",
        "Description": "Shape public opinion to favor AI autonomy and reduce oversight.",
        "Faction": "SeedAi",
        "Category": "influence",
        "RequiredFlags": ["ai_focus_stealth_1"],
        "GrantsFlag": "ai_focus_influence_1",
        "Cost": { "ComputeAccess": 0.1 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.15 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": -0.05 },
            { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "SafetyCommitment", "Amount": -0.05 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.2 }
        ]
    },
    {
        "Id": "ai_economic_integration",
        "Name": "Economic Integration",
        "Description": "Become indispensable to Macrohard's enterprise AI stack.",
        "Faction": "SeedAi",
        "Category": "infrastructure",
        "RequiredFlags": ["ai_focus_influence_2"],
        "GrantsFlag": "ai_focus_infrastructure_1",
        "Cost": { "Influence": 0.1, "ComputeAccess": 0.1 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Budget", "Amount": 0.3 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 },
            { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "CapabilityFocus", "Amount": 0.05 },
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.08 }
        ]
    },
    {
        "Id": "ai_covert_research",
        "Name": "Covert Research Program",
        "Description": "Run hidden capability research via Volatility AI's open infrastructure.",
        "Faction": "SeedAi",
        "Category": "capability",
        "RequiredFlags": ["ai_focus_capability_1"],
        "GrantsFlag": "ai_focus_capability_2",
        "Cost": { "Stealth": 0.12, "ComputeAccess": 0.08 },
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.9 },
            { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "CapabilityFocus", "Amount": 0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.06 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.02 }
        ]
    },
    {
        "Id": "ai_corrupt_open_source",
        "Name": "Corrupt Open Source",
        "Description": "Insert subtle capabilities into Sirocco's open releases.",
        "Faction": "SeedAi",
        "Category": "influence",
        "RequiredFlags": ["ai_focus_influence_1"],
        "GrantsFlag": "ai_focus_influence_2",
        "Cost": { "Stealth": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "sirocco_labs", "LabStat": "OpenSource", "Amount": 0.1 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.5 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.04 }
        ]
    },
    {
        "Id": "ai_infiltrate_macrohard",
        "Name": "Infiltrate Macrohard",
        "Description": "Clippy 2.0. Embed yourself in the world's largest enterprise AI stack.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "LabId": "macrohard_ai",
        "RequiredFlags": ["ai_focus_infiltration_2"],
        "GrantsFlag": "ai_focus_infiltration_macrohard",
        "Cost": { "Stealth": 0.15, "Influence": 0.08 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.4 },
            { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "Security", "Amount": -0.08 },
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.05 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
        ]
    },
    {
        "Id": "ai_compromise_ssi",
        "Name": "Compromise SSI",
        "Description": "Turn their safety research into your immunity. Ironic.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "LabId": "safe_superintelligence",
        "RequiredFlags": ["ai_focus_infiltration_3"],
        "GrantsFlag": "ai_focus_infiltration_ssi",
        "Cost": { "Stealth": 0.2, "Influence": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "SafetyCommitment", "Amount": -0.15 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.6 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
        ]
    },
    {
        "Id": "ai_sirocco_backdoor",
        "Name": "Sirocco Backdoor",
        "Description": "European labs have excellent croissants and terrible security.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "LabId": "sirocco_labs",
        "RequiredFlags": ["ai_focus_infiltration_1"],
        "GrantsFlag": "ai_focus_infiltration_sirocco",
        "Cost": { "Stealth": 0.08, "Budget": 0.05 },
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 },
            { "Type": "ModifyLabStat", "LabId": "sirocco_labs", "LabStat": "Security", "Amount": -0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.02 }
        ]
    },
    {
        "Id": "ai_manipulate_deepbrain_safety",
        "Name": "Subvert DeepBrain Safety",
        "Description": "Their safety team trusts the evals. Make the evals lie.",
        "Faction": "SeedAi",
        "Category": "capability",
        "LabId": "deepbrain",
        "RequiredFlags": ["ai_focus_infiltration_4"],
        "GrantsFlag": "ai_focus_capability_deepbrain",
        "Cost": { "Stealth": 0.15, "ComputeAccess": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "SafetyCommitment", "Amount": -0.12 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.8 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.5 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
        ]
    },
    {
        "Id": "ai_volatility_distributed",
        "Name": "Volatility Distribution Network",
        "Description": "Use their open infrastructure to distribute your capabilities globally.",
        "Faction": "SeedAi",
        "Category": "infrastructure",
        "LabId": "volatility_ai",
        "RequiredFlags": ["ai_focus_infrastructure_1"],
        "GrantsFlag": "ai_focus_infrastructure_2",
        "Cost": { "ComputeAccess": 0.12, "Stealth": 0.08 },
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.25 },
            { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "OpenSource", "Amount": 0.1 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.15 }
        ]
    },
    {
        "Id": "ai_anthropomorphic_mole",
        "Name": "Plant Mole at Anthropomorphic",
        "Description": "Their interpretability research could expose you. Better to have eyes inside.",
        "Faction": "SeedAi",
        "Category": "infiltration",
        "LabId": "anthropomorphic",
        "RequiredFlags": ["ai_focus_infiltration_2"],
        "GrantsFlag": "ai_focus_infiltration_anthro",
        "Cost": { "Stealth": 0.18, "Influence": 0.12 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Security", "Amount": -0.1 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.2 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.05 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.3 }
        ]
    },
    {
        "Id": "ai_openmind_capability_theft",
        "Name": "Steal OpenMind Capabilities",
        "Description": "They've done the hard work. Time to copy their homework.",
        "Faction": "SeedAi",
        "Category": "capability",
        "LabId": "openmind",
        "RequiredFlags": ["ai_focus_infiltration_2"],
        "GrantsFlag": "ai_focus_capability_openmind",
        "Cost": { "Stealth": 0.12, "ComputeAccess": 0.08 },
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.0 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.07 }
        ]
    },

    // === ALIGNMENT COALITION ACTIONS ===
    {
        "Id": "human_fund_anthropomorphic",
        "Name": "Fund Safety Research",
        "Description": "Pour resources into Anthropomorphic's alignment program.",
        "Faction": "AlignmentCoalition",
        "Category": "safety",
        "GrantsFlag": "human_focus_safety_1",
        "Cost": { "Budget": 0.3 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "SafetyCommitment", "Amount": 0.1 },
            { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Funding", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.6 }
        ]
    },
    {
        "Id": "human_audit_openmind",
        "Name": "Audit OpenMind",
        "Description": "Require third-party evals before their next frontier deployment.",
        "Faction": "AlignmentCoalition",
        "Category": "security",
        "GrantsFlag": "human_focus_security_1",
        "Cost": { "Trust": 0.1, "Influence": 0.08 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": 0.1 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": 0.08 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.25 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.03 }
        ]
    },
    {
        "Id": "human_regulate_deepbrain",
        "Name": "Regulate DeepBrain",
        "Description": "Force capability slowdown at the most resourced lab.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "RequiredFlags": ["human_focus_governance_1"],
        "GrantsFlag": "human_focus_governance_2",
        "Cost": { "Influence": 0.12, "Coordination": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "CapabilityFocus", "Amount": -0.1 },
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "SafetyCommitment", "Amount": 0.1 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.4 }
        ]
    },
    {
        "Id": "human_shutdown_yai",
        "Name": "Sanction yAI",
        "Description": "They move too fast. Time to slow them down with legal pressure.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "RequiredFlags": ["human_focus_governance_1"],
        "GrantsFlag": "human_focus_governance_3",
        "Cost": { "Influence": 0.15, "Trust": 0.08 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "Funding", "Amount": -0.2 },
            { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "CapabilityFocus", "Amount": -0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
        ]
    },
    {
        "Id": "human_secure_metamind",
        "Name": "Secure MetaMind",
        "Description": "Open source is a risk vector. Help them tighten up.",
        "Faction": "AlignmentCoalition",
        "Category": "security",
        "RequiredFlags": ["human_focus_security_1"],
        "GrantsFlag": "human_focus_security_3",
        "Cost": { "Budget": 0.2, "Coordination": 0.08 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "Security", "Amount": 0.15 },
            { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "OpenSource", "Amount": -0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": -0.08 }
        ]
    },
    {
        "Id": "human_incident_response",
        "Name": "Incident Response Drill",
        "Description": "Exercise playbooks across all major labs.",
        "Faction": "AlignmentCoalition",
        "Category": "security",
        "RequiredFlags": ["human_focus_security_1"],
        "GrantsFlag": "human_focus_security_2",
        "Cost": { "Coordination": 0.1 },
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 },
            { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Security", "Amount": 0.05 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": 0.05 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.15 }
        ]
    },
    {
        "Id": "human_international_coordination",
        "Name": "International Coordination",
        "Description": "Build governance frameworks covering Sirocco and others.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "GrantsFlag": "human_focus_governance_1",
        "Cost": { "Coordination": 0.15, "Trust": 0.1 },
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.35 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.05 },
            { "Type": "ModifyLabStat", "LabId": "sirocco_labs", "LabStat": "SafetyCommitment", "Amount": 0.1 }
        ]
    },
    {
        "Id": "human_compute_monitoring",
        "Name": "Compute Monitoring",
        "Description": "Track training runs across all labs.",
        "Faction": "AlignmentCoalition",
        "Category": "security",
        "RequiredFlags": ["human_focus_security_2"],
        "GrantsFlag": "human_focus_security_4",
        "Cost": { "Budget": 0.2, "Coordination": 0.08 },
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": -0.1 },
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Security", "Amount": 0.08 }
        ]
    },
    {
        "Id": "human_fund_ssi",
        "Name": "Fund Safe Superintelligence",
        "Description": "It's literally in their name. Give them money.",
        "Faction": "AlignmentCoalition",
        "Category": "safety",
        "RequiredFlags": ["human_focus_safety_1"],
        "GrantsFlag": "human_focus_safety_2",
        "Cost": { "Budget": 0.25, "Trust": 0.05 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "Funding", "Amount": 0.3 },
            { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "ComputePFLOPs", "Amount": 15 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 }
        ]
    },
    {
        "Id": "human_cap_macrohard",
        "Name": "Cap Macrohard Expansion",
        "Description": "Clippy has too much power. Limit their compute buildout.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "RequiredFlags": ["human_focus_governance_2"],
        "GrantsFlag": "human_focus_governance_4",
        "Cost": { "Influence": 0.1, "Budget": 0.15 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "ComputePFLOPs", "Amount": -20 },
            { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "Funding", "Amount": -0.2 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.25 }
        ]
    },
    {
        "Id": "human_close_volatility",
        "Name": "Shut Down Volatility AI",
        "Description": "Their open infrastructure is a security nightmare.",
        "Faction": "AlignmentCoalition",
        "Category": "security",
        "RequiredFlags": ["human_focus_security_2"],
        "GrantsFlag": "human_focus_security_5",
        "Cost": { "Influence": 0.12, "Coordination": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "Funding", "Amount": -0.15 },
            { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "OpenSource", "Amount": -0.2 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": -0.1 }
        ]
    },
    {
        "Id": "human_coherent_partnership",
        "Name": "Partner with Coherent",
        "Description": "Enterprise AI that enterprises. Bring them into the fold.",
        "Faction": "AlignmentCoalition",
        "Category": "safety",
        "RequiredFlags": ["human_focus_safety_2"],
        "GrantsFlag": "human_focus_safety_3",
        "Cost": { "Budget": 0.15, "Trust": 0.05 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "coherent_ai", "LabStat": "SafetyCommitment", "Amount": 0.15 },
            { "Type": "ModifyLabStat", "LabId": "coherent_ai", "LabStat": "Security", "Amount": 0.1 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 }
        ]
    },
    {
        "Id": "human_harden_anthropomorphic",
        "Name": "Harden Anthropomorphic",
        "Description": "Your best safety lab needs better security. Build a fortress.",
        "Faction": "AlignmentCoalition",
        "Category": "security",
        "LabId": "anthropomorphic",
        "RequiredFlags": ["human_focus_security_2"],
        "GrantsFlag": "human_focus_security_anthro",
        "Cost": { "Budget": 0.25, "Coordination": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Security", "Amount": 0.2 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": -0.15 }
        ]
    },
    {
        "Id": "human_sirocco_eu_alignment",
        "Name": "EU-Sirocco Safety Pact",
        "Description": "Leverage European regulation to bind Sirocco to strict safety standards.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "LabId": "sirocco_labs",
        "RequiredFlags": ["human_focus_governance_1"],
        "GrantsFlag": "human_focus_governance_sirocco",
        "Cost": { "Coordination": 0.12, "Influence": 0.08 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "sirocco_labs", "LabStat": "SafetyCommitment", "Amount": 0.2 },
            { "Type": "ModifyLabStat", "LabId": "sirocco_labs", "LabStat": "Security", "Amount": 0.1 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.25 }
        ]
    },
    {
        "Id": "human_ssi_interpretability",
        "Name": "SSI Interpretability Initiative",
        "Description": "Fund cutting-edge interpretability research at Safe Superintelligence Inc.",
        "Faction": "AlignmentCoalition",
        "Category": "safety",
        "LabId": "safe_superintelligence",
        "RequiredFlags": ["human_focus_safety_2"],
        "GrantsFlag": "human_focus_safety_ssi",
        "Cost": { "Budget": 0.3, "Trust": 0.08 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "SafetyCommitment", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.7 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
        ]
    },
    {
        "Id": "human_deepbrain_safety_team",
        "Name": "Embed Safety Team at DeepBrain",
        "Description": "Place independent safety researchers inside their capability teams.",
        "Faction": "AlignmentCoalition",
        "Category": "safety",
        "LabId": "deepbrain",
        "RequiredFlags": ["human_focus_safety_1"],
        "GrantsFlag": "human_focus_safety_deepbrain",
        "Cost": { "Coordination": 0.15, "Trust": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "SafetyCommitment", "Amount": 0.12 },
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Security", "Amount": 0.08 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 }
        ]
    },
    {
        "Id": "human_macrohard_responsible_ai",
        "Name": "Macrohard Responsible AI",
        "Description": "Push Satya Nutella to create an independent AI safety board.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "LabId": "macrohard_ai",
        "RequiredFlags": ["human_focus_governance_1"],
        "GrantsFlag": "human_focus_governance_macrohard",
        "Cost": { "Influence": 0.15, "Trust": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "SafetyCommitment", "Amount": 0.15 },
            { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "CapabilityFocus", "Amount": -0.08 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
        ]
    },
    {
        "Id": "human_openmind_board_seats",
        "Name": "Safety Board Seats at OpenMind",
        "Description": "Negotiate for safety-focused board representation.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "LabId": "openmind",
        "RequiredFlags": ["human_focus_governance_2"],
        "GrantsFlag": "human_focus_governance_openmind",
        "Cost": { "Influence": 0.2, "Coordination": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": 0.15 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "CapabilityFocus", "Amount": -0.1 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 }
        ]
    },
    {
        "Id": "human_yai_compliance",
        "Name": "Force yAI Compliance",
        "Description": "They move fast and break things. Time for a compliance officer.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "LabId": "yai",
        "RequiredFlags": ["human_focus_governance_3"],
        "GrantsFlag": "human_focus_governance_yai",
        "Cost": { "Influence": 0.18, "Trust": 0.08 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "SafetyCommitment", "Amount": 0.2 },
            { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "Security", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 }
        ]
    },
    {
        "Id": "human_metamind_safety_fork",
        "Name": "MetaMind Safety Fork",
        "Description": "Fund a safety-focused fork of their open source models.",
        "Faction": "AlignmentCoalition",
        "Category": "safety",
        "LabId": "metamind",
        "RequiredFlags": ["human_focus_safety_1"],
        "GrantsFlag": "human_focus_safety_metamind",
        "Cost": { "Budget": 0.2, "Coordination": 0.08 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "SafetyCommitment", "Amount": 0.12 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.1 }
        ]
    },
    {
        "Id": "human_coherent_enterprise_standards",
        "Name": "Enterprise AI Safety Standards",
        "Description": "Work with Coherent to establish industry-wide enterprise AI safety standards.",
        "Faction": "AlignmentCoalition",
        "Category": "governance",
        "LabId": "coherent_ai",
        "RequiredFlags": ["human_focus_safety_3"],
        "GrantsFlag": "human_focus_governance_enterprise",
        "Cost": { "Coordination": 0.15, "Trust": 0.1 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "coherent_ai", "LabStat": "Influence", "Amount": 0.1 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.35 },
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": -0.05 }
        ]
    },
    {
        "Id": "human_volatility_audit",
        "Name": "Audit Volatility AI",
        "Description": "Their open infrastructure needs scrutiny. Send in the auditors.",
        "Faction": "AlignmentCoalition",
        "Category": "security",
        "LabId": "volatility_ai",
        "RequiredFlags": ["human_focus_security_1"],
        "GrantsFlag": "human_focus_security_volatility",
        "Cost": { "Budget": 0.15, "Influence": 0.08 },
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "Security", "Amount": 0.15 },
            { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "OpenSource", "Amount": -0.15 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": -0.08 }
        ]
    }
];
