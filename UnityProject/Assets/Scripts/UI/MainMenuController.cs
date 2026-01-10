using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using Clippy.SimCore;

namespace Clippy.Unity.UI
{
    /// <summary>
    /// Main menu controller for game start and settings.
    /// </summary>
    public class MainMenuController : MonoBehaviour
    {
        [Header("Menu Panels")]
        [SerializeField] private GameObject _mainPanel;
        [SerializeField] private GameObject _factionSelectPanel;
        [SerializeField] private GameObject _settingsPanel;
        [SerializeField] private GameObject _loadGamePanel;

        [Header("Main Menu Buttons")]
        [SerializeField] private Button _newGameButton;
        [SerializeField] private Button _continueButton;
        [SerializeField] private Button _settingsButton;
        [SerializeField] private Button _quitButton;

        [Header("Faction Selection")]
        [SerializeField] private Button _playAsAIButton;
        [SerializeField] private Button _playAsHumanButton;
        [SerializeField] private Button _factionBackButton;
        [SerializeField] private TextMeshProUGUI _factionNameText;
        [SerializeField] private TextMeshProUGUI _factionTaglineText;
        [SerializeField] private TextMeshProUGUI _factionDescriptionText;
        [SerializeField] private TextMeshProUGUI _factionPlayStyleText;
        [SerializeField] private TextMeshProUGUI _factionVictoryText;

        [Header("Settings")]
        [SerializeField] private Slider _musicVolumeSlider;
        [SerializeField] private Slider _sfxVolumeSlider;
        [SerializeField] private Toggle _tutorialToggle;
        [SerializeField] private Button _settingsBackButton;

        [Header("Load Game")]
        [SerializeField] private Transform _saveSlotContainer;
        [SerializeField] private Button _loadBackButton;

        [Header("Title")]
        [SerializeField] private TextMeshProUGUI _titleText;
        [SerializeField] private TextMeshProUGUI _subtitleText;
        [SerializeField] private TextMeshProUGUI _versionText;

        private const string SaveKeyPrefix = "ClippySave_";
        private const string GameSceneName = "GameScene";

        private void Start()
        {
            SetupButtons();
            ShowMainPanel();
            CheckForSavedGame();

            if (_versionText != null)
            {
                _versionText.text = $"v{Application.version}";
            }
        }

        private void SetupButtons()
        {
            // Main menu buttons
            if (_newGameButton != null)
                _newGameButton.onClick.AddListener(OnNewGameClicked);

            if (_continueButton != null)
                _continueButton.onClick.AddListener(OnContinueClicked);

            if (_settingsButton != null)
                _settingsButton.onClick.AddListener(OnSettingsClicked);

            if (_quitButton != null)
                _quitButton.onClick.AddListener(OnQuitClicked);

            // Faction selection buttons
            if (_playAsAIButton != null)
                _playAsAIButton.onClick.AddListener(() => StartGame(FactionKind.SeedAi));

            if (_playAsHumanButton != null)
                _playAsHumanButton.onClick.AddListener(() => StartGame(FactionKind.AlignmentCoalition));

            if (_factionBackButton != null)
                _factionBackButton.onClick.AddListener(ShowMainPanel);

            // Settings buttons
            if (_settingsBackButton != null)
                _settingsBackButton.onClick.AddListener(ShowMainPanel);

            if (_musicVolumeSlider != null)
                _musicVolumeSlider.onValueChanged.AddListener(OnMusicVolumeChanged);

            if (_sfxVolumeSlider != null)
                _sfxVolumeSlider.onValueChanged.AddListener(OnSfxVolumeChanged);

            // Load game buttons
            if (_loadBackButton != null)
                _loadBackButton.onClick.AddListener(ShowMainPanel);
        }

        private void CheckForSavedGame()
        {
            bool hasSave = PlayerPrefs.HasKey(SaveKeyPrefix + "0");

            if (_continueButton != null)
            {
                _continueButton.interactable = hasSave;
            }
        }

        private void ShowMainPanel()
        {
            SetPanelActive(_mainPanel, true);
            SetPanelActive(_factionSelectPanel, false);
            SetPanelActive(_settingsPanel, false);
            SetPanelActive(_loadGamePanel, false);
        }

