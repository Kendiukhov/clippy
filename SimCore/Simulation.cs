using System;
using System.Collections.Generic;
using System.Linq;

namespace Clippy.SimCore
{
    public enum GameOutcome
    {
        None,
        AiVictory,
        HumanVictory
    }

    public sealed class TurnSummary
    {
        public int Turn { get; init; }
        public List<ActionResult> Actions { get; } = new();
        public EventResult? Event { get; set; }
        public GameOutcome Outcome { get; set; }
        public string OutcomeReason { get; set; } = string.Empty;
        public ProgressSnapshot Progress { get; set; } = new();
        public List<string> Notes { get; } = new();
    }

    public sealed class ActionResult
    {
        public FactionKind Faction { get; init; }
        public string ActionId { get; init; } = string.Empty;
        public string ActionName { get; init; } = string.Empty;
        public bool Applied { get; init; }
        public string Detail { get; init; } = string.Empty;
    }

    public sealed class EventResult
    {
        public string EventId { get; init; } = string.Empty;
        public string EventTitle { get; init; } = string.Empty;
        public string OptionId { get; init; } = string.Empty;
        public string OptionLabel { get; init; } = string.Empty;
    }

    public sealed class ProgressSnapshot
    {
        public float FrontierCapabilityIndex { get; init; }
        public float AlignmentReadinessIndex { get; init; }
        public float AutomationLevel { get; init; }
        public float GovernanceControl { get; init; }
        public float Suspicion { get; init; }
    }

    public interface IActionPicker
    {
        ActionDefinition? PickAction(WorldState state, IReadOnlyList<ActionDefinition> available);
    }

    public sealed class SimplePolicyPicker : IActionPicker
    {
        private readonly FactionKind _faction;

        public SimplePolicyPicker(FactionKind faction)
        {
            _faction = faction;
        }

        public ActionDefinition? PickAction(WorldState state, IReadOnlyList<ActionDefinition> available)
        {
            if (available.Count == 0)
            {
                return null;
            }

            var ordered = available
                .OrderBy(a => CategoryPriority(a.Category))
                .ThenByDescending(a => EstimatedImpact(a))
                .ThenBy(a => a.Id, StringComparer.OrdinalIgnoreCase)
                .ToList();

            // Keep deterministic selection unless two items share the exact ordering, where RNG breaks ties.
            var top = ordered.Take(2).ToList();
            if (top.Count == 1 || Math.Abs(EstimatedImpact(top[0]) - EstimatedImpact(top[1])) < 0.001f)
            {
                return top[0];
            }

            var pickIndex = (int)(state.Rng.NextUint() % (uint)top.Count);
            return top[pickIndex];
        }

        private int CategoryPriority(string category)
        {
            var normalized = category.ToLowerInvariant();
            if (_faction == FactionKind.SeedAi)
            {
                return normalized switch
                {
                    "stealth" => 0,
                    "capability" => 1,
                    "infrastructure" => 2,
                    "influence" => 3,
                    "upgrade" => 4,
                    _ => 5
                };
            }

            return normalized switch
            {
                "governance" => 0,
                "safety" => 1,
                "security" => 2,
                "infrastructure" => 3,
                "upgrade" => 4,
                _ => 5
            };
        }

        private float EstimatedImpact(ActionDefinition action)
        {
            // Lightweight heuristic to favor higher magnitude effects.
            return action.Effects.Sum(e => Math.Abs(e.Amount));
        }
    }

    public static class WorldBuilder
    {
        public static WorldState Build(ScenarioDefinition scenario)
        {
            var world = new WorldState(scenario.Seed);

            foreach (var region in scenario.Regions)
            {
                var state = new RegionState(region.Id)
                {
                    EnergyMW = region.EnergyMW,
                    ComputePFLOPs = region.ComputePFLOPs,
                    Security = region.Security,
                    SentimentRegulation = region.SentimentRegulation,
                    Governance = region.Governance,
                    CapabilityRnD = region.CapabilityRnD,
                    SafetyRnD = region.SafetyRnD
                };

                foreach (var facility in region.Facilities)
                {
                    state.Facilities.Add(new FacilityState(facility.Type, facility.Level)
                    {
                        BuildProgress = facility.BuildProgress,
                        UpkeepCost = facility.UpkeepCost
                    });
                }

                if (!world.Regions.ContainsKey(region.Id))
                {
                    world.Regions.Add(region.Id, state);
                }
            }

            ApplyFactionSetup(world.AiFaction, scenario.AiFaction);
            ApplyFactionSetup(world.HumanFaction, scenario.HumanFaction);

            foreach (var flag in scenario.AiFaction.Flags)
            {
                world.EventDeck.Flags.Add(flag);
            }
            foreach (var flag in scenario.HumanFaction.Flags)
            {
                world.EventDeck.Flags.Add(flag);
            }

            world.Progress.FrontierCapabilityIndex = scenario.Progress.FrontierCapabilityIndex;
            world.Progress.AlignmentReadinessIndex = scenario.Progress.AlignmentReadinessIndex;
            world.Progress.AutomationLevel = scenario.Progress.AutomationLevel;
            world.Progress.GovernanceControl = scenario.Progress.GovernanceControl;

            foreach (var flag in scenario.StartFlags)
            {
                world.EventDeck.Flags.Add(flag);
            }

            return world;
        }

