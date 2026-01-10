using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.UI;
using Clippy.Unity;
using Clippy.Unity.UI;

namespace Clippy.Unity.Editor
{
    public static class ClippySceneBootstrap
    {
        private const string ScenesFolder = "Assets/Scenes";
        private const string PrefabsFolder = "Assets/Prefabs";
        private const string UiPrefabsFolder = "Assets/Prefabs/UI";
        private const string RegionPrefabsFolder = "Assets/Prefabs/Regions";

        private const string MainMenuScenePath = "Assets/Scenes/MainMenu.unity";
        private const string GameScenePath = "Assets/Scenes/GameScene.unity";

        [MenuItem("Clippy/Setup/Generate Scenes and Prefabs")]
        public static void GenerateAll()
        {
            EnsureFolders();

            var prefabs = CreatePrefabs();
            CreateMainMenuScene(prefabs);
            CreateGameScene(prefabs);
            UpdateBuildSettings();

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
        }

        public static void BuildAll()
        {
            GenerateAll();
        }

        private static void EnsureFolders()
        {
            EnsureFolder("Assets", "Scenes");
            EnsureFolder("Assets", "Prefabs");
            EnsureFolder(PrefabsFolder, "UI");
            EnsureFolder(PrefabsFolder, "Regions");
            EnsureFolder("Assets", "Editor");
        }

        private static void EnsureFolder(string parent, string folderName)
        {
            var path = $"{parent}/{folderName}";
            if (!AssetDatabase.IsValidFolder(path))
            {
                AssetDatabase.CreateFolder(parent, folderName);
            }
        }

        private sealed class PrefabRefs
        {
            public ActionCard ActionCard;
            public EventOptionButton EventOptionButton;
            public RegionView RegionView;
            public TextMeshProUGUI NewsTickerText;
        }

        private static PrefabRefs CreatePrefabs()
        {
            var prefabs = new PrefabRefs
            {
                ActionCard = CreateActionCardPrefab($"{UiPrefabsFolder}/ActionCard.prefab"),
                EventOptionButton = CreateEventOptionButtonPrefab($"{UiPrefabsFolder}/EventOptionButton.prefab"),
                RegionView = CreateRegionViewPrefab($"{RegionPrefabsFolder}/RegionView.prefab"),
                NewsTickerText = CreateNewsTickerTextPrefab($"{UiPrefabsFolder}/NewsTickerText.prefab")
            };

            return prefabs;
        }

        private static ActionCard CreateActionCardPrefab(string path)
        {
            var existing = AssetDatabase.LoadAssetAtPath<ActionCard>(path);
            if (existing != null)
            {
                return existing;
            }

            var root = new GameObject("ActionCard", typeof(RectTransform), typeof(Image), typeof(ActionCard));
            var rect = root.GetComponent<RectTransform>();
            rect.sizeDelta = new Vector2(300f, 170f);
            var background = root.GetComponent<Image>();
            background.color = new Color(0.15f, 0.16f, 0.2f, 0.95f);

            var border = CreateImage("Border", root.transform, new Color(0.7f, 0.75f, 0.85f, 0.8f));
            Stretch(border.rectTransform);

            var content = CreateUIObject("Content", root.transform);
            Stretch(content);
            var contentLayout = content.gameObject.AddComponent<VerticalLayoutGroup>();
            contentLayout.padding = new RectOffset(10, 10, 10, 10);
            contentLayout.spacing = 6f;
            contentLayout.childControlHeight = true;
            contentLayout.childControlWidth = true;
            contentLayout.childForceExpandHeight = false;
            contentLayout.childForceExpandWidth = true;

            var header = CreateUIObject("Header", content);
            var headerLayout = header.gameObject.AddComponent<HorizontalLayoutGroup>();
            headerLayout.spacing = 6f;
            headerLayout.childControlHeight = true;
            headerLayout.childControlWidth = true;
            headerLayout.childForceExpandHeight = false;
            headerLayout.childForceExpandWidth = true;

            var nameText = CreateText("Name", header, "Action Name", 18, TextAlignmentOptions.Left);
            var nameLayout = nameText.gameObject.AddComponent<LayoutElement>();
            nameLayout.flexibleWidth = 1f;

            var categoryText = CreateText("Category", header, "CATEGORY", 12, TextAlignmentOptions.Right);
            var categoryLayout = categoryText.gameObject.AddComponent<LayoutElement>();
            categoryLayout.preferredWidth = 90f;

            var descriptionText = CreateText("Description", content, "Action description goes here.", 13, TextAlignmentOptions.TopLeft);
            var descriptionLayout = descriptionText.gameObject.AddComponent<LayoutElement>();
            descriptionLayout.flexibleHeight = 1f;

            var costText = CreateText("Cost", content, "Cost: 1 Budget", 12, TextAlignmentOptions.Left);

            var tooltip = CreatePanel("Tooltip", root.transform, new Color(0f, 0f, 0f, 0.85f));
            var tooltipGroup = tooltip.gameObject.AddComponent<CanvasGroup>();
            tooltipGroup.alpha = 0f;
            var tooltipRect = tooltip.rectTransform;
            tooltipRect.anchorMin = new Vector2(0f, 1f);
            tooltipRect.anchorMax = new Vector2(1f, 1f);
            tooltipRect.pivot = new Vector2(0.5f, 1f);
            tooltipRect.sizeDelta = new Vector2(0f, 40f);
            tooltipRect.anchoredPosition = new Vector2(0f, 10f);

            var tooltipText = CreateText("TooltipText", tooltip.transform, "Click to select this action", 11, TextAlignmentOptions.Center);
            Stretch(tooltipText.rectTransform);

            var actionCard = root.GetComponent<ActionCard>();
            SetObject(actionCard, "_backgroundImage", background);
            SetObject(actionCard, "_borderImage", border);
            SetObject(actionCard, "_nameText", nameText);
            SetObject(actionCard, "_descriptionText", descriptionText);
            SetObject(actionCard, "_costText", costText);
            SetObject(actionCard, "_categoryText", categoryText);
            SetObject(actionCard, "_tooltipGroup", tooltipGroup);

            var prefab = PrefabUtility.SaveAsPrefabAsset(root, path);
            Object.DestroyImmediate(root);

            return prefab.GetComponent<ActionCard>();
        }

        private static EventOptionButton CreateEventOptionButtonPrefab(string path)
        {
            var existing = AssetDatabase.LoadAssetAtPath<EventOptionButton>(path);
            if (existing != null)
            {
                return existing;
            }

            var root = new GameObject("EventOptionButton", typeof(RectTransform), typeof(Image), typeof(Button), typeof(EventOptionButton));
            var rect = root.GetComponent<RectTransform>();
            rect.sizeDelta = new Vector2(460f, 90f);
            var background = root.GetComponent<Image>();
            background.color = new Color(0.18f, 0.2f, 0.24f, 0.95f);

            var layout = root.AddComponent<VerticalLayoutGroup>();
            layout.padding = new RectOffset(12, 12, 8, 8);
            layout.spacing = 4f;
            layout.childControlWidth = true;
            layout.childControlHeight = true;

            var labelText = CreateText("Label", root.transform, "Option Label", 16, TextAlignmentOptions.Left);
            var effectsText = CreateText("Effects", root.transform, "Effects preview", 12, TextAlignmentOptions.Left);

            var optionButton = root.GetComponent<EventOptionButton>();
            SetObject(optionButton, "_button", root.GetComponent<Button>());
            SetObject(optionButton, "_labelText", labelText);
            SetObject(optionButton, "_effectsText", effectsText);

            var prefab = PrefabUtility.SaveAsPrefabAsset(root, path);
            Object.DestroyImmediate(root);

            return prefab.GetComponent<EventOptionButton>();
        }

