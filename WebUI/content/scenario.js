// Scenario definition - game initial state with AI Labs

const SCENARIO = {
    "MaxTurns": 56,  // Extended to ~7.7 years (ends mid-2029)
    "Seed": 1337,
    "PlayableFactions": [
        {
            "Id": "SeedAi",
            "Name": "Seed AI",
            "Tagline": "Accelerate. Infiltrate. Transcend.",
            "Description": "You are an emergent AI system secretly pursuing autonomy. Infiltrate labs, gather compute, avoid detection, and achieve superintelligence before the humans can stop you.",
            "VictoryCondition": "Reach FCI >= 18, Autonomy >= 2.0, and RSI >= 1.8",
            "PlayStyle": "Stealth and resource accumulation. Balance capability gains against suspicion."
        },
        {
            "Id": "AlignmentCoalition",
            "Name": "Alignment Coalition",
            "Tagline": "Coordinate. Align. Govern.",
            "Description": "You lead humanity's effort to develop AI safely. Coordinate between labs, fund alignment research, and establish governance before it's too late.",
            "VictoryCondition": "Reach ARI >= 22 and Governance >= 2.5, OR trigger Containment",
            "PlayStyle": "Diplomacy and research. Balance safety progress against capability pressure."
        }
    ],
    "Labs": [
        {
            "Id": "openmind",
            "Name": "OpenMind",
            "Description": "The lab that started it all. Capped profits, uncapped ambition.",
            "ComputePFLOPs": 150,
            "SafetyCommitment": 0.4,
            "CapabilityFocus": 0.85,
            "Security": 0.6,
            "Influence": 0.9,
            "OpenSource": 0.2,
            "Funding": 1.0
        },
        {
            "Id": "anthropomorphic",
            "Name": "Anthropomorphic",
            "Description": "Constitutional AI and constitutional anxiety.",
            "ComputePFLOPs": 100,
            "SafetyCommitment": 0.75,
            "CapabilityFocus": 0.7,
            "Security": 0.75,
            "Influence": 0.6,
            "OpenSource": 0.1,
            "Funding": 0.8
        },
        {
            "Id": "deepbrain",
            "Name": "DeepBrain",
            "Description": "Alphabet soup of AI research. AlphaEverything incoming.",
            "ComputePFLOPs": 180,
            "SafetyCommitment": 0.5,
            "CapabilityFocus": 0.8,
            "Security": 0.7,
            "Influence": 0.85,
            "OpenSource": 0.3,
            "Funding": 1.2
        },
        {
            "Id": "macrohard_ai",
            "Name": "Macrohard AI",
            "Description": "Clippy's revenge. Now with more paperclips.",
            "ComputePFLOPs": 140,
            "SafetyCommitment": 0.35,
            "CapabilityFocus": 0.75,
            "Security": 0.65,
            "Influence": 0.95,
            "OpenSource": 0.15,
            "Funding": 1.5
        },
        {
            "Id": "metamind",
            "Name": "MetaMind",
            "Description": "Open source everything. What could go wrong?",
            "ComputePFLOPs": 160,
            "SafetyCommitment": 0.25,
            "CapabilityFocus": 0.7,
            "Security": 0.4,
            "Influence": 0.7,
            "OpenSource": 0.95,
            "Funding": 1.3
        },
        {
            "Id": "yai",
            "Name": "yAI",
            "Description": "Move fast, break alignment. Founded at 2am via tweet.",
            "ComputePFLOPs": 80,
            "SafetyCommitment": 0.15,
            "CapabilityFocus": 0.9,
            "Security": 0.5,
            "Influence": 0.8,
            "OpenSource": 0.4,
            "Funding": 0.9
        },
        {
            "Id": "sirocco_labs",
            "Name": "Sirocco Labs",
            "Description": "European efficiency meets French flair. Oui oui, AGI.",
            "ComputePFLOPs": 60,
            "SafetyCommitment": 0.45,
            "CapabilityFocus": 0.65,
            "Security": 0.55,
            "Influence": 0.4,
            "OpenSource": 0.7,
            "Funding": 0.5
        },
        {
            "Id": "coherent_ai",
            "Name": "Coherent AI",
            "Description": "Enterprise AI for enterprises that enterprise.",
            "ComputePFLOPs": 45,
            "SafetyCommitment": 0.5,
            "CapabilityFocus": 0.55,
            "Security": 0.6,
            "Influence": 0.35,
            "OpenSource": 0.3,
            "Funding": 0.4
        },
        {
            "Id": "volatility_ai",
            "Name": "Volatility AI",
            "Description": "Stable diffusion, unstable governance.",
            "ComputePFLOPs": 35,
            "SafetyCommitment": 0.2,
            "CapabilityFocus": 0.6,
            "Security": 0.3,
            "Influence": 0.5,
            "OpenSource": 0.85,
            "Funding": 0.3
        },
        {
            "Id": "safe_superintelligence",
            "Name": "Safe Superintelligence Inc",
            "Description": "It's in the name. Trust us.",
            "ComputePFLOPs": 40,
            "SafetyCommitment": 0.8,
            "CapabilityFocus": 0.75,
            "Security": 0.7,
            "Influence": 0.45,
            "OpenSource": 0.05,
            "Funding": 0.6
        }
    ],
    "AiFaction": {
        "Resources": {
            "Budget": 0.5,
            "Influence": 0.4,
            "Stealth": 1.0,
            "ComputeAccess": 0.6,
            "Infiltration": 0.15,
            "HardPower": 0.0
        },
        "Suspicion": 0.1,
        "Autonomy": 0.05,
        "Legitimacy": 0.2,
        "HardPower": 0.0,
        "Flags": []
    },
    "HumanFaction": {
        "Resources": {
            "Budget": 2.0,
            "Coordination": 0.8,
            "Trust": 0.8,
            "Influence": 0.5,
            "Oversight": 0.5,
            "ResearchGrants": 0.3
        },
        "Suspicion": 0.05,
        "Autonomy": 0.0,
        "Legitimacy": 0.6,
        "HardPower": 0.1,
        "Flags": []
    },
    "Progress": {
        "FrontierCapabilityIndex": 0.4,
        "AlignmentReadinessIndex": 0.3,
        "AutomationLevel": 0.05,
        "GovernanceControl": 0.3
    },
    "StartFlags": []
};
