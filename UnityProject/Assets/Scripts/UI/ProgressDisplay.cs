using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Displays global progress metrics and faction meters.
    /// </summary>
    public class ProgressDisplay : MonoBehaviour
    {
        [Header("Progress Bars")]
        [SerializeField] private ProgressBar _fciBar;
        [SerializeField] private ProgressBar _ariBar;
        [SerializeField] private ProgressBar _automationBar;
        [SerializeField] private ProgressBar _governanceBar;

        [Header("Faction Meters")]
        [SerializeField] private ProgressBar _suspicionBar;
        [SerializeField] private ProgressBar _autonomyBar;
        [SerializeField] private ProgressBar _legitimacyBar;

        [Header("Turn Display")]
        [SerializeField] private TextMeshProUGUI _turnText;
        [SerializeField] private TextMeshProUGUI _factionText;

        [Header("Victory Progress")]
        [SerializeField] private Image _aiVictoryProgress;
        [SerializeField] private Image _humanVictoryProgress;
        [SerializeField] private TextMeshProUGUI _aiVictoryText;
        [SerializeField] private TextMeshProUGUI _humanVictoryText;

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStarted.AddListener(UpdateDisplay);
                GameManager.Instance.OnWorldStateChanged.AddListener(UpdateDisplay);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStarted.RemoveListener(UpdateDisplay);
                GameManager.Instance.OnWorldStateChanged.RemoveListener(UpdateDisplay);
            }
        }

        public void UpdateDisplay()
        {
            var worldState = GameManager.Instance?.WorldState;
            if (worldState == null) return;

            var progress = worldState.Progress;
            var aiFaction = worldState.AiFaction;
            var humanFaction = worldState.HumanFaction;

            // Update progress metrics
            UpdateBar(_fciBar, "Frontier Capability", progress.FrontierCapabilityIndex, 10f,
                "AI capability advancement toward superintelligence");
            UpdateBar(_ariBar, "Alignment Readiness", progress.AlignmentReadinessIndex, 10f,
                "Global readiness for safe AI development");
            UpdateBar(_automationBar, "Automation Level", progress.AutomationLevel, 2.5f,
                "Degree of AI automation in the economy");
            UpdateBar(_governanceBar, "Governance Control", progress.GovernanceControl, 2.5f,
                "Effectiveness of AI governance frameworks");

            // Update AI faction meters
            UpdateBar(_suspicionBar, "Suspicion", aiFaction.Suspicion, 2.5f,
                "How suspicious humans are of AI intentions", isNegative: true);
            UpdateBar(_autonomyBar, "Autonomy", aiFaction.Autonomy, 2.5f,
                "AI's operational independence from human oversight");

            // Update human faction meters
            UpdateBar(_legitimacyBar, "Legitimacy", humanFaction.Legitimacy, 2.5f,
                "Public trust in AI governance institutions");

            // Update turn and faction info
            if (_turnText != null)
            {
                _turnText.text = $"Turn {worldState.Turn}";
            }

            if (_factionText != null)
            {
                var playerFaction = GameManager.Instance.PlayerFaction;
                _factionText.text = playerFaction == FactionKind.SeedAi
                    ? "Playing as: Seed AI"
                    : "Playing as: Alignment Coalition";
            }

            // Update victory progress indicators
            UpdateVictoryProgress(progress, aiFaction);
        }

        private void UpdateBar(ProgressBar bar, string label, float value, float maxValue,
            string tooltip = "", bool isNegative = false)
        {
            if (bar == null) return;
            bar.SetValue(label, value, maxValue, tooltip, isNegative);
        }

        private void UpdateVictoryProgress(ProgressState progress, FactionState aiFaction)
        {
            // AI Victory: FCI >= 10 AND Autonomy >= 1.5
            float aiProgress = (progress.FrontierCapabilityIndex / 10f + aiFaction.Autonomy / 1.5f) / 2f;

            // Human Victory: ARI >= 10 AND Governance >= 1.5
            float humanProgress = (progress.AlignmentReadinessIndex / 10f + progress.GovernanceControl / 1.5f) / 2f;

            if (_aiVictoryProgress != null)
            {
                _aiVictoryProgress.fillAmount = Mathf.Clamp01(aiProgress);
            }

            if (_humanVictoryProgress != null)
            {
                _humanVictoryProgress.fillAmount = Mathf.Clamp01(humanProgress);
            }

            if (_aiVictoryText != null)
            {
                _aiVictoryText.text = $"AI Victory: {aiProgress * 100:F0}%";
            }

            if (_humanVictoryText != null)
            {
                _humanVictoryText.text = $"Human Victory: {humanProgress * 100:F0}%";
            }
        }
    }

    /// <summary>
    /// Individual progress bar component with label and tooltip.
    /// </summary>
    [System.Serializable]
    public class ProgressBar : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI _labelText;
        [SerializeField] private TextMeshProUGUI _valueText;
        [SerializeField] private Image _fillImage;
        [SerializeField] private Image _backgroundImage;
        [SerializeField] private CanvasGroup _tooltipGroup;
        [SerializeField] private TextMeshProUGUI _tooltipText;

        [Header("Colors")]
        [SerializeField] private Color _positiveColor = new Color(0.3f, 0.7f, 0.4f);
        [SerializeField] private Color _negativeColor = new Color(0.7f, 0.3f, 0.3f);
        [SerializeField] private Color _neutralColor = new Color(0.5f, 0.5f, 0.6f);

        private string _tooltip;

        public void SetValue(string label, float value, float maxValue, string tooltip = "", bool isNegative = false)
        {
            _tooltip = tooltip;

            if (_labelText != null)
            {
                _labelText.text = label;
            }

            if (_valueText != null)
            {
                _valueText.text = $"{value:F1} / {maxValue:F1}";
            }

            if (_fillImage != null)
            {
                float normalizedValue = Mathf.Clamp01(value / maxValue);
                _fillImage.fillAmount = normalizedValue;
                _fillImage.color = isNegative ? _negativeColor : _positiveColor;
            }

            if (_tooltipText != null)
            {
                _tooltipText.text = tooltip;
            }
        }

        public void ShowTooltip()
        {
            if (_tooltipGroup != null && !string.IsNullOrEmpty(_tooltip))
            {
                _tooltipGroup.alpha = 1f;
            }
        }

        public void HideTooltip()
        {
            if (_tooltipGroup != null)
            {
                _tooltipGroup.alpha = 0f;
            }
        }
    }
}
