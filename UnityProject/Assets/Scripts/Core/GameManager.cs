using UnityEngine;
using UnityEngine.Events;
using System.Collections.Generic;
using System.Linq;
using Clippy.SimCore;

namespace Clippy.Unity
{
    /// <summary>
    /// Central game manager that bridges Unity UI with SimCore simulation.
    /// Singleton pattern for global access.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Game State")]
        [SerializeField] private bool _isGameActive;
        [SerializeField] private FactionKind _playerFaction = FactionKind.AlignmentCoalition;
        [SerializeField] private int _simulationSeed = 12345;

        // Simulation state
        private Simulation _simulation;
        private SimContent _content;

        // Pending event for player choice
        private EventDefinition _pendingEvent;
        private bool _awaitingEventChoice;

        // Events for UI updates
        public UnityEvent OnGameStarted = new UnityEvent();
        public UnityEvent OnTurnStarted = new UnityEvent();
        public UnityEvent OnTurnEnded = new UnityEvent();
        public TurnSummaryEvent OnTurnResolved = new TurnSummaryEvent();
        public UnityEvent<EventDefinition> OnEventTriggered = new UnityEvent<EventDefinition>();
        public UnityEvent<GameEndResult> OnGameEnded = new UnityEvent<GameEndResult>();
        public UnityEvent OnWorldStateChanged = new UnityEvent();

        // Properties
        public WorldState WorldState => _simulation?.State;
        public SimContent Content => _content;
        public Simulation Simulation => _simulation;
        public bool IsGameActive => _isGameActive;
        public FactionKind PlayerFaction => _playerFaction;
        public int CurrentTurn => WorldState?.Turn ?? 0;
        public bool AwaitingEventChoice => _awaitingEventChoice;
        public EventDefinition PendingEvent => _pendingEvent;
        public TurnPhase CurrentPhase => _simulation?.CurrentPhase ?? TurnPhase.TurnComplete;

        public FactionState PlayerFactionState => _playerFaction == FactionKind.SeedAi
            ? WorldState?.AiFaction
            : WorldState?.HumanFaction;

        public FactionState OpponentFactionState => _playerFaction == FactionKind.SeedAi
            ? WorldState?.HumanFaction
            : WorldState?.AiFaction;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        /// <summary>
        /// Initialize and start a new game.
        /// </summary>
        public void StartNewGame(FactionKind playerFaction, int? seed = null, bool startTurn = true)
        {
            _playerFaction = playerFaction;
            _simulationSeed = seed ?? Random.Range(1, 100000);

            LoadContent();
            InitializeSimulation();

            _isGameActive = true;
            _awaitingEventChoice = false;
            _pendingEvent = null;

            OnGameStarted?.Invoke();
            OnWorldStateChanged?.Invoke();

            if (startTurn)
            {
                BeginTurn();
            }

            Debug.Log($"[GameManager] New game started. Player: {_playerFaction}, Seed: {_simulationSeed}");
        }

        private void LoadContent()
        {
            // Load content from Resources folder
            var scenarioJson = Resources.Load<TextAsset>("Content/scenario");
            var actionsJson = Resources.Load<TextAsset>("Content/actions");
            var eventsJson = Resources.Load<TextAsset>("Content/events");
            var upgradesJson = Resources.Load<TextAsset>("Content/upgrades");
            var charactersJson = Resources.Load<TextAsset>("Content/characters");

            if (scenarioJson == null || actionsJson == null || eventsJson == null)
            {
                Debug.LogError("[GameManager] Failed to load content files from Resources/Content/");
                return;
            }

            _content = ContentLoader.Load(
                scenarioJson.text,
                actionsJson.text,
                eventsJson.text,
                upgradesJson?.text,
                charactersJson?.text
            );
            Debug.Log($"[GameManager] Content loaded: {_content.Actions.Count} actions, {_content.Events.Count} events, {_content.Characters.Count} characters");
        }

        private void InitializeSimulation()
        {
            // Override scenario seed with our seed
            _content.Scenario.Seed = _simulationSeed;
            // Use interactive mode with player faction
            _simulation = new Simulation(_content, _playerFaction);
        }