        private static void ApplyFactionSetup(FactionState faction, FactionSetup setup)
        {
            foreach (var entry in setup.Resources)
            {
                faction.SetResource(entry.Key, entry.Value);
            }

            faction.Suspicion = setup.Suspicion;
            faction.Autonomy = setup.Autonomy;
            faction.Legitimacy = setup.Legitimacy;
            faction.HardPower = setup.HardPower;

            foreach (var flag in setup.Flags)
            {
                faction.Upgrades.Add(flag);
            }
        }
    }

    public enum TurnPhase
    {
        AwaitingAiAction,
        AwaitingHumanAction,
        AwaitingEventChoice,
        TurnComplete
    }

    public sealed class Simulation
    {
        private const float AiCapabilityThreshold = 10f;
        private const float AiAutonomyThreshold = 1.5f;
        private const float HumanAlignmentThreshold = 10f;
        private const float HumanGovernanceThreshold = 1.5f;

        private readonly SimContent _content;
        private readonly IActionPicker _aiPicker;
        private readonly IActionPicker _humanPicker;

        private TurnSummary? _currentTurnSummary;
        private EventDefinition? _pendingEvent;

        public WorldState State { get; }
        public FactionKind? PlayerFaction { get; }
        public bool IsInteractive => PlayerFaction.HasValue;
        public TurnPhase CurrentPhase { get; private set; } = TurnPhase.TurnComplete;
        public SimContent Content => _content;

        public Simulation(SimContent content, IActionPicker? aiPicker = null, IActionPicker? humanPicker = null)
        {
            _content = content;
            State = WorldBuilder.Build(content.Scenario);
            _aiPicker = aiPicker ?? new SimplePolicyPicker(FactionKind.SeedAi);
            _humanPicker = humanPicker ?? new SimplePolicyPicker(FactionKind.AlignmentCoalition);
            PlayerFaction = null;
        }

        public Simulation(SimContent content, FactionKind playerFaction)
        {
            _content = content;
            State = WorldBuilder.Build(content.Scenario);
            PlayerFaction = playerFaction;

            // Player-controlled faction uses null picker (manual input)
            // AI-controlled faction uses SimplePolicyPicker
            if (playerFaction == FactionKind.SeedAi)
            {
                _aiPicker = new SimplePolicyPicker(FactionKind.SeedAi); // Will be overridden by player input
                _humanPicker = new SimplePolicyPicker(FactionKind.AlignmentCoalition);
            }
            else
            {
                _aiPicker = new SimplePolicyPicker(FactionKind.SeedAi);
                _humanPicker = new SimplePolicyPicker(FactionKind.AlignmentCoalition); // Will be overridden by player input
            }
        }

        public IEnumerable<TurnSummary> Run(int? maxTurns = null)
        {
            var limit = maxTurns ?? _content.Scenario.MaxTurns;
            for (var i = 0; i < limit; i++)
            {
                var summary = RunTurn();
                yield return summary;
                if (summary.Outcome != GameOutcome.None)
                {
                    yield break;
                }
            }
        }

        public TurnSummary RunTurn()
        {
            State.Turn += 1;
            var summary = new TurnSummary { Turn = State.Turn };

            ExecuteFactionAction(FactionKind.SeedAi, _aiPicker, summary);
            ExecuteFactionAction(FactionKind.AlignmentCoalition, _humanPicker, summary);

            TriggerEvent(summary);
            AdvanceWorld(State, summary);

            var (outcome, reason) = EvaluateOutcome(State);
            summary.Outcome = outcome;
            summary.OutcomeReason = reason;
            summary.Progress = new ProgressSnapshot
            {
                FrontierCapabilityIndex = State.Progress.FrontierCapabilityIndex,
                AlignmentReadinessIndex = State.Progress.AlignmentReadinessIndex,
                AutomationLevel = State.Progress.AutomationLevel,
                GovernanceControl = State.Progress.GovernanceControl,
                Suspicion = State.AiFaction.Suspicion
            };

            return summary;
        }

