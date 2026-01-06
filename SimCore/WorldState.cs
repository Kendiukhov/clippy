using System;
using System.Collections.Generic;

namespace Clippy.SimCore
{
    // Core data structures for the deterministic simulation.

    public enum FactionKind
    {
        SeedAi,
        AlignmentCoalition
    }

    public enum FacilityType
    {
        Datacenter,
        ChipFab,
        PowerPlant,
        GridUpgrade,
        ResearchHub,
        SecurityOrg
    }

    public enum ResourceType
    {
        Budget,
        Influence,
        Stealth,
        Coordination,
        Trust,
        HardPower,
        ComputeAccess,
        Energy
    }

    public enum RegionStat
    {
        EnergyMW,
        ComputePFLOPs,
        Security,
        SentimentRegulation,
        Governance,
        CapabilityRnD,
        SafetyRnD
    }

    public enum GlobalMarketType
    {
        ChipSupply,
        TransformerSupply,
        EnergyPriceIndex,
        TalentPool,
        GeopoliticalTension
    }

    public sealed class WorldState
    {
        public WorldState(int seed = 1337)
        {
            Rng = new RngState(seed);
        }

        public int Turn { get; set; }
        public Dictionary<string, RegionState> Regions { get; } = new();
        public GlobalMarkets Markets { get; } = new();
        public FactionState AiFaction { get; } = FactionState.Create(FactionKind.SeedAi);
        public FactionState HumanFaction { get; } = FactionState.Create(FactionKind.AlignmentCoalition);
        public ProgressState Progress { get; } = new();
        public EventDeckState EventDeck { get; } = new();
        public RngState Rng { get; }
    }

    public sealed class RegionState
    {
        public string Id { get; }
        public float EnergyMW { get; set; }
        public float ComputePFLOPs { get; set; }
        public float Security { get; set; }
        public float SentimentRegulation { get; set; }
        public float Governance { get; set; }
        public float CapabilityRnD { get; set; }
        public float SafetyRnD { get; set; }
        public List<FacilityState> Facilities { get; } = new();

        public RegionState(string id)
        {
            Id = id;
        }
    }

    public sealed class FacilityState
    {
        public FacilityType Type { get; }
        public int Level { get; set; }
        public float BuildProgress { get; set; }
        public float UpkeepCost { get; set; }

        public FacilityState(FacilityType type, int level = 0)
        {
            Type = type;
            Level = level;
        }
    }

    public sealed class GlobalMarkets
    {
        public float ChipSupply { get; set; }
        public float TransformerSupply { get; set; }
        public float EnergyPriceIndex { get; set; }
        public float TalentPool { get; set; }
        public float GeopoliticalTension { get; set; }
    }

    public sealed class FactionState
    {
        public FactionKind Kind { get; }
        public Dictionary<ResourceType, float> Resources { get; } = new();
        public HashSet<string> Upgrades { get; } = new();
        public HashSet<string> ActiveProjects { get; } = new();

        // Special meters; not every meter is used by both factions.
        public float Suspicion { get; set; }
        public float Autonomy { get; set; }
        public float Legitimacy { get; set; }
        public float HardPower { get; set; }

        private FactionState(FactionKind kind)
        {
            Kind = kind;
        }

        public static FactionState Create(FactionKind kind)
        {
            var faction = new FactionState(kind);
            // Seed defaults that make sense for both factions; tuning happens in content.
            faction.Resources[ResourceType.Budget] = 0f;
            faction.Resources[ResourceType.Influence] = 0f;
            faction.Resources[ResourceType.Stealth] = kind == FactionKind.SeedAi ? 1f : 0f;
            faction.Resources[ResourceType.Coordination] = kind == FactionKind.AlignmentCoalition ? 0.5f : 0f;
            faction.Resources[ResourceType.Trust] = kind == FactionKind.AlignmentCoalition ? 0.5f : 0f;
            faction.Resources[ResourceType.ComputeAccess] = 0f;
            faction.Resources[ResourceType.Energy] = 0f;
            faction.Resources[ResourceType.HardPower] = 0f;
            return faction;
        }

        public float GetResource(ResourceType type)
        {
            Resources.TryGetValue(type, out var value);
            return value;
        }

        public void SetResource(ResourceType type, float value)
        {
            Resources[type] = value;
        }
    }

    public sealed class ProgressState
    {
        public float FrontierCapabilityIndex { get; set; }
        public float AlignmentReadinessIndex { get; set; }
        public float AutomationLevel { get; set; }
        public float GovernanceControl { get; set; }
    }

    public sealed class EventDeckState
    {
        public HashSet<string> SeenEvents { get; } = new();
        public HashSet<string> Flags { get; } = new();
    }

    public interface IEffect
    {
        void Apply(WorldState world);
    }

