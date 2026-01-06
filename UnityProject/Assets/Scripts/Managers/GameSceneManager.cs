using UnityEngine;
using Clippy.SimCore;

namespace Clippy.Unity
{
    /// <summary>
    /// Initializes the game scene and starts the game based on player selection.
    /// </summary>
    public class GameSceneManager : MonoBehaviour
    {
        [Header("Scene References")]
        [SerializeField] private GameObject _loadingScreen;
        [SerializeField] private GameObject _gameUI;

        [Header("Default Settings")]
        [SerializeField] private FactionKind _defaultFaction = FactionKind.AlignmentCoalition;
        [SerializeField] private bool _autoStartGame = true;

        private void Start()
        {
            // Show loading, hide game UI initially
            if (_loadingScreen != null) _loadingScreen.SetActive(true);
            if (_gameUI != null) _gameUI.SetActive(false);

            // Initialize the game
            StartCoroutine(InitializeGame());
        }

        private System.Collections.IEnumerator InitializeGame()
        {
            yield return null; // Wait a frame for all objects to initialize

            // Check for pending load
            string pendingLoad = PlayerPrefs.GetString("PendingLoad", "");
            if (!string.IsNullOrEmpty(pendingLoad))
            {
                PlayerPrefs.DeleteKey("PendingLoad");

                if (GameManager.Instance != null)
                {
                    bool loaded = GameManager.Instance.LoadGame(pendingLoad);
                    if (loaded)
                    {
                        Debug.Log("[GameSceneManager] Loaded saved game");
                        FinishLoading();
                        yield break;
                    }
                }
            }

            // Start new game with selected faction
            FactionKind faction = _defaultFaction;
            if (PlayerPrefs.HasKey("SelectedFaction"))
            {
                faction = (FactionKind)PlayerPrefs.GetInt("SelectedFaction", (int)_defaultFaction);
                PlayerPrefs.DeleteKey("SelectedFaction");
            }

            if (_autoStartGame && GameManager.Instance != null)
            {
                GameManager.Instance.StartNewGame(faction);
                Debug.Log($"[GameSceneManager] Started new game as {faction}");
            }

            yield return null;
            FinishLoading();
        }

        private void FinishLoading()
        {
            if (_loadingScreen != null) _loadingScreen.SetActive(false);
            if (_gameUI != null) _gameUI.SetActive(true);
        }

        private void Update()
        {
            // Handle keyboard shortcuts
            if (Input.GetKeyDown(KeyCode.F5))
            {
                QuickSave();
            }

            if (Input.GetKeyDown(KeyCode.F9))
            {
                QuickLoad();
            }

            if (Input.GetKeyDown(KeyCode.Escape))
            {
                TogglePauseMenu();
            }
        }

        private void QuickSave()
        {
            if (SaveManager.Instance != null)
            {
                SaveManager.Instance.QuickSave();
                Debug.Log("[GameSceneManager] Quick saved");
            }
        }

        private void QuickLoad()
        {
            if (SaveManager.Instance != null)
            {
                SaveManager.Instance.QuickLoad();
                Debug.Log("[GameSceneManager] Quick loaded");
            }
        }

        private void TogglePauseMenu()
        {
            // TODO: Implement pause menu toggle
            Debug.Log("[GameSceneManager] Pause menu toggled");
        }
    }
}