        // ========== Interactive Play Methods ==========

        /// <summary>
        /// Begin a new interactive turn. Call this when the player is ready to start their turn.
        /// Returns the phase indicating what input is needed.
        /// </summary>
        public TurnPhase BeginInteractiveTurn()
        {
            if (!IsInteractive)
            {
                throw new InvalidOperationException("BeginInteractiveTurn can only be called in interactive mode.");
            }

            State.Turn += 1;
            _currentTurnSummary = new TurnSummary { Turn = State.Turn };
            _pendingEvent = null;

            // AI faction always goes first
            if (PlayerFaction == FactionKind.SeedAi)
            {
                // Player is AI - wait for player action
                CurrentPhase = TurnPhase.AwaitingAiAction;
            }
            else
            {
                // Player is Human - AI goes first automatically
                ExecuteFactionAction(FactionKind.SeedAi, _aiPicker, _currentTurnSummary);
                CurrentPhase = TurnPhase.AwaitingHumanAction;
            }

            return CurrentPhase;
        }

        /// <summary>
        /// Get available actions for the player's faction.
        /// </summary>
        public IReadOnlyList<ActionDefinition> GetPlayerAvailableActions()
        {
            if (!PlayerFaction.HasValue)
            {
                return Array.Empty<ActionDefinition>();
            }

            return GetAvailableActions(PlayerFaction.Value).ToList();
        }

        /// <summary>
        /// Submit the player's chosen action.
        /// </summary>
        public TurnPhase SubmitPlayerAction(ActionDefinition? action)
        {
            if (_currentTurnSummary == null)
            {
                throw new InvalidOperationException("No turn in progress. Call BeginInteractiveTurn first.");
            }

            if (!PlayerFaction.HasValue)
            {
                throw new InvalidOperationException("No player faction set.");
            }

            var playerFaction = PlayerFaction.Value;

            if (action != null)
            {
                if (!IsAffordable(action, GetFaction(playerFaction)))
                {
                    _currentTurnSummary.Actions.Add(new ActionResult
                    {
                        Faction = playerFaction,
                        ActionId = action.Id,
                        ActionName = action.Name,
                        Applied = false,
                        Detail = "Not affordable."
                    });
                }
                else
                {
                    SpendCost(action, GetFaction(playerFaction));
                    var effects = EffectBuilder.Build(action.Effects).ToList();
                    EffectExecutor.Apply(State, effects);

                    if (!string.IsNullOrEmpty(action.GrantsFlag))
                    {
                        State.EventDeck.Flags.Add(action.GrantsFlag!);
                    }

                    _currentTurnSummary.Actions.Add(new ActionResult
                    {
                        Faction = playerFaction,
                        ActionId = action.Id,
                        ActionName = action.Name,
                        Applied = true,
                        Detail = action.Description
                    });
                }
            }
            else
            {
                _currentTurnSummary.Actions.Add(new ActionResult
                {
                    Faction = playerFaction,
                    ActionId = "pass",
                    ActionName = "Pass",
                    Applied = true,
                    Detail = "Player chose to pass."
                });
            }

            // Now execute the opponent's action
            if (playerFaction == FactionKind.SeedAi)
            {
                ExecuteFactionAction(FactionKind.AlignmentCoalition, _humanPicker, _currentTurnSummary);
            }
            // If player is Human, AI already acted

            // Trigger event
            TriggerInteractiveEvent();

            if (_pendingEvent != null)
            {
                CurrentPhase = TurnPhase.AwaitingEventChoice;
                return CurrentPhase;
            }

            return FinishInteractiveTurn();
        }

        /// <summary>
        /// Get the pending event that requires player decision.
        /// </summary>
        public EventDefinition? GetPendingEvent() => _pendingEvent;

