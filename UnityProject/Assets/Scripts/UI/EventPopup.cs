using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Popup dialog for displaying game events and player choices.
    /// </summary>
    public class EventPopup : MonoBehaviour
    {
        [Header("Panel References")]
        [SerializeField] private CanvasGroup _canvasGroup;
        [SerializeField] private Image _backgroundOverlay;
        [SerializeField] private RectTransform _popupPanel;

        [Header("Content References")]
        [SerializeField] private TextMeshProUGUI _titleText;
        [SerializeField] private TextMeshProUGUI _descriptionText;
        [SerializeField] private Transform _optionsContainer;
        [SerializeField] private EventOptionButton _optionButtonPrefab;
        [SerializeField] private Button _dismissButton;

        [Header("Animation")]
        [SerializeField] private float _fadeInDuration = 0.3f;
        [SerializeField] private float _fadeOutDuration = 0.2f;

        private EventDefinition _currentEvent;
        private List<EventOptionButton> _optionButtons = new List<EventOptionButton>();
        private bool _isShowing;

        private void Awake()
        {
            if (_dismissButton != null)
            {
                _dismissButton.onClick.AddListener(Hide);
            }

            // Subscribe to events
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnEventTriggered.AddListener(Show);
            }

            Hide();
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnEventTriggered.RemoveListener(Show);
            }
        }

        public void Show(EventDefinition evt)
        {
            if (evt == null) return;

            _currentEvent = evt;
            _isShowing = true;
            gameObject.SetActive(true);

            UpdateDisplay();
            StartCoroutine(FadeIn());
        }

        public void Hide()
        {
            _isShowing = false;
            StartCoroutine(FadeOut());
        }

        private void UpdateDisplay()
        {
            if (_currentEvent == null) return;

            // Set title and description
            if (_titleText != null)
            {
                _titleText.text = _currentEvent.Title;
            }

            if (_descriptionText != null)
            {
                _descriptionText.text = _currentEvent.Description;
            }

            // Clear existing option buttons
            foreach (var button in _optionButtons)
            {
                if (button != null) Destroy(button.gameObject);
            }
            _optionButtons.Clear();

            // Create option buttons
            if (_optionButtonPrefab != null && _optionsContainer != null)
            {
                for (int i = 0; i < _currentEvent.Options.Count; i++)
                {
                    var option = _currentEvent.Options[i];
                    var button = Instantiate(_optionButtonPrefab, _optionsContainer);
                    button.Initialize(option, i, this);
                    _optionButtons.Add(button);
                }
            }

            // Show/hide dismiss button based on whether there are options
            if (_dismissButton != null)
            {
                _dismissButton.gameObject.SetActive(_currentEvent.Options.Count == 0);
            }
        }

        public void OnOptionSelected(int optionIndex)
        {
            if (_currentEvent == null || optionIndex < 0 || optionIndex >= _currentEvent.Options.Count)
                return;

            var summary = GameManager.Instance?.SubmitEventChoice(optionIndex);
            if (summary != null)
            {
                Debug.Log($"[EventPopup] Option selected: {_currentEvent.Options[optionIndex].Label}");
                Hide();
            }
        }

        private System.Collections.IEnumerator FadeIn()
        {
            if (_canvasGroup == null) yield break;

            float elapsed = 0f;
            _canvasGroup.alpha = 0f;
            _canvasGroup.interactable = false;
            _canvasGroup.blocksRaycasts = true;

            while (elapsed < _fadeInDuration)
            {
                elapsed += Time.deltaTime;
                _canvasGroup.alpha = Mathf.Lerp(0f, 1f, elapsed / _fadeInDuration);
                yield return null;
            }

            _canvasGroup.alpha = 1f;
            _canvasGroup.interactable = true;
        }

        private System.Collections.IEnumerator FadeOut()
        {
            if (_canvasGroup == null) yield break;

            float elapsed = 0f;
            float startAlpha = _canvasGroup.alpha;
            _canvasGroup.interactable = false;

            while (elapsed < _fadeOutDuration)
            {
                elapsed += Time.deltaTime;
                _canvasGroup.alpha = Mathf.Lerp(startAlpha, 0f, elapsed / _fadeOutDuration);
                yield return null;
            }

            _canvasGroup.alpha = 0f;
            _canvasGroup.blocksRaycasts = false;
            gameObject.SetActive(false);
        }
    }

    /// <summary>
    /// Button for event option selection.
    /// </summary>
    public class EventOptionButton : MonoBehaviour
    {
        [SerializeField] private Button _button;
        [SerializeField] private TextMeshProUGUI _labelText;
        [SerializeField] private TextMeshProUGUI _effectsText;

        private EventOption _option;
        private int _optionIndex;
        private EventPopup _popup;

        public void Initialize(EventOption option, int index, EventPopup popup)
        {
            _option = option;
            _optionIndex = index;
            _popup = popup;

            if (_labelText != null)
            {
                _labelText.text = option.Label;
            }

            if (_effectsText != null)
            {
                _effectsText.text = FormatEffects(option.Effects);
            }

            if (_button != null)
            {
                _button.onClick.AddListener(OnClick);
            }
        }

        private string FormatEffects(List<EffectDefinition> effects)
        {
            if (effects == null || effects.Count == 0) return "";

            var effectStrings = new List<string>();
            foreach (var effect in effects)
            {
                string effectDesc = effect.Type.ToLowerInvariant() switch
                {
                    "addresource" => $"{(effect.Amount >= 0 ? "+" : "")}{effect.Amount:F0} {effect.Resource}",
                    "adjustprogress" => $"{(effect.Amount >= 0 ? "+" : "")}{effect.Amount:F1} {effect.ProgressMetric}",
                    "adjustmeter" => $"{(effect.Amount >= 0 ? "+" : "")}{effect.Amount:F1} {effect.Meter}",
                    "setflag" => $"Unlock: {effect.FlagId}",
                    _ => $"{effect.Type}"
                };
                effectStrings.Add(effectDesc);
            }

            return string.Join("\n", effectStrings);
        }

        private void OnClick()
        {
            _popup?.OnOptionSelected(_optionIndex);
        }
    }
}