        /// <summary>
        /// Get playable factions from scenario for faction selection screen.
        /// </summary>
        public List<PlayableFactionDefinition> GetPlayableFactions()
        {
            if (_content == null)
            {
                LoadContent();
            }
            return _content?.Scenario?.PlayableFactions ?? new List<PlayableFactionDefinition>();
        }

        /// <summary>
        /// Get character by ID.
        /// </summary>
        public CharacterDefinition GetCharacter(string characterId)
        {
            return _content?.Characters?.Find(c => c.Id == characterId);
        }

        /// <summary>
        /// Get all characters.
        /// </summary>
        public List<CharacterDefinition> GetAllCharacters()
        {
            return _content?.Characters ?? new List<CharacterDefinition>();
        }

        /// <summary>
        /// Get available actions for the player faction.
        /// </summary>
        public List<ActionDefinition> GetAvailableActions()
        {
            if (_simulation != null && _simulation.IsInteractive)
            {
                return _simulation.GetPlayerAvailableActions().ToList();
            }

            return GetAvailableActionsForFaction(_playerFaction);
        }

        /// <summary>
        /// Get available actions for a specific faction.
        /// </summary>
        public List<ActionDefinition> GetAvailableActionsForFaction(FactionKind faction)
        {
            var result = new List<ActionDefinition>();
            if (WorldState == null || _content == null) return result;

            var factionState = faction == FactionKind.SeedAi ? WorldState.AiFaction : WorldState.HumanFaction;

            foreach (var action in _content.Actions)
            {
                if (action.Faction != faction) continue;
                if (!CanAffordAction(action, factionState)) continue;
                if (!MeetsActionRequirements(action)) continue;
                result.Add(action);
            }

            return result;
        }

        /// <summary>
        /// Check if faction can afford an action.
        /// </summary>
        public bool CanAffordAction(ActionDefinition action, FactionState factionState = null)
        {
            factionState ??= PlayerFactionState;
            if (factionState == null) return false;

            foreach (var cost in action.Cost)
            {
                var currentValue = factionState.GetResource(cost.Key);
                if (currentValue < cost.Value) return false;
            }

            return true;
        }

