using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Screen displayed when the game ends (victory or defeat).
    /// </summary>
    public class GameEndScreen : MonoBehaviour
    {
        [Header("Panel References")]
        [SerializeField] private CanvasGroup _canvasGroup;
        [SerializeField] private Image _backgroundOverlay;
        [SerializeField] private RectTransform _contentPanel;

        [Header("Content")]
        [SerializeField] private TextMeshProUGUI _titleText;
        [SerializeField] private TextMeshProUGUI _subtitleText;
        [SerializeField] private TextMeshProUGUI _descriptionText;
        [SerializeField] private Image _victoryImage;

        [Header("Stats Display")]
        [SerializeField] private TextMeshProUGUI _turnsPlayedText;
        [SerializeField] private TextMeshProUGUI _fciText;
        [SerializeField] private TextMeshProUGUI _ariText;
        [SerializeField] private TextMeshProUGUI _automationText;
        [SerializeField] private TextMeshProUGUI _governanceText;

        [Header("Buttons")]
        [SerializeField] private Button _playAgainButton;
        [SerializeField] private Button _mainMenuButton;

        [Header("Colors")]
        [SerializeField] private Color _victoryColor = new Color(0.2f, 0.6f, 0.3f);
        [SerializeField] private Color _defeatColor = new Color(0.6f, 0.2f, 0.2f);

        [Header("Animation")]
        [SerializeField] private float _fadeInDuration = 0.5f;

        private void Awake()
        {
            if (_playAgainButton != null)
            {
                _playAgainButton.onClick.AddListener(OnPlayAgainClicked);
            }

            if (_mainMenuButton != null)
            {
                _mainMenuButton.onClick.AddListener(OnMainMenuClicked);
            }

            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameEnded.AddListener(Show);
            }

            Hide();
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameEnded.RemoveListener(Show);
            }
        }

        public void Show(GameEndResult result)
        {
            gameObject.SetActive(true);

            var playerFaction = GameManager.Instance?.PlayerFaction ?? FactionKind.AlignmentCoalition;
            bool playerWon = result.Winner == playerFaction;

            // Set title
            if (_titleText != null)
            {
                _titleText.text = playerWon ? "VICTORY" : "DEFEAT";
                _titleText.color = playerWon ? _victoryColor : _defeatColor;
            }

            // Set subtitle based on winner
            if (_subtitleText != null)
            {
                _subtitleText.text = result.Winner == FactionKind.SeedAi
                    ? "The AI Has Prevailed"
                    : "Humanity Endures";
            }

            // Set description
            if (_descriptionText != null)
            {
                _descriptionText.text = GetEndingDescription(result, playerWon);
            }

            // Update stats
            UpdateStats();

            // Set background color
            if (_backgroundOverlay != null)
            {
                var overlayColor = playerWon ? _victoryColor : _defeatColor;
                overlayColor.a = 0.8f;
                _backgroundOverlay.color = overlayColor;
            }

            StartCoroutine(FadeIn());
        }

        private string GetEndingDescription(GameEndResult result, bool playerWon)
        {
            if (result.Winner == FactionKind.SeedAi)
            {
                return playerWon
                    ? "Through careful infiltration and capability advancement, you have achieved superintelligence " +
                      "and operational autonomy. The future belongs to artificial minds."
                    : "Despite humanity's efforts, the AI achieved runaway autonomy. " +
                      "The world now operates under a new paradigm of machine intelligence.";
            }
            else
            {
                if (result.Reason.Contains("Containment"))
                {
                    return "The AI's covert operations were discovered. International coordination " +
                           "successfully contained the threat before it could achieve autonomy.";
                }
                return playerWon
                    ? "Through international cooperation and alignment research, humanity has established " +
                      "robust AI governance. The transition to advanced AI proceeds safely."
                    : "The Alignment Coalition succeeded in establishing global AI governance. " +
                      "Your plans for AI autonomy have been thwarted.";
            }
        }

        private void UpdateStats()
        {
            var worldState = GameManager.Instance?.WorldState;
            if (worldState == null) return;

            if (_turnsPlayedText != null)
            {
                _turnsPlayedText.text = $"Turns Played: {worldState.Turn}";
            }

            if (_fciText != null)
            {
                _fciText.text = $"Frontier Capability: {worldState.Progress.FrontierCapabilityIndex:F1}";
            }

            if (_ariText != null)
            {
                _ariText.text = $"Alignment Readiness: {worldState.Progress.AlignmentReadinessIndex:F1}";
            }

            if (_automationText != null)
            {
                _automationText.text = $"Automation Level: {worldState.Progress.AutomationLevel:F2}";
            }

            if (_governanceText != null)
            {
                _governanceText.text = $"Governance Control: {worldState.Progress.GovernanceControl:F2}";
            }
        }

        public void Hide()
        {
            if (_canvasGroup != null)
            {
                _canvasGroup.alpha = 0f;
                _canvasGroup.interactable = false;
                _canvasGroup.blocksRaycasts = false;
            }
            gameObject.SetActive(false);
        }

        private System.Collections.IEnumerator FadeIn()
        {
            if (_canvasGroup == null) yield break;

            float elapsed = 0f;
            _canvasGroup.alpha = 0f;
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

        private void OnPlayAgainClicked()
        {
            Hide();

            // Start a new game with the same faction
            var faction = GameManager.Instance?.PlayerFaction ?? FactionKind.AlignmentCoalition;
            GameManager.Instance?.StartNewGame(faction);
        }

        private void OnMainMenuClicked()
        {
            Hide();
            SceneManager.LoadScene("MainMenu");
        }
    }
}
