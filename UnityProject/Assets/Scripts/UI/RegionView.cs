using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Visual representation of a single region on the map.
    /// </summary>
    public class RegionView : MonoBehaviour, IPointerClickHandler, IPointerEnterHandler, IPointerExitHandler
    {
        [Header("UI References")]
        [SerializeField] private Image _regionImage;
        [SerializeField] private Image _overlayImage;
        [SerializeField] private Image _selectionOutline;
        [SerializeField] private TextMeshProUGUI _regionNameText;
        [SerializeField] private TextMeshProUGUI _overlayValueText;
        [SerializeField] private CanvasGroup _hoverGroup;

        [Header("Colors")]
        [SerializeField] private Color _normalColor = new Color(0.3f, 0.5f, 0.7f, 0.8f);
        [SerializeField] private Color _hoverColor = new Color(0.4f, 0.6f, 0.8f, 0.9f);
        [SerializeField] private Color _selectedColor = new Color(0.5f, 0.7f, 0.9f, 1f);

        [Header("Overlay Colors")]
        [SerializeField] private Gradient _computeGradient;
        [SerializeField] private Gradient _energyGradient;
        [SerializeField] private Gradient _governanceGradient;
        [SerializeField] private Gradient _securityGradient;

        private WorldMapController _mapController;
        private string _regionId;
        private bool _isSelected;
        private bool _isHovered;

        public string RegionId => _regionId;

        private void Awake()
        {
            // Set up default gradients if not configured
            if (_computeGradient == null) _computeGradient = CreateDefaultGradient(Color.blue, Color.cyan);
            if (_energyGradient == null) _energyGradient = CreateDefaultGradient(Color.yellow, Color.red);
            if (_governanceGradient == null) _governanceGradient = CreateDefaultGradient(Color.gray, Color.green);
            if (_securityGradient == null) _securityGradient = CreateDefaultGradient(Color.red, Color.green);
        }

        private Gradient CreateDefaultGradient(Color lowColor, Color highColor)
        {
            var gradient = new Gradient();
            gradient.SetKeys(
                new GradientColorKey[] { new GradientColorKey(lowColor, 0f), new GradientColorKey(highColor, 1f) },
                new GradientAlphaKey[] { new GradientAlphaKey(0.6f, 0f), new GradientAlphaKey(0.8f, 1f) }
            );
            return gradient;
        }

        public void Initialize(RegionState region, WorldMapController controller)
        {
            _regionId = region.Id;
            _mapController = controller;

            if (_regionNameText != null)
            {
                _regionNameText.text = FormatRegionName(region.Id);
            }

            if (_selectionOutline != null)
            {
                _selectionOutline.enabled = false;
            }

            UpdateDisplay(region, OverlayType.None);
        }

        public void UpdateDisplay(RegionState region, OverlayType overlay)
        {
            if (region == null) return;

            float overlayValue = 0f;
            float maxValue = 100f;
            Gradient gradient = null;
            string valueLabel = "";

            switch (overlay)
            {
                case OverlayType.Compute:
                    overlayValue = region.ComputePFLOPs;
                    maxValue = 1000f;
                    gradient = _computeGradient;
                    valueLabel = $"{overlayValue:F0} PFLOPS";
                    break;

                case OverlayType.Energy:
                    overlayValue = region.EnergyMW;
                    maxValue = 10000f;
                    gradient = _energyGradient;
                    valueLabel = $"{overlayValue:F0} MW";
                    break;

                case OverlayType.Governance:
                    overlayValue = region.Governance;
                    maxValue = 10f;
                    gradient = _governanceGradient;
                    valueLabel = $"Gov: {overlayValue:F1}";
                    break;

                case OverlayType.Security:
                    overlayValue = region.Security;
                    maxValue = 10f;
                    gradient = _securityGradient;
                    valueLabel = $"Sec: {overlayValue:F1}";
                    break;

                case OverlayType.Sentiment:
                    overlayValue = region.SentimentRegulation;
                    maxValue = 10f;
                    gradient = _governanceGradient;
                    valueLabel = $"Reg: {overlayValue:F1}";
                    break;

                case OverlayType.CapabilityRnD:
                    overlayValue = region.CapabilityRnD;
                    maxValue = 10f;
                    gradient = _computeGradient;
                    valueLabel = $"Cap R&D: {overlayValue:F1}";
                    break;

                case OverlayType.SafetyRnD:
                    overlayValue = region.SafetyRnD;
                    maxValue = 10f;
                    gradient = _securityGradient;
                    valueLabel = $"Safety R&D: {overlayValue:F1}";
                    break;

                case OverlayType.None:
                default:
                    break;
            }

            // Update overlay display
            if (_overlayImage != null)
            {
                if (overlay != OverlayType.None && gradient != null)
                {
                    _overlayImage.enabled = true;
                    float normalizedValue = Mathf.Clamp01(overlayValue / maxValue);
                    _overlayImage.color = gradient.Evaluate(normalizedValue);
                }
                else
                {
                    _overlayImage.enabled = false;
                }
            }

            if (_overlayValueText != null)
            {
                _overlayValueText.text = overlay != OverlayType.None ? valueLabel : "";
            }

            UpdateColor();
        }

        public void SetSelected(bool selected)
        {
            _isSelected = selected;

            if (_selectionOutline != null)
            {
                _selectionOutline.enabled = selected;
            }

            UpdateColor();
        }

        private void UpdateColor()
        {
            if (_regionImage == null) return;

            if (_isSelected)
            {
                _regionImage.color = _selectedColor;
            }
            else if (_isHovered)
            {
                _regionImage.color = _hoverColor;
            }
            else
            {
                _regionImage.color = _normalColor;
            }
        }

        public void OnPointerClick(PointerEventData eventData)
        {
            var region = GameManager.Instance?.GetRegion(_regionId);
            if (region != null && _mapController != null)
            {
                _mapController.OnRegionClicked(region);
            }
        }

        public void OnPointerEnter(PointerEventData eventData)
        {
            _isHovered = true;
            UpdateColor();

            if (_hoverGroup != null)
            {
                _hoverGroup.alpha = 1f;
            }
        }

        public void OnPointerExit(PointerEventData eventData)
        {
            _isHovered = false;
            UpdateColor();

            if (_hoverGroup != null)
            {
                _hoverGroup.alpha = 0f;
            }
        }

        private string FormatRegionName(string id)
        {
            // Convert snake_case to Title Case
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
}