    public sealed record AddResourceEffect(FactionKind Target, ResourceType Resource, float Amount) : IEffect
    {
        public void Apply(WorldState world)
        {
            var faction = GetFaction(world);
            faction.Resources.TryGetValue(Resource, out var current);
            faction.Resources[Resource] = current + Amount;
        }

        private FactionState GetFaction(WorldState world) =>
            Target == FactionKind.SeedAi ? world.AiFaction : world.HumanFaction;
    }

    public sealed record ModifyRegionStatEffect(string RegionId, RegionStat Stat, float Delta) : IEffect
    {
        public void Apply(WorldState world)
        {
            if (!world.Regions.TryGetValue(RegionId, out var region))
            {
                return;
            }

            switch (Stat)
            {
                case RegionStat.EnergyMW:
                    region.EnergyMW += Delta;
                    break;
                case RegionStat.ComputePFLOPs:
                    region.ComputePFLOPs += Delta;
                    break;
                case RegionStat.Security:
                    region.Security += Delta;
                    break;
                case RegionStat.SentimentRegulation:
                    region.SentimentRegulation += Delta;
                    break;
                case RegionStat.Governance:
                    region.Governance += Delta;
                    break;
                case RegionStat.CapabilityRnD:
                    region.CapabilityRnD += Delta;
                    break;
                case RegionStat.SafetyRnD:
                    region.SafetyRnD += Delta;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(Stat), Stat, "Unhandled region stat.");
            }
        }
    }

    public sealed record ChangeGlobalMarketEffect(GlobalMarketType Market, float Delta) : IEffect
    {
        public void Apply(WorldState world)
        {
            switch (Market)
            {
                case GlobalMarketType.ChipSupply:
                    world.Markets.ChipSupply += Delta;
                    break;
                case GlobalMarketType.TransformerSupply:
                    world.Markets.TransformerSupply += Delta;
                    break;
                case GlobalMarketType.EnergyPriceIndex:
                    world.Markets.EnergyPriceIndex += Delta;
                    break;
                case GlobalMarketType.TalentPool:
                    world.Markets.TalentPool += Delta;
                    break;
                case GlobalMarketType.GeopoliticalTension:
                    world.Markets.GeopoliticalTension += Delta;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(Market), Market, "Unhandled market.");
            }
        }
    }

    public sealed record SetFlagEffect(string FlagId) : IEffect
    {
        public void Apply(WorldState world)
        {
            world.EventDeck.Flags.Add(FlagId);
        }
    }

    public sealed record AdjustProgressEffect(ProgressMetric Metric, float Amount) : IEffect
    {
        public void Apply(WorldState world)
        {
            switch (Metric)
            {
                case ProgressMetric.FrontierCapabilityIndex:
                    world.Progress.FrontierCapabilityIndex += Amount;
                    break;
                case ProgressMetric.AlignmentReadinessIndex:
                    world.Progress.AlignmentReadinessIndex += Amount;
                    break;
                case ProgressMetric.AutomationLevel:
                    world.Progress.AutomationLevel += Amount;
                    break;
                case ProgressMetric.GovernanceControl:
                    world.Progress.GovernanceControl += Amount;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(Metric), Metric, "Unhandled progress metric.");
            }
        }
    }

    public sealed record AdjustMeterEffect(FactionKind Target, FactionMeter Meter, float Amount) : IEffect
    {
        public void Apply(WorldState world)
        {
            var faction = Target == FactionKind.SeedAi ? world.AiFaction : world.HumanFaction;
            switch (Meter)
            {
                case FactionMeter.Suspicion:
                    faction.Suspicion += Amount;
                    break;
                case FactionMeter.Autonomy:
                    faction.Autonomy += Amount;
                    break;
                case FactionMeter.Legitimacy:
                    faction.Legitimacy += Amount;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(Meter), Meter, "Unhandled faction meter.");
            }
        }
    }

    public static class EffectExecutor
    {
        public static void Apply(WorldState world, IEnumerable<IEffect> effects)
        {
            foreach (var effect in effects)
            {
                effect.Apply(world);
            }
        }
    }

    // Simple deterministic RNG (xorshift32) to keep sim steps reproducible.
    public sealed class RngState
    {
        public uint State { get; private set; }
        public int Seed { get; }

        public RngState(int seed = 1337)
        {
            Seed = seed;
            State = seed == 0 ? 1u : (uint)seed;
        }

        public uint NextUint()
        {
            // xorshift32
            State ^= State << 13;
            State ^= State >> 17;
            State ^= State << 5;
            return State;
        }

        public float NextFloat01() => NextUint() / (float)uint.MaxValue;

        public int NextInt(int minInclusive, int maxExclusive)
        {
            if (maxExclusive <= minInclusive)
            {
                throw new ArgumentException("Invalid range for NextInt.");
            }
            var span = (uint)(maxExclusive - minInclusive);
            var sample = NextUint() % span;
            return (int)sample + minInclusive;
        }
    }
}