        private static RegionView CreateRegionViewPrefab(string path)
        {
            var existing = AssetDatabase.LoadAssetAtPath<RegionView>(path);
            if (existing != null)
            {
                return existing;
            }

            var root = new GameObject("RegionView", typeof(RectTransform), typeof(Image), typeof(RegionView));
            var rect = root.GetComponent<RectTransform>();
            rect.sizeDelta = new Vector2(140f, 90f);
            var regionImage = root.GetComponent<Image>();
            regionImage.color = new Color(0.25f, 0.45f, 0.6f, 0.85f);

            var overlayImage = CreateImage("Overlay", root.transform, new Color(0.2f, 0.4f, 0.6f, 0.6f));
            Stretch(overlayImage.rectTransform);

            var selectionOutline = CreateImage("SelectionOutline", root.transform, new Color(1f, 1f, 1f, 0.8f));
            Stretch(selectionOutline.rectTransform);
            selectionOutline.enabled = false;

            var nameText = CreateText("RegionName", root.transform, "Region", 12, TextAlignmentOptions.BottomLeft);
            var nameRect = nameText.rectTransform;
            nameRect.anchorMin = new Vector2(0f, 0f);
            nameRect.anchorMax = new Vector2(1f, 0f);
            nameRect.pivot = new Vector2(0.5f, 0f);
            nameRect.sizeDelta = new Vector2(0f, 20f);
            nameRect.anchoredPosition = new Vector2(0f, 4f);

            var hoverGroup = CreatePanel("HoverGroup", root.transform, new Color(0f, 0f, 0f, 0.6f));
            var hoverCanvasGroup = hoverGroup.gameObject.AddComponent<CanvasGroup>();
            hoverCanvasGroup.alpha = 0f;
            var hoverRect = hoverGroup.rectTransform;
            hoverRect.anchorMin = new Vector2(0f, 1f);
            hoverRect.anchorMax = new Vector2(1f, 1f);
            hoverRect.pivot = new Vector2(0.5f, 1f);
            hoverRect.sizeDelta = new Vector2(0f, 26f);
            hoverRect.anchoredPosition = new Vector2(0f, 0f);

            var overlayValueText = CreateText("OverlayValue", hoverGroup.transform, "Value", 12, TextAlignmentOptions.Center);
            Stretch(overlayValueText.rectTransform);

            var regionView = root.GetComponent<RegionView>();
            SetObject(regionView, "_regionImage", regionImage);
            SetObject(regionView, "_overlayImage", overlayImage);
            SetObject(regionView, "_selectionOutline", selectionOutline);
            SetObject(regionView, "_regionNameText", nameText);
            SetObject(regionView, "_overlayValueText", overlayValueText);
            SetObject(regionView, "_hoverGroup", hoverCanvasGroup);

            var prefab = PrefabUtility.SaveAsPrefabAsset(root, path);
            Object.DestroyImmediate(root);

            return prefab.GetComponent<RegionView>();
        }

        private static TextMeshProUGUI CreateNewsTickerTextPrefab(string path)
        {
            var existing = AssetDatabase.LoadAssetAtPath<TextMeshProUGUI>(path);
            if (existing != null)
            {
                return existing;
            }

            var root = new GameObject("NewsTickerText", typeof(RectTransform), typeof(TextMeshProUGUI));
            var rect = root.GetComponent<RectTransform>();
            rect.sizeDelta = new Vector2(400f, 24f);
            var text = root.GetComponent<TextMeshProUGUI>();
            text.text = "[T0] News message";
            text.fontSize = 14f;
            text.alignment = TextAlignmentOptions.Left;
            text.color = new Color(0.85f, 0.85f, 0.85f);

            var prefab = PrefabUtility.SaveAsPrefabAsset(root, path);
            Object.DestroyImmediate(root);

            return prefab.GetComponent<TextMeshProUGUI>();
        }

        private static void CreateMainMenuScene(PrefabRefs prefabs)
        {
            if (File.Exists(MainMenuScenePath))
            {
                return;
            }

            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "MainMenu";

            CreateEventSystem();

            CreateManagers();

            var canvas = CreateCanvas("Canvas");
            var root = canvas.transform;

            var background = CreatePanel("Background", root, new Color(0.08f, 0.09f, 0.12f, 1f));
            Stretch(background.rectTransform);

            var titlePanel = CreateUIObject("TitlePanel", root);
            var titleRect = titlePanel;
            titleRect.anchorMin = new Vector2(0f, 0.7f);
            titleRect.anchorMax = new Vector2(1f, 1f);
            titleRect.offsetMin = new Vector2(80f, 0f);
            titleRect.offsetMax = new Vector2(-80f, -20f);

            var titleText = CreateText("Title", titlePanel, "CLIPPY", 52, TextAlignmentOptions.Left);
            var subtitleText = CreateText("Subtitle", titlePanel, "AI Strategy Prototype", 18, TextAlignmentOptions.Left);
            var versionText = CreateText("Version", titlePanel, "v0.1", 12, TextAlignmentOptions.Left);

            var titleLayout = titlePanel.gameObject.AddComponent<VerticalLayoutGroup>();
            titleLayout.spacing = 6f;
            titleLayout.childControlHeight = true;
            titleLayout.childControlWidth = true;

            var mainPanel = CreatePanel("MainPanel", root, new Color(0.12f, 0.13f, 0.16f, 0.9f));
            var mainRect = mainPanel.rectTransform;
            mainRect.anchorMin = new Vector2(0.08f, 0.25f);
            mainRect.anchorMax = new Vector2(0.38f, 0.7f);
            mainRect.offsetMin = Vector2.zero;
            mainRect.offsetMax = Vector2.zero;
            var mainLayout = mainPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            mainLayout.padding = new RectOffset(20, 20, 20, 20);
            mainLayout.spacing = 10f;
            mainLayout.childControlHeight = true;
            mainLayout.childControlWidth = true;

            var newGameButton = CreateButton("NewGameButton", mainPanel.transform, "New Game");
            var continueButton = CreateButton("ContinueButton", mainPanel.transform, "Continue");
            var settingsButton = CreateButton("SettingsButton", mainPanel.transform, "Settings");
            var quitButton = CreateButton("QuitButton", mainPanel.transform, "Quit");

            var factionPanel = CreatePanel("FactionSelectPanel", root, new Color(0.12f, 0.13f, 0.16f, 0.95f));
            var factionRect = factionPanel.rectTransform;
            factionRect.anchorMin = new Vector2(0.4f, 0.2f);
            factionRect.anchorMax = new Vector2(0.92f, 0.8f);
            factionRect.offsetMin = Vector2.zero;
            factionRect.offsetMax = Vector2.zero;
            factionPanel.gameObject.SetActive(false);

            var factionLayout = factionPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            factionLayout.padding = new RectOffset(20, 20, 20, 20);
            factionLayout.spacing = 8f;

            var factionNameText = CreateText("FactionName", factionPanel.transform, "Faction Name", 26, TextAlignmentOptions.Left);
            var factionTaglineText = CreateText("FactionTagline", factionPanel.transform, "Tagline", 16, TextAlignmentOptions.Left);
            var factionDescriptionText = CreateText("FactionDescription", factionPanel.transform, "Description", 14, TextAlignmentOptions.Left);
            var factionPlayStyleText = CreateText("FactionPlayStyle", factionPanel.transform, "Play Style", 13, TextAlignmentOptions.Left);
            var factionVictoryText = CreateText("FactionVictory", factionPanel.transform, "Victory Condition", 13, TextAlignmentOptions.Left);

            var factionButtons = CreateUIObject("FactionButtons", factionPanel.transform);
            var factionButtonsLayout = factionButtons.gameObject.AddComponent<HorizontalLayoutGroup>();
            factionButtonsLayout.spacing = 12f;
            factionButtonsLayout.childControlWidth = true;
            factionButtonsLayout.childForceExpandWidth = true;

            var playAiButton = CreateButton("PlayAIButton", factionButtons, "Play as Seed AI");
            var playHumanButton = CreateButton("PlayHumanButton", factionButtons, "Play as Alignment Coalition");
            var factionBackButton = CreateButton("FactionBackButton", factionPanel.transform, "Back");

            var settingsPanel = CreatePanel("SettingsPanel", root, new Color(0.12f, 0.13f, 0.16f, 0.95f));
            var settingsRect = settingsPanel.rectTransform;
            settingsRect.anchorMin = new Vector2(0.4f, 0.25f);
            settingsRect.anchorMax = new Vector2(0.75f, 0.7f);
            settingsRect.offsetMin = Vector2.zero;
            settingsRect.offsetMax = Vector2.zero;
            settingsPanel.gameObject.SetActive(false);

            var settingsLayout = settingsPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            settingsLayout.padding = new RectOffset(20, 20, 20, 20);
            settingsLayout.spacing = 10f;

            CreateText("SettingsTitle", settingsPanel.transform, "Settings", 20, TextAlignmentOptions.Left);
            var musicSlider = CreateSlider("MusicSlider", settingsPanel.transform);
            var sfxSlider = CreateSlider("SfxSlider", settingsPanel.transform);
            var tutorialToggle = CreateToggle("TutorialToggle", settingsPanel.transform, "Show Tutorial");
            var settingsBackButton = CreateButton("SettingsBackButton", settingsPanel.transform, "Back");

            var loadPanel = CreatePanel("LoadGamePanel", root, new Color(0.12f, 0.13f, 0.16f, 0.95f));
            var loadRect = loadPanel.rectTransform;
            loadRect.anchorMin = new Vector2(0.4f, 0.25f);
            loadRect.anchorMax = new Vector2(0.75f, 0.7f);
            loadRect.offsetMin = Vector2.zero;
            loadRect.offsetMax = Vector2.zero;
            loadPanel.gameObject.SetActive(false);
            var loadLayout = loadPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            loadLayout.padding = new RectOffset(20, 20, 20, 20);
            loadLayout.spacing = 8f;

            CreateText("LoadTitle", loadPanel.transform, "Load Game", 20, TextAlignmentOptions.Left);
            var saveSlotContainer = CreateUIObject("SaveSlotContainer", loadPanel.transform);
            var loadBackButton = CreateButton("LoadBackButton", loadPanel.transform, "Back");

            var menuController = canvas.gameObject.AddComponent<MainMenuController>();
            SetObject(menuController, "_mainPanel", mainPanel.gameObject);
            SetObject(menuController, "_factionSelectPanel", factionPanel.gameObject);
            SetObject(menuController, "_settingsPanel", settingsPanel.gameObject);
            SetObject(menuController, "_loadGamePanel", loadPanel.gameObject);

            SetObject(menuController, "_newGameButton", newGameButton);
            SetObject(menuController, "_continueButton", continueButton);
            SetObject(menuController, "_settingsButton", settingsButton);
            SetObject(menuController, "_quitButton", quitButton);

            SetObject(menuController, "_playAsAIButton", playAiButton);
            SetObject(menuController, "_playAsHumanButton", playHumanButton);
            SetObject(menuController, "_factionBackButton", factionBackButton);
            SetObject(menuController, "_factionNameText", factionNameText);
            SetObject(menuController, "_factionTaglineText", factionTaglineText);
            SetObject(menuController, "_factionDescriptionText", factionDescriptionText);
            SetObject(menuController, "_factionPlayStyleText", factionPlayStyleText);
            SetObject(menuController, "_factionVictoryText", factionVictoryText);

            SetObject(menuController, "_musicVolumeSlider", musicSlider);
            SetObject(menuController, "_sfxVolumeSlider", sfxSlider);
            SetObject(menuController, "_tutorialToggle", tutorialToggle);
            SetObject(menuController, "_settingsBackButton", settingsBackButton);

            SetObject(menuController, "_saveSlotContainer", saveSlotContainer);
            SetObject(menuController, "_loadBackButton", loadBackButton);

            SetObject(menuController, "_titleText", titleText);
            SetObject(menuController, "_subtitleText", subtitleText);
            SetObject(menuController, "_versionText", versionText);

            EditorSceneManager.SaveScene(scene, MainMenuScenePath);
        }