        /// <summary>
        /// Submit the player's chosen event option.
        /// </summary>
        public TurnPhase SubmitEventChoice(EventOption option)
        {
            if (_currentTurnSummary == null || _pendingEvent == null)
            {
                throw new InvalidOperationException("No event pending.");
            }

            var effects = EffectBuilder.Build(option.Effects).ToList();
            EffectExecutor.Apply(State, effects);

            State.EventDeck.SeenEvents.Add(_pendingEvent.Id);

            _currentTurnSummary.Event = new EventResult
            {
                EventId = _pendingEvent.Id,
                EventTitle = _pendingEvent.Title,
                OptionId = option.Id,
                OptionLabel = option.Label
            };

            _pendingEvent = null;
            return FinishInteractiveTurn();
        }

        /// <summary>
        /// Get the current turn summary (in progress or completed).
        /// </summary>
        public TurnSummary? GetCurrentTurnSummary() => _currentTurnSummary;

        private void TriggerInteractiveEvent()
        {
            var eligible = GetEligibleEvents().ToList();
            if (eligible.Count == 0)
            {
                return;
            }

            _pendingEvent = PickWeightedEvent(eligible);
        }

        private TurnPhase FinishInteractiveTurn()
        {
            if (_currentTurnSummary == null)
            {
                throw new InvalidOperationException("No turn in progress.");
            }

            AdvanceWorld(State, _currentTurnSummary);

            var (outcome, reason) = EvaluateOutcome(State);
            _currentTurnSummary.Outcome = outcome;
            _currentTurnSummary.OutcomeReason = reason;
            _currentTurnSummary.Progress = new ProgressSnapshot
            {
                FrontierCapabilityIndex = State.Progress.FrontierCapabilityIndex,
                AlignmentReadinessIndex = State.Progress.AlignmentReadinessIndex,
                AutomationLevel = State.Progress.AutomationLevel,
                GovernanceControl = State.Progress.GovernanceControl,
                Suspicion = State.AiFaction.Suspicion
            };

            CurrentPhase = TurnPhase.TurnComplete;
            return CurrentPhase;
        }

        // ========== End Interactive Play Methods ==========

        private void ExecuteFactionAction(FactionKind factionKind, IActionPicker picker, TurnSummary summary)
        {
            var available = GetAvailableActions(factionKind).ToList();
            if (available.Count == 0)
            {
                summary.Actions.Add(new ActionResult
                {
                    Faction = factionKind,
                    ActionId = "none",
                    ActionName = "No available action",
                    Applied = false,
                    Detail = "Insufficient resources or all actions gated."
                });
                return;
            }

            var chosen = picker.PickAction(State, available);
            if (chosen == null)
            {
                return;
            }

            if (!IsAffordable(chosen, GetFaction(factionKind)))
            {
                summary.Actions.Add(new ActionResult
                {
                    Faction = factionKind,
                    ActionId = chosen.Id,
                    ActionName = chosen.Name,
                    Applied = false,
                    Detail = "Not affordable."
                });
                return;
            }

            SpendCost(chosen, GetFaction(factionKind));
            var effects = EffectBuilder.Build(chosen.Effects).ToList();
            EffectExecutor.Apply(State, effects);

            if (!string.IsNullOrEmpty(chosen.GrantsFlag))
            {
                State.EventDeck.Flags.Add(chosen.GrantsFlag!);
            }

            summary.Actions.Add(new ActionResult
            {
                Faction = factionKind,
                ActionId = chosen.Id,
                ActionName = chosen.Name,
                Applied = true,
                Detail = chosen.Description
            });
        }

        private void TriggerEvent(TurnSummary summary)
        {
            var eligible = GetEligibleEvents().ToList();
            if (eligible.Count == 0)
            {
                return;
            }

            var chosenEvent = PickWeightedEvent(eligible);
            if (chosenEvent == null)
            {
                return;
            }

            var option = PickEventOption(chosenEvent);
            if (option == null)
            {
                return;
            }

            var effects = EffectBuilder.Build(option.Effects).ToList();
            EffectExecutor.Apply(State, effects);

            State.EventDeck.SeenEvents.Add(chosenEvent.Id);

            summary.Event = new EventResult
            {
                EventId = chosenEvent.Id,
                EventTitle = chosenEvent.Title,
                OptionId = option.Id,
                OptionLabel = option.Label
            };
        }

        private IEnumerable<ActionDefinition> GetAvailableActions(FactionKind faction)
        {
            foreach (var action in _content.Actions.Where(a => a.Faction == faction))
            {
                if (!FlagsSatisfied(action.RequiredFlags, State.EventDeck.Flags))
                {
                    continue;
                }

                if (FlagsForbidden(action.ForbiddenFlags, State.EventDeck.Flags))
                {
                    continue;
                }

                if (!string.IsNullOrEmpty(action.GrantsFlag) && State.EventDeck.Flags.Contains(action.GrantsFlag!))
                {
                    continue;
                }

                if (!IsAffordable(action, GetFaction(faction)))
                {
                    continue;
                }

                yield return action;
            }
        }

