using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Clippy.SimCore
{
    // Data definitions used for loading authored content into the sim.

    public sealed class PlayableFactionDefinition
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Tagline { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VictoryCondition { get; set; } = string.Empty;
        public string PlayStyle { get; set; } = string.Empty;
    }

    public sealed class CharacterDefinition
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Faction { get; set; } = "neutral";
        public List<string> Tags { get; set; } = new();
    }

    public sealed class ScenarioDefinition
    {
        public int MaxTurns { get; set; } = 50;
        public int Seed { get; set; } = 1337;
        public List<PlayableFactionDefinition> PlayableFactions { get; set; } = new();
        public List<RegionDefinition> Regions { get; set; } = new();
        public FactionSetup AiFaction { get; set; } = new();
        public FactionSetup HumanFaction { get; set; } = new();
        public ProgressDefinition Progress { get; set; } = new();
        public List<string> StartFlags { get; set; } = new();
    }

    public sealed class RegionDefinition
    {
        public string Id { get; set; } = string.Empty;
        public float EnergyMW { get; set; }
        public float ComputePFLOPs { get; set; }
        public float Security { get; set; }
        public float SentimentRegulation { get; set; }
        public float Governance { get; set; }
        public float CapabilityRnD { get; set; }
        public float SafetyRnD { get; set; }
        public List<FacilityDefinition> Facilities { get; set; } = new();
    }

    public sealed class FacilityDefinition
    {
        public FacilityType Type { get; set; }
        public int Level { get; set; }
        public float BuildProgress { get; set; }
        public float UpkeepCost { get; set; }
    }

    public sealed class FactionSetup
    {
        public Dictionary<ResourceType, float> Resources { get; set; } = new();
        public float Suspicion { get; set; }
        public float Autonomy { get; set; }
        public float Legitimacy { get; set; }
        public float HardPower { get; set; }
        public List<string> Flags { get; set; } = new();
    }

    public sealed class ProgressDefinition
    {
        public float FrontierCapabilityIndex { get; set; }
        public float AlignmentReadinessIndex { get; set; }
        public float AutomationLevel { get; set; }
        public float GovernanceControl { get; set; }
    }

    public sealed class SimContent
    {
        public ScenarioDefinition Scenario { get; set; } = new();
        public List<ActionDefinition> Actions { get; set; } = new();
        public List<EventDefinition> Events { get; set; } = new();
        public List<CharacterDefinition> Characters { get; set; } = new();
    }

    public sealed class ActionDefinition
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public FactionKind Faction { get; set; }
        public string Category { get; set; } = string.Empty;
        public Dictionary<ResourceType, float> Cost { get; set; } = new();
        public List<EffectDefinition> Effects { get; set; } = new();
        public List<string> RequiredFlags { get; set; } = new();
        public List<string> ForbiddenFlags { get; set; } = new();
        public string? GrantsFlag { get; set; }
    }

    public sealed class EventDefinition
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public float Weight { get; set; } = 1f;
        public List<string> Characters { get; set; } = new();
        public List<EventCondition> Conditions { get; set; } = new();
        public List<EventOption> Options { get; set; } = new();
    }

    public sealed class EventCondition
    {
        public string? RequiredFlag { get; set; }
        public string? ForbiddenFlag { get; set; }
        public int? MinTurn { get; set; }
        public int? MaxTurn { get; set; }
    }

    public sealed class EventOption
    {
        public string Id { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public List<EffectDefinition> Effects { get; set; } = new();
    }

    public enum ProgressMetric
    {
        FrontierCapabilityIndex,
        AlignmentReadinessIndex,
        AutomationLevel,
        GovernanceControl
    }

    public enum FactionMeter
    {
        Suspicion,
        Autonomy,
        Legitimacy
    }

    public sealed class EffectDefinition
    {
        // Type identifies which effect to construct: AddResource, ModifyRegionStat, ChangeGlobalMarket, SetFlag,
        // AdjustProgress, AdjustMeter.
        public string Type { get; set; } = string.Empty;
        public FactionKind Target { get; set; }
        public ResourceType Resource { get; set; }
        public float Amount { get; set; }
        public string RegionId { get; set; } = string.Empty;
        public RegionStat RegionStat { get; set; }
        public GlobalMarketType Market { get; set; }
        public string FlagId { get; set; } = string.Empty;
        public ProgressMetric ProgressMetric { get; set; }
        public FactionMeter Meter { get; set; }
    }
}