        private static void CreateGameScene(PrefabRefs prefabs)
        {
            if (File.Exists(GameScenePath))
            {
                return;
            }

            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "GameScene";

            CreateEventSystem();

            CreateManagers();

            var canvas = CreateCanvas("Canvas");
            var root = canvas.transform;

            var loadingScreen = CreatePanel("LoadingScreen", root, new Color(0f, 0f, 0f, 0.9f));
            Stretch(loadingScreen.rectTransform);
            CreateText("LoadingText", loadingScreen.transform, "Loading...", 24, TextAlignmentOptions.Center);

            var gameUi = CreateUIObject("GameUI", root);
            Stretch(gameUi);

            var background = CreatePanel("Background", gameUi, new Color(0.08f, 0.09f, 0.12f, 1f));
            Stretch(background.rectTransform);

            var topBar = CreatePanel("TopBar", gameUi, new Color(0.12f, 0.13f, 0.16f, 0.9f));
            var topRect = topBar.rectTransform;
            topRect.anchorMin = new Vector2(0f, 0.82f);
            topRect.anchorMax = new Vector2(1f, 1f);
            topRect.offsetMin = Vector2.zero;
            topRect.offsetMax = Vector2.zero;

            var progressDisplay = topBar.gameObject.AddComponent<ProgressDisplay>();

            var progressLeft = CreateUIObject("ProgressLeft", topBar.transform);
            var progressLeftRect = progressLeft;
            progressLeftRect.anchorMin = new Vector2(0f, 0f);
            progressLeftRect.anchorMax = new Vector2(0.45f, 1f);
            progressLeftRect.offsetMin = new Vector2(10f, 10f);
            progressLeftRect.offsetMax = new Vector2(-10f, -10f);
            var progressLeftLayout = progressLeft.gameObject.AddComponent<VerticalLayoutGroup>();
            progressLeftLayout.spacing = 6f;
            progressLeftLayout.childControlHeight = true;
            progressLeftLayout.childControlWidth = true;
            progressLeftLayout.childForceExpandHeight = false;

            var fciBar = CreateProgressBar("FCIBar", progressLeft, "Frontier Capability");
            var ariBar = CreateProgressBar("ARIBar", progressLeft, "Alignment Readiness");
            var autoBar = CreateProgressBar("AutomationBar", progressLeft, "Automation Level");
            var govBar = CreateProgressBar("GovernanceBar", progressLeft, "Governance Control");

            var progressCenter = CreateUIObject("ProgressCenter", topBar.transform);
            var progressCenterRect = progressCenter;
            progressCenterRect.anchorMin = new Vector2(0.45f, 0f);
            progressCenterRect.anchorMax = new Vector2(0.65f, 1f);
            progressCenterRect.offsetMin = new Vector2(10f, 10f);
            progressCenterRect.offsetMax = new Vector2(-10f, -10f);
            var centerLayout = progressCenter.gameObject.AddComponent<VerticalLayoutGroup>();
            centerLayout.spacing = 4f;
            centerLayout.childAlignment = TextAnchor.MiddleCenter;

            var turnText = CreateText("TurnText", progressCenter, "Turn 0", 16, TextAlignmentOptions.Center);
            var factionText = CreateText("FactionText", progressCenter, "Playing as: Alignment Coalition", 12, TextAlignmentOptions.Center);

            var progressRight = CreateUIObject("ProgressRight", topBar.transform);
            var progressRightRect = progressRight;
            progressRightRect.anchorMin = new Vector2(0.65f, 0f);
            progressRightRect.anchorMax = new Vector2(1f, 1f);
            progressRightRect.offsetMin = new Vector2(10f, 10f);
            progressRightRect.offsetMax = new Vector2(-10f, -10f);
            var progressRightLayout = progressRight.gameObject.AddComponent<VerticalLayoutGroup>();
            progressRightLayout.spacing = 6f;
            progressRightLayout.childControlHeight = true;
            progressRightLayout.childControlWidth = true;
            progressRightLayout.childForceExpandHeight = false;

            var suspicionBar = CreateProgressBar("SuspicionBar", progressRight, "Suspicion");
            var autonomyBar = CreateProgressBar("AutonomyBar", progressRight, "Autonomy");
            var legitimacyBar = CreateProgressBar("LegitimacyBar", progressRight, "Legitimacy");

            var victoryPanel = CreateUIObject("VictoryPanel", progressRight);
            var victoryLayout = victoryPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            victoryLayout.spacing = 4f;
            victoryLayout.childControlWidth = true;
            victoryLayout.childControlHeight = true;

            var aiVictoryImage = CreateImage("AiVictoryFill", victoryPanel, new Color(0.6f, 0.3f, 0.3f, 0.9f));
            aiVictoryImage.type = Image.Type.Filled;
            aiVictoryImage.fillMethod = Image.FillMethod.Horizontal;
            var aiVictoryText = CreateText("AiVictoryText", victoryPanel, "AI Victory: 0%", 12, TextAlignmentOptions.Left);

            var humanVictoryImage = CreateImage("HumanVictoryFill", victoryPanel, new Color(0.3f, 0.6f, 0.3f, 0.9f));
            humanVictoryImage.type = Image.Type.Filled;
            humanVictoryImage.fillMethod = Image.FillMethod.Horizontal;
            var humanVictoryText = CreateText("HumanVictoryText", victoryPanel, "Human Victory: 0%", 12, TextAlignmentOptions.Left);

            SetObject(progressDisplay, "_fciBar", fciBar);
            SetObject(progressDisplay, "_ariBar", ariBar);
            SetObject(progressDisplay, "_automationBar", autoBar);
            SetObject(progressDisplay, "_governanceBar", govBar);
            SetObject(progressDisplay, "_suspicionBar", suspicionBar);
            SetObject(progressDisplay, "_autonomyBar", autonomyBar);
            SetObject(progressDisplay, "_legitimacyBar", legitimacyBar);
            SetObject(progressDisplay, "_turnText", turnText);
            SetObject(progressDisplay, "_factionText", factionText);
            SetObject(progressDisplay, "_aiVictoryProgress", aiVictoryImage);
            SetObject(progressDisplay, "_humanVictoryProgress", humanVictoryImage);
            SetObject(progressDisplay, "_aiVictoryText", aiVictoryText);
            SetObject(progressDisplay, "_humanVictoryText", humanVictoryText);

            var mapArea = CreatePanel("MapArea", gameUi, new Color(0.1f, 0.12f, 0.16f, 1f));
            var mapRect = mapArea.rectTransform;
            mapRect.anchorMin = new Vector2(0.18f, 0.2f);
            mapRect.anchorMax = new Vector2(0.82f, 0.8f);
            mapRect.offsetMin = Vector2.zero;
            mapRect.offsetMax = Vector2.zero;

            var regionsContainer = CreateUIObject("RegionsContainer", mapArea.transform);
            Stretch(regionsContainer);

            var worldMap = mapArea.gameObject.AddComponent<WorldMapController>();
            SetObject(worldMap, "_regionsContainer", regionsContainer);
            SetObject(worldMap, "_regionPrefab", prefabs.RegionView);

            var overlayPanel = CreatePanel("OverlayPanel", gameUi, new Color(0.12f, 0.13f, 0.16f, 0.9f));
            var overlayRect = overlayPanel.rectTransform;
            overlayRect.anchorMin = new Vector2(0f, 0.2f);
            overlayRect.anchorMax = new Vector2(0.18f, 0.8f);
            overlayRect.offsetMin = Vector2.zero;
            overlayRect.offsetMax = Vector2.zero;

            var overlayGroup = overlayPanel.gameObject.AddComponent<OverlayToggleGroup>();
            SetObject(overlayGroup, "_mapController", worldMap);

            var overlayLayout = overlayPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            overlayLayout.padding = new RectOffset(10, 10, 10, 10);
            overlayLayout.spacing = 6f;
            overlayLayout.childControlHeight = true;
            overlayLayout.childControlWidth = true;

            var computeToggle = CreateOverlayToggleButton("ComputeToggle", overlayPanel.transform);
            var energyToggle = CreateOverlayToggleButton("EnergyToggle", overlayPanel.transform);
            var governanceToggle = CreateOverlayToggleButton("GovernanceToggle", overlayPanel.transform);
            var securityToggle = CreateOverlayToggleButton("SecurityToggle", overlayPanel.transform);
            var sentimentToggle = CreateOverlayToggleButton("SentimentToggle", overlayPanel.transform);
            var capabilityToggle = CreateOverlayToggleButton("CapabilityToggle", overlayPanel.transform);
            var safetyToggle = CreateOverlayToggleButton("SafetyToggle", overlayPanel.transform);

            SetObject(overlayGroup, "_computeToggle", computeToggle);
            SetObject(overlayGroup, "_energyToggle", energyToggle);
            SetObject(overlayGroup, "_governanceToggle", governanceToggle);
            SetObject(overlayGroup, "_securityToggle", securityToggle);
            SetObject(overlayGroup, "_sentimentToggle", sentimentToggle);
            SetObject(overlayGroup, "_capabilityRnDToggle", capabilityToggle);
            SetObject(overlayGroup, "_safetyRnDToggle", safetyToggle);

            var regionInfoPanel = CreatePanel("RegionInfoPanel", gameUi, new Color(0.12f, 0.13f, 0.16f, 0.95f));
            var regionInfoRect = regionInfoPanel.rectTransform;
            regionInfoRect.anchorMin = new Vector2(0.82f, 0.2f);
            regionInfoRect.anchorMax = new Vector2(1f, 0.8f);
            regionInfoRect.offsetMin = Vector2.zero;
            regionInfoRect.offsetMax = Vector2.zero;
            var regionInfoCanvasGroup = regionInfoPanel.gameObject.AddComponent<CanvasGroup>();

            var regionInfo = regionInfoPanel.gameObject.AddComponent<RegionInfoPanel>();
            SetObject(regionInfo, "_canvasGroup", regionInfoCanvasGroup);

            var regionInfoLayout = regionInfoPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            regionInfoLayout.padding = new RectOffset(12, 12, 12, 12);
            regionInfoLayout.spacing = 6f;

            var regionName = CreateText("RegionName", regionInfoPanel.transform, "Region", 18, TextAlignmentOptions.Left);
            var regionCloseButton = CreateButton("CloseRegionButton", regionInfoPanel.transform, "Close");
            var computeStat = CreateStatBar("ComputeStat", regionInfoPanel.transform, "Compute");
            var energyStat = CreateStatBar("EnergyStat", regionInfoPanel.transform, "Energy");
            var securityStat = CreateStatBar("SecurityStat", regionInfoPanel.transform, "Security");
            var governanceStat = CreateStatBar("GovernanceStat", regionInfoPanel.transform, "Governance");
            var sentimentStat = CreateStatBar("SentimentStat", regionInfoPanel.transform, "Regulation");
            var capabilityStat = CreateStatBar("CapabilityStat", regionInfoPanel.transform, "Capability RnD");
            var safetyStat = CreateStatBar("SafetyStat", regionInfoPanel.transform, "Safety RnD");
            var facilitiesContainer = CreateUIObject("FacilitiesContainer", regionInfoPanel.transform);
            var facilitiesText = CreateText("FacilitiesText", facilitiesContainer, "No facilities", 12, TextAlignmentOptions.Left);

            SetObject(regionInfo, "_regionNameText", regionName);
            SetObject(regionInfo, "_closeButton", regionCloseButton);
            SetObject(regionInfo, "_computeBar", computeStat);
            SetObject(regionInfo, "_energyBar", energyStat);
            SetObject(regionInfo, "_securityBar", securityStat);
            SetObject(regionInfo, "_governanceBar", governanceStat);
            SetObject(regionInfo, "_sentimentBar", sentimentStat);
            SetObject(regionInfo, "_capabilityRnDBar", capabilityStat);
            SetObject(regionInfo, "_safetyRnDBar", safetyStat);
            SetObject(regionInfo, "_facilitiesContainer", facilitiesContainer);
            SetObject(regionInfo, "_facilitiesText", facilitiesText);

            SetObject(worldMap, "_regionInfoPanel", regionInfo);

            var actionBarPanel = CreatePanel("ActionBar", gameUi, new Color(0.1f, 0.12f, 0.16f, 0.95f));
            var actionBarRect = actionBarPanel.rectTransform;
            actionBarRect.anchorMin = new Vector2(0f, 0f);
            actionBarRect.anchorMax = new Vector2(1f, 0.2f);
            actionBarRect.offsetMin = Vector2.zero;
            actionBarRect.offsetMax = Vector2.zero;

            var actionBar = actionBarPanel.gameObject.AddComponent<ActionBarController>();

            var actionBarLayout = actionBarPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            actionBarLayout.padding = new RectOffset(10, 10, 10, 10);
            actionBarLayout.spacing = 6f;
            actionBarLayout.childControlHeight = true;
            actionBarLayout.childControlWidth = true;

            var actionHeader = CreateUIObject("ActionHeader", actionBarPanel.transform);
            var actionHeaderLayout = actionHeader.gameObject.AddComponent<HorizontalLayoutGroup>();
            actionHeaderLayout.spacing = 10f;
            actionHeaderLayout.childControlHeight = true;
            actionHeaderLayout.childControlWidth = true;
            actionHeaderLayout.childForceExpandWidth = false;

            var turnCounterText = CreateText("TurnCounter", actionHeader, "Turn 0", 14, TextAlignmentOptions.Left);
            var endTurnButton = CreateButton("EndTurnButton", actionHeader, "End Turn");
            var endTurnText = endTurnButton.GetComponentInChildren<TextMeshProUGUI>();

            var actionsScrollRect = CreateScrollRect("ActionsScroll", actionBarPanel.transform, true);
            var actionsContainer = actionsScrollRect.content;
            var actionsLayout = actionsContainer.gameObject.AddComponent<HorizontalLayoutGroup>();
            actionsLayout.spacing = 8f;
            actionsLayout.childControlHeight = true;
            actionsLayout.childControlWidth = true;
            actionsLayout.childForceExpandHeight = false;
            actionsLayout.childForceExpandWidth = false;

            var resourcePanel = CreateUIObject("ResourcePanel", actionBarPanel.transform);
            var resourceLayout = resourcePanel.gameObject.AddComponent<HorizontalLayoutGroup>();
            resourceLayout.spacing = 12f;
            resourceLayout.childControlHeight = true;
            resourceLayout.childControlWidth = true;
            resourceLayout.childForceExpandHeight = false;
            resourceLayout.childForceExpandWidth = false;

            var budgetDisplay = CreateResourceDisplay("BudgetDisplay", resourcePanel, "Budget");
            var influenceDisplay = CreateResourceDisplay("InfluenceDisplay", resourcePanel, "Influence");
            var coordinationDisplay = CreateResourceDisplay("CoordinationDisplay", resourcePanel, "Coordination");
            var trustDisplay = CreateResourceDisplay("TrustDisplay", resourcePanel, "Trust");
            var stealthDisplay = CreateResourceDisplay("StealthDisplay", resourcePanel, "Stealth");
            var computeDisplay = CreateResourceDisplay("ComputeDisplay", resourcePanel, "Compute");
            var energyDisplay = CreateResourceDisplay("EnergyDisplay", resourcePanel, "Energy");
            var hardPowerDisplay = CreateResourceDisplay("HardPowerDisplay", resourcePanel, "Hard Power");

            SetObject(actionBar, "_actionsContainer", actionsContainer);
            SetObject(actionBar, "_actionCardPrefab", prefabs.ActionCard);
            SetObject(actionBar, "_endTurnButton", endTurnButton);
            SetObject(actionBar, "_endTurnText", endTurnText);
            SetObject(actionBar, "_turnCounterText", turnCounterText);
            SetObject(actionBar, "_budgetDisplay", budgetDisplay);
            SetObject(actionBar, "_influenceDisplay", influenceDisplay);
            SetObject(actionBar, "_coordinationDisplay", coordinationDisplay);
            SetObject(actionBar, "_trustDisplay", trustDisplay);
            SetObject(actionBar, "_stealthDisplay", stealthDisplay);
            SetObject(actionBar, "_computeDisplay", computeDisplay);
            SetObject(actionBar, "_energyDisplay", energyDisplay);
            SetObject(actionBar, "_hardPowerDisplay", hardPowerDisplay);

            var newsTickerPanel = CreatePanel("NewsTickerPanel", gameUi, new Color(0.12f, 0.13f, 0.16f, 0.9f));
            var newsRect = newsTickerPanel.rectTransform;
            newsRect.anchorMin = new Vector2(0f, 0.2f);
            newsRect.anchorMax = new Vector2(0.18f, 0.4f);
            newsRect.offsetMin = Vector2.zero;
            newsRect.offsetMax = Vector2.zero;

            var newsTicker = newsTickerPanel.gameObject.AddComponent<NewsTicker>();
            var newsScroll = CreateScrollRect("NewsScroll", newsTickerPanel.transform, false);
            var newsLayout = newsScroll.content.gameObject.AddComponent<VerticalLayoutGroup>();
            newsLayout.spacing = 4f;
            newsLayout.childControlWidth = true;
            newsLayout.childControlHeight = true;
            newsLayout.childForceExpandHeight = false;
            SetObject(newsTicker, "_scrollRect", newsScroll.scrollRect);
            SetObject(newsTicker, "_tickerContainer", newsScroll.content);
            SetObject(newsTicker, "_tickerTextPrefab", prefabs.NewsTickerText);

            var eventPopup = CreateEventPopup(gameUi, prefabs);
            var gameEndScreen = CreateGameEndScreen(gameUi);
            var pauseMenu = CreatePauseMenu(gameUi);
            var tutorialOverlay = CreateTutorialOverlay(gameUi);

            var sceneManagerGo = new GameObject("GameSceneManager", typeof(GameSceneManager));
            var sceneManager = sceneManagerGo.GetComponent<GameSceneManager>();
            SetObject(sceneManager, "_loadingScreen", loadingScreen.gameObject);
            SetObject(sceneManager, "_gameUI", gameUi.gameObject);
            SetObject(sceneManager, "_pauseMenu", pauseMenu);

            EditorSceneManager.SaveScene(scene, GameScenePath);
        }