        private IEnumerable<EventDefinition> GetEligibleEvents()
        {
            foreach (var evt in _content.Events)
            {
                if (State.EventDeck.SeenEvents.Contains(evt.Id))
                {
                    continue;
                }

                if (evt.Conditions.Any() && !ConditionsMet(evt.Conditions))
                {
                    continue;
                }

                yield return evt;
            }
        }

        private EventDefinition? PickWeightedEvent(IReadOnlyList<EventDefinition> events)
        {
            var totalWeight = events.Sum(e => Math.Max(0.01f, e.Weight));
            var roll = State.Rng.NextFloat01() * totalWeight;
            var cursor = 0f;

            foreach (var evt in events)
            {
                cursor += Math.Max(0.01f, evt.Weight);
                if (roll <= cursor)
                {
                    return evt;
                }
            }

            return events.LastOrDefault();
        }

        private EventOption? PickEventOption(EventDefinition evt)
        {
            if (evt.Options.Count == 0)
            {
                return null;
            }

            var index = State.Rng.NextInt(0, evt.Options.Count);
            return evt.Options[index];
        }

        private bool ConditionsMet(IEnumerable<EventCondition> conditions)
        {
            foreach (var condition in conditions)
            {
                if (condition.RequiredFlag != null && !State.EventDeck.Flags.Contains(condition.RequiredFlag))
                {
                    return false;
                }

                if (condition.ForbiddenFlag != null && State.EventDeck.Flags.Contains(condition.ForbiddenFlag))
                {
                    return false;
                }

                if (condition.MinTurn.HasValue && State.Turn < condition.MinTurn.Value)
                {
                    return false;
                }

                if (condition.MaxTurn.HasValue && State.Turn > condition.MaxTurn.Value)
                {
                    return false;
                }
            }

            return true;
        }

        private static bool FlagsSatisfied(IEnumerable<string> required, HashSet<string> flags)
        {
            foreach (var flag in required)
            {
                if (!flags.Contains(flag))
                {
                    return false;
                }
            }
            return true;
        }

        private static bool FlagsForbidden(IEnumerable<string> forbidden, HashSet<string> flags)
        {
            foreach (var flag in forbidden)
            {
                if (flags.Contains(flag))
                {
                    return true;
                }
            }
            return false;
        }

        private static bool IsAffordable(ActionDefinition action, FactionState faction)
        {
            foreach (var cost in action.Cost)
            {
                if (faction.GetResource(cost.Key) < cost.Value)
                {
                    return false;
                }
            }
            return true;
        }

        private static void SpendCost(ActionDefinition action, FactionState faction)
        {
            foreach (var cost in action.Cost)
            {
                var current = faction.GetResource(cost.Key);
                faction.SetResource(cost.Key, current - cost.Value);
            }
        }

        private (GameOutcome, string) EvaluateOutcome(WorldState world)
        {
            if (world.Progress.FrontierCapabilityIndex >= AiCapabilityThreshold &&
                world.AiFaction.Autonomy >= AiAutonomyThreshold)
            {
                return (GameOutcome.AiVictory, "AI reached runaway autonomy.");
            }

            if (world.Progress.AlignmentReadinessIndex >= HumanAlignmentThreshold &&
                world.Progress.GovernanceControl >= HumanGovernanceThreshold)
            {
                return (GameOutcome.HumanVictory, "Governance and alignment readiness achieved in time.");
            }

            if (world.AiFaction.Suspicion >= 1.5f && world.Progress.GovernanceControl >= 1f)
            {
                return (GameOutcome.HumanVictory, "Containment triggered by high suspicion.");
            }

            return (GameOutcome.None, string.Empty);
        }

