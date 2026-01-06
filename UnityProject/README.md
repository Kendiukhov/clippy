# Clippy Unity Project

Unity 2D implementation of the Clippy AI strategy game.

## Project Structure

```
UnityProject/
├── Assets/
│   ├── Scenes/              # MainMenu.unity, GameScene.unity (create in Unity)
│   ├── Scripts/
│   │   ├── Core/            # SimCore integration + GameManager
│   │   ├── Managers/        # SaveManager, AudioManager, GameSceneManager
│   │   └── UI/              # All UI controllers and components
│   ├── Prefabs/             # UI and Region prefabs (create in Unity)
│   ├── Resources/
│   │   └── Content/         # JSON game data (scenario, actions, events)
│   └── Sprites/             # Visual assets (add your own)
├── Packages/
│   └── manifest.json        # Unity package dependencies
└── ProjectSettings/         # Unity project configuration
```

## Setup Instructions

### 1. Open in Unity
1. Open Unity Hub
2. Click "Add" and select the `UnityProject` folder
3. Open with Unity 2023 LTS (or later)

### 2. Create Scenes
Create two scenes in `Assets/Scenes/`:

#### MainMenu.unity
- Create Canvas with MainMenuController
- Add panels for: Main menu, Faction selection, Settings
- Add buttons: New Game, Continue, Settings, Quit

#### GameScene.unity
- Create Canvas with all game UI:
  - WorldMapController with RegionsContainer
  - ActionBarController with ActionsContainer
  - ProgressDisplay (top bar)
  - RegionInfoPanel (side panel)
  - EventPopup (modal)
  - GameEndScreen (modal)
  - NewsTicker (scrolling log)
  - OverlayToggleGroup (overlay buttons)
  - PauseMenu (ESC menu)
  - TutorialOverlay (first-time guide)
- Add GameManager, SaveManager, AudioManager as singletons
- Add GameSceneManager to initialize the scene

### 3. Create Prefabs

#### RegionView Prefab
- Create UI panel with:
  - Background Image
  - Overlay Image (for stat visualization)
  - Region name TextMeshPro
  - Selection outline Image
  - Add RegionView script

#### ActionCard Prefab
- Create UI panel with:
  - Background Image
  - Border Image
  - Name TextMeshPro
  - Description TextMeshPro
  - Cost TextMeshPro
  - Category label
  - Add ActionCard script

#### EventOptionButton Prefab
- Create Button with:
  - Label TextMeshPro
  - Effects preview TextMeshPro
  - Add EventOptionButton script

### 4. Wire Up References
1. Assign prefabs to controllers
2. Connect UI elements to script serialized fields
3. Set up event listeners

### 5. Add Sprites
Add visual assets to `Assets/Sprites/`:
- World map background
- Region shapes/icons
- UI elements (buttons, panels, icons)

## Key Scripts

### Core
- **GameManager.cs**: Central game state, bridges UI with SimCore
- **SimCore/*.cs**: Deterministic simulation engine (copied from ../SimCore)

### Managers
- **GameSceneManager.cs**: Scene initialization and keyboard shortcuts
- **SaveManager.cs**: Save/load game state
- **AudioManager.cs**: Music and SFX (placeholder)

### UI
- **WorldMapController.cs**: Map view and region management
- **RegionView.cs**: Individual region visualization
- **RegionInfoPanel.cs**: Selected region details
- **ActionBarController.cs**: Bottom action bar
- **ActionCard.cs**: Individual action cards
- **EventPopup.cs**: Event dialog with options
- **ProgressDisplay.cs**: Global metrics display
- **OverlayToggle.cs**: Map overlay controls
- **NewsTicker.cs**: Event log
- **GameEndScreen.cs**: Victory/defeat screen
- **MainMenuController.cs**: Main menu
- **PauseMenu.cs**: In-game pause menu
- **TutorialOverlay.cs**: First-time player guide

## Controls

| Key | Action |
|-----|--------|
| Click | Select region/action |
| ESC | Pause menu |
| F5 | Quick save |
| F9 | Quick load |

## Build Targets

Configured for:
- iOS
- Android
- Standalone (Windows/Mac/Linux)

## Dependencies

- TextMeshPro (for text rendering)
- Unity UI (uGUI)
- Input System (optional, classic input used)
