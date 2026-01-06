using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using TMPro;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Tutorial overlay that guides new players through the game.
    /// </summary>
    public class TutorialOverlay : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private CanvasGroup _canvasGroup;
        [SerializeField] private RectTransform _tooltipPanel;
        [SerializeField] private TextMeshProUGUI _titleText;
        [SerializeField] private TextMeshProUGUI _descriptionText;
        [SerializeField] private Button _nextButton;
        [SerializeField] private Button _skipButton;
        [SerializeField] private TextMeshProUGUI _stepIndicator;
        [SerializeField] private Image _highlightMask;

        [Header("Settings")]
        [SerializeField] private bool _showOnFirstLaunch = true;
        [SerializeField] private string _tutorialCompletedKey = "TutorialCompleted";

        private List<TutorialStep> _steps;
        private int _currentStep;
        private bool _isActive;

        private void Awake()
        {
            InitializeTutorialSteps();

            if (_nextButton != null)
                _nextButton.onClick.AddListener(NextStep);

            if (_skipButton != null)
                _skipButton.onClick.AddListener(SkipTutorial);

            Hide();
        }

        private void Start()
        {
            if (_showOnFirstLaunch && !HasCompletedTutorial())
            {
                Show();
            }
        }

        private void InitializeTutorialSteps()
        {
            _steps = new List<TutorialStep>
            {
                new TutorialStep
                {
                    Title = "Welcome to Clippy",
                    Description = "Clippy is a strategy game about the race between AI capability and human alignment efforts. Your goal depends on which faction you choose.",
                    HighlightArea = null
                },
                new TutorialStep
                {
                    Title = "The World Map",
                    Description = "The map shows 10 global regions. Each region has stats like Compute, Energy, Governance, and R&D levels. Click on a region to see its details.",
                    HighlightArea = new Rect(0, 0, 1, 0.7f)
                },
                new TutorialStep
                {
                    Title = "Overlays",
                    Description = "Use the overlay buttons to visualize different stats across regions. This helps you identify strategic opportunities.",
                    HighlightArea = new Rect(0, 0.7f, 0.3f, 0.1f)
                },
                new TutorialStep
                {
                    Title = "Progress Meters",
                    Description = "The top bar shows global progress. FCI (Frontier Capability Index) tracks AI advancement. ARI (Alignment Readiness Index) tracks safety progress.",
                    HighlightArea = new Rect(0, 0.85f, 1, 0.15f)
                },
                new TutorialStep
                {
                    Title = "Actions",
                    Description = "Each turn, select an action from the bottom bar. Actions cost resources and have effects on regions and global progress.",
                    HighlightArea = new Rect(0, 0, 1, 0.2f)
                },
                new TutorialStep
                {
                    Title = "Events",
                    Description = "Random events occur each turn, presenting choices that affect the game. Read carefully and choose wisely!",
                    HighlightArea = null
                },
                new TutorialStep
                {
                    Title = "Victory Conditions",
                    Description = "AI wins by reaching FCI 10 with high Autonomy. Humans win by reaching ARI 10 with strong Governance. Watch the victory progress indicators!",
                    HighlightArea = null
                },
                new TutorialStep
                {
                    Title = "Ready to Play",
                    Description = "You're ready to start! Remember: F5 saves, F9 loads, and ESC opens the menu. Good luck shaping the future of AI!",
                    HighlightArea = null
                }
            };
        }

        public void Show()
        {
            _isActive = true;
            _currentStep = 0;
            gameObject.SetActive(true);

            if (_canvasGroup != null)
            {
                _canvasGroup.alpha = 1f;
                _canvasGroup.interactable = true;
                _canvasGroup.blocksRaycasts = true;
            }

            UpdateDisplay();
        }

        public void Hide()
        {
            _isActive = false;

            if (_canvasGroup != null)
            {
                _canvasGroup.alpha = 0f;
                _canvasGroup.interactable = false;
                _canvasGroup.blocksRaycasts = false;
            }

            gameObject.SetActive(false);
        }

        private void UpdateDisplay()
        {
            if (_currentStep < 0 || _currentStep >= _steps.Count) return;

            var step = _steps[_currentStep];

            if (_titleText != null)
                _titleText.text = step.Title;

            if (_descriptionText != null)
                _descriptionText.text = step.Description;

            if (_stepIndicator != null)
                _stepIndicator.text = $"{_currentStep + 1} / {_steps.Count}";

            // Update highlight area
            if (_highlightMask != null)
            {
                _highlightMask.enabled = step.HighlightArea.HasValue;
                if (step.HighlightArea.HasValue)
                {
                    // Position highlight mask based on normalized rect
                    var rect = step.HighlightArea.Value;
                    var maskRect = _highlightMask.rectTransform;
                    maskRect.anchorMin = new Vector2(rect.x, rect.y);
                    maskRect.anchorMax = new Vector2(rect.x + rect.width, rect.y + rect.height);
                    maskRect.offsetMin = Vector2.zero;
                    maskRect.offsetMax = Vector2.zero;
                }
            }

            // Update button text for last step
            if (_nextButton != null)
            {
                var buttonText = _nextButton.GetComponentInChildren<TextMeshProUGUI>();
                if (buttonText != null)
                {
                    buttonText.text = _currentStep == _steps.Count - 1 ? "Start Playing" : "Next";
                }
            }
        }

        private void NextStep()
        {
            _currentStep++;

            if (_currentStep >= _steps.Count)
            {
                CompleteTutorial();
            }
            else
            {
                UpdateDisplay();
            }
        }

        private void SkipTutorial()
        {
            CompleteTutorial();
        }

        private void CompleteTutorial()
        {
            PlayerPrefs.SetInt(_tutorialCompletedKey, 1);
            PlayerPrefs.Save();
            Hide();
        }

        public bool HasCompletedTutorial()
        {
            return PlayerPrefs.GetInt(_tutorialCompletedKey, 0) == 1;
        }

        public void ResetTutorial()
        {
            PlayerPrefs.DeleteKey(_tutorialCompletedKey);
        }
    }

    [System.Serializable]
    public struct TutorialStep
    {
        public string Title;
        public string Description;
        public Rect? HighlightArea; // Normalized screen rect to highlight
    }
}