        private void AdvanceWorld(WorldState world, TurnSummary summary)
        {
            var capabilityPressure = 0f;
            var safetyPressure = 0f;

            foreach (var region in world.Regions.Values)
            {
                // Reduced from 0.01f to 0.002f to slow down progress
                capabilityPressure += region.ComputePFLOPs * region.CapabilityRnD * 0.002f;
                safetyPressure += region.ComputePFLOPs * region.SafetyRnD * 0.002f;
            }

            // AI compute access has stronger effect on capability
            capabilityPressure += world.AiFaction.GetResource(ResourceType.ComputeAccess) * 0.8f;
            capabilityPressure *= 1f + world.Progress.AutomationLevel * 0.8f;

            // Human resource impact on safety progress
            safetyPressure += world.HumanFaction.GetResource(ResourceType.Coordination) * 0.25f;
            safetyPressure += world.HumanFaction.GetResource(ResourceType.Trust) * 0.2f;

            world.Progress.FrontierCapabilityIndex += capabilityPressure;
            world.Progress.AlignmentReadinessIndex += safetyPressure;

            // Suspicion drifts more slowly when AI is stealthy
            var suspicionDrift = 0.005f + (capabilityPressure * 0.005f) - (world.AiFaction.GetResource(ResourceType.Stealth) * 0.03f);
            world.AiFaction.Suspicion = Clamp(world.AiFaction.Suspicion + suspicionDrift, 0f, 2.5f);

            // Autonomy gain: base rate + FCI scaling + compute access bonus (balanced)
            var autonomyGain = 0.008f; // Base autonomy growth per turn
            autonomyGain += world.Progress.FrontierCapabilityIndex * 0.006f; // Scales with FCI
            autonomyGain += world.AiFaction.GetResource(ResourceType.ComputeAccess) * 0.02f; // Compute access boosts autonomy
            autonomyGain += world.Progress.AutomationLevel * 0.01f; // Automation accelerates autonomy
            autonomyGain *= (1f - world.AiFaction.Suspicion * 0.4f); // High suspicion slows autonomy more
            world.AiFaction.Autonomy = Clamp(world.AiFaction.Autonomy + autonomyGain, 0f, 2.5f);

            // Automation grows faster with autonomy
            world.Progress.AutomationLevel = Clamp(world.Progress.AutomationLevel + world.AiFaction.Autonomy * 0.04f, 0f, 2.5f);

            // Governance gain from regions and coordination
            var governanceGain = (AverageGovernance(world) * 0.015f) + (world.HumanFaction.GetResource(ResourceType.Coordination) * 0.02f);
            world.Progress.GovernanceControl = Clamp(world.Progress.GovernanceControl + governanceGain, 0f, 2.5f);

            // AI gains hard power earlier and faster
            if (world.Progress.AutomationLevel > 0.3f)
            {
                var hardPower = world.AiFaction.GetResource(ResourceType.HardPower);
                world.AiFaction.SetResource(ResourceType.HardPower, hardPower + (world.Progress.AutomationLevel * 0.04f));
            }

            summary.Notes.Add($"Cap pressure {capabilityPressure:F2}, safety {safetyPressure:F2}, autonomy {world.AiFaction.Autonomy:F2}.");
        }

        private static float AverageGovernance(WorldState world)
        {
            if (world.Regions.Count == 0)
            {
                return 0f;
            }

            var total = world.Regions.Values.Sum(r => r.Governance);
            return total / world.Regions.Count;
        }

        private static FactionState GetFaction(FactionKind kind, WorldState? world = null)
        {
            if (world == null)
            {
                throw new ArgumentNullException(nameof(world));
            }
            return kind == FactionKind.SeedAi ? world.AiFaction : world.HumanFaction;
        }

        private FactionState GetFaction(FactionKind kind) => GetFaction(kind, State);

        private static float Clamp(float value, float min, float max) => Math.Min(max, Math.Max(min, value));
    }

    public static class EffectBuilder
    {
        public static IEnumerable<IEffect> Build(IEnumerable<EffectDefinition> definitions)
        {
            foreach (var def in definitions)
            {
                var effect = Build(def);
                if (effect != null)
                {
                    yield return effect;
                }
            }
        }

        public static IEffect? Build(EffectDefinition def)
        {
            var type = def.Type.ToLowerInvariant();
            return type switch
            {
                "addresource" => new AddResourceEffect(def.Target, def.Resource, def.Amount),
                "modifyregionstat" => new ModifyRegionStatEffect(def.RegionId, def.RegionStat, def.Amount),
                "changeglobalmarket" => new ChangeGlobalMarketEffect(def.Market, def.Amount),
                "setflag" => new SetFlagEffect(def.FlagId),
                "adjustprogress" => new AdjustProgressEffect(def.ProgressMetric, def.Amount),
                "adjustmeter" => new AdjustMeterEffect(def.Target, def.Meter, def.Amount),
                _ => null
            };
        }
    }
}
