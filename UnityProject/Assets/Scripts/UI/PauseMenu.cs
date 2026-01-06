using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Pause menu with save, load, settings, and quit options.
    /// </summary>
    public class PauseMenu : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private CanvasGroup _canvasGroup;
        [SerializeField] private GameObject _mainPanel;
        [SerializeField] private GameObject _settingsPanel;
        [SerializeField] private GameObject _confirmQuitPanel;

        [Header("Main Menu Buttons")]
        [SerializeField] private Button _resumeButton;
        [SerializeField] private Button _saveButton;
        [SerializeField] private Button _loadButton;
        [SerializeField] private Button _settingsButton;
        [SerializeField] private Button _mainMenuButton;
        [SerializeField] private Button _quitButton;

        [Header("Settings")]
        [SerializeField] private Slider _musicVolumeSlider;
        [SerializeField] private Slider _sfxVolumeSlider;
        [SerializeField] private Button _settingsBackButton;

        [Header("Confirm Quit")]
        [SerializeField] private Button _confirmQuitYes;
        [SerializeField] private Button _confirmQuitNo;

        [Header("Status")]
        [SerializeField] private TextMeshProUGUI _statusText;

        private bool _isPaused;

        private void Awake()
        {
            SetupButtons();
            Hide();
        }

        private void Update()
        {
            if (Input.GetKeyDown(KeyCode.Escape))
            {
                if (_isPaused)
                    Hide();
                else
                    Show();
            }
        }

        private void SetupButtons()
        {
            if (_resumeButton != null)
                _resumeButton.onClick.AddListener(Hide);

            if (_saveButton != null)
                _saveButton.onClick.AddListener(OnSaveClicked);

            if (_loadButton != null)
                _loadButton.onClick.AddListener(OnLoadClicked);

            if (_settingsButton != null)
                _settingsButton.onClick.AddListener(ShowSettings);

            if (_mainMenuButton != null)
                _mainMenuButton.onClick.AddListener(OnMainMenuClicked);

            if (_quitButton != null)
                _quitButton.onClick.AddListener(ShowConfirmQuit);

            if (_settingsBackButton != null)
                _settingsBackButton.onClick.AddListener(ShowMainPanel);

            if (_confirmQuitYes != null)
                _confirmQuitYes.onClick.AddListener(QuitGame);

            if (_confirmQuitNo != null)
                _confirmQuitNo.onClick.AddListener(ShowMainPanel);

            if (_musicVolumeSlider != null)
                _musicVolumeSlider.onValueChanged.AddListener(OnMusicVolumeChanged);

            if (_sfxVolumeSlider != null)
                _sfxVolumeSlider.onValueChanged.AddListener(OnSfxVolumeChanged);
        }

        public void Show()
        {
            _isPaused = true;
            gameObject.SetActive(true);

            if (_canvasGroup != null)
            {
                _canvasGroup.alpha = 1f;
                _canvasGroup.interactable = true;
                _canvasGroup.blocksRaycasts = true;
            }

            ShowMainPanel();
            LoadSettings();
            Time.timeScale = 0f; // Pause the game
        }

        public void Hide()
        {
            _isPaused = false;
            Time.timeScale = 1f; // Resume the game

            if (_canvasGroup != null)
            {
                _canvasGroup.alpha = 0f;
                _canvasGroup.interactable = false;
                _canvasGroup.blocksRaycasts = false;
            }

            gameObject.SetActive(false);
        }

        private void ShowMainPanel()
        {
            SetPanelActive(_mainPanel, true);
            SetPanelActive(_settingsPanel, false);
            SetPanelActive(_confirmQuitPanel, false);
        }

        private void ShowSettings()
        {
            SetPanelActive(_mainPanel, false);
            SetPanelActive(_settingsPanel, true);
            SetPanelActive(_confirmQuitPanel, false);
        }

        private void ShowConfirmQuit()
        {
            SetPanelActive(_mainPanel, false);
            SetPanelActive(_settingsPanel, false);
            SetPanelActive(_confirmQuitPanel, true);
        }

        private void SetPanelActive(GameObject panel, bool active)
        {
            if (panel != null) panel.SetActive(active);
        }

        private void OnSaveClicked()
        {
            if (SaveManager.Instance != null)
            {
                bool success = SaveManager.Instance.SaveGame(0);
                ShowStatus(success ? "Game saved!" : "Save failed!");
            }
        }

        private void OnLoadClicked()
        {
            if (SaveManager.Instance != null && SaveManager.Instance.HasSave(0))
            {
                bool success = SaveManager.Instance.LoadGame(0);
                if (success)
                {
                    Hide();
                }
                else
                {
                    ShowStatus("Load failed!");
                }
            }
            else
            {
                ShowStatus("No save found!");
            }
        }

        private void OnMainMenuClicked()
        {
            Time.timeScale = 1f;
            SceneManager.LoadScene("MainMenu");
        }

        private void QuitGame()
        {
            Time.timeScale = 1f;
#if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
#else
            Application.Quit();
#endif
        }

        private void LoadSettings()
        {
            if (_musicVolumeSlider != null)
                _musicVolumeSlider.value = PlayerPrefs.GetFloat("MusicVolume", 0.7f);

            if (_sfxVolumeSlider != null)
                _sfxVolumeSlider.value = PlayerPrefs.GetFloat("SfxVolume", 1f);
        }

        private void OnMusicVolumeChanged(float value)
        {
            PlayerPrefs.SetFloat("MusicVolume", value);
            AudioManager.Instance?.SetMusicVolume(value);
        }

        private void OnSfxVolumeChanged(float value)
        {
            PlayerPrefs.SetFloat("SfxVolume", value);
            AudioManager.Instance?.SetSfxVolume(value);
        }

        private void ShowStatus(string message)
        {
            if (_statusText != null)
            {
                _statusText.text = message;
                CancelInvoke(nameof(ClearStatus));
                Invoke(nameof(ClearStatus), 2f);
            }
        }

        private void ClearStatus()
        {
            if (_statusText != null)
                _statusText.text = "";
        }

        public bool IsPaused => _isPaused;
    }
}
