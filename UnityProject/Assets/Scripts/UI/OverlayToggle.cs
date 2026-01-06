using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Controls overlay toggle buttons for the map view.
    /// </summary>
    public class OverlayToggleGroup : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private WorldMapController _mapController;
        [SerializeField] private Transform _buttonsContainer;

        [Header("Toggle Buttons")]
        [SerializeField] private OverlayToggleButton _computeToggle;
        [SerializeField] private OverlayToggleButton _energyToggle;
        [SerializeField] private OverlayToggleButton _governanceToggle;
        [SerializeField] private OverlayToggleButton _securityToggle;
        [SerializeField] private OverlayToggleButton _sentimentToggle;
        [SerializeField] private OverlayToggleButton _capabilityRnDToggle;
        [SerializeField] private OverlayToggleButton _safetyRnDToggle;

        private OverlayType _currentOverlay = OverlayType.None;
        private OverlayToggleButton _selectedButton;

        private void Start()
        {
            InitializeToggle(_computeToggle, OverlayType.Compute);
            InitializeToggle(_energyToggle, OverlayType.Energy);
            InitializeToggle(_governanceToggle, OverlayType.Governance);
            InitializeToggle(_securityToggle, OverlayType.Security);
            InitializeToggle(_sentimentToggle, OverlayType.Sentiment);
            InitializeToggle(_capabilityRnDToggle, OverlayType.CapabilityRnD);
            InitializeToggle(_safetyRnDToggle, OverlayType.SafetyRnD);
        }

        private void InitializeToggle(OverlayToggleButton toggle, OverlayType overlayType)
        {
            if (toggle == null) return;
            toggle.Initialize(overlayType, this);
        }

        public void OnToggleSelected(OverlayToggleButton button, OverlayType overlayType)
        {
            // If same button clicked, toggle off
            if (_currentOverlay == overlayType)
            {
                _currentOverlay = OverlayType.None;
                _selectedButton?.SetSelected(false);
                _selectedButton = null;
            }
            else
            {
                // Deselect previous
                _selectedButton?.SetSelected(false);

                // Select new
                _currentOverlay = overlayType;
                _selectedButton = button;
                _selectedButton?.SetSelected(true);
            }

            // Update map
            if (_mapController != null)
            {
                _mapController.SetOverlay(_currentOverlay);
            }
        }

        public OverlayType CurrentOverlay => _currentOverlay;
    }

    /// <summary>
    /// Individual overlay toggle button.
    /// </summary>
    public class OverlayToggleButton : MonoBehaviour
    {
        [SerializeField] private Button _button;
        [SerializeField] private Image _buttonImage;
        [SerializeField] private Image _iconImage;
        [SerializeField] private TextMeshProUGUI _labelText;

        [Header("Colors")]
        [SerializeField] private Color _normalColor = new Color(0.3f, 0.3f, 0.4f, 0.8f);
        [SerializeField] private Color _selectedColor = new Color(0.4f, 0.6f, 0.8f, 1f);
        [SerializeField] private Color _hoverColor = new Color(0.35f, 0.45f, 0.55f, 0.9f);

        private OverlayToggleGroup _group;
        private OverlayType _overlayType;
        private bool _isSelected;

        public void Initialize(OverlayType overlayType, OverlayToggleGroup group)
        {
            _overlayType = overlayType;
            _group = group;

            if (_button != null)
            {
                _button.onClick.AddListener(OnClick);
            }

            if (_labelText != null)
            {
                _labelText.text = GetOverlayLabel(overlayType);
            }

            UpdateVisuals();
        }

        private string GetOverlayLabel(OverlayType type)
        {
            return type switch
            {
                OverlayType.Compute => "Compute",
                OverlayType.Energy => "Energy",
                OverlayType.Governance => "Gov",
                OverlayType.Security => "Security",
                OverlayType.Sentiment => "Regulation",
                OverlayType.CapabilityRnD => "Cap R&D",
                OverlayType.SafetyRnD => "Safety R&D",
                _ => "None"
            };
        }

        public void SetSelected(bool selected)
        {
            _isSelected = selected;
            UpdateVisuals();
        }

        private void UpdateVisuals()
        {
            if (_buttonImage != null)
            {
                _buttonImage.color = _isSelected ? _selectedColor : _normalColor;
            }
        }

        private void OnClick()
        {
            _group?.OnToggleSelected(this, _overlayType);
        }
    }
}
