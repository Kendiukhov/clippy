using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Individual action card in the action bar.
    /// </summary>
    public class ActionCard : MonoBehaviour, IPointerClickHandler, IPointerEnterHandler, IPointerExitHandler
    {
        [Header("UI References")]
        [SerializeField] private Image _backgroundImage;
        [SerializeField] private Image _borderImage;
        [SerializeField] private TextMeshProUGUI _nameText;
        [SerializeField] private TextMeshProUGUI _descriptionText;
        [SerializeField] private TextMeshProUGUI _costText;
        [SerializeField] private TextMeshProUGUI _categoryText;
        [SerializeField] private CanvasGroup _tooltipGroup;

        [Header("Colors")]
        [SerializeField] private Color _normalColor = new Color(0.2f, 0.2f, 0.3f, 0.9f);
        [SerializeField] private Color _hoverColor = new Color(0.3f, 0.3f, 0.4f, 0.95f);
        [SerializeField] private Color _selectedColor = new Color(0.4f, 0.5f, 0.6f, 1f);
        [SerializeField] private Color _disabledColor = new Color(0.15f, 0.15f, 0.2f, 0.6f);

        [Header("Category Colors")]
        [SerializeField] private Color _governanceColor = new Color(0.2f, 0.6f, 0.3f);
        [SerializeField] private Color _safetyColor = new Color(0.3f, 0.5f, 0.8f);
        [SerializeField] private Color _securityColor = new Color(0.7f, 0.3f, 0.3f);
        [SerializeField] private Color _infrastructureColor = new Color(0.6f, 0.5f, 0.2f);
        [SerializeField] private Color _stealthColor = new Color(0.4f, 0.2f, 0.5f);
        [SerializeField] private Color _capabilityColor = new Color(0.7f, 0.4f, 0.2f);
        [SerializeField] private Color _defaultCategoryColor = new Color(0.5f, 0.5f, 0.5f);

        private ActionBarController _controller;
        private ActionDefinition _action;
        private bool _isSelected;
        private bool _isHovered;
        private bool _isAffordable;

        public ActionDefinition Action => _action;

        public void Initialize(ActionDefinition action, ActionBarController controller)
        {
            _action = action;
            _controller = controller;
            _isAffordable = GameManager.Instance?.CanAffordAction(action) ?? false;

            UpdateDisplay();
        }

        private void UpdateDisplay()
        {
            if (_action == null) return;

            // Set name
            if (_nameText != null)
            {
                _nameText.text = _action.Name;
            }

            // Set description
            if (_descriptionText != null)
            {
                _descriptionText.text = _action.Description;
            }

            // Set category
            if (_categoryText != null)
            {
                _categoryText.text = _action.Category.ToUpperInvariant();
                _categoryText.color = GetCategoryColor(_action.Category);
            }

            // Set cost display
            if (_costText != null)
            {
                _costText.text = FormatCosts(_action.Cost);
            }

            // Hide tooltip by default
            if (_tooltipGroup != null)
            {
                _tooltipGroup.alpha = 0f;
            }

            UpdateColor();
        }

        private string FormatCosts(System.Collections.Generic.Dictionary<ResourceType, float> costs)
        {
            if (costs == null || costs.Count == 0) return "Free";

            var costStrings = new System.Collections.Generic.List<string>();
            foreach (var cost in costs)
            {
                costStrings.Add($"{cost.Value:F0} {FormatResourceName(cost.Key)}");
            }
            return string.Join(", ", costStrings);
        }

        private string FormatResourceName(ResourceType resource)
        {
            return resource switch
            {
                ResourceType.Budget => "Budget",
                ResourceType.Influence => "Influence",
                ResourceType.Stealth => "Stealth",
                ResourceType.Coordination => "Coord",
                ResourceType.Trust => "Trust",
                ResourceType.HardPower => "Hard Power",
                ResourceType.ComputeAccess => "Compute",
                ResourceType.Energy => "Energy",
                _ => resource.ToString()
            };
        }

        private Color GetCategoryColor(string category)
        {
            return category?.ToLowerInvariant() switch
            {
                "governance" => _governanceColor,
                "safety" => _safetyColor,
                "security" => _securityColor,
                "infrastructure" => _infrastructureColor,
                "stealth" => _stealthColor,
                "capability" => _capabilityColor,
                _ => _defaultCategoryColor
            };
        }

        public void SetSelected(bool selected)
        {
            _isSelected = selected;
            UpdateColor();
        }

        private void UpdateColor()
        {
            if (_backgroundImage == null) return;

            if (!_isAffordable)
            {
                _backgroundImage.color = _disabledColor;
            }
            else if (_isSelected)
            {
                _backgroundImage.color = _selectedColor;
            }
            else if (_isHovered)
            {
                _backgroundImage.color = _hoverColor;
            }
            else
            {
                _backgroundImage.color = _normalColor;
            }

            // Update border for selected state
            if (_borderImage != null)
            {
                _borderImage.enabled = _isSelected;
            }
        }

        public void OnPointerClick(PointerEventData eventData)
        {
            if (!_isAffordable) return;
            _controller?.OnActionSelected(_action);
        }

        public void OnPointerEnter(PointerEventData eventData)
        {
            _isHovered = true;
            UpdateColor();

            // Show tooltip
            if (_tooltipGroup != null)
            {
                _tooltipGroup.alpha = 1f;
            }
        }

        public void OnPointerExit(PointerEventData eventData)
        {
            _isHovered = false;
            UpdateColor();

            // Hide tooltip
            if (_tooltipGroup != null)
            {
                _tooltipGroup.alpha = 0f;
            }
        }
    }
}
