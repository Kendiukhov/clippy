using UnityEngine;
using System;
using System.IO;
using Clippy.SimCore;

namespace Clippy.Unity
{
    /// <summary>
    /// Handles saving and loading game state.
    /// </summary>
    public class SaveManager : MonoBehaviour
    {
        public static SaveManager Instance { get; private set; }

        [Header("Settings")]
        [SerializeField] private int _maxSaveSlots = 3;
        [SerializeField] private bool _usePlayerPrefs = true;

        private const string SaveKeyPrefix = "ClippySave_";
        private const string SaveFilePrefix = "save_";
        private const string SaveFileExtension = ".json";

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        /// <summary>
        /// Save current game to a slot.
        /// </summary>
        public bool SaveGame(int slot = 0)
        {
            if (slot < 0 || slot >= _maxSaveSlots)
            {
                Debug.LogError($"[SaveManager] Invalid save slot: {slot}");
                return false;
            }

            if (GameManager.Instance == null || GameManager.Instance.WorldState == null)
            {
                Debug.LogError("[SaveManager] No game to save");
                return false;
            }

            try
            {
                string saveData = GameManager.Instance.SaveGame();
                if (string.IsNullOrEmpty(saveData))
                {
                    Debug.LogError("[SaveManager] Failed to serialize save data");
                    return false;
                }

                if (_usePlayerPrefs)
                {
                    PlayerPrefs.SetString(SaveKeyPrefix + slot, saveData);
                    PlayerPrefs.SetString(SaveKeyPrefix + slot + "_timestamp", DateTime.Now.ToString("o"));
                    PlayerPrefs.Save();
                }
                else
                {
                    string path = GetSaveFilePath(slot);
                    File.WriteAllText(path, saveData);
                }

                Debug.Log($"[SaveManager] Game saved to slot {slot}");
                return true;
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveManager] Save failed: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Load game from a slot.
        /// </summary>
        public bool LoadGame(int slot = 0)
        {
            if (slot < 0 || slot >= _maxSaveSlots)
            {
                Debug.LogError($"[SaveManager] Invalid save slot: {slot}");
                return false;
            }

            try
            {
                string saveData;

                if (_usePlayerPrefs)
                {
                    saveData = PlayerPrefs.GetString(SaveKeyPrefix + slot, "");
                }
                else
                {
                    string path = GetSaveFilePath(slot);
                    if (!File.Exists(path))
                    {
                        Debug.LogWarning($"[SaveManager] No save file at slot {slot}");
                        return false;
                    }
                    saveData = File.ReadAllText(path);
                }

                if (string.IsNullOrEmpty(saveData))
                {
                    Debug.LogWarning($"[SaveManager] No save data in slot {slot}");
                    return false;
                }

                if (GameManager.Instance == null)
                {
                    Debug.LogError("[SaveManager] GameManager not found");
                    return false;
                }

                bool success = GameManager.Instance.LoadGame(saveData);
                if (success)
                {
                    Debug.Log($"[SaveManager] Game loaded from slot {slot}");
                }
                return success;
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveManager] Load failed: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Check if a save exists in a slot.
        /// </summary>
        public bool HasSave(int slot)
        {
            if (slot < 0 || slot >= _maxSaveSlots) return false;

            if (_usePlayerPrefs)
            {
                return PlayerPrefs.HasKey(SaveKeyPrefix + slot);
            }
            else
            {
                return File.Exists(GetSaveFilePath(slot));
            }
        }

        /// <summary>
        /// Delete a save from a slot.
        /// </summary>
        public void DeleteSave(int slot)
        {
            if (slot < 0 || slot >= _maxSaveSlots) return;

            if (_usePlayerPrefs)
            {
                PlayerPrefs.DeleteKey(SaveKeyPrefix + slot);
                PlayerPrefs.DeleteKey(SaveKeyPrefix + slot + "_timestamp");
                PlayerPrefs.Save();
            }
            else
            {
                string path = GetSaveFilePath(slot);
                if (File.Exists(path))
                {
                    File.Delete(path);
                }
            }

            Debug.Log($"[SaveManager] Deleted save in slot {slot}");
        }

        /// <summary>
        /// Get save info for a slot.
        /// </summary>
        public SaveSlotInfo GetSaveInfo(int slot)
        {
            if (!HasSave(slot)) return null;

            var info = new SaveSlotInfo { Slot = slot };

            if (_usePlayerPrefs)
            {
                string timestamp = PlayerPrefs.GetString(SaveKeyPrefix + slot + "_timestamp", "");
                if (DateTime.TryParse(timestamp, out var dt))
                {
                    info.SaveTime = dt;
                }

                // Parse save data to get turn info
                string saveData = PlayerPrefs.GetString(SaveKeyPrefix + slot, "");
                if (!string.IsNullOrEmpty(saveData))
                {
                    try
                    {
                        var saveObj = JsonUtility.FromJson<GameSaveData>(saveData);
                        info.Turn = saveObj.Turn;
                        info.Faction = saveObj.PlayerFaction;
                    }
                    catch { }
                }
            }
            else
            {
                string path = GetSaveFilePath(slot);
                info.SaveTime = File.GetLastWriteTime(path);

                string saveData = File.ReadAllText(path);
                try
                {
                    var saveObj = JsonUtility.FromJson<GameSaveData>(saveData);
                    info.Turn = saveObj.Turn;
                    info.Faction = saveObj.PlayerFaction;
                }
                catch { }
            }

            return info;
        }

        private string GetSaveFilePath(int slot)
        {
            return Path.Combine(Application.persistentDataPath, $"{SaveFilePrefix}{slot}{SaveFileExtension}");
        }

        /// <summary>
        /// Quick save to slot 0.
        /// </summary>
        public void QuickSave()
        {
            SaveGame(0);
        }

        /// <summary>
        /// Quick load from slot 0.
        /// </summary>
        public void QuickLoad()
        {
            LoadGame(0);
        }
    }

    [System.Serializable]
    public class SaveSlotInfo
    {
        public int Slot;
        public int Turn;
        public FactionKind Faction;
        public DateTime SaveTime;

        public string GetDisplayText()
        {
            string factionName = Faction == FactionKind.SeedAi ? "Seed AI" : "Alignment Coalition";
            return $"Turn {Turn} - {factionName}\n{SaveTime:g}";
        }
    }
}