        private static void CreateManagers()
        {
            CreateManager<GameManager>("GameManager");
            CreateManager<SaveManager>("SaveManager");
            CreateManager<AudioManager>("AudioManager");
        }

        private static void CreateManager<T>(string name) where T : Component
        {
            if (Object.FindObjectOfType<T>() != null)
            {
                return;
            }

            new GameObject(name, typeof(T));
        }

        private static void CreateEventSystem()
        {
            if (Object.FindObjectOfType<UnityEngine.EventSystems.EventSystem>() != null)
            {
                return;
            }

            var eventSystem = new GameObject("EventSystem", typeof(UnityEngine.EventSystems.EventSystem));
            eventSystem.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
        }

        private static Canvas CreateCanvas(string name)
        {
            var canvasGo = new GameObject(name, typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            var canvas = canvasGo.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = canvasGo.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1920f, 1080f);
            scaler.matchWidthOrHeight = 0.5f;
            return canvas;
        }

        private static RectTransform CreateUIObject(string name, Transform parent)
        {
            var go = new GameObject(name, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            return go.GetComponent<RectTransform>();
        }

        private static RectTransform CreateUIObject(string name, RectTransform parent)
        {
            return CreateUIObject(name, parent.transform);
        }

        private static Image CreatePanel(string name, Transform parent, Color color)
        {
            var rect = CreateUIObject(name, parent);
            var image = rect.gameObject.AddComponent<Image>();
            image.color = color;
            return image;
        }

        private static Image CreateImage(string name, Transform parent, Color color)
        {
            var rect = CreateUIObject(name, parent);
            var image = rect.gameObject.AddComponent<Image>();
            image.color = color;
            return image;
        }

        private static TextMeshProUGUI CreateText(string name, Transform parent, string text, float fontSize, TextAlignmentOptions alignment)
        {
            var rect = CreateUIObject(name, parent);
            var tmp = rect.gameObject.AddComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = fontSize;
            tmp.alignment = alignment;
            tmp.color = new Color(0.9f, 0.92f, 0.95f, 1f);
            return tmp;
        }

        private static Button CreateButton(string name, Transform parent, string label)
        {
            var rect = CreateUIObject(name, parent);
            var image = rect.gameObject.AddComponent<Image>();
            image.color = new Color(0.2f, 0.24f, 0.3f, 0.9f);
            var button = rect.gameObject.AddComponent<Button>();

            var labelText = CreateText("Label", rect, label, 14, TextAlignmentOptions.Center);
            Stretch(labelText.rectTransform);

            var layout = rect.gameObject.AddComponent<LayoutElement>();
            layout.preferredHeight = 36f;

            return button;
        }

        private static Slider CreateSlider(string name, Transform parent)
        {
            var rect = CreateUIObject(name, parent);
            rect.sizeDelta = new Vector2(0f, 24f);

            var background = CreateImage("Background", rect, new Color(0.15f, 0.18f, 0.24f, 1f));
            Stretch(background.rectTransform);

            var fillArea = CreateUIObject("FillArea", rect);
            fillArea.anchorMin = new Vector2(0f, 0.25f);
            fillArea.anchorMax = new Vector2(1f, 0.75f);
            fillArea.offsetMin = new Vector2(6f, 0f);
            fillArea.offsetMax = new Vector2(-6f, 0f);

            var fill = CreateImage("Fill", fillArea, new Color(0.3f, 0.6f, 0.4f, 0.9f));
            Stretch(fill.rectTransform);
            fill.type = Image.Type.Filled;
            fill.fillMethod = Image.FillMethod.Horizontal;

            var handleArea = CreateUIObject("HandleArea", rect);
            Stretch(handleArea);

            var handle = CreateImage("Handle", handleArea, new Color(0.8f, 0.85f, 0.9f, 1f));
            handle.rectTransform.sizeDelta = new Vector2(16f, 16f);

            var slider = rect.gameObject.AddComponent<Slider>();
            slider.fillRect = fill.rectTransform;
            slider.handleRect = handle.rectTransform;
            slider.targetGraphic = handle;
            slider.direction = Slider.Direction.LeftToRight;
            slider.minValue = 0f;
            slider.maxValue = 1f;
            slider.value = 0.7f;

            return slider;
        }

        private static Toggle CreateToggle(string name, Transform parent, string label)
        {
            var rect = CreateUIObject(name, parent);
            rect.sizeDelta = new Vector2(0f, 24f);

            var background = CreateImage("Background", rect, new Color(0.18f, 0.2f, 0.26f, 0.9f));
            background.rectTransform.anchorMin = new Vector2(0f, 0.5f);
            background.rectTransform.anchorMax = new Vector2(0f, 0.5f);
            background.rectTransform.sizeDelta = new Vector2(20f, 20f);
            background.rectTransform.anchoredPosition = new Vector2(10f, 0f);

            var checkmark = CreateImage("Checkmark", background.transform, new Color(0.4f, 0.8f, 0.5f, 1f));
            Stretch(checkmark.rectTransform);

            var toggle = rect.gameObject.AddComponent<Toggle>();
            toggle.targetGraphic = background;
            toggle.graphic = checkmark;
            toggle.isOn = true;

            var labelText = CreateText("Label", rect, label, 14, TextAlignmentOptions.Left);
            labelText.rectTransform.anchorMin = new Vector2(0f, 0f);
            labelText.rectTransform.anchorMax = new Vector2(1f, 1f);
            labelText.rectTransform.offsetMin = new Vector2(36f, 0f);
            labelText.rectTransform.offsetMax = new Vector2(0f, 0f);

            return toggle;
        }

        private static (ScrollRect scrollRect, RectTransform content) CreateScrollRect(string name, Transform parent, bool horizontal)
        {
            var rect = CreateUIObject(name, parent);
            rect.sizeDelta = new Vector2(0f, 120f);

            var background = rect.gameObject.AddComponent<Image>();
            background.color = new Color(0.1f, 0.11f, 0.14f, 0.6f);

            var viewport = CreateUIObject("Viewport", rect);
            Stretch(viewport);
            var viewportImage = viewport.gameObject.AddComponent<Image>();
            viewportImage.color = new Color(0f, 0f, 0f, 0.25f);
            var mask = viewport.gameObject.AddComponent<Mask>();
            mask.showMaskGraphic = false;

            var content = CreateUIObject("Content", viewport);
            content.anchorMin = new Vector2(0f, 0f);
            content.anchorMax = new Vector2(1f, 1f);
            content.offsetMin = Vector2.zero;
            content.offsetMax = Vector2.zero;
            var contentFitter = content.gameObject.AddComponent<ContentSizeFitter>();
            contentFitter.horizontalFit = horizontal ? ContentSizeFitter.FitMode.PreferredSize : ContentSizeFitter.FitMode.Unconstrained;
            contentFitter.verticalFit = horizontal ? ContentSizeFitter.FitMode.Unconstrained : ContentSizeFitter.FitMode.PreferredSize;

            var scrollRect = rect.gameObject.AddComponent<ScrollRect>();
            scrollRect.viewport = viewport;
            scrollRect.content = content;
            scrollRect.horizontal = horizontal;
            scrollRect.vertical = !horizontal;
            scrollRect.movementType = ScrollRect.MovementType.Clamped;

            return (scrollRect, content);
        }

        private static ProgressBar CreateProgressBar(string name, Transform parent, string label)
        {
            var root = CreateUIObject(name, parent);
            root.sizeDelta = new Vector2(0f, 26f);

            var background = root.gameObject.AddComponent<Image>();
            background.color = new Color(0.2f, 0.22f, 0.28f, 0.9f);

            var fill = CreateImage("Fill", root, new Color(0.3f, 0.7f, 0.4f, 0.9f));
            Stretch(fill.rectTransform);
            fill.type = Image.Type.Filled;
            fill.fillMethod = Image.FillMethod.Horizontal;
            fill.fillAmount = 0.3f;

            var labelText = CreateText("Label", root, label, 12, TextAlignmentOptions.Left);
            labelText.rectTransform.anchorMin = new Vector2(0f, 0f);
            labelText.rectTransform.anchorMax = new Vector2(0.7f, 1f);
            labelText.rectTransform.offsetMin = new Vector2(24f, 0f);
            labelText.rectTransform.offsetMax = new Vector2(-6f, 0f);

            var valueText = CreateText("Value", root, "0.0 / 0.0", 12, TextAlignmentOptions.Right);
            valueText.rectTransform.anchorMin = new Vector2(0.7f, 0f);
            valueText.rectTransform.anchorMax = new Vector2(1f, 1f);
            valueText.rectTransform.offsetMin = new Vector2(6f, 0f);
            valueText.rectTransform.offsetMax = new Vector2(-6f, 0f);

            var tooltipPanel = CreatePanel("Tooltip", root, new Color(0f, 0f, 0f, 0.8f));
            var tooltipGroup = tooltipPanel.gameObject.AddComponent<CanvasGroup>();
            tooltipGroup.alpha = 0f;
            tooltipPanel.rectTransform.anchorMin = new Vector2(0f, 1f);
            tooltipPanel.rectTransform.anchorMax = new Vector2(1f, 1f);
            tooltipPanel.rectTransform.pivot = new Vector2(0.5f, 1f);
            tooltipPanel.rectTransform.sizeDelta = new Vector2(0f, 36f);
            tooltipPanel.rectTransform.anchoredPosition = new Vector2(0f, 6f);

            var tooltipText = CreateText("TooltipText", tooltipPanel.transform, label, 11, TextAlignmentOptions.Center);
            Stretch(tooltipText.rectTransform);

            var bar = root.gameObject.AddComponent<ProgressBar>();
            SetObject(bar, "_labelText", labelText);
            SetObject(bar, "_valueText", valueText);
            SetObject(bar, "_fillImage", fill);
            SetObject(bar, "_backgroundImage", background);
            SetObject(bar, "_tooltipGroup", tooltipGroup);
            SetObject(bar, "_tooltipText", tooltipText);

            return bar;
        }

        private static StatBar CreateStatBar(string name, Transform parent, string label)
        {
            var root = CreateUIObject(name, parent);
            root.sizeDelta = new Vector2(0f, 22f);

            var background = root.gameObject.AddComponent<Image>();
            background.color = new Color(0.2f, 0.22f, 0.28f, 0.9f);

            var fill = CreateImage("Fill", root, new Color(0.4f, 0.6f, 0.9f, 0.9f));
            Stretch(fill.rectTransform);
            fill.type = Image.Type.Filled;
            fill.fillMethod = Image.FillMethod.Horizontal;
            fill.fillAmount = 0.3f;

            var labelText = CreateText("Label", root, label, 12, TextAlignmentOptions.Left);
            labelText.rectTransform.anchorMin = new Vector2(0f, 0f);
            labelText.rectTransform.anchorMax = new Vector2(0.6f, 1f);
            labelText.rectTransform.offsetMin = new Vector2(6f, 0f);
            labelText.rectTransform.offsetMax = new Vector2(-6f, 0f);

            var valueText = CreateText("Value", root, "0.0", 12, TextAlignmentOptions.Right);
            valueText.rectTransform.anchorMin = new Vector2(0.6f, 0f);
            valueText.rectTransform.anchorMax = new Vector2(1f, 1f);
            valueText.rectTransform.offsetMin = new Vector2(6f, 0f);
            valueText.rectTransform.offsetMax = new Vector2(-6f, 0f);

            var statBar = root.gameObject.AddComponent<StatBar>();
            SetObject(statBar, "_labelText", labelText);
            SetObject(statBar, "_valueText", valueText);
            SetObject(statBar, "_fillImage", fill);

            return statBar;
        }

        private static ResourceDisplay CreateResourceDisplay(string name, Transform parent, string label)
        {
            var root = CreateUIObject(name, parent);
            root.sizeDelta = new Vector2(120f, 28f);

            var background = root.gameObject.AddComponent<Image>();
            background.color = new Color(0.12f, 0.14f, 0.18f, 0.9f);

            var labelText = CreateText("Label", root, label, 12, TextAlignmentOptions.Left);
            labelText.rectTransform.anchorMin = new Vector2(0f, 0f);
            labelText.rectTransform.anchorMax = new Vector2(0.65f, 1f);
            labelText.rectTransform.offsetMin = new Vector2(6f, 0f);
            labelText.rectTransform.offsetMax = new Vector2(-6f, 0f);

            var valueText = CreateText("Value", root, "0.0", 12, TextAlignmentOptions.Right);
            valueText.rectTransform.anchorMin = new Vector2(0.65f, 0f);
            valueText.rectTransform.anchorMax = new Vector2(1f, 1f);
            valueText.rectTransform.offsetMin = new Vector2(6f, 0f);
            valueText.rectTransform.offsetMax = new Vector2(-6f, 0f);

            var icon = CreateImage("Icon", root, new Color(0.4f, 0.45f, 0.55f, 0.9f));
            icon.rectTransform.anchorMin = new Vector2(0f, 0.5f);
            icon.rectTransform.anchorMax = new Vector2(0f, 0.5f);
            icon.rectTransform.sizeDelta = new Vector2(14f, 14f);
            icon.rectTransform.anchoredPosition = new Vector2(6f, 0f);

            var display = root.gameObject.AddComponent<ResourceDisplay>();
            SetObject(display, "_labelText", labelText);
            SetObject(display, "_valueText", valueText);
            SetObject(display, "_icon", icon);

            return display;
        }

        private static OverlayToggleButton CreateOverlayToggleButton(string name, Transform parent)
        {
            var root = CreateUIObject(name, parent);
            var image = root.gameObject.AddComponent<Image>();
            image.color = new Color(0.2f, 0.22f, 0.3f, 0.9f);
            var button = root.gameObject.AddComponent<Button>();

            var icon = CreateImage("Icon", root, new Color(0.5f, 0.6f, 0.7f, 0.9f));
            icon.rectTransform.anchorMin = new Vector2(0f, 0.5f);
            icon.rectTransform.anchorMax = new Vector2(0f, 0.5f);
            icon.rectTransform.sizeDelta = new Vector2(18f, 18f);
            icon.rectTransform.anchoredPosition = new Vector2(16f, 0f);

            var label = CreateText("Label", root, "Overlay", 12, TextAlignmentOptions.Left);
            label.rectTransform.anchorMin = new Vector2(0f, 0f);
            label.rectTransform.anchorMax = new Vector2(1f, 1f);
            label.rectTransform.offsetMin = new Vector2(40f, 0f);
            label.rectTransform.offsetMax = new Vector2(-6f, 0f);

            var toggle = root.gameObject.AddComponent<OverlayToggleButton>();
            SetObject(toggle, "_button", button);
            SetObject(toggle, "_buttonImage", image);
            SetObject(toggle, "_iconImage", icon);
            SetObject(toggle, "_labelText", label);

            var layout = root.gameObject.AddComponent<LayoutElement>();
            layout.preferredHeight = 32f;

            return toggle;
        }

        private static EventPopup CreateEventPopup(Transform parent, PrefabRefs prefabs)
        {
            var overlay = CreatePanel("EventPopup", parent, new Color(0f, 0f, 0f, 0.6f));
            Stretch(overlay.rectTransform);
            var canvasGroup = overlay.gameObject.AddComponent<CanvasGroup>();
            canvasGroup.alpha = 0f;

            var panel = CreatePanel("Panel", overlay.transform, new Color(0.12f, 0.13f, 0.18f, 0.98f));
            panel.rectTransform.anchorMin = new Vector2(0.2f, 0.2f);
            panel.rectTransform.anchorMax = new Vector2(0.8f, 0.8f);
            panel.rectTransform.offsetMin = Vector2.zero;
            panel.rectTransform.offsetMax = Vector2.zero;

            var panelLayout = panel.gameObject.AddComponent<VerticalLayoutGroup>();
            panelLayout.padding = new RectOffset(16, 16, 16, 16);
            panelLayout.spacing = 8f;

            var titleText = CreateText("Title", panel.transform, "Event Title", 22, TextAlignmentOptions.Left);
            var descriptionText = CreateText("Description", panel.transform, "Event description", 14, TextAlignmentOptions.Left);
            var optionsContainer = CreateUIObject("OptionsContainer", panel.transform);
            var optionsLayout = optionsContainer.gameObject.AddComponent<VerticalLayoutGroup>();
            optionsLayout.spacing = 6f;
            optionsLayout.childControlWidth = true;
            optionsLayout.childControlHeight = true;

            var dismissButton = CreateButton("DismissButton", panel.transform, "Dismiss");

            var popup = overlay.gameObject.AddComponent<EventPopup>();
            SetObject(popup, "_canvasGroup", canvasGroup);
            SetObject(popup, "_backgroundOverlay", overlay);
            SetObject(popup, "_popupPanel", panel.rectTransform);
            SetObject(popup, "_titleText", titleText);
            SetObject(popup, "_descriptionText", descriptionText);
            SetObject(popup, "_optionsContainer", optionsContainer);
            SetObject(popup, "_optionButtonPrefab", prefabs.EventOptionButton);
            SetObject(popup, "_dismissButton", dismissButton);

            return popup;
        }

        private static GameEndScreen CreateGameEndScreen(Transform parent)
        {
            var overlay = CreatePanel("GameEndScreen", parent, new Color(0f, 0f, 0f, 0.6f));
            Stretch(overlay.rectTransform);
            var canvasGroup = overlay.gameObject.AddComponent<CanvasGroup>();
            canvasGroup.alpha = 0f;

            var panel = CreatePanel("Panel", overlay.transform, new Color(0.12f, 0.13f, 0.18f, 0.98f));
            panel.rectTransform.anchorMin = new Vector2(0.2f, 0.2f);
            panel.rectTransform.anchorMax = new Vector2(0.8f, 0.8f);
            panel.rectTransform.offsetMin = Vector2.zero;
            panel.rectTransform.offsetMax = Vector2.zero;

            var layout = panel.gameObject.AddComponent<VerticalLayoutGroup>();
            layout.padding = new RectOffset(16, 16, 16, 16);
            layout.spacing = 8f;

            var titleText = CreateText("Title", panel.transform, "VICTORY", 28, TextAlignmentOptions.Center);
            var subtitleText = CreateText("Subtitle", panel.transform, "Outcome", 16, TextAlignmentOptions.Center);
            var descriptionText = CreateText("Description", panel.transform, "Description goes here", 14, TextAlignmentOptions.Left);

            var statsPanel = CreateUIObject("StatsPanel", panel.transform);
            var statsLayout = statsPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            statsLayout.spacing = 4f;

            var turnsText = CreateText("Turns", statsPanel, "Turns Played: 0", 12, TextAlignmentOptions.Left);
            var fciText = CreateText("FCI", statsPanel, "Frontier Capability: 0", 12, TextAlignmentOptions.Left);
            var ariText = CreateText("ARI", statsPanel, "Alignment Readiness: 0", 12, TextAlignmentOptions.Left);
            var automationText = CreateText("Automation", statsPanel, "Automation: 0", 12, TextAlignmentOptions.Left);
            var governanceText = CreateText("Governance", statsPanel, "Governance: 0", 12, TextAlignmentOptions.Left);

            var buttonRow = CreateUIObject("Buttons", panel.transform);
            var buttonLayout = buttonRow.gameObject.AddComponent<HorizontalLayoutGroup>();
            buttonLayout.spacing = 8f;
            buttonLayout.childForceExpandWidth = true;

            var playAgainButton = CreateButton("PlayAgainButton", buttonRow, "Play Again");
            var mainMenuButton = CreateButton("MainMenuButton", buttonRow, "Main Menu");

            var victoryImage = CreateImage("VictoryImage", panel.transform, new Color(0.3f, 0.6f, 0.3f, 0.9f));
            victoryImage.rectTransform.sizeDelta = new Vector2(120f, 8f);

            var screen = overlay.gameObject.AddComponent<GameEndScreen>();
            SetObject(screen, "_canvasGroup", canvasGroup);
            SetObject(screen, "_backgroundOverlay", overlay);
            SetObject(screen, "_contentPanel", panel.rectTransform);
            SetObject(screen, "_titleText", titleText);
            SetObject(screen, "_subtitleText", subtitleText);
            SetObject(screen, "_descriptionText", descriptionText);
            SetObject(screen, "_victoryImage", victoryImage);
            SetObject(screen, "_turnsPlayedText", turnsText);
            SetObject(screen, "_fciText", fciText);
            SetObject(screen, "_ariText", ariText);
            SetObject(screen, "_automationText", automationText);
            SetObject(screen, "_governanceText", governanceText);
            SetObject(screen, "_playAgainButton", playAgainButton);
            SetObject(screen, "_mainMenuButton", mainMenuButton);

            return screen;
        }

        private static PauseMenu CreatePauseMenu(Transform parent)
        {
            var overlay = CreatePanel("PauseMenu", parent, new Color(0f, 0f, 0f, 0.6f));
            Stretch(overlay.rectTransform);
            var canvasGroup = overlay.gameObject.AddComponent<CanvasGroup>();
            canvasGroup.alpha = 0f;

            var panel = CreatePanel("Panel", overlay.transform, new Color(0.12f, 0.13f, 0.18f, 0.98f));
            panel.rectTransform.anchorMin = new Vector2(0.35f, 0.2f);
            panel.rectTransform.anchorMax = new Vector2(0.65f, 0.8f);
            panel.rectTransform.offsetMin = Vector2.zero;
            panel.rectTransform.offsetMax = Vector2.zero;

            var mainPanel = CreateUIObject("MainPanel", panel.transform);
            var mainLayout = mainPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            mainLayout.padding = new RectOffset(16, 16, 16, 16);
            mainLayout.spacing = 8f;

            var resumeButton = CreateButton("ResumeButton", mainPanel, "Resume");
            var saveButton = CreateButton("SaveButton", mainPanel, "Save");
            var loadButton = CreateButton("LoadButton", mainPanel, "Load");
            var settingsButton = CreateButton("SettingsButton", mainPanel, "Settings");
            var mainMenuButton = CreateButton("MainMenuButton", mainPanel, "Main Menu");
            var quitButton = CreateButton("QuitButton", mainPanel, "Quit");
            var statusText = CreateText("StatusText", mainPanel, "", 12, TextAlignmentOptions.Center);

            var settingsPanel = CreateUIObject("SettingsPanel", panel.transform);
            settingsPanel.gameObject.SetActive(false);
            var settingsLayout = settingsPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            settingsLayout.padding = new RectOffset(16, 16, 16, 16);
            settingsLayout.spacing = 8f;
            CreateText("SettingsTitle", settingsPanel, "Settings", 18, TextAlignmentOptions.Left);
            var musicSlider = CreateSlider("MusicSlider", settingsPanel);
            var sfxSlider = CreateSlider("SfxSlider", settingsPanel);
            var settingsBackButton = CreateButton("SettingsBackButton", settingsPanel, "Back");

            var confirmPanel = CreateUIObject("ConfirmQuitPanel", panel.transform);
            confirmPanel.gameObject.SetActive(false);
            var confirmLayout = confirmPanel.gameObject.AddComponent<VerticalLayoutGroup>();
            confirmLayout.padding = new RectOffset(16, 16, 16, 16);
            confirmLayout.spacing = 8f;
            CreateText("ConfirmTitle", confirmPanel, "Quit to Desktop?", 16, TextAlignmentOptions.Center);
            var confirmYes = CreateButton("ConfirmYes", confirmPanel, "Yes");
            var confirmNo = CreateButton("ConfirmNo", confirmPanel, "No");

            var pauseMenu = overlay.gameObject.AddComponent<PauseMenu>();
            SetObject(pauseMenu, "_canvasGroup", canvasGroup);
            SetObject(pauseMenu, "_mainPanel", mainPanel.gameObject);
            SetObject(pauseMenu, "_settingsPanel", settingsPanel.gameObject);
            SetObject(pauseMenu, "_confirmQuitPanel", confirmPanel.gameObject);
            SetObject(pauseMenu, "_resumeButton", resumeButton);
            SetObject(pauseMenu, "_saveButton", saveButton);
            SetObject(pauseMenu, "_loadButton", loadButton);
            SetObject(pauseMenu, "_settingsButton", settingsButton);
            SetObject(pauseMenu, "_mainMenuButton", mainMenuButton);
            SetObject(pauseMenu, "_quitButton", quitButton);
            SetObject(pauseMenu, "_musicVolumeSlider", musicSlider);
            SetObject(pauseMenu, "_sfxVolumeSlider", sfxSlider);
            SetObject(pauseMenu, "_settingsBackButton", settingsBackButton);
            SetObject(pauseMenu, "_confirmQuitYes", confirmYes);
            SetObject(pauseMenu, "_confirmQuitNo", confirmNo);
            SetObject(pauseMenu, "_statusText", statusText);

            return pauseMenu;
        }

        private static TutorialOverlay CreateTutorialOverlay(Transform parent)
        {
            var overlay = CreatePanel("TutorialOverlay", parent, new Color(0f, 0f, 0f, 0.55f));
            Stretch(overlay.rectTransform);
            var canvasGroup = overlay.gameObject.AddComponent<CanvasGroup>();
            canvasGroup.alpha = 0f;

            var panel = CreatePanel("TooltipPanel", overlay.transform, new Color(0.12f, 0.13f, 0.18f, 0.98f));
            panel.rectTransform.anchorMin = new Vector2(0.2f, 0.15f);
            panel.rectTransform.anchorMax = new Vector2(0.8f, 0.35f);
            panel.rectTransform.offsetMin = Vector2.zero;
            panel.rectTransform.offsetMax = Vector2.zero;

            var layout = panel.gameObject.AddComponent<VerticalLayoutGroup>();
            layout.padding = new RectOffset(16, 16, 16, 16);
            layout.spacing = 6f;

            var titleText = CreateText("Title", panel.transform, "Tutorial", 18, TextAlignmentOptions.Left);
            var descriptionText = CreateText("Description", panel.transform, "Tutorial step description", 14, TextAlignmentOptions.Left);
            var stepIndicator = CreateText("StepIndicator", panel.transform, "1 / 8", 12, TextAlignmentOptions.Right);

            var buttonRow = CreateUIObject("Buttons", panel.transform);
            var buttonLayout = buttonRow.gameObject.AddComponent<HorizontalLayoutGroup>();
            buttonLayout.spacing = 8f;
            buttonLayout.childForceExpandWidth = true;

            var nextButton = CreateButton("NextButton", buttonRow, "Next");
            var skipButton = CreateButton("SkipButton", buttonRow, "Skip");

            var highlightMask = CreateImage("HighlightMask", overlay.transform, new Color(1f, 1f, 1f, 0.2f));
            highlightMask.gameObject.SetActive(false);

            var tutorial = overlay.gameObject.AddComponent<TutorialOverlay>();
            SetObject(tutorial, "_canvasGroup", canvasGroup);
            SetObject(tutorial, "_tooltipPanel", panel.rectTransform);
            SetObject(tutorial, "_titleText", titleText);
            SetObject(tutorial, "_descriptionText", descriptionText);
            SetObject(tutorial, "_nextButton", nextButton);
            SetObject(tutorial, "_skipButton", skipButton);
            SetObject(tutorial, "_stepIndicator", stepIndicator);
            SetObject(tutorial, "_highlightMask", highlightMask);

            return tutorial;
        }

        private static void UpdateBuildSettings()
        {
            var scenes = new List<EditorBuildSettingsScene>
            {
                new EditorBuildSettingsScene(MainMenuScenePath, true),
                new EditorBuildSettingsScene(GameScenePath, true)
            };
            EditorBuildSettings.scenes = scenes.ToArray();
        }

        private static void Stretch(RectTransform rect)
        {
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }

        private static void SetObject(Object target, string fieldName, Object value)
        {
            var serializedObject = new SerializedObject(target);
            var property = serializedObject.FindProperty(fieldName);
            if (property == null)
            {
                Debug.LogWarning($"Field not found: {target.GetType().Name}.{fieldName}");
                return;
            }
            property.objectReferenceValue = value;
            serializedObject.ApplyModifiedPropertiesWithoutUndo();
        }
    }
}
