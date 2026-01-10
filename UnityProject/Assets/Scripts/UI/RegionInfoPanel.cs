using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Panel showing detailed information about a selected region.
    /// </summary>
    public class RegionInfoPanel : MonoBehaviour
    {
        [Header("Panel References")]
        [SerializeField] private CanvasGroup _canvasGroup;
        [SerializeField] private TextMeshProUGUI _regionNameText;
        [SerializeField] private Button _closeButton;

        [Header("Stat Displays")]
        [SerializeField] private StatBar _computeBar;
        [SerializeField] private StatBar _energyBar;
        [SerializeField] private StatBar _securityBar;
        [SerializeField] private StatBar _governanceBar;
        [SerializeField] private StatBar _sentimentBar;
        [SerializeField] private StatBar _capabilityRnDBar;
        [SerializeField] private StatBar _safetyRnDBar;

        [Header("Facilities")]
        [SerializeField] private Transform _facilitiesContainer;
        [SerializeField] private TextMeshProUGUI _facilitiesText;

        private RegionState _currentRegion;
        private string _currentRegionId;

        private void Awake()
        {
            if (_closeButton != null)
            {
                _closeButton.onClick.AddListener(Hide);
            }

            Hide();
        }

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnWorldStateChanged.AddListener(UpdateFromWorld);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnWorldStateChanged.RemoveListener(UpdateFromWorld);
            }
        }

        public void Show(RegionState region)
        {
            if (region == null) return;

            _currentRegion = region;
            _currentRegionId = region.Id;
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
            _currentRegion = null;
            _currentRegionId = null;

            if (_canvasGroup != null)
            {
                _canvasGroup.alpha = 0f;
                _canvasGroup.interactable = false;
                _canvasGroup.blocksRaycasts = false;
            }

            gameObject.SetActive(false);
        }

        private void UpdateFromWorld()
        {
            if (string.IsNullOrEmpty(_currentRegionId)) return;

            var region = GameManager.Instance?.GetRegion(_currentRegionId);
            if (region == null)
            {
                Hide();
                return;
            }

            _currentRegion = region;
            UpdateDisplay();
        }

        private void UpdateDisplay()
        {
            if (_currentRegion == null) return;

            // Update region name
            if (_regionNameText != null)
            {
                _regionNameText.text = FormatRegionName(_currentRegion.Id);
            }

            // Update stat bars
            UpdateStatBar(_computeBar, "Compute", _currentRegion.ComputePFLOPs, 1000f, "PFLOPS");
            UpdateStatBar(_energyBar, "Energy", _currentRegion.EnergyMW, 10000f, "MW");
            UpdateStatBar(_securityBar, "Security", _currentRegion.Security, 10f);
            UpdateStatBar(_governanceBar, "Governance", _currentRegion.Governance, 10f);
            UpdateStatBar(_sentimentBar, "Regulation", _currentRegion.SentimentRegulation, 10f);
            UpdateStatBar(_capabilityRnDBar, "Capability R&D", _currentRegion.CapabilityRnD, 10f);
            UpdateStatBar(_safetyRnDBar, "Safety R&D", _currentRegion.SafetyRnD, 10f);

            // Update facilities list
            if (_facilitiesText != null)
            {
                if (_currentRegion.Facilities.Count > 0)
                {
                    var facilityList = "";
                    foreach (var facility in _currentRegion.Facilities)
                    {
                        facilityList += $"- {facility.Type} (Level {facility.Level})\n";
                    }
                    _facilitiesText.text = facilityList.TrimEnd('\n');
                }
                else
                {
                    _facilitiesText.text = "No facilities";
                }
            }
        }

        private void UpdateStatBar(StatBar bar, string label, float value, float maxValue, string unit = "")
        {
            if (bar == null) return;
            bar.SetValue(label, value, maxValue, unit);
        }

        private string FormatRegionName(string id)
        {
            var words = id.Split('_');
            for (int i = 0; i < words.Length; i++)
            {
                if (words[i].Length > 0)
                {
                    words[i] = char.ToUpper(words[i][0]) + words[i].Substring(1);
                }
            }
            return string.Join(" ", words);
        }
    }

    /// <summary>
    /// Simple stat bar component for displaying region statistics.
    /// </summary>
    [System.Serializable]
    public class StatBar : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI _labelText;
        [SerializeField] private TextMeshProUGUI _valueText;
        [SerializeField] private Image _fillImage;
        [SerializeField] private Gradient _fillGradient;

        public void SetValue(string label, float value, float maxValue, string unit = "")
        {
            if (_labelText != null)
            {
                _labelText.text = label;
            }

            if (_valueText != null)
            {
                _valueText.text = string.IsNullOrEmpty(unit)
                    ? $"{value:F1}"
                    : $"{value:F0} {unit}";
            }

            if (_fillImage != null)
            {
                float normalizedValue = Mathf.Clamp01(value / maxValue);
                _fillImage.fillAmount = normalizedValue;

                if (_fillGradient != null)
                {
                    _fillImage.color = _fillGradient.Evaluate(normalizedValue);
                }
            }
        }
    }
}
