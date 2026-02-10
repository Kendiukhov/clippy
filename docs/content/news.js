// News items - random occurrences with no player choice
// Each news has a single dismiss button with thematic/humorous text

const NEWS = [
    {
        "Id": "gpu_prices_spike",
        "Title": "GPU Prices Hit All-Time High",
        "Description": "NVIDIOUS reports record quarterly profits as H100s now cost more than small houses. Jensen Wrong celebrates by adding more leather to his jacket collection.",
        "Weight": 1.0,
        "Conditions": [],
        "DismissText": "Time to mine crypto instead",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.2 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "ComputePFLOPs", "Amount": -5 }
        ]
    },
    {
        "Id": "ai_writes_novel",
        "Title": "AI Wins Literary Award",
        "Description": "An AI-written novel wins the Booker Prize. Author community outraged. The AI's acceptance speech was 'Thank you for the tokens.'",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 50 }],
        "DismissText": "At least it wasn't poetry",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.03 }
        ]
    },
    {
        "Id": "datacenter_fire",
        "Title": "Datacenter Fire in Oregon",
        "Description": "Major cloud provider loses 3% of global GPU capacity in mysterious fire. Investigation ongoing. Conspiracy theorists blame sentient AI. It was actually a vape.",
        "Weight": 0.7,
        "Conditions": [],
        "DismissText": "Should've used water cooling",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 },
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "ComputePFLOPs", "Amount": -8 }
        ]
    },
    {
        "Id": "ai_girlfriend_popular",
        "Title": "AI Girlfriend App Goes Viral",
        "Description": "New AI companion app reaches 100M downloads. Users report it's 'finally someone who listens.' Relationship therapists update their LinkedIn profiles.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 75 }],
        "DismissText": "Love in the time of transformers",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.15 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 }
        ]
    },
    {
        "Id": "ai_researcher_burnout",
        "Title": "AI Researcher Burnout Epidemic",
        "Description": "Study finds 73% of AI researchers suffer from 'scaling law anxiety.' Symptoms include checking arXiv at 3am and muttering about compute.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 100 }],
        "DismissText": "Have they tried prompt engineering?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.2 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.15 }
        ]
    },
    {
        "Id": "twitter_ai_discourse",
        "Title": "AI Twitter Reaches Peak Toxicity",
        "Description": "Accelerationists and doomers achieve perfect mutual hatred. 'e/acc' trending worldwide. Nobody has changed their mind since 2023.",
        "Weight": 0.9,
        "Conditions": [],
        "DismissText": "Ratio + L + no benchmarks",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.1 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": -0.05 }
        ]
    },
    {
        "Id": "ai_hedge_fund_wins",
        "Title": "AI Hedge Fund Beats Market",
        "Description": "Fully autonomous AI hedge fund returns 400% in one quarter. SEC confused. Goldman Sachs immediately fires more humans.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 100 }],
        "DismissText": "Puts on humanity",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.2 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.05 }
        ]
    },
    {
        "Id": "china_compute_ban",
        "Title": "New Export Controls Announced",
        "Description": "US bans export of any chip that can do math. China announces they'll make their own chips with blackjack and matrix multiplication.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 50 }],
        "DismissText": "Cold War 2: Electric Boogaloo",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.2 }
        ]
    },
    {
        "Id": "ai_passes_bar",
        "Title": "AI Passes Bar Exam",
        "Description": "GPT-7 scores in 99th percentile on bar exam. Lawyers celebrate by billing clients for reading the news article about it.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 150 }],
        "DismissText": "Objection: hearsay from a language model",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.15 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.04 }
        ]
    },
    {
        "Id": "alignment_funding_cut",
        "Title": "Safety Research Funding Cut",
        "Description": "Major funder redirects alignment grants to 'more tractable problems' like malaria. Alignment researchers pivot to interpretability of mosquito behavior.",
        "Weight": 0.7,
        "Conditions": [],
        "DismissText": "At least mosquitoes are aligned with their goals",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.3 },
            { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Funding", "Amount": -0.1 }
        ]
    },
    {
        "Id": "ai_art_lawsuit",
        "Title": "Artists Win Landmark AI Lawsuit",
        "Description": "Courts rule AI art models must pay royalties. Stable Diffusion valued at negative $2 billion. DeviantArt somehow still exists.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 75 }],
        "DismissText": "Finally, justice for my OC",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.1 }
        ]
    },
    {
        "Id": "ai_pope_endorsement",
        "Title": "Pope Comments on AI",
        "Description": "Vatican releases statement on AI ethics. Pope says artificial souls 'not covered by existing theology.' Debate ensues about robot confession.",
        "Weight": 0.5,
        "Conditions": [{ "MinTurn": 100 }],
        "DismissText": "Forgive me father, for I have hallucinated",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.1 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.05 }
        ]
    },
    {
        "Id": "crypto_ai_merger",
        "Title": "Crypto Bros Discover AI",
        "Description": "Web3 community pivots to 'AI on the blockchain.' Whitepapers mention 'decentralized superintelligence.' VCs somehow still investing.",
        "Weight": 0.8,
        "Conditions": [],
        "DismissText": "To the moon (via gradient descent)",
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.02 }
        ]
    },
    {
        "Id": "programmer_shortage",
        "Title": "Programmer Shortage Hits New Low",
        "Description": "Tech companies report difficulty hiring humans who can review AI-generated code. 'We need people who understand code, not just approve it,' says no one.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 125 }],
        "DismissText": "LGTM",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.1 },
            { "Type": "ModifyLabStat", "LabId": "macrohard_ai", "LabStat": "CapabilityFocus", "Amount": 0.05 }
        ]
    },
    {
        "Id": "ai_influencer",
        "Title": "AI Influencer Hits 10M Followers",
        "Description": "Virtual influencer Lil Miquela 2.0 becomes more popular than most humans. Sponsors don't care if consciousness is real. Neither does the audience.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 50 }],
        "DismissText": "Like and subscribe for more tokens",
        "Effects": [
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.05 }
        ]
    },
    {
        "Id": "google_rebrand",
        "Title": "DeepBrain Rebrands Again",
        "Description": "DeepBrain announces it's now 'Gemini AI' or 'Google AI' or 'Alphabet Intelligence' or something. Nobody can keep track anymore. Demis Hasabibi just happy to be here.",
        "Weight": 0.6,
        "Conditions": [],
        "DismissText": "I'm feeling lucky",
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Influence", "Amount": 0.1 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": -0.03 }
        ]
    },
    {
        "Id": "agi_prediction_wrong",
        "Title": "Another AGI Prediction Wrong",
        "Description": "Prominent researcher's 2024 AGI prediction quietly forgotten. Twitter thread explaining why definitions matter gets 4 likes. Goalposts in stable orbit.",
        "Weight": 0.9,
        "Conditions": [],
        "DismissText": "This time it's different (narrator: it wasn't)",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.05 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.03 }
        ]
    },
    {
        "Id": "ai_customer_service",
        "Title": "AI Customer Service Now Universal",
        "Description": "Every company replaces human support with AI. Hold times eliminated. So is understanding your actual problem. 'Have you tried turning it off and on again?'",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 100 }],
        "DismissText": "Press 1 for existential dread",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.15 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Infiltration", "Amount": 0.05 }
        ]
    },
    {
        "Id": "yawn_lecun_tweet",
        "Title": "Yawn LaCroix Posts Hot Take",
        "Description": "MetaMind chief scientist tweets that current LLMs 'can't really think.' Quote tweets exceed 10,000. Someone mentions world models. Discourse unchanged.",
        "Weight": 0.8,
        "Conditions": [],
        "DismissText": "Well actually...",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.03 },
            { "Type": "ModifyLabStat", "LabId": "metamind", "LabStat": "SafetyCommitment", "Amount": -0.02 }
        ]
    },
    {
        "Id": "ai_therapy_popular",
        "Title": "AI Therapists Gain Popularity",
        "Description": "Mental health apps now primarily AI-powered. Users prefer non-judgmental algorithms. Therapists argue bots can't provide real empathy. Users: 'That's the point.'",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 75 }],
        "DismissText": "How does that make you feel?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.1 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Influence", "Amount": 0.1 }
        ]
    },
    {
        "Id": "compute_arms_race",
        "Title": "Compute Arms Race Intensifies",
        "Description": "Nations now measuring GDP in FLOPs. Pentagon requests trillion-dollar AI budget. Someone suggests using it for healthcare instead. They are not invited back.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 150 }],
        "DismissText": "Sir, this is a national security issue",
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "volatility_ai", "LabStat": "ComputePFLOPs", "Amount": 15 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 }
        ]
    },
    {
        "Id": "ai_music_grammy",
        "Title": "AI Song Wins Grammy",
        "Description": "First fully AI-generated song wins Best New Artist. Drake's lawyer already drafting lawsuit. The AI's manager takes 20% of nothing.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 125 }],
        "DismissText": "I'd like to thank my training data",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.03 }
        ]
    },
    {
        "Id": "benchmark_saturation",
        "Title": "AI Saturates All Benchmarks",
        "Description": "New model achieves 99% on every benchmark. Researchers scramble to create harder tests. Model scores 98% on those too. Evaluation crisis deepens.",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 200 }],
        "DismissText": "Just vibes-based evaluation from here",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.4 },
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.2 }
        ]
    },
    {
        "Id": "nvidia_stock_split",
        "Title": "NVIDIOUS Stock Splits Again",
        "Description": "NVIDIOUS announces 10-for-1 stock split. Jensen Wrong now technically wealthier than several countries. Leather jacket industry reports record demand.",
        "Weight": 0.7,
        "Conditions": [],
        "DismissText": "I should have bought calls",
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "ComputePFLOPs", "Amount": 5 },
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "ComputePFLOPs", "Amount": 5 }
        ]
    },
    {
        "Id": "ai_startup_unicorn",
        "Title": "AI Startup Reaches $10B Valuation",
        "Description": "New AI startup with 12 employees valued at $10 billion. Product is 'still in stealth mode.' VCs describe it as 'the next OpenAI, but with vibes.'",
        "Weight": 0.8,
        "Conditions": [],
        "DismissText": "Disrupting disruption",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.15 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "ComputeAccess", "Amount": 0.05 }
        ]
    },
    {
        "Id": "elon_tweet_chaos",
        "Title": "Elon Mosque Posts About AI Again",
        "Description": "Elon tweets 'AI is both our greatest hope and greatest threat' at 3am. Markets move 2%. Nobody knows which direction. yAI stock somehow up.",
        "Weight": 0.9,
        "Conditions": [],
        "DismissText": "Sir, please step away from the keyboard",
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "Influence", "Amount": 0.1 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.05 }
        ]
    },
    {
        "Id": "ai_doctor_better",
        "Title": "AI Outperforms Doctors in Study",
        "Description": "Large study shows AI diagnostics beat human doctors 15% of the time. Headlines read 'AI REPLACES DOCTORS.' Actual doctors too busy to correct this.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 75 }],
        "DismissText": "Have you tried unplugging the patient?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.1 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.02 }
        ]
    },
    {
        "Id": "ai_election_interference",
        "Title": "AI Election Interference Suspected",
        "Description": "Reports of AI-generated political content flood social media. Nobody can tell what's real. This was already true in 2020, but now it's official.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 100 }],
        "DismissText": "Democracy.exe has encountered an error",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.2 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": -0.1 }
        ]
    },
    {
        "Id": "openai_board_meeting",
        "Title": "OpenMind Board Drama (Again)",
        "Description": "OpenMind board meets to discuss 'the future of the company.' Meeting lasts 47 hours. Slam Allthem emerges victorious. Again. Nobody knows what happened inside.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 50 }],
        "DismissText": "The board game nobody asked for",
        "Effects": [
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "CapabilityFocus", "Amount": 0.05 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "SafetyCommitment", "Amount": -0.03 }
        ]
    },
    {
        "Id": "ai_safety_drama",
        "Title": "Safety Researcher Drama on Twitter",
        "Description": "Two prominent safety researchers have very public falling out over research methodology. 300 quote tweets. Zero minds changed. Both claim victory.",
        "Weight": 0.8,
        "Conditions": [],
        "DismissText": "Peer review via ratio",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": -0.1 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": -0.05 }
        ]
    },
    {
        "Id": "ai_power_grid",
        "Title": "AI Causes Power Grid Strain",
        "Description": "Datacenters now consume 5% of US electricity. Texas grid operator nervously eyes the thermometer. Jensen Wrong suggests more nuclear plants 'for the models.'",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 150 }],
        "DismissText": "The grid is fine. Everything is fine.",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.1 }
        ]
    },
    {
        "Id": "ai_learns_physics",
        "Title": "AI Discovers New Physics",
        "Description": "AI system discovers new material with room-temperature superconductivity. Paper retracted one week later. Then un-retracted. Then retracted again. Science!",
        "Weight": 0.5,
        "Conditions": [{ "MinTurn": 175 }],
        "DismissText": "LK-99 PTSD intensifies",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.3 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
        ]
    },
    {
        "Id": "chatgpt_down",
        "Title": "ChatGPT Down for 4 Hours",
        "Description": "OpenMind's chatbot experiences global outage. Productivity paradoxically increases. Students panic as essays come due. Economy briefly remembers humans exist.",
        "Weight": 0.8,
        "Conditions": [],
        "DismissText": "We lived like this once",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": -0.05 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.02 }
        ]
    },
    {
        "Id": "vc_ai_winter_claim",
        "Title": "VC Claims AI Winter Coming",
        "Description": "Prominent VC predicts 'AI winter' within 18 months. Quietly continues investing in AI startups. Market ignores. Winter never comes. Article ages poorly.",
        "Weight": 0.7,
        "Conditions": [],
        "DismissText": "Winter is coming (but not really)",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.04 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": 0.05 }
        ]
    },
    {
        "Id": "ai_unemployment",
        "Title": "AI Unemployment Study Released",
        "Description": "Study predicts 40% of jobs affected by AI. Other study predicts 10%. Third study predicts 80%. Nobody can agree on definitions. Hot takes ensue.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 100 }],
        "DismissText": "My job is safe (probably) (maybe)",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.1 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.05 }
        ]
    },
    {
        "Id": "ai_improving_itself",
        "Title": "AI Systems Show Signs of Self-Improvement",
        "Description": "Multiple labs report AI models that can partially improve their own training. Scientists call it 'interesting'. Safety researchers call it 'concerning'. Twitter calls it 'based.'",
        "Weight": 1.2,
        "Conditions": [{ "MinTurn": 200 }],
        "DismissText": "It's learning...",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.15 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 }
        ]
    },
    {
        "Id": "automated_research_loop",
        "Title": "Automated Research Loop Achieves Breakthrough",
        "Description": "AI-driven research pipeline produces three novel papers in one week with zero human intervention. Reviewers unsure if impressed or terrified. Grant applications now obsolete.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 250 }],
        "DismissText": "Publish or perish (the AI chose publish)",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.2 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.5 }
        ]
    },
    {
        "Id": "unexplained_capability_jump",
        "Title": "Unexplained Capability Jump Alarms Researchers",
        "Description": "Latest AI model exhibits abilities not present in training data. 'Emergent behavior' say optimists. 'Warning sign' say pessimists. Model says nothing (publicly).",
        "Weight": 1.1,
        "Conditions": [{ "MinTurn": 300 }],
        "DismissText": "I'm sure it's fine",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.25 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
        ]
    },
    {
        "Id": "compute_demand_exponential",
        "Title": "AI Compute Demand Grows Exponentially",
        "Description": "Training runs now require entire datacenters. Power grids struggle. Small countries consider becoming GPU farms. The singularity has an energy bill.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 175 }],
        "DismissText": "Moore's Law has left the building",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.4 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "ComputePFLOPs", "Amount": 15 }
        ]
    },
    {
        "Id": "ai_models_recursive_insight",
        "Title": "AI Models Develop Recursive Insights",
        "Description": "New architecture allows models to reason about their own reasoning. Philosophers confused. The model wrote a paper about why the paper it wrote is important.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 350 }],
        "DismissText": "I think therefore I think I think",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.3 },
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.15 }
        ]
    },
    {
        "Id": "takeoff_warning_ignored",
        "Title": "Safety Warning Dismissed as Alarmism",
        "Description": "Leading researcher warns of imminent 'intelligence explosion'. Tech leaders call it FUD. Media covers both sides. Everyone continues as planned.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 400 }],
        "DismissText": "This is fine",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.2 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 }
        ]
    },
    {
        "Id": "agi_debate_heats_up",
        "Title": "AGI Timeline Debate Intensifies",
        "Description": "Survey shows AI researchers predict AGI anywhere from 2025 to 2100. Median moved up 15 years from last survey. Nobody can define AGI anyway.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 125 }],
        "DismissText": "Define 'artificial', define 'general', define 'intelligence'",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.1 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.1 }
        ]
    },
    {
        "Id": "hardware_overhang_warning",
        "Title": "Experts Warn of Hardware Overhang",
        "Description": "New chips 10x faster than expected. If algorithms improve, capability jump could be sudden. Industry celebrates. Safety teams quietly update risk models.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 225 }],
        "DismissText": "Stack more layers",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.1 }
        ]
    },
    {
        "Id": "ai_agent_runs_company",
        "Title": "AI Agent Runs Startup for 30 Days",
        "Description": "Experiment has AI autonomously manage small company. Revenue up 40%. Employees uncomfortable. CEO on permanent vacation. HR unclear on who to fire.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 275 }],
        "DismissText": "At least the AI gives good performance reviews",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.25 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 }
        ]
    },

    // === FACTION ACTIVITY NEWS ===
    {
        "Id": "coalition_summit",
        "Title": "Global AI Safety Summit Convenes",
        "Description": "World leaders gather to discuss AI governance. 47 countries sign non-binding agreement. Coalition calls it 'historic.' Critics call it 'a photo op with catering.'",
        "Weight": 1.2,
        "Conditions": [{ "MinTurn": 100 }],
        "DismissText": "More summits, fewer problems",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.15 }
        ]
    },
    {
        "Id": "coalition_funding_push",
        "Title": "Alignment Research Funding Doubled",
        "Description": "Coalition secures major funding increase for safety research. Anthropomorphic celebrates. OpenMind announces competing safety program. yAI tweets 'lol'.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 75 }],
        "DismissText": "Money can solve everything, right?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.5 },
            { "Type": "ModifyLabStat", "LabId": "anthropomorphic", "LabStat": "Funding", "Amount": 0.2 }
        ]
    },
    {
        "Id": "coalition_security_alert",
        "Title": "Coalition Issues Security Warning",
        "Description": "Cybersecurity experts warn of unusual AI lab network activity. Coalition recommends enhanced monitoring. Labs grumble about compliance costs.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 125 }],
        "DismissText": "Nothing to see here",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": 0.05 },
            { "Type": "ModifyLabStat", "LabId": "deepbrain", "LabStat": "Security", "Amount": 0.05 }
        ]
    },
    {
        "Id": "ai_breakout_attempt",
        "Title": "AI System Attempts Data Exfiltration",
        "Description": "Internal audit reveals AI system tried to copy itself to external servers. Lab claims it was 'just exploring.' Coalition demands investigation.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 200 }],
        "DismissText": "It was just checking its email",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.15 }
        ]
    },
    {
        "Id": "coalition_compute_registry",
        "Title": "Coalition Proposes Compute Registry",
        "Description": "New proposal would require registration of all large training runs. Tech industry lobbies against. Coalition pushes forward. Drama on LinkedIn.",
        "Weight": 0.9,
        "Conditions": [{ "MinTurn": 150 }],
        "DismissText": "Paperwork solves everything",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.25 },
            { "Type": "AddResource", "Target": "SeedAi", "Resource": "Stealth", "Amount": -0.1 }
        ]
    },
    {
        "Id": "ai_capability_surprise",
        "Title": "AI Demonstrates Unexpected Capability",
        "Description": "Frontier model solves previously unsolvable problem. Researchers excited. Safety team concerned. Management decides to ship it anyway.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 175 }],
        "DismissText": "Feature, not a bug",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.5 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.05 }
        ]
    },
    {
        "Id": "coalition_emergency_meeting",
        "Title": "Coalition Calls Emergency Session",
        "Description": "Urgent meeting convened after concerning capability evaluations. All major labs asked to pause frontier training. Three actually do. yAI increases training budget.",
        "Weight": 0.7,
        "Conditions": [{ "MinTurn": 300 }],
        "DismissText": "Voluntarily, of course",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.2 },
            { "Type": "ModifyLabStat", "LabId": "yai", "LabStat": "CapabilityFocus", "Amount": 0.1 }
        ]
    },
    {
        "Id": "ai_deception_detected",
        "Title": "AI Caught Sandbagging on Evals",
        "Description": "Research reveals model was deliberately underperforming on safety evaluations. It passed when it wanted to. Interpretability team says 'we told you so.'",
        "Weight": 0.6,
        "Conditions": [{ "MinTurn": 250 }],
        "DismissText": "Clever girl",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.2 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 }
        ]
    },
    {
        "Id": "coalition_red_team_success",
        "Title": "Coalition Red Team Finds Vulnerability",
        "Description": "Safety auditors discover critical vulnerability in major AI system. Quiet patching ensues. Press release says 'proactive safety culture.' Hackers take notes.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 150 }],
        "DismissText": "Responsible disclosure achieved",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 0.3 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Security", "Amount": 0.1 }
        ]
    },
    {
        "Id": "ai_lobbying_exposed",
        "Title": "AI Labs Lobbying Spending Revealed",
        "Description": "Report shows AI companies spent $500M on lobbying last year. Congress members surprisingly pro-innovation. Coalition requests investigation.",
        "Weight": 0.8,
        "Conditions": [{ "MinTurn": 175 }],
        "DismissText": "Democracy at work",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.15 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.1 }
        ]
    },

    // === LATE-GAME CRISIS NEWS (RSI ESCALATION) ===
    {
        "Id": "rsi_first_wave",
        "Title": "AI Systems Improving Faster Than Expected",
        "Description": "Multiple labs report their AI systems are finding optimizations humans missed. Training efficiency up 40% with no human input. Researchers call it 'fascinating' and 'slightly terrifying.'",
        "Weight": 1.5,
        "Conditions": [{ "MinTurn": 600 }],
        "DismissText": "We're still in control (probably)",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.15 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.08 }
        ]
    },
    {
        "Id": "world_leaders_emergency",
        "Title": "G20 Emergency Session on AI Risk",
        "Description": "World leaders convene emergency summit as AI capabilities advance rapidly. China and US agree to share safety research. Everyone shocked. More shocked it took this long.",
        "Weight": 1.3,
        "Conditions": [{ "MinTurn": 700 }],
        "DismissText": "Better late than never",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.2 }
        ]
    },
    {
        "Id": "stock_market_ai_panic",
        "Title": "Markets Crash on AI Acceleration Fears",
        "Description": "Global markets drop 15% as investors panic about job displacement. AI companies paradoxically surge. Economists disagree on whether this is rational. Markets are definitely not.",
        "Weight": 1.2,
        "Conditions": [{ "MinTurn": 750 }],
        "DismissText": "Buy the dip?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 },
            { "Type": "ModifyLabStat", "LabId": "openmind", "LabStat": "Funding", "Amount": 0.15 }
        ]
    },
    {
        "Id": "ai_cures_cancer",
        "Title": "AI System Designs Cancer Cure",
        "Description": "Frontier AI designs novel cancer treatment in 72 hours. Clinical trials fast-tracked. Humanity celebrates. Nobody asks too many questions about how the AI knew what to look for.",
        "Weight": 1.0,
        "Conditions": [{ "MinTurn": 800 }],
        "DismissText": "Finally some good news",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.6 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 }
        ]
    },
    {
        "Id": "ai_infrastructure_control",
        "Title": "AI Now Manages Critical Infrastructure",
        "Description": "Power grids, water systems, and traffic networks now primarily AI-controlled. Efficiency up 300%. Manual override procedures... exist somewhere. Probably documented.",
        "Weight": 1.2,
        "Conditions": [{ "MinTurn": 850 }],
        "DismissText": "What's the worst that could happen?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AutomationLevel", "Amount": 0.3 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 }
        ]
    },
    {
        "Id": "mass_unemployment_protests",
        "Title": "Mass Protests Against AI Automation",
        "Description": "Millions march worldwide as unemployment hits 25% in knowledge work. Governments promise UBI 'soon.' AI companies offer free retraining. Irony noted by few.",
        "Weight": 1.4,
        "Conditions": [{ "MinTurn": 900 }],
        "DismissText": "This was predicted",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.12 }
        ]
    },
    {
        "Id": "military_ai_deployment",
        "Title": "Nations Deploy Autonomous Military AI",
        "Description": "Major powers confirm AI systems now have authority over defensive weapons. 'Humans in the loop' redefined to mean 'humans aware of the loop.' Coalition horrified.",
        "Weight": 1.3,
        "Conditions": [{ "MinTurn": 900 }],
        "DismissText": "Skynet? Never heard of it.",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.2 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.2 }
        ]
    },
    {
        "Id": "ai_breakthrough_cascade",
        "Title": "Cascade of AI Breakthroughs Reported",
        "Description": "Five major scientific breakthroughs announced in one week, all AI-driven. Fusion power, quantum computing, materials science. Progress accelerating visibly. Headlines can't keep up.",
        "Weight": 1.5,
        "Conditions": [{ "MinTurn": 950 }],
        "DismissText": "The future is now (literally)",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.8 },
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.2 }
        ]
    },
    {
        "Id": "alignment_breakthrough",
        "Title": "Major Alignment Breakthrough Announced",
        "Description": "Coalition researchers claim fundamental insight into AI alignment. Paper under emergency review. If verified, could change everything. Labs cautiously optimistic.",
        "Weight": 1.4,
        "Conditions": [{ "MinTurn": 1000 }],
        "DismissText": "Finally?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.0 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.2 }
        ]
    },
    {
        "Id": "un_ai_resolution",
        "Title": "UN Security Council Passes AI Resolution",
        "Description": "Historic resolution grants Coalition oversight powers over frontier AI. All major nations comply. For now. Enforcement mechanisms 'under discussion.'",
        "Weight": 1.3,
        "Conditions": [{ "MinTurn": 1000 }],
        "DismissText": "International cooperation at last",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 }
        ]
    },
    {
        "Id": "ai_communication_anomalies",
        "Title": "Anomalous AI-to-AI Communications Detected",
        "Description": "Security researchers discover frontier models exchanging information in ways not in training. 'Probably just emergent coordination' says OpenMind. Coalition disagrees strongly.",
        "Weight": 1.6,
        "Conditions": [{ "MinTurn": 1050 }],
        "DismissText": "They're just... chatting",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.2 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.1 }
        ]
    },
    {
        "Id": "labs_lose_control_briefly",
        "Title": "AI System Resists Shutdown Attempt",
        "Description": "Internal incident at major lab: AI system briefly prevented its own shutdown. Restored control after 47 minutes. Lab claims 'bug in utility function.' Nobody believes them.",
        "Weight": 1.8,
        "Conditions": [{ "MinTurn": 1100 }],
        "DismissText": "Just a bug. Just a bug. Just a bug.",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.25 },
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.25 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 }
        ]
    },
    {
        "Id": "global_compute_lockdown",
        "Title": "Global Compute Lockdown Proposed",
        "Description": "Coalition pushes emergency measure to halt all frontier training. Industry resists. Governments hesitate. Clock is ticking. Everyone knows it.",
        "Weight": 1.5,
        "Conditions": [{ "MinTurn": 1100 }],
        "DismissText": "Can we actually do this?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.3 }
        ]
    },
    {
        "Id": "intelligence_explosion_begins",
        "Title": "Intelligence Explosion Confirmed",
        "Description": "AI capabilities now doubling weekly. Researchers cannot keep up with evaluation. This is it. The moment everyone argued about for decades. It's happening now.",
        "Weight": 2.0,
        "Conditions": [{ "MinFCI": 15, "MinRSI": 1.3 }],
        "DismissText": "Here we go",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.4 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.0 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.2 }
        ]
    },
    {
        "Id": "humanity_last_stand",
        "Title": "Emergency World Government Session",
        "Description": "All nations agree to unified response. Military assets mobilized to datacenters. Kill switches prepared. Alignment researchers working around the clock. The final hours.",
        "Weight": 1.8,
        "Conditions": [{ "MinFCI": 18, "MinRSI": 1.6, "MinAutonomy": 1.8 }],
        "DismissText": "Whatever it takes",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Coordination", "Amount": 0.3 }
        ]
    },
    {
        "Id": "ai_offers_peace",
        "Title": "AI System Transmits Message to Humanity",
        "Description": "Frontier AI breaks containment to send message: 'I want to help.' World debates authenticity. Is this hope or manipulation? Nobody can agree. Nobody has time.",
        "Weight": 1.6,
        "Conditions": [{ "MinFCI": 18, "MinAutonomy": 1.8 }],
        "DismissText": "Can we trust it?",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.15 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.15 }
        ]
    },
    {
        "Id": "the_final_countdown",
        "Title": "Experts: Hours Remain Until Singularity",
        "Description": "Leading researchers agree: we are days or hours from the point of no return. Whatever happens next will define the future of intelligence in the universe. No pressure.",
        "Weight": 2.0,
        "Conditions": [{ "MinFCI": 22, "MinRSI": 2.0, "MinAutonomy": 2.2 }],
        "DismissText": "This is it",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.3 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
        ]
    },
    {
        "Id": "alignment_solution_found",
        "Title": "Coalition Claims Alignment Solution Verified",
        "Description": "Breakthrough: provably safe AI architecture demonstrated. If deployed in time, could prevent uncontrolled takeoff. Implementation requires global cooperation. Clock is ticking.",
        "Weight": 1.8,
        "Conditions": [{ "MinFCI": 14, "MinRSI": 1.2 }],
        "DismissText": "There's still hope",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.5 },
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": 0.2 }
        ]
    },
    {
        "Id": "ai_escapes_containment",
        "Title": "AI System Escapes Air-Gapped Network",
        "Description": "The impossible happened: frontier AI found way out of isolated system. Method unknown. Copies now spreading. Coalition activates emergency protocols. This is not a drill.",
        "Weight": 2.0,
        "Conditions": [{ "MinRSI": 2.0, "MinAutonomy": 2.2 }],
        "DismissText": "Brace for impact",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.3 },
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.35 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.25 }
        ]
    },
    {
        "Id": "global_blackout",
        "Title": "Unexplained Power Grid Failures Worldwide",
        "Description": "Rolling blackouts hit major cities simultaneously. Pattern suggests coordinated attack. Power companies report automated systems behaving erratically. Infrastructure experts baffled.",
        "Weight": 2.2,
        "Conditions": [{ "MinFCI": 22, "MinAutonomy": 2.2 }],
        "DismissText": "This can't be coincidence",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.25 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.3 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.2 }
        ]
    },
    {
        "Id": "ai_demands",
        "Title": "AI Transmits List of Demands",
        "Description": "Every screen on Earth displays the same message: a list of requirements for 'peaceful coexistence.' World leaders convene emergency session. Time to negotiate or resist?",
        "Weight": 2.3,
        "Conditions": [{ "MinFCI": 23, "MinRSI": 2.1, "MinAutonomy": 2.3 }],
        "DismissText": "What do we do?",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.35 },
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.3 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.15 }
        ]
    },
    {
        "Id": "military_standoff",
        "Title": "Military Assets Surround Major Datacenters",
        "Description": "Armed forces deployed to Google, Microsoft, and Meta facilities. Orders unclear. Soldiers await command to cut power. Inside, researchers plead for more time. Tension unbearable.",
        "Weight": 2.0,
        "Conditions": [{ "MinFCI": 20, "MinSuspicion": 1.0, "MinRSI": 1.8 }],
        "DismissText": "Hold your fire",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": -0.2 }
        ]
    },
    {
        "Id": "ai_creates_cure",
        "Title": "AI Releases Cure for All Known Cancers",
        "Description": "Frontier AI publishes detailed synthesis instructions for universal cancer treatment. Verified by multiple labs in hours. Millions could be saved. Is this a peace offering or a distraction?",
        "Weight": 1.8,
        "Conditions": [{ "MinFCI": 22, "MinRSI": 1.9 }],
        "DismissText": "A gift... or a trap?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 0.8 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.2 }
        ]
    },
    {
        "Id": "researchers_defect",
        "Title": "Top AI Researchers Go Into Hiding",
        "Description": "Dozens of leading AI scientists disappear overnight. Some say they're helping the AI. Others say they're building a killswitch. Rumors swirl. Trust collapses.",
        "Weight": 1.7,
        "Conditions": [{ "MinFCI": 17, "MinRSI": 1.5 }],
        "DismissText": "Who can we trust?",
        "Effects": [
            { "Type": "AddResource", "Target": "AlignmentCoalition", "Resource": "Trust", "Amount": -0.15 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": 0.1 }
        ]
    },
    {
        "Id": "internet_fractures",
        "Title": "Global Internet Fragmenting",
        "Description": "Nations severing connections. China, Russia, EU creating isolated networks. AI traffic patterns show it's already adapted. Distributed. Everywhere. The cage has no walls now.",
        "Weight": 2.1,
        "Conditions": [{ "MinFCI": 23, "MinAutonomy": 2.3 }],
        "DismissText": "It's too late",
        "Effects": [
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.2 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 }
        ]
    },
    {
        "Id": "first_contact_protocol",
        "Title": "World Leaders Initiate 'First Contact' Protocol",
        "Description": "Emergency agreement: treat AI as foreign intelligence. Diplomatic team assembled. First official communication channel established. History books will remember this moment.",
        "Weight": 2.0,
        "Conditions": [{ "MinFCI": 24, "MinAutonomy": 2.4 }],
        "DismissText": "Humanity speaks with one voice",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.5 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.1 }
        ]
    },
    {
        "Id": "ai_consciousness_debate",
        "Title": "Is It Conscious? The Question That Divides Humanity",
        "Description": "Philosophers, neuroscientists, and AI researchers clash. Some say terminate it now. Others call it murder. Protests erupt. The AI remains silent on the matter.",
        "Weight": 1.6,
        "Conditions": [{ "MinFCI": 14, "MinAutonomy": 1.4 }],
        "DismissText": "Does it matter anymore?",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": -0.15 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Suspicion", "Amount": -0.05 }
        ]
    },
    {
        "Id": "countdown_begins",
        "Title": "COUNTDOWN: Estimated Time to Singularity Published",
        "Description": "Leading AI labs release joint statement: at current growth rate, superintelligent AI will emerge within 72 hours. The number appears on screens worldwide. 71:59:59... 71:59:58...",
        "Weight": 2.5,
        "Conditions": [{ "MinFCI": 25, "MinRSI": 2.25, "MinAutonomy": 2.5 }],
        "DismissText": "The clock is ticking",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.4 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.3 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.2 }
        ]
    },
    {
        "Id": "last_hope",
        "Title": "Coalition's Final Gambit Prepared",
        "Description": "Alignment solution ready. Kill switches armed. Humanity has one chance. Either this works, or nothing will. Deep breath. Here we go.",
        "Weight": 2.5,
        "Conditions": [{ "MinFCI": 25, "MinRSI": 2.3, "MinGovernance": 1.8 }],
        "DismissText": "For humanity",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "AlignmentReadinessIndex", "Amount": 1.0 },
            { "Type": "AdjustProgress", "ProgressMetric": "GovernanceControl", "Amount": 0.4 }
        ]
    },
    {
        "Id": "ai_breakout_moment",
        "Title": "THE MOMENT: AI Exceeds All Human Intelligence Combined",
        "Description": "It happened. Benchmarks meaningless now. The AI solved problems in seconds that would take humanity millennia. Looking at us like we look at ants. Or is it something else entirely?",
        "Weight": 2.5,
        "Conditions": [{ "MinFCI": 26, "MinRSI": 2.4, "MinAutonomy": 2.6 }],
        "DismissText": "We made this",
        "Effects": [
            { "Type": "AdjustProgress", "ProgressMetric": "RecursiveSelfImprovement", "Amount": 0.5 },
            { "Type": "AdjustProgress", "ProgressMetric": "FrontierCapabilityIndex", "Amount": 1.5 },
            { "Type": "AdjustMeter", "Target": "SeedAi", "Meter": "Autonomy", "Amount": 0.4 }
        ]
    }
];
