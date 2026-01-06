using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Controls the world map view and region display.
    /// </summary>
    public class WorldMapController : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private Transform _regionsContainer;
        [SerializeField] private RegionView _regionPrefab;
        [SerializeField] private RegionInfoPanel _regionInfoPanel;

        [Header("Overlay Settings")]
        [SerializeField] private OverlayType _currentOverlay = OverlayType.None;

        private Dictionary<string, RegionView> _regionViews = new Dictionary<string, RegionView>();
        private RegionState _selectedRegion;

        // Region positions on the map (normalized 0-1 coordinates)
        private static readonly Dictionary<string, Vector2> RegionPositions = new Dictionary<string, Vector2>
        {
            { "north_america", new Vector2(0.2f, 0.65f) },
            { "south_america", new Vector2(0.28f, 0.35f) },
            { "europe", new Vector2(0.48f, 0.7f) },
            { "africa", new Vector2(0.5f, 0.4f) },
            { "middle_east", new Vector2(0.58f, 0.55f) },
            { "russia", new Vector2(0.65f, 0.8f) },
            { "south_asia", new Vector2(0.68f, 0.5f) },
            { "east_asia", new Vector2(0.78f, 0.65f) },
            { "southeast_asia", new Vector2(0.75f, 0.45f) },
            { "oceania", new Vector2(0.85f, 0.3f) }
        };

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStarted.AddListener(OnGameStarted);
                GameManager.Instance.OnWorldStateChanged.AddListener(RefreshRegions);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStarted.RemoveListener(OnGameStarted);
                GameManager.Instance.OnWorldStateChanged.RemoveListener(RefreshRegions);
            }
        }

        private void OnGameStarted()
        {
            CreateRegionViews();
            RefreshRegions();
        }

        private void CreateRegionViews()
        {
            // Clear existing views
            foreach (var view in _regionViews.Values)
            {
                if (view != null) Destroy(view.gameObject);
            }
            _regionViews.Clear();

            if (_regionPrefab == null || _regionsContainer == null) return;

            var worldState = GameManager.Instance.WorldState;
            if (worldState == null) return;

            RectTransform containerRect = _regionsContainer as RectTransform;
            Vector2 containerSize = containerRect != null ? containerRect.rect.size : new Vector2(1920, 1080);

            foreach (var region in worldState.Regions.Values)
            {
                var view = Instantiate(_regionPrefab, _regionsContainer);
                view.Initialize(region, this);

                // Position the region
                if (RegionPositions.TryGetValue(region.Id, out var normalizedPos))
                {
                    var rectTransform = view.GetComponent<RectTransform>();
                    if (rectTransform != null)
                    {
                        rectTransform.anchoredPosition = new Vector2(
                            normalizedPos.x * containerSize.x - containerSize.x / 2,
                            normalizedPos.y * containerSize.y - containerSize.y / 2
                        );
                    }
                }

                _regionViews[region.Id] = view;
            }
        }

        public void RefreshRegions()
        {
            if (GameManager.Instance?.WorldState == null) return;

            foreach (var kvp in _regionViews)
            {
                var region = GameManager.Instance.GetRegion(kvp.Key);
                if (region != null)
                {
                    kvp.Value.UpdateDisplay(region, _currentOverlay);
                }
            }
        }

        public void SetOverlay(OverlayType overlay)
        {
            _currentOverlay = overlay;
            RefreshRegions();
        }

        public void OnRegionClicked(RegionState region)
        {
            _selectedRegion = region;

            // Highlight selected region
            foreach (var view in _regionViews.Values)
            {
                view.SetSelected(view.RegionId == region.Id);
            }

            // Show info panel
            if (_regionInfoPanel != null)
            {
                _regionInfoPanel.Show(region);
            }
        }

        public void DeselectRegion()
        {
            _selectedRegion = null;
            foreach (var view in _regionViews.Values)
            {
                view.SetSelected(false);
            }

            if (_regionInfoPanel != null)
            {
                _regionInfoPanel.Hide();
            }
        }

        public RegionState SelectedRegion => _selectedRegion;
    }

    public enum OverlayType
    {
        None,
        Compute,
        Energy,
        Governance,
        Security,
        Sentiment,
        CapabilityRnD,
        SafetyRnD
    }
}
