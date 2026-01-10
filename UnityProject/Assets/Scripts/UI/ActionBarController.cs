using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Controls the bottom action bar UI.
    /// </summary>
    public class ActionBarController : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private Transform _actionsContainer;
        [SerializeField] private ActionCard _actionCardPrefab;
        [SerializeField] private Button _endTurnButton;
        [SerializeField] private TextMeshProUGUI _endTurnText;
        [SerializeField] private TextMeshProUGUI _turnCounterText;

        [Header("Resources Display")]
        [SerializeField] private ResourceDisplay _budgetDisplay;
        [SerializeField] private ResourceDisplay _influenceDisplay;
        [SerializeField] private ResourceDisplay _coordinationDisplay;
        [SerializeField] private ResourceDisplay _trustDisplay;
        [SerializeField] private ResourceDisplay _stealthDisplay;
        [SerializeField] private ResourceDisplay _computeDisplay;
        [SerializeField] private ResourceDisplay _energyDisplay;
        [SerializeField] private ResourceDisplay _hardPowerDisplay;

        private List<ActionCard> _actionCards = new List<ActionCard>();
        private ActionDefinition _selectedAction;

        private void Start()
        {
            if (_endTurnButton != null)
            {
                _endTurnButton.onClick.AddListener(OnEndTurnClicked);
            }

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStarted.AddListener(RefreshActions);
                GameManager.Instance.OnWorldStateChanged.AddListener(RefreshActions);
                GameManager.Instance.OnTurnEnded.AddListener(OnTurnEnded);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStarted.RemoveListener(RefreshActions);
                GameManager.Instance.OnWorldStateChanged.RemoveListener(RefreshActions);
                GameManager.Instance.OnTurnEnded.RemoveListener(OnTurnEnded);
            }
        }

        public void RefreshActions()
        {
            ClearActionCards();

            if (GameManager.Instance == null || !GameManager.Instance.IsGameActive) return;

            var availableActions = GameManager.Instance.GetAvailableActions();

            foreach (var action in availableActions)
            {
                CreateActionCard(action);
            }

            UpdateResourceDisplay();
            UpdateTurnCounter();
            UpdateEndTurnState();
        }

        private void ClearActionCards()
        {
            foreach (var card in _actionCards)
            {
                if (card != null) Destroy(card.gameObject);
            }
            _actionCards.Clear();
            _selectedAction = null;
        }

        private void CreateActionCard(ActionDefinition action)
        {
            if (_actionCardPrefab == null || _actionsContainer == null) return;

            var card = Instantiate(_actionCardPrefab, _actionsContainer);
            card.Initialize(action, this);
            _actionCards.Add(card);
        }

        public void OnActionSelected(ActionDefinition action)
        {
            _selectedAction = action;

            // Update visual selection state
            foreach (var card in _actionCards)
            {
                card.SetSelected(card.Action?.Id == action.Id);
            }

            Debug.Log($"[ActionBar] Selected action: {action.Name}");
            UpdateEndTurnState();
        }

        private void OnEndTurnClicked()
        {
            if (GameManager.Instance == null || !GameManager.Instance.IsGameActive) return;
            if (GameManager.Instance.AwaitingEventChoice) return;

            // Execute turn with selected action
            string actionId = _selectedAction?.Id;
            var summary = GameManager.Instance.ExecutePlayerTurn(actionId);

            if (summary != null)
            {
                Debug.Log($"[ActionBar] Turn {summary.Turn} completed. Outcome: {summary.Outcome}");
            }
        }

        private void OnTurnEnded()
        {
            _selectedAction = null;
            RefreshActions();
        }

        private void UpdateResourceDisplay()
        {
            var factionState = GameManager.Instance?.PlayerFactionState;
            if (factionState == null) return;

            var faction = GameManager.Instance.PlayerFaction;

            if (faction == FactionKind.SeedAi)
            {
                UpdateResource(_stealthDisplay, "Stealth", factionState.GetResource(ResourceType.Stealth), true);
                UpdateResource(_computeDisplay, "Compute", factionState.GetResource(ResourceType.ComputeAccess), true);
                UpdateResource(_energyDisplay, "Energy", factionState.GetResource(ResourceType.Energy), true);
                UpdateResource(_influenceDisplay, "Influence", factionState.GetResource(ResourceType.Influence), true);
                UpdateResource(_budgetDisplay, "Budget", factionState.GetResource(ResourceType.Budget), _budgetDisplay != null);
                UpdateResource(_coordinationDisplay, "Coordination", 0f, false);
                UpdateResource(_trustDisplay, "Trust", 0f, false);
                UpdateResource(_hardPowerDisplay, "Hard Power", factionState.GetResource(ResourceType.HardPower), _hardPowerDisplay != null);
            }
            else
            {
                UpdateResource(_budgetDisplay, "Budget", factionState.GetResource(ResourceType.Budget), true);
                UpdateResource(_influenceDisplay, "Influence", factionState.GetResource(ResourceType.Influence), true);
                UpdateResource(_coordinationDisplay, "Coordination", factionState.GetResource(ResourceType.Coordination), true);
                UpdateResource(_trustDisplay, "Trust", factionState.GetResource(ResourceType.Trust), true);
                UpdateResource(_stealthDisplay, "Stealth", 0f, false);
                UpdateResource(_computeDisplay, "Compute", 0f, false);
                UpdateResource(_energyDisplay, "Energy", 0f, false);
                UpdateResource(_hardPowerDisplay, "Hard Power", 0f, false);
            }
        }

        private void UpdateResource(ResourceDisplay display, string label, float value, bool active)
        {
            if (display == null) return;
            display.gameObject.SetActive(active);
            if (active)
            {
                display.SetValue(label, value);
            }
        }

        private void UpdateTurnCounter()
        {
            if (_turnCounterText == null) return;
            _turnCounterText.text = $"Turn {GameManager.Instance?.CurrentTurn ?? 0}";
        }

        private void UpdateEndTurnState()
        {
            if (_endTurnButton == null) return;

            if (GameManager.Instance == null || !GameManager.Instance.IsGameActive)
            {
                _endTurnButton.interactable = false;
                if (_endTurnText != null) _endTurnText.text = "End Turn";
                return;
            }

            if (GameManager.Instance.AwaitingEventChoice)
            {
                _endTurnButton.interactable = false;
                if (_endTurnText != null) _endTurnText.text = "Resolve Event";
                return;
            }

            _endTurnButton.interactable = true;
            if (_endTurnText != null)
            {
                _endTurnText.text = _selectedAction == null ? "End Turn (Pass)" : "End Turn";
            }
        }
    }

    /// <summary>
    /// Simple resource display component.
    /// </summary>
    [System.Serializable]
    public class ResourceDisplay : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI _labelText;
        [SerializeField] private TextMeshProUGUI _valueText;
        [SerializeField] private Image _icon;

        public void SetValue(string label, float value)
        {
            if (_labelText != null)
            {
                _labelText.text = label;
            }

            if (_valueText != null)
            {
                _valueText.text = value.ToString("F1");
            }
        }
    }
}