        /// <summary>
        /// Check if action requirements (flags) are met.
        /// </summary>
        public bool MeetsActionRequirements(ActionDefinition action)
        {
            if (WorldState == null) return false;

            // Check required flags
            foreach (var flag in action.RequiredFlags)
            {
                if (!WorldState.EventDeck.Flags.Contains(flag)) return false;
            }

            // Check forbidden flags
            foreach (var flag in action.ForbiddenFlags)
            {
                if (WorldState.EventDeck.Flags.Contains(flag)) return false;
            }

            // Check if action already granted its flag
            if (!string.IsNullOrEmpty(action.GrantsFlag) && WorldState.EventDeck.Flags.Contains(action.GrantsFlag))
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Execute player's turn with selected action.
        /// Returns the turn summary.
        /// </summary>
        public TurnSummary ExecutePlayerTurn(string actionId)
        {
            if (!_isGameActive || WorldState == null) return null;
            if (_awaitingEventChoice) return null;

            if (CurrentPhase == TurnPhase.TurnComplete)
            {
                BeginTurn();
            }

            var action = ResolvePlayerAction(actionId);
            var phase = _simulation.SubmitPlayerAction(action);
            var summary = _simulation.GetCurrentTurnSummary();

            OnWorldStateChanged?.Invoke();

            // Check if an event was triggered that needs player choice
            if (phase == TurnPhase.AwaitingEventChoice)
            {
                _pendingEvent = _simulation.GetPendingEvent();
                _awaitingEventChoice = _pendingEvent != null;

                if (_pendingEvent != null)
                {
                    OnEventTriggered?.Invoke(_pendingEvent);
                }

                return summary;
            }

            return FinalizeTurn(summary);
        }

        /// <summary>
        /// Submit the player's selected event option.
        /// </summary>
        public TurnSummary SubmitEventChoice(int optionIndex)
        {
            if (!_isGameActive || !_awaitingEventChoice || _pendingEvent == null) return null;

            if (optionIndex < 0 || optionIndex >= _pendingEvent.Options.Count) return null;

            var phase = _simulation.SubmitEventChoice(_pendingEvent.Options[optionIndex]);
            var summary = _simulation.GetCurrentTurnSummary();

            _awaitingEventChoice = false;
            _pendingEvent = null;

            OnWorldStateChanged?.Invoke();

            if (phase == TurnPhase.TurnComplete)
            {
                return FinalizeTurn(summary);
            }

            return summary;
        }

        /// <summary>
        /// Get region state by ID.
        /// </summary>
        public RegionState GetRegion(string regionId)
        {
            if (WorldState == null) return null;
            WorldState.Regions.TryGetValue(regionId, out var region);
            return region;
        }

        /// <summary>
        /// Get all regions.
        /// </summary>
        public IEnumerable<RegionState> GetAllRegions()
        {
            return WorldState?.Regions.Values ?? Enumerable.Empty<RegionState>();
        }

        /// <summary>
        /// Get progress state.
        /// </summary>
        public ProgressState GetProgress()
        {
            return WorldState?.Progress;
        }

        /// <summary>
        /// Save current game state to JSON.
        /// </summary>
        public string SaveGame()
        {
            if (WorldState == null) return null;

            var saveData = new GameSaveData
            {
                Version = 1,
                Seed = _simulationSeed,
                PlayerFaction = _playerFaction,
                Turn = WorldState.Turn,
                // For a full implementation, serialize the entire WorldState
            };

            return JsonUtility.ToJson(saveData, true);
        }

        /// <summary>
        /// Load game from save data.
        /// </summary>
        public bool LoadGame(string saveJson)
        {
            try
            {
                var saveData = JsonUtility.FromJson<GameSaveData>(saveJson);
                if (saveData == null) return false;

                // Restart game with saved seed and faction
                StartNewGame(saveData.PlayerFaction, saveData.Seed, startTurn: false);

                // Fast-forward to saved turn
                for (int i = 0; i < saveData.Turn; i++)
                {
                    _simulation.RunTurn();
                }

                BeginTurn();
                return true;
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"[GameManager] Failed to load save: {ex.Message}");
                return false;
            }
        }

        private void BeginTurn()
        {
            if (_simulation == null) return;

            _simulation.BeginInteractiveTurn();
            _awaitingEventChoice = false;
            _pendingEvent = null;

            OnTurnStarted?.Invoke();
            OnWorldStateChanged?.Invoke();
        }

        private ActionDefinition ResolvePlayerAction(string actionId)
        {
            if (string.IsNullOrWhiteSpace(actionId) || _content == null) return null;

            var action = _content.Actions.FirstOrDefault(a => a.Id == actionId);
            if (action == null) return null;

            if (action.Faction != _playerFaction) return null;
            if (!MeetsActionRequirements(action)) return null;
            if (!CanAffordAction(action, PlayerFactionState)) return null;

            return action;
        }

        private TurnSummary FinalizeTurn(TurnSummary summary)
        {
            OnTurnEnded?.Invoke();
            if (summary != null)
            {
                OnTurnResolved?.Invoke(summary);
            }

            if (summary != null && summary.Outcome != GameOutcome.None)
            {
                _isGameActive = false;
                var result = new GameEndResult
                {
                    Winner = summary.Outcome == GameOutcome.AiVictory ? FactionKind.SeedAi : FactionKind.AlignmentCoalition,
                    Reason = summary.OutcomeReason
                };
                OnGameEnded?.Invoke(result);
                return summary;
            }

            BeginTurn();
            return summary;
        }
    }

    [System.Serializable]
    public class GameSaveData
    {
        public int Version;
        public int Seed;
        public FactionKind PlayerFaction;
        public int Turn;
    }

    [System.Serializable]
    public class GameEndResult
    {
        public FactionKind Winner;
        public string Reason;
    }

    [System.Serializable]
    public class TurnSummaryEvent : UnityEvent<TurnSummary>
    {
    }
}