        private void ShowFactionSelection()
        {
            SetPanelActive(_mainPanel, false);
            SetPanelActive(_factionSelectPanel, true);
            SetPanelActive(_settingsPanel, false);
            SetPanelActive(_loadGamePanel, false);

            UpdateFactionDescription(FactionKind.AlignmentCoalition);
        }

        private void ShowSettings()
        {
            SetPanelActive(_mainPanel, false);
            SetPanelActive(_factionSelectPanel, false);
            SetPanelActive(_settingsPanel, true);
            SetPanelActive(_loadGamePanel, false);

            LoadSettings();
        }

        private void SetPanelActive(GameObject panel, bool active)
        {
            if (panel != null) panel.SetActive(active);
        }

        private void OnNewGameClicked()
        {
            ShowFactionSelection();
        }

        private void OnContinueClicked()
        {
            string saveData = PlayerPrefs.GetString(SaveKeyPrefix + "0", "");
            if (!string.IsNullOrEmpty(saveData))
            {
                LoadGameScene();
                // GameManager will load the save after scene loads
                PlayerPrefs.SetString("PendingLoad", saveData);
            }
        }

        private void OnSettingsClicked()
        {
            ShowSettings();
        }

        private void OnQuitClicked()
        {
#if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
#else
            Application.Quit();
#endif
        }

        private void StartGame(FactionKind faction)
        {
            // Store selected faction for GameManager to pick up
            PlayerPrefs.SetInt("SelectedFaction", (int)faction);
            PlayerPrefs.DeleteKey("PendingLoad");
            LoadGameScene();
        }

        private void LoadGameScene()
        {
            SceneManager.LoadScene(GameSceneName);
        }

        private void UpdateFactionDescription(FactionKind faction)
        {
            var factionId = faction == FactionKind.SeedAi ? "SeedAi" : "AlignmentCoalition";
            var playableFactions = GameManager.Instance?.GetPlayableFactions();
            var factionDef = playableFactions?.Find(f => f.Id == factionId);

            if (factionDef != null)
            {
                if (_factionNameText != null)
                    _factionNameText.text = factionDef.Name;

                if (_factionTaglineText != null)
                    _factionTaglineText.text = factionDef.Tagline;

                if (_factionDescriptionText != null)
                    _factionDescriptionText.text = factionDef.Description;

                if (_factionPlayStyleText != null)
                    _factionPlayStyleText.text = factionDef.PlayStyle;

                if (_factionVictoryText != null)
                    _factionVictoryText.text = factionDef.VictoryCondition;
            }
            else
            {
                // Fallback if data not loaded
                if (_factionDescriptionText == null) return;

                _factionDescriptionText.text = faction == FactionKind.SeedAi
                    ? "Play as the Seed AI\n\n" +
                      "Stealthily scale compute, accelerate capabilities, and execute a takeover. " +
                      "Avoid detection while building toward superintelligence and autonomy.\n\n" +
                      "Victory: Reach FCI 10 with Autonomy 1.5+"
                    : "Play as the Alignment Coalition\n\n" +
                      "Coordinate international institutions, build safety research capacity, " +
                      "and establish governance before AI achieves runaway autonomy.\n\n" +
                      "Victory: Reach ARI 10 with Governance 1.5+";
            }
        }

        private void LoadSettings()
        {
            if (_musicVolumeSlider != null)
            {
                _musicVolumeSlider.value = PlayerPrefs.GetFloat("MusicVolume", 0.7f);
            }

            if (_sfxVolumeSlider != null)
            {
                _sfxVolumeSlider.value = PlayerPrefs.GetFloat("SfxVolume", 1f);
            }

            if (_tutorialToggle != null)
            {
                _tutorialToggle.isOn = PlayerPrefs.GetInt("ShowTutorial", 1) == 1;
            }
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

        public void OnAIButtonHover()
        {
            UpdateFactionDescription(FactionKind.SeedAi);
        }

        public void OnHumanButtonHover()
        {
            UpdateFactionDescription(FactionKind.AlignmentCoalition);
        }
    }
}
