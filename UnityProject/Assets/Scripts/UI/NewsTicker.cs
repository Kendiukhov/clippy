using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Scrolling news ticker that displays game events and turn summaries.
    /// </summary>
    public class NewsTicker : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private RectTransform _tickerContainer;
        [SerializeField] private TextMeshProUGUI _tickerTextPrefab;
        [SerializeField] private ScrollRect _scrollRect;

        [Header("Settings")]
        [SerializeField] private int _maxMessages = 20;
        [SerializeField] private float _scrollSpeed = 50f;
        [SerializeField] private bool _autoScroll = true;

        [Header("Colors")]
        [SerializeField] private Color _eventColor = new Color(0.9f, 0.8f, 0.3f);
        [SerializeField] private Color _actionColor = new Color(0.6f, 0.8f, 0.9f);
        [SerializeField] private Color _warningColor = new Color(0.9f, 0.5f, 0.3f);
        [SerializeField] private Color _normalColor = new Color(0.8f, 0.8f, 0.8f);

        private Queue<NewsEntry> _messages = new Queue<NewsEntry>();
        private List<TextMeshProUGUI> _textObjects = new List<TextMeshProUGUI>();

        private void Start()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnTurnEnded.AddListener(OnTurnEnded);
                GameManager.Instance.OnEventTriggered.AddListener(OnEventTriggered);
            }
        }

        private void OnDestroy()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnTurnEnded.RemoveListener(OnTurnEnded);
                GameManager.Instance.OnEventTriggered.RemoveListener(OnEventTriggered);
            }
        }

        public void AddMessage(string message, NewsType type = NewsType.Normal)
        {
            var entry = new NewsEntry
            {
                Message = message,
                Type = type,
                Turn = GameManager.Instance?.CurrentTurn ?? 0
            };

            _messages.Enqueue(entry);

            // Remove old messages if over limit
            while (_messages.Count > _maxMessages)
            {
                _messages.Dequeue();
            }

            RefreshDisplay();
        }

        private void OnTurnEnded()
        {
            int turn = GameManager.Instance?.CurrentTurn ?? 0;
            AddMessage($"[Turn {turn}] Turn completed.", NewsType.Normal);
        }

        private void OnEventTriggered(EventDefinition evt)
        {
            if (evt == null) return;
            AddMessage($"EVENT: {evt.Title}", NewsType.Event);
        }

        private void RefreshDisplay()
        {
            // Clear existing text objects
            foreach (var textObj in _textObjects)
            {
                if (textObj != null) Destroy(textObj.gameObject);
            }
            _textObjects.Clear();

            if (_tickerTextPrefab == null || _tickerContainer == null) return;

            // Create text objects for each message
            foreach (var entry in _messages)
            {
                var textObj = Instantiate(_tickerTextPrefab, _tickerContainer);
                textObj.text = $"[T{entry.Turn}] {entry.Message}";
                textObj.color = GetColorForType(entry.Type);
                _textObjects.Add(textObj);
            }

            // Auto-scroll to bottom
            if (_autoScroll && _scrollRect != null)
            {
                Canvas.ForceUpdateCanvases();
                _scrollRect.verticalNormalizedPosition = 0f;
            }
        }

        private Color GetColorForType(NewsType type)
        {
            return type switch
            {
                NewsType.Event => _eventColor,
                NewsType.Action => _actionColor,
                NewsType.Warning => _warningColor,
                _ => _normalColor
            };
        }

        public void Clear()
        {
            _messages.Clear();
            RefreshDisplay();
        }
    }

    public enum NewsType
    {
        Normal,
        Event,
        Action,
        Warning
    }

    public struct NewsEntry
    {
        public string Message;
        public NewsType Type;
        public int Turn;
    }
}
