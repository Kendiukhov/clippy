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
        }

        private void OnEndTurnClicked()
        {
            if (GameManager.Instance == null || !GameManager.Instance.IsGameActive) return;

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

            UpdateResource(_budgetDisplay, "Budget", factionState.GetResource(ResourceType.Budget));
            UpdateResource(_influenceDisplay, "Influence", factionState.GetResource(ResourceType.Influence));
            UpdateResource(_coordinationDisplay, "Coordination", factionState.GetResource(ResourceType.Coordination));
            UpdateResource(_trustDisplay, "Trust", factionState.GetResource(ResourceType.Trust));
        }

        private void UpdateResource(ResourceDisplay display, string label, float value)
        {
            if (display == null) return;
            display.SetValue(label, value);
        }

        private void UpdateTurnCounter()
        {
            if (_turnCounterText == null) return;
            _turnCounterText.text = $"Turn {GameManager.Instance?.CurrentTurn ?? 0}";
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
