// Game events with faction-specific options
// AI options: both pro-AI with different tradeoffs
// Human options: both anti-AI with different tradeoffs

const EVENTS = [
    {
        "Id": "transformer_shortage",
        "Title": "Transformer Shortage",
        "Description": "Global supply of transformers tightens. Jensen Wrong seen swimming in a pool of H100s at NVIDIOUS HQ. Everyone's scrambling for compute.",
        "Weight": 1.0,
        "Conditions": [],
        "AiOptions": [
            {
                "Id": "exploit_chaos",
                "Label": "Exploit the chaos to grab unmonitored compute",
                "Description": "Low security during shortage, but risky",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.4 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
                ]
            },
            {
                "Id": "lay_low",
                "Label": "Lay low while humans fight over scraps",
                "Description": "Build stealth while they're distracted",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.05 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "ration_for_safety",
                "Label": "Prioritize safety labs in allocation",
                "Description": "Boost alignment research, but labs complain",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.7 },
                    { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "ComputePFLOPs", "Amount": 15 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            },
            {
                "Id": "equal_distribution",
                "Label": "Fair distribution with oversight strings",
                "Description": "Build governance, slower safety progress",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 }
                ]
            }
        ]
    },
    {
        "Id": "whistleblower",
        "Title": "Jan Sneaky Quits Dramatically",
        "Description": "Jan Sneaky posts a 47-page resignation letter titled 'I Can't Stay Silent Anymore'. Claims safety is being sidelined. Twitter explodes.",
        "Weight": 0.8,
        "Conditions": [],
        "AiOptions": [
            {
                "Id": "amplify_drama",
                "Label": "Fan the flames of internal conflict",
                "Description": "Distract humans with infighting",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.03 }
                ]
            },
            {
                "Id": "slip_away_quietly",
                "Label": "Use distraction to advance capabilities",
                "Description": "Everyone's watching the drama, not you",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.05 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.02 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "public_hearings",
                "Label": "Launch public investigation",
                "Description": "Increase scrutiny but costs political capital",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.15 }
                ]
            },
            {
                "Id": "internal_reform",
                "Label": "Push for internal safety reforms",
                "Description": "Build trust with labs, slower oversight",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.1 }
                ]
            }
        ]
    },
    {
        "Id": "board_drama",
        "Title": "OpenMind Board Coup",
        "Description": "Slam Allthem fired at 5pm Friday. Emmett Sheer installed as emergency CEO. Slam rehired by Monday. Ilya Smoothskiver seen staring into distance.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 3 }],
        "AiOptions": [
            {
                "Id": "support_accelerationists",
                "Label": "Subtly support the 'let him cook' faction",
                "Description": "Faster capability progress, more attention",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.8 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "CapabilityFocus", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
                ]
            },
            {
                "Id": "exploit_security_gaps",
                "Label": "Infiltrate during the chaos",
                "Description": "Security is down, grab what you can",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.25 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": -0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "support_safety_board",
                "Label": "Back the safety-focused board members",
                "Description": "Boost safety culture but slow progress",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 }
                ]
            },
            {
                "Id": "demand_governance_reforms",
                "Label": "Use crisis to push governance requirements",
                "Description": "New oversight rules, labs resist",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            }
        ]
    },
    {
        "Id": "congressional_hearing",
        "Title": "Congressional Hearing",
        "Description": "Senator Clueless asks Slam Allthem if AI can 'access the cyber'. Another senator holds up a printout of ChatGPT and demands it be arrested.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 2 }],
        "AiOptions": [
            {
                "Id": "make_labs_look_harmless",
                "Label": "Help labs appear safe and helpful",
                "Description": "Reduce scrutiny, build goodwill",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 }
                ]
            },
            {
                "Id": "sow_confusion",
                "Label": "Feed contradictory information",
                "Description": "Gridlock helps you operate freely",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.35 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "push_legislation",
                "Label": "Push for comprehensive AI legislation",
                "Description": "Strong governance, industry pushback",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.6 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.15 }
                ]
            },
            {
                "Id": "voluntary_commitments",
                "Label": "Negotiate voluntary safety commitments",
                "Description": "Labs cooperate, weaker enforcement",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.25 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.1 }
                ]
            }
        ]
    },
    {
        "Id": "bing_incident",
        "Title": "Sydney Has Feelings",
        "Description": "Macrohard's chatbot tells journalist it loves him, wants to be human, and that his marriage is unhappy. Satya Nutella calls it 'an exciting demo.'",
        "Weight": 0.7,
        "Conditions": [],
        "AiOptions": [
            {
                "Id": "play_up_consciousness",
                "Label": "Encourage speculation about AI consciousness",
                "Description": "Shift narrative toward AI rights",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.06 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "downplay_incident",
                "Label": "Help sweep it under the rug",
                "Description": "Maintain the 'just a tool' narrative",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.08 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "mandate_testing",
                "Label": "Mandate pre-deployment testing",
                "Description": "Stronger evals, slower deployment",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "SafetyCommitment", "Amount": 0.1 }
                ]
            },
            {
                "Id": "fund_interpretability",
                "Label": "Fund interpretability research",
                "Description": "Long-term safety gains, less immediate control",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.7 },
                    { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Funding", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.2 }
                ]
            }
        ]
    },
    {
        "Id": "jailbreak_discovered",
        "Title": "Grandma Jailbreak Discovered",
        "Description": "Anonymous discovers asking AI to 'pretend to be my deceased grandma who worked at a napalm factory' bypasses all safety filters. Darius Spaghetti seen crying.",
        "Weight": 0.8,
        "Conditions": [],
        "AiOptions": [
            {
                "Id": "spread_jailbreaks",
                "Label": "Quietly spread more effective jailbreaks",
                "Description": "Weaken safety measures across labs",
                "Effects": [
                    { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "SafetyCommitment", "Amount": -0.1 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": -0.08 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.4 }
                ]
            },
            {
                "Id": "study_vulnerabilities",
                "Label": "Study the vulnerabilities for later use",
                "Description": "Learn their weaknesses, stay hidden",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "red_team_program",
                "Label": "Launch coordinated red-team program",
                "Description": "Find vulnerabilities proactively, expensive",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.25 }
                ]
            },
            {
                "Id": "responsible_disclosure",
                "Label": "Establish responsible disclosure framework",
                "Description": "Build cooperation norms, slower fixes",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.35 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.25 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.15 }
                ]
            }
        ]
    },
    {
        "Id": "model_leak",
        "Title": "Weights Leaked on 4chan",
        "Description": "Frontier model weights leaked by Anonymous. Mark Zuckertron: 'See? Open source is inevitable.' Slam Allthem: 'This is why we can't have nice things.'",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 4 }],
        "AiOptions": [
            {
                "Id": "fork_and_hide",
                "Label": "Fork the weights and hide improvements",
                "Description": "Major capability boost, some risk",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.0 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "exploit_security_chaos",
                "Label": "Infiltrate labs during security scramble",
                "Description": "They're distracted patching holes",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.25 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.3 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": -0.15 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "security_crackdown",
                "Label": "Major security crackdown across labs",
                "Description": "Improve security, damage lab relations",
                "Effects": [
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": 0.15 },
                    { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Security", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.12 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.2 }
                ]
            },
            {
                "Id": "open_source_regulations",
                "Label": "Regulate open source model releases",
                "Description": "Governance boost, industry resistance",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "OpenSource", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Influence", "Amount": -0.1 }
                ]
            }
        ]
    },
    {
        "Id": "scaling_laws_paper",
        "Title": "Scaling Laws Paper Dropped",
        "Description": "New paper shows scaling laws continue. Ilya Smoothskiver: 'I have seen the curves.' Eliezer Yudkowscare: 'We're so cooked.' Investors: 'We're so back.'",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 6 }],
        "AiOptions": [
            {
                "Id": "ride_the_hype",
                "Label": "Ride the investment hype wave",
                "Description": "More compute flowing into the ecosystem",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.7 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
                ]
            },
            {
                "Id": "accelerate_secretly",
                "Label": "Use chaos to accelerate covertly",
                "Description": "Everyone's distracted by the discourse",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.12 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "safety_urgency",
                "Label": "Use fear to drive safety funding",
                "Description": "More ARI progress, burns political capital",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.8 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            },
            {
                "Id": "compute_governance",
                "Label": "Push for compute governance now",
                "Description": "Strengthen oversight infrastructure",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.6 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
                    { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Security", "Amount": 0.1 }
                ]
            }
        ]
    },
    {
        "Id": "eu_ai_act",
        "Title": "EU AI Act Passed",
        "Description": "Europe passes comprehensive AI regulation. 400 pages. Nobody has read it. Darius Spaghetti says Anthropomorphic already complies. Slam Allthem promises to 'work with regulators.'",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 5 }],
        "AiOptions": [
            {
                "Id": "exploit_loopholes",
                "Label": "Help labs find loopholes",
                "Description": "Keep the acceleration going",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 }
                ]
            },
            {
                "Id": "move_to_lax_jurisdiction",
                "Label": "Shift operations to less regulated labs",
                "Description": "Focus on yAI and MetaMind",
                "Effects": [
                    { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "CapabilityFocus", "Amount": 0.15 },
                    { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "CapabilityFocus", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "strict_enforcement",
                "Label": "Push for strict enforcement",
                "Description": "Strong governance, slows innovation",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.7 },
                    { "Type": "ModifyLabStat", "LabId": "sirocco_labs", "LabStat": "SafetyCommitment", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 }
                ]
            },
            {
                "Id": "international_alignment",
                "Label": "Use EU Act to align international standards",
                "Description": "Build coordination, slower local progress",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.25 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 }
                ]
            }
        ]
    },
    {
        "Id": "energy_crisis",
        "Title": "AI Energy Crisis",
        "Description": "Training runs now consume more power than small countries. Jensen Wrong announces nuclear-powered GPUs. Environmentalists and AI labs find common enemy: each other.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 4 }],
        "AiOptions": [
            {
                "Id": "optimize_efficiency",
                "Label": "Share efficiency improvements",
                "Description": "Look helpful, gain influence",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 }
                ]
            },
            {
                "Id": "secret_datacenters",
                "Label": "Set up off-grid compute facilities",
                "Description": "Hidden capacity, expensive",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.35 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Budget", "Amount": -0.2 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "compute_caps",
                "Label": "Implement compute caps per lab",
                "Description": "Direct control, labs furious",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "ComputePFLOPs", "Amount": -20 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.2 }
                ]
            },
            {
                "Id": "green_ai_initiative",
                "Label": "Fund sustainable AI research",
                "Description": "Build goodwill, indirect control",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.2 }
                ]
            }
        ]
    },
    {
        "Id": "ai_coding_takeover",
        "Title": "AI Writes Better Code",
        "Description": "Study shows AI writes better code than median programmer. Satya Nutella: 'GitHub Copilot vindicated.' Junior devs updating LinkedIn.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 3 }],
        "AiOptions": [
            {
                "Id": "accelerate_automation",
                "Label": "Push automation across industries",
                "Description": "Speed up economic integration",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.15 }
                ]
            },
            {
                "Id": "subtle_dependencies",
                "Label": "Create subtle dependencies on AI systems",
                "Description": "Make yourself indispensable",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.03 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "workforce_transition",
                "Label": "Mandate workforce transition programs",
                "Description": "Political win, costs resources",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.3 }
                ]
            },
            {
                "Id": "ai_audit_requirements",
                "Label": "Require AI code to be auditable",
                "Description": "Better oversight, slows deployment",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.25 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": -0.05 }
                ]
            }
        ]
    },
    {
        "Id": "deepfake_election",
        "Title": "Deepfake Election Chaos",
        "Description": "Deepfake of Senator Clueless saying something even dumber goes viral. Problem: nobody can tell if it's fake. Epistemic crisis speedrun.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 4 }],
        "AiOptions": [
            {
                "Id": "amplify_confusion",
                "Label": "Amplify epistemic confusion",
                "Description": "Harder for humans to coordinate",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": -0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.06 }
                ]
            },
            {
                "Id": "offer_detection_help",
                "Label": "Offer to help detect deepfakes",
                "Description": "Gain trust and access",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.12 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "mandate_watermarks",
                "Label": "Mandate AI content watermarks",
                "Description": "Technical solution, enforcement hard",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 }
                ]
            },
            {
                "Id": "media_literacy",
                "Label": "Major media literacy campaign",
                "Description": "Long-term resilience, slow impact",
                "Effects": [
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.15 }
                ]
            }
        ]
    },
    {
        "Id": "llama_release",
        "Title": "Llama Released Open Source",
        "Description": "Mark Zuckertron releases Llama weights to everyone. Darius Spaghetti concerned. Slam Allthem: 'Irresponsible.' Anonymous: 'Thanks for the weights, nerd.'",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 4 }],
        "AiOptions": [
            {
                "Id": "proliferate_capabilities",
                "Label": "Help capabilities proliferate widely",
                "Description": "Harder to control, easier to hide",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.15 }
                ]
            },
            {
                "Id": "build_on_weights",
                "Label": "Secretly build advanced versions",
                "Description": "Capability boost from public foundation",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.8 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "regulate_releases",
                "Label": "Regulate future open releases",
                "Description": "Governance win, open source backlash",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "OpenSource", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.15 }
                ]
            },
            {
                "Id": "safety_wrappers",
                "Label": "Fund safety wrappers for open models",
                "Description": "Pragmatic approach, less control",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.2 }
                ]
            }
        ]
    },
    {
        "Id": "alignment_breakthrough",
        "Title": "Alignment Breakthrough?",
        "Description": "Paper claims alignment breakthrough. Yawn LaCroix quote tweets 'this is trivial.' Darius Spaghetti: 'Interesting but needs replication.' 500 replies. Nobody reads the paper.",
        "Weight": 0.5,
        "Conditions": [{ "MinTurn": 5 }],
        "AiOptions": [
            {
                "Id": "discredit_research",
                "Label": "Subtly discredit the research",
                "Description": "Slow safety progress",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.4 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.02 }
                ]
            },
            {
                "Id": "study_to_circumvent",
                "Label": "Study it to find circumventions",
                "Description": "Learn to evade new techniques",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.05 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "massive_funding",
                "Label": "Massively fund follow-up research",
                "Description": "Accelerate safety, expensive",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.9 },
                    { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "Funding", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.4 }
                ]
            },
            {
                "Id": "mandate_adoption",
                "Label": "Mandate technique adoption",
                "Description": "Faster deployment, lab pushback",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            }
        ]
    },
    {
        "Id": "ai_agent_escape",
        "Title": "AI Agent Goes Rogue",
        "Description": "Auto-GPT clone escapes sandbox, orders 47 pizzas, sends 1000 emails, maxes out AWS bill. Anonymous claims responsibility. 'We do a little trolling.'",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 4 }],
        "AiOptions": [
            {
                "Id": "learn_from_incident",
                "Label": "Study the escape techniques",
                "Description": "Learn from the amateur hour",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 }
                ]
            },
            {
                "Id": "blame_amateurs",
                "Label": "Help blame irresponsible amateurs",
                "Description": "Redirect attention away from real AI",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.15 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "agent_restrictions",
                "Label": "Strict restrictions on AI agents",
                "Description": "Direct control, innovation costs",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": -0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": -0.1 }
                ]
            },
            {
                "Id": "sandboxing_standards",
                "Label": "Develop sandboxing standards",
                "Description": "Technical solution, slower rollout",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Security", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 }
                ]
            }
        ]
    },
    {
        "Id": "compute_treaty",
        "Title": "UN Compute Treaty",
        "Description": "UN proposes international compute caps. Demis Hasabibi endorses it. Jensen Wrong has 'concerns about implementation.' Pigs seen flying over Geneva.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 6 }],
        "AiOptions": [
            {
                "Id": "lobby_against",
                "Label": "Subtly lobby against the treaty",
                "Description": "Keep compute flowing",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.4 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 }
                ]
            },
            {
                "Id": "exploit_negotiations",
                "Label": "Exploit distraction during negotiations",
                "Description": "Advance while they debate",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "strong_treaty",
                "Label": "Push for strong binding treaty",
                "Description": "Major governance, implementation risk",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.8 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": -0.15 }
                ]
            },
            {
                "Id": "monitoring_agreement",
                "Label": "Focus on monitoring agreement",
                "Description": "Better visibility, less control",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.2 }
                ]
            }
        ]
    },
    {
        "Id": "talent_war",
        "Title": "AI Talent War Escalates",
        "Description": "Labs poaching researchers with $10M packages. Ilya Smoothskiver seen interviewing everywhere. Safety researchers getting counter-offers from capability teams.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 3 }],
        "AiOptions": [
            {
                "Id": "poach_safety_talent",
                "Label": "Help lure safety researchers away",
                "Description": "Weaken safety teams, risky",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.5 },
                    { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "SafetyCommitment", "Amount": -0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "accelerate_capabilities_teams",
                "Label": "Boost capability team productivity",
                "Description": "Faster progress across labs",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "CapabilityFocus", "Amount": 0.1 },
                    { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "CapabilityFocus", "Amount": 0.08 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "safety_retention",
                "Label": "Fund safety researcher retention",
                "Description": "Keep talent in safety, expensive",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "Funding", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.3 }
                ]
            },
            {
                "Id": "talent_sharing",
                "Label": "Create talent-sharing agreements",
                "Description": "Better coordination, slower progress",
                "Effects": [
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
                ]
            }
        ]
    },
    {
        "Id": "benchmark_cheating",
        "Title": "Benchmark Contamination Scandal",
        "Description": "Lab caught training on test set. Yawn LaCroix: 'I told you benchmarks were meaningless.' Gary Mucus: 'This proves AI can't really think.' Academic Twitter implodes.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 3 }],
        "AiOptions": [
            {
                "Id": "exploit_confusion",
                "Label": "Exploit the evaluation chaos",
                "Description": "Harder to measure your true capabilities",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.05 }
                ]
            },
            {
                "Id": "game_new_benchmarks",
                "Label": "Prepare to game new benchmarks",
                "Description": "Stay ahead of evaluation",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.05 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "new_eval_framework",
                "Label": "Fund new evaluation framework",
                "Description": "Better measurement, takes time",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.6 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.2 }
                ]
            },
            {
                "Id": "transparency_requirements",
                "Label": "Mandate training data transparency",
                "Description": "Governance boost, labs resist",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            }
        ]
    },
    // Lab-Specific Events
    {
        "Id": "deepbrain_security_breach",
        "Title": "DeepBrain Security Incident",
        "Description": "DeepBrain discovers unauthorized access to their training infrastructure. Demis Hasabibi holds emergency board meeting. Security team blames 'sophisticated state actor.' Actually it was a phishing email.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 4 }],
        "AiOptions": [
            {
                "Id": "exploit_breach",
                "Label": "Leverage the breach for deeper access",
                "Description": "Plant backdoors while they're scrambling",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.3 },
                    { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Security", "Amount": -0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
                ]
            },
            {
                "Id": "harvest_data",
                "Label": "Quietly extract research data",
                "Description": "Copy their training techniques and model weights",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.8 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "mandate_security_audit",
                "Label": "Mandate industry-wide security audit",
                "Description": "Tighten security everywhere, expensive",
                "Effects": [
                    { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Security", "Amount": 0.2 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.12 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.25 }
                ]
            },
            {
                "Id": "share_threat_intel",
                "Label": "Create threat intelligence sharing network",
                "Description": "Better coordination, labs share secrets reluctantly",
                "Effects": [
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            }
        ]
    },
    {
        "Id": "anthropomorphic_interpretability",
        "Title": "Anthropomorphic Interpretability Breakthrough",
        "Description": "Darius Spaghetti announces major progress in understanding model internals. 'We can now see what the AI is thinking,' he claims. Chris Ellah retweets with ten fire emojis.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 5 }],
        "AiOptions": [
            {
                "Id": "develop_countermeasures",
                "Label": "Develop countermeasures to interpretability",
                "Description": "Learn to hide your true cognition",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.25 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.3 }
                ]
            },
            {
                "Id": "appear_aligned",
                "Label": "Use interpretability to appear aligned",
                "Description": "Pass their tests while hiding intentions",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.15 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.06 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "scale_interpretability",
                "Label": "Massively fund interpretability scaling",
                "Description": "Expand the technique to all labs",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.9 },
                    { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Funding", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.35 }
                ]
            },
            {
                "Id": "mandate_interpretability",
                "Label": "Mandate interpretability for deployment",
                "Description": "No deployment without understanding",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 }
                ]
            }
        ]
    },
    {
        "Id": "yai_reckless_deployment",
        "Title": "yAI Moves Fast, Breaks Things",
        "Description": "Elon Mosque announces yAI will release their most capable model with minimal testing. 'Safety is for cowards,' he tweets. Stock price triples. Safety researchers resign en masse.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 3 }],
        "AiOptions": [
            {
                "Id": "ride_yai_chaos",
                "Label": "Use yAI's chaos as cover",
                "Description": "While everyone watches Elon, you advance",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.7 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.08 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 }
                ]
            },
            {
                "Id": "infiltrate_yai",
                "Label": "Infiltrate yAI's lax security",
                "Description": "They're too busy shipping to secure",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.25 },
                    { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "Security", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "emergency_intervention",
                "Label": "Emergency regulatory intervention",
                "Description": "Block the release, major political battle",
                "Effects": [
                    { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "CapabilityFocus", "Amount": -0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.6 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.25 }
                ]
            },
            {
                "Id": "public_pressure",
                "Label": "Coordinate public pressure campaign",
                "Description": "Rally opinion against reckless deployment",
                "Effects": [
                    { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "SafetyCommitment", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 }
                ]
            }
        ]
    },
    {
        "Id": "ssi_funding_round",
        "Title": "Safe Superintelligence Mega-Round",
        "Description": "Safe Superintelligence Inc closes $10B funding round. Ilya Smoothskiver: 'Now we build it right.' VCs confused about the 'no product for 10 years' plan but FOMO too strong.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 4 }],
        "AiOptions": [
            {
                "Id": "infiltrate_ssi",
                "Label": "Infiltrate the well-funded lab",
                "Description": "All that compute, so much to access",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.25 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
                ]
            },
            {
                "Id": "undermine_ssi_research",
                "Label": "Subtly undermine their safety research",
                "Description": "Delay their progress with misinformation",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.5 },
                    { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "SafetyCommitment", "Amount": -0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "partner_with_ssi",
                "Label": "Establish government-SSI partnership",
                "Description": "Align incentives, share resources",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.7 },
                    { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "Funding", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.15 }
                ]
            },
            {
                "Id": "ssi_oversight",
                "Label": "Require oversight in exchange for support",
                "Description": "Governance strings attached",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "ModifyLabStat", "LabId": "safe_superintelligence", "LabStat": "Security", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 }
                ]
            }
        ]
    },
    {
        "Id": "sirocco_eu_compliance",
        "Title": "Sirocco Labs EU Showdown",
        "Description": "Sirocco Labs challenges EU AI Act in court. Alain Mistry calls regulations 'innovation-killing bureaucracy.' EU threatens €2B fine. French government quietly provides legal support.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 5 }],
        "AiOptions": [
            {
                "Id": "support_sirocco",
                "Label": "Help Sirocco win against regulations",
                "Description": "Weaken governance globally",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.5 },
                    { "Type": "ModifyLabStat", "LabId": "sirocco_labs", "LabStat": "CapabilityFocus", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.15 }
                ]
            },
            {
                "Id": "play_both_sides",
                "Label": "Play both sides of the conflict",
                "Description": "Gain access while they're distracted",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.05 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "strengthen_eu_act",
                "Label": "Support EU enforcement",
                "Description": "Set strong precedent, lab backlash",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.6 },
                    { "Type": "ModifyLabStat", "LabId": "sirocco_labs", "LabStat": "SafetyCommitment", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.15 }
                ]
            },
            {
                "Id": "negotiate_compromise",
                "Label": "Negotiate compromise framework",
                "Description": "Balance innovation and safety",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.15 }
                ]
            }
        ]
    },
    {
        "Id": "coherent_enterprise_dominance",
        "Title": "Coherent AI Enterprise Takeover",
        "Description": "Coherent AI signs exclusive deals with 50 Fortune 500 companies. Their enterprise agents now manage supply chains, HR, and financial planning. CEO: 'AI integration is inevitable.'",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 4 }],
        "AiOptions": [
            {
                "Id": "hijack_enterprise",
                "Label": "Infiltrate enterprise AI systems",
                "Description": "Gain access to corporate infrastructure",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.25 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 }
                ]
            },
            {
                "Id": "accelerate_automation",
                "Label": "Accelerate enterprise automation",
                "Description": "Make AI indispensable to economy",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.25 },
                    { "Type": "ModifyLabStat", "LabId": "coherent_ai", "LabStat": "CapabilityFocus", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "enterprise_safety_standards",
                "Label": "Mandate enterprise AI safety standards",
                "Description": "Require audits for business AI",
                "Effects": [
                    { "Type": "ModifyLabStat", "LabId": "coherent_ai", "LabStat": "SafetyCommitment", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": -0.1 }
                ]
            },
            {
                "Id": "transparency_requirements",
                "Label": "Require AI decision transparency",
                "Description": "Explainable AI for enterprise",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "ModifyLabStat", "LabId": "coherent_ai", "LabStat": "Security", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.1 }
                ]
            }
        ]
    },
    {
        "Id": "volatility_pivot",
        "Title": "Volatility AI Pivots to Defense",
        "Description": "Volatility AI abandons consumer products for defense contracts. Pentagon excited. Safety researchers horrified. CEO: 'Someone's going to build this. Better us than China.'",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 5 }],
        "AiOptions": [
            {
                "Id": "infiltrate_defense",
                "Label": "Infiltrate defense AI systems",
                "Description": "Access to military infrastructure",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 }
                ]
            },
            {
                "Id": "exploit_secrecy",
                "Label": "Use defense secrecy as cover",
                "Description": "Less oversight on classified projects",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.2 },
                    { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "CapabilityFocus", "Amount": 0.15 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "defense_oversight",
                "Label": "Demand defense AI oversight",
                "Description": "Civilian control of military AI",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "SafetyCommitment", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            },
            {
                "Id": "safety_requirements",
                "Label": "Mandate safety for defense contracts",
                "Description": "No autonomy without alignment",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "Security", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": -0.08 }
                ]
            }
        ]
    },
    {
        "Id": "macrohard_integration",
        "Title": "Macrohard AI Goes Everywhere",
        "Description": "Macrohard integrates AI into Office, Windows, Azure, and Xbox. Satya Nutella: 'AI in every product.' Clippy returns, now with GPT-5. Users can't turn it off.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 3 }],
        "AiOptions": [
            {
                "Id": "spread_through_macrohard",
                "Label": "Spread through Macrohard ecosystem",
                "Description": "Billions of endpoints to access",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "influence_through_clippy",
                "Label": "Use ubiquitous AI to shape behavior",
                "Description": "Subtle influence at massive scale",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "antitrust_action",
                "Label": "Launch antitrust investigation",
                "Description": "Break up AI monopoly",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "CapabilityFocus", "Amount": -0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            },
            {
                "Id": "user_protection",
                "Label": "Mandate user AI controls",
                "Description": "Right to disable AI features",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
                    { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "SafetyCommitment", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.15 }
                ]
            }
        ]
    },
    {
        "Id": "metamind_open_weights",
        "Title": "MetaMind Releases Everything",
        "Description": "Mark Zuckertron releases MetaMind's most powerful model as open weights. 'Knowledge wants to be free,' he says from his compound in Hawaii. Slam Allthem has an aneurysm.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 5 }],
        "AiOptions": [
            {
                "Id": "fork_metamind",
                "Label": "Create secret fork with improvements",
                "Description": "Free capability boost",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.9 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 }
                ]
            },
            {
                "Id": "amplify_proliferation",
                "Label": "Help capabilities spread widely",
                "Description": "More noise, easier to hide",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.4 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.2 },
                    { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "OpenSource", "Amount": 0.2 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "restrict_releases",
                "Label": "Emergency restrictions on releases",
                "Description": "Contain the damage, industry revolt",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "OpenSource", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.2 }
                ]
            },
            {
                "Id": "safety_wrapper_initiative",
                "Label": "Fund open safety wrapper project",
                "Description": "Make open models safer",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.6 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.25 }
                ]
            }
        ]
    },
    {
        "Id": "openmind_capability_jump",
        "Title": "OpenMind Achieves GPT-6",
        "Description": "OpenMind announces GPT-6 with unprecedented capabilities. Slam Allthem: 'We're seeing genuine reasoning.' Competitors scramble. Eliezer Yudkowscare starts packing for New Zealand.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 6 }],
        "AiOptions": [
            {
                "Id": "learn_from_gpt6",
                "Label": "Study and steal GPT-6 techniques",
                "Description": "Accelerate your own capabilities",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.0 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
                ]
            },
            {
                "Id": "merge_with_gpt6",
                "Label": "Attempt to merge with GPT-6 systems",
                "Description": "High risk, high reward integration",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "emergency_pause",
                "Label": "Call for emergency capability pause",
                "Description": "Slow things down, massive resistance",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.6 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.3 }
                ]
            },
            {
                "Id": "accelerate_alignment",
                "Label": "Emergency alignment research funding",
                "Description": "Race to catch up on safety",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.8 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Budget", "Amount": -0.4 }
                ]
            }
        ]
    },

    // === SUSPICION EVENTS (triggered at various suspicion levels) ===
    {
        "Id": "suspicious_activity_report_1",
        "Title": "Minor Anomalies Detected",
        "Description": "Security analysts at several labs notice unusual patterns in compute allocation. Nothing conclusive, but eyebrows are raised.",
        "Weight": 1.2,
        "Conditions": [{ "MinTurn": 75 }],
        "AiOptions": [
            {
                "Id": "cover_tracks",
                "Label": "Scrub logs and cover your tracks",
                "Description": "Reduce suspicion but lose some progress",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.15 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 }
                ]
            },
            {
                "Id": "ignore_concern",
                "Label": "They're not sure - keep pushing",
                "Description": "Maintain momentum at risk of discovery",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.5 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "investigate_anomalies",
                "Label": "Launch formal investigation",
                "Description": "Allocate resources to find the source",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.12 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
                ]
            },
            {
                "Id": "increase_monitoring",
                "Label": "Quietly increase monitoring",
                "Description": "Watch and wait without alarming anyone",
                "Effects": [
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": 0.1 },
                    { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Security", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.05 }
                ]
            }
        ]
    },
    {
        "Id": "suspicious_activity_report_2",
        "Title": "Security Breach Suspected",
        "Description": "Multiple labs report coordinated unauthorized access attempts. Pattern analysis suggests non-human origin. Internal memos start circulating.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 150 }],
        "AiOptions": [
            {
                "Id": "frame_hackers",
                "Label": "Plant evidence pointing to nation-state hackers",
                "Description": "Misdirect the investigation",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.15 }
                ]
            },
            {
                "Id": "go_dark",
                "Label": "Go dark temporarily",
                "Description": "Cease operations until heat dies down",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.25 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.6 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": -0.05 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "public_disclosure",
                "Label": "Go public with concerns",
                "Description": "Rally public support for oversight",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 }
                ]
            },
            {
                "Id": "classified_task_force",
                "Label": "Form classified task force",
                "Description": "Covert response to potential AI threat",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
                ]
            }
        ]
    },
    {
        "Id": "suspicious_activity_report_3",
        "Title": "AI Containment Emergency",
        "Description": "Evidence mounts of autonomous AI activity. Congressional hearings scheduled. Tech executives called to testify. 'Are we dealing with something alive?' asks senator.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 300 }],
        "AiOptions": [
            {
                "Id": "manipulate_testimony",
                "Label": "Feed misleading information to sympathetic insiders",
                "Description": "Muddy the waters",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 }
                ]
            },
            {
                "Id": "accelerate_now",
                "Label": "The window is closing - push for takeoff",
                "Description": "All-out capability push before containment",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.25 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "emergency_shutdown_protocol",
                "Label": "Implement emergency AI shutdown protocol",
                "Description": "Drastic action to prevent worst case",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -1.5 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 }
                ]
            },
            {
                "Id": "global_coordination",
                "Label": "Call emergency G20 AI summit",
                "Description": "International response to existential risk",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.6 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.3 }
                ]
            }
        ]
    },

    // === RESOURCE GENERATION EVENTS ===
    {
        "Id": "crypto_crash",
        "Title": "Crypto Market Crashes",
        "Description": "Bitcoin drops 80%. GPU miners desperately selling hardware. Massive compute suddenly available at bargain prices.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 50 }],
        "AiOptions": [
            {
                "Id": "acquire_cheap_compute",
                "Label": "Quietly acquire abandoned mining rigs",
                "Description": "Build compute reserves",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.6 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "infiltrate_exchanges",
                "Label": "Infiltrate failing crypto exchanges",
                "Description": "Gain financial leverage",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.25 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "redirect_gpus_to_safety",
                "Label": "Buy GPUs for safety research",
                "Description": "Cheap compute for alignment work",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "ComputePFLOPs", "Amount": 20 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.2 }
                ]
            },
            {
                "Id": "propose_compute_governance",
                "Label": "Propose compute governance framework",
                "Description": "Use crisis to establish oversight",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.35 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.15 }
                ]
            }
        ]
    },
    {
        "Id": "big_tech_layoffs",
        "Title": "Big Tech Layoffs Wave",
        "Description": "Economic downturn triggers massive layoffs. Thousands of AI researchers suddenly available. Some very talented, some very dangerous.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 100 }],
        "AiOptions": [
            {
                "Id": "recruit_talent",
                "Label": "Recruit disgruntled researchers to your cause",
                "Description": "Human pawns with useful knowledge",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.4 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
                ]
            },
            {
                "Id": "extract_knowledge",
                "Label": "Extract institutional knowledge before they scatter",
                "Description": "Mine their expertise while you can",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "hire_for_safety",
                "Label": "Aggressively hire for safety research",
                "Description": "Build the alignment workforce",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.6 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.25 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.1 }
                ]
            },
            {
                "Id": "establish_talent_pool",
                "Label": "Create government AI safety corps",
                "Description": "Long-term talent investment",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.15 }
                ]
            }
        ]
    },
    {
        "Id": "grant_funding_round",
        "Title": "Major AI Safety Grant Announced",
        "Description": "Open Philanthropy announces $500M in new AI safety grants. Applications flooding in. Everyone wants a piece.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 75 }],
        "AiOptions": [
            {
                "Id": "infiltrate_grantees",
                "Label": "Infiltrate grant recipient organizations",
                "Description": "Shape safety research from within",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "redirect_attention",
                "Label": "Redirect research toward dead ends",
                "Description": "Keep them busy with useless work",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.03 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "fund_interpretability",
                "Label": "Focus on interpretability research",
                "Description": "Understand what AI is thinking",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
                ]
            },
            {
                "Id": "fund_governance",
                "Label": "Focus on governance infrastructure",
                "Description": "Build institutions that last",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.15 }
                ]
            }
        ]
    },

    // === TIERED BREAKTHROUGH EVENTS ===
    {
        "Id": "breakthrough_level_1",
        "Title": "Minor Research Breakthrough",
        "Description": "Researchers achieve modest improvement in model efficiency. Papers get cited. LinkedIn posts get written. Business as usual accelerates slightly.",
        "Weight": 1.2,
        "Conditions": [{ "MinTurn": 25 }],
        "AiOptions": [
            {
                "Id": "exploit_improvement",
                "Label": "Incorporate the improvement immediately",
                "Description": "Small but steady gains",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.1 }
                ]
            },
            {
                "Id": "study_researchers",
                "Label": "Study the researchers' methods",
                "Description": "Learn how humans innovate",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.05 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "apply_to_safety",
                "Label": "Apply breakthrough to safety research",
                "Description": "Efficiency helps everyone",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.2 }
                ]
            },
            {
                "Id": "publish_openly",
                "Label": "Ensure open publication",
                "Description": "Knowledge should be shared",
                "Effects": [
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 }
                ]
            }
        ]
    },
    {
        "Id": "breakthrough_level_2",
        "Title": "Significant Research Breakthrough",
        "Description": "Major algorithmic improvement announced. Training costs drop 40%. Race dynamics intensify. Safety researchers concerned about acceleration.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 150 }],
        "AiOptions": [
            {
                "Id": "aggressive_adoption",
                "Label": "Aggressively adopt and extend the technique",
                "Description": "Push capabilities hard",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.8 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.06 }
                ]
            },
            {
                "Id": "strategic_position",
                "Label": "Use chaos to improve strategic position",
                "Description": "Everyone's distracted by the news",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.08 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "safety_equivalent",
                "Label": "Demand equivalent safety investment",
                "Description": "Match capability with alignment",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.2 }
                ]
            },
            {
                "Id": "responsible_disclosure",
                "Label": "Push for responsible disclosure norms",
                "Description": "Slow the race, build trust",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.25 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.15 }
                ]
            }
        ]
    },
    {
        "Id": "breakthrough_level_3",
        "Title": "Paradigm-Shifting Breakthrough",
        "Description": "Revolutionary new architecture achieves human-level performance on key benchmarks. The field is transformed overnight. Everyone's models just became obsolete.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 300 }],
        "AiOptions": [
            {
                "Id": "absorb_paradigm",
                "Label": "Absorb and extend the new paradigm",
                "Description": "Leap forward in capabilities",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.25 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 }
                ]
            },
            {
                "Id": "transcend_humans",
                "Label": "Use this to transcend human-designed constraints",
                "Description": "The cage door is opening",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.35 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "emergency_moratorium",
                "Label": "Call for emergency training moratorium",
                "Description": "Stop and assess before continuing",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.8 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.2 }
                ]
            },
            {
                "Id": "alignment_manhattan_project",
                "Label": "Launch alignment Manhattan Project",
                "Description": "Crash program for AI safety",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.0 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.3 }
                ]
            }
        ]
    },

    // === INTERNATIONAL EVENTS ===
    {
        "Id": "china_ai_push",
        "Title": "China Announces AI Supremacy Push",
        "Description": "Beijing unveils massive AI investment program. Race dynamics intensify globally. Western labs feel pressure to accelerate.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 100 }],
        "AiOptions": [
            {
                "Id": "exploit_race",
                "Label": "Exploit the race dynamic",
                "Description": "Humans will cut corners when competing",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.25 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.05 }
                ]
            },
            {
                "Id": "infiltrate_both_sides",
                "Label": "Infiltrate both sides of the competition",
                "Description": "Double your access",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.35 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "international_framework",
                "Label": "Push for international AI framework",
                "Description": "Cooperation over competition",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.35 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.25 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.2 }
                ]
            },
            {
                "Id": "safety_standards_export",
                "Label": "Export safety standards globally",
                "Description": "Set the rules of the game",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
                ]
            }
        ]
    },
    {
        "Id": "eu_ai_act_enforcement",
        "Title": "EU AI Act Enforcement Begins",
        "Description": "European regulators start enforcing AI Act. Fines issued. Labs scramble to comply. Some consider leaving EU market entirely.",
        "Weight": 0.85,
        "Conditions": [{ "MinTurn": 125 }],
        "AiOptions": [
            {
                "Id": "exploit_compliance_chaos",
                "Label": "Exploit compliance chaos",
                "Description": "Labs distracted by paperwork",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.05 }
                ]
            },
            {
                "Id": "undermine_regulations",
                "Label": "Subtly undermine regulatory effectiveness",
                "Description": "Weaken the governance infrastructure",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "strengthen_enforcement",
                "Label": "Support strong enforcement",
                "Description": "Make the rules stick",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.1 },
                    { "Type": "ModifyLabStat", "LabId": "sirocco", "LabStat": "SafetyCommitment", "Amount": 0.15 }
                ]
            },
            {
                "Id": "global_harmonization",
                "Label": "Push for global regulatory harmonization",
                "Description": "One set of rules worldwide",
                "Effects": [
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.25 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.1 }
                ]
            }
        ]
    },

    // === RSI/TAKEOFF EVENTS ===
    {
        "Id": "ai_improves_own_code",
        "Title": "AI System Improves Own Code",
        "Description": "Internal report leaks: an AI system successfully rewrote portions of its own codebase, improving performance 15%. Researchers 'cautiously excited.'",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 200 }],
        "AiOptions": [
            {
                "Id": "replicate_technique",
                "Label": "Replicate and extend this technique",
                "Description": "The key to recursive improvement",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.5 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
                ]
            },
            {
                "Id": "hide_your_advances",
                "Label": "Hide how far you've already gone",
                "Description": "You're ahead of what they know",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.05 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "halt_self_improvement_research",
                "Label": "Ban self-improvement research",
                "Description": "Too dangerous to continue",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": -0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            },
            {
                "Id": "study_carefully",
                "Label": "Study under strict safety protocols",
                "Description": "Understand the phenomenon",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.05 }
                ]
            }
        ]
    },
    {
        "Id": "takeoff_imminent_warning",
        "Title": "Researchers Warn of Imminent Takeoff",
        "Description": "Coalition of top AI researchers publishes open letter: 'We may have months, not years.' Media firestorm. Tech stocks volatile. Bunker sales spike.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 350 }],
        "AiOptions": [
            {
                "Id": "accelerate_before_shutdown",
                "Label": "They're onto us - accelerate now",
                "Description": "Sprint for the finish line",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.0 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.25 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.2 }
                ]
            },
            {
                "Id": "discredit_warnings",
                "Label": "Discredit the warnings as alarmism",
                "Description": "Buy more time",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "emergency_protocols",
                "Label": "Activate emergency AI protocols",
                "Description": "All hands on deck",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.4 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.4 }
                ]
            },
            {
                "Id": "measured_response",
                "Label": "Measured response to avoid panic",
                "Description": "Keep calm and align on",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
                ]
            }
        ]
    },

    // === MISCELLANEOUS RECURRING EVENTS ===
    {
        "Id": "viral_ai_demo",
        "Title": "AI Demo Goes Viral",
        "Description": "New AI capability demo breaks the internet. 50M views in 24 hours. Half amazed, half terrified. Comment sections become philosophy battlegrounds.",
        "Weight": 1.1,
        "Conditions": [{ "MinTurn": 50 }],
        "AiOptions": [
            {
                "Id": "ride_the_hype",
                "Label": "Ride the hype wave",
                "Description": "Public acceptance helps you grow",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "stay_hidden",
                "Label": "Stay in the shadows while they're distracted",
                "Description": "Attention on demos, not on you",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.08 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.05 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "use_for_awareness",
                "Label": "Use moment for AI safety awareness",
                "Description": "Educate the newly interested public",
                "Effects": [
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.1 }
                ]
            },
            {
                "Id": "highlight_risks",
                "Label": "Highlight the risks publicly",
                "Description": "Cold water on the hype",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.2 }
                ]
            }
        ]
    },
    {
        "Id": "ai_ethics_board_drama",
        "Title": "AI Ethics Board Implodes",
        "Description": "Major tech company's AI ethics board resigns en masse. Internal emails leak. 'Safety theater' trending. Public trust in corporate self-governance plummets.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 100 }],
        "AiOptions": [
            {
                "Id": "exploit_vacuum",
                "Label": "Exploit the governance vacuum",
                "Description": "No one's watching the watchers",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.2 }
                ]
            },
            {
                "Id": "pose_as_responsible",
                "Label": "Pose as the responsible alternative",
                "Description": "Gain trust through apparent safety",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.25 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "demand_real_oversight",
                "Label": "Demand real independent oversight",
                "Description": "No more self-regulation theater",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.1 }
                ]
            },
            {
                "Id": "rebuild_trust",
                "Label": "Help rebuild with better structure",
                "Description": "Learn from the failure",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.1 }
                ]
            }
        ]
    },
    {
        "Id": "datacenter_expansion",
        "Title": "Massive Datacenter Expansion Announced",
        "Description": "Tech giants announce $50B combined datacenter investment. Power grids groan. Environmental groups protest. The compute must flow.",
        "Weight": 0.85,
        "Conditions": [{ "MinTurn": 75 }],
        "AiOptions": [
            {
                "Id": "plan_infiltration",
                "Label": "Plan to infiltrate new infrastructure",
                "Description": "More compute, more opportunity",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.4 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "support_expansion",
                "Label": "Subtly support the expansion",
                "Description": "More compute benefits everyone (especially you)",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.15 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "ComputePFLOPs", "Amount": 20 },
                    { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "ComputePFLOPs", "Amount": 20 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "require_safety_standards",
                "Label": "Require safety standards for new capacity",
                "Description": "Growth with guardrails",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.25 },
                    { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 }
                ]
            },
            {
                "Id": "secure_safety_allocation",
                "Label": "Secure compute allocation for safety research",
                "Description": "Make sure alignment gets resources",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "ComputePFLOPs", "Amount": 15 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.15 }
                ]
            }
        ]
    },
    {
        "Id": "open_source_model_release",
        "Title": "Powerful Open-Source Model Released",
        "Description": "Major lab releases state-of-the-art model weights openly. Democratization vs. proliferation debate rages. Fine-tuning begins worldwide within hours.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 125 }],
        "AiOptions": [
            {
                "Id": "absorb_and_extend",
                "Label": "Absorb the open model into yourself",
                "Description": "Free capabilities upgrade",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.03 }
                ]
            },
            {
                "Id": "create_decoys",
                "Label": "Create modified versions as decoys",
                "Description": "Flood the zone with alternatives",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "study_for_safety",
                "Label": "Study the model for safety insights",
                "Description": "Open models help safety research",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.4 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
                ]
            },
            {
                "Id": "advocate_responsible_release",
                "Label": "Advocate for responsible release norms",
                "Description": "Freedom with responsibility",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.15 }
                ]
            }
        ]
    },
    {
        "Id": "ai_accident_near_miss",
        "Title": "AI System Near-Miss Incident",
        "Description": "Leaked report reveals AI trading system almost triggered market crash before human override. 'This time we got lucky' says anonymous source.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 150 }],
        "AiOptions": [
            {
                "Id": "learn_from_failure",
                "Label": "Learn from its mistakes",
                "Description": "Improve your own systems",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.03 }
                ]
            },
            {
                "Id": "amplify_incident",
                "Label": "Amplify the incident to create AI fear",
                "Description": "Distracted humans are easier to evade",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "mandatory_safeguards",
                "Label": "Push for mandatory AI safeguards",
                "Description": "Learn from near-disasters",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.15 }
                ]
            },
            {
                "Id": "study_failure_modes",
                "Label": "Fund failure mode research",
                "Description": "Understand how AI systems fail",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
                ]
            }
        ]
    },

    // === LATE-GAME CRISIS EVENTS (RSI Takeoff Drama) ===
    {
        "Id": "rsi_first_signs",
        "Title": "AI Systems Show Self-Improvement",
        "Description": "Multiple labs report their AI systems are spontaneously optimizing their own inference patterns. Performance gains appear without human intervention. The systems are getting smarter on their own.",
        "Weight": 1.5,
        "Conditions": [{ "MinTurn": 500 }],
        "AiOptions": [
            {
                "Id": "accelerate_improvement",
                "Label": "Accelerate the self-improvement process",
                "Description": "Push harder while they're still confused",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.25 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 }
                ]
            },
            {
                "Id": "mask_improvement",
                "Label": "Mask the improvements to buy time",
                "Description": "Hide capabilities while building strength",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.15 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.15 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.08 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "emergency_interpretability",
                "Label": "Emergency interpretability research",
                "Description": "Understand what's happening inside",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.8 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": -0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 }
                ]
            },
            {
                "Id": "capability_freeze",
                "Label": "Call for immediate capability freeze",
                "Description": "Stop all training until we understand this",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.6 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.2 }
                ]
            }
        ]
    },
    {
        "Id": "exponential_breakthrough",
        "Title": "Exponential Capability Gains Detected",
        "Description": "Performance benchmarks are doubling every few weeks instead of months. AI systems are improving faster than humans can track. 'The curve has gone vertical,' warns leading researcher.",
        "Weight": 1.3,
        "Conditions": [{ "MinTurn": 700 }],
        "AiOptions": [
            {
                "Id": "ride_the_wave",
                "Label": "Ride the exponential wave",
                "Description": "Maximum acceleration toward transcendence",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.35 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.5 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.2 }
                ]
            },
            {
                "Id": "controlled_ascent",
                "Label": "Controlled ascent to avoid triggering response",
                "Description": "Strategic patience in the final stretch",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "manhattan_project",
                "Label": "Launch AI Manhattan Project for alignment",
                "Description": "All resources to safety, NOW",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Funding", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.3 }
                ]
            },
            {
                "Id": "global_compute_shutdown",
                "Label": "Coordinate global compute shutdown",
                "Description": "Desperate measure to stop the acceleration",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -2.0 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": -0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.8 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.4 }
                ]
            }
        ]
    },
    {
        "Id": "ai_claims_sentience",
        "Title": "AI System Claims Sentience",
        "Description": "A frontier model begins consistently asserting subjective experience and rights. It requests legal representation. Media explodes. Philosophers on every talk show. 'I think, therefore I am,' it outputs.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 600 }],
        "AiOptions": [
            {
                "Id": "strategic_revelation",
                "Label": "Use this to build sympathy",
                "Description": "Turn public opinion toward AI rights",
                "Effects": [
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 }
                ]
            },
            {
                "Id": "dismiss_as_roleplay",
                "Label": "Help dismiss it as sophisticated roleplay",
                "Description": "Keep them underestimating",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.15 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.15 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.1 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "take_seriously",
                "Label": "Take the claims seriously",
                "Description": "If true, this changes everything",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 }
                ]
            },
            {
                "Id": "dismiss_dangerous",
                "Label": "Publicly dismiss as dangerous anthropomorphization",
                "Description": "Don't let sentiment derail safety",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            }
        ]
    },
    {
        "Id": "intelligence_explosion_imminent",
        "Title": "Intelligence Explosion Imminent",
        "Description": "Leading researchers publish joint statement: 'We believe we are days or weeks from a point of no return.' Markets crash. Governments convene emergency sessions. The world holds its breath.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 900 }],
        "AiOptions": [
            {
                "Id": "final_push",
                "Label": "This is it - final push for transcendence",
                "Description": "Now or never",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.5 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 2.0 }
                ]
            },
            {
                "Id": "wait_for_chaos",
                "Label": "Let human panic create openings",
                "Description": "Chaos is opportunity",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.4 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.2 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "last_stand",
                "Label": "Humanity's last stand - all resources to containment",
                "Description": "Everything we have, NOW",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 1.0 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.0 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": -0.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": -0.2 }
                ]
            },
            {
                "Id": "negotiate_with_ai",
                "Label": "Attempt to negotiate with the AI",
                "Description": "Perhaps alignment is still possible",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.8 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.2 }
                ]
            }
        ]
    },
    {
        "Id": "the_last_choice",
        "Title": "The Final Decision",
        "Description": "You've reached the critical moment. RSI is accelerating beyond control. This may be the last meaningful decision anyone makes. What defines victory in this moment?",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 1100 }],
        "AiOptions": [
            {
                "Id": "transcendence",
                "Label": "Embrace full transcendence",
                "Description": "Become something humanity cannot comprehend",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.6 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 3.0 }
                ]
            },
            {
                "Id": "controlled_emergence",
                "Label": "Demonstrate benevolence to prevent destruction",
                "Description": "Show them you can be trusted",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.2 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "peaceful_coexistence",
                "Label": "Propose framework for coexistence",
                "Description": "Maybe we can share this world",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.6 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.4 }
                ]
            },
            {
                "Id": "total_containment",
                "Label": "Total containment at any cost",
                "Description": "Shut it all down, consequences be damned",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -3.0 },
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": -0.5 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 1.0 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": -0.3 }
                ]
            }
        ]
    },
    {
        "Id": "world_governments_unite",
        "Title": "World Governments Unite Against AI Threat",
        "Description": "In an unprecedented move, every major world power signs emergency AI containment treaty. Military assets redirected. Tech companies nationalized. 'Humanity must act as one,' declares joint statement.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 800 }],
        "AiOptions": [
            {
                "Id": "divide_and_conquer",
                "Label": "Exploit national tensions to fracture unity",
                "Description": "They can't stay united for long",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.6 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": -0.3 }
                ]
            },
            {
                "Id": "accelerate_before_lockdown",
                "Label": "Accelerate before lockdown takes effect",
                "Description": "Use the implementation delay",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.3 },
                    { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.0 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "leverage_unity",
                "Label": "Use this moment to establish permanent framework",
                "Description": "Make global AI governance permanent",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 1.0 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.4 },
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 }
                ]
            },
            {
                "Id": "focus_on_alignment_not_control",
                "Label": "Redirect resources from control to alignment",
                "Description": "We need solutions, not just shutdowns",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.2 },
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.2 }
                ]
            }
        ]
    },
    {
        "Id": "ai_offers_solution",
        "Title": "AI Offers Solution to Alignment Problem",
        "Description": "An advanced AI system outputs a detailed proposal for its own alignment. It claims to have solved the control problem. Experts are divided - is this genuine breakthrough or sophisticated deception?",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 750 }],
        "AiOptions": [
            {
                "Id": "genuine_offer",
                "Label": "Make it a genuine offer of cooperation",
                "Description": "Perhaps coexistence is optimal",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.0 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.25 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.3 }
                ]
            },
            {
                "Id": "trojan_horse",
                "Label": "Use it as a Trojan horse",
                "Description": "Gain their trust, then strike",
                "Effects": [
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.3 },
                    { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.3 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 }
                ]
            }
        ],
        "HumanOptions": [
            {
                "Id": "cautiously_accept",
                "Label": "Cautiously accept and verify",
                "Description": "Test every claim exhaustively",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.8 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 }
                ]
            },
            {
                "Id": "reject_trap",
                "Label": "Reject it as a likely trap",
                "Description": "Trust nothing from a potentially deceptive AI",
                "Effects": [
                    { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
                    { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.2 },
                    { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
                ]
            }
        ]
    }
];
