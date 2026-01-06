using UnityEngine;
using UnityEngine.Audio;

namespace Clippy.Unity
{
    /// <summary>
    /// Manages game audio (music and sound effects).
    /// Placeholder for MVP - actual audio implementation can be added later.
    /// </summary>
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [Header("Audio Mixer")]
        [SerializeField] private AudioMixer _audioMixer;

        [Header("Audio Sources")]
        [SerializeField] private AudioSource _musicSource;
        [SerializeField] private AudioSource _sfxSource;

        [Header("Music Clips")]
        [SerializeField] private AudioClip _menuMusic;
        [SerializeField] private AudioClip _gameMusic;
        [SerializeField] private AudioClip _tensionMusic;
        [SerializeField] private AudioClip _victoryMusic;
        [SerializeField] private AudioClip _defeatMusic;

        [Header("SFX Clips")]
        [SerializeField] private AudioClip _buttonClick;
        [SerializeField] private AudioClip _turnEnd;
        [SerializeField] private AudioClip _eventPopup;
        [SerializeField] private AudioClip _actionExecute;
        [SerializeField] private AudioClip _warning;

        private float _musicVolume = 0.7f;
        private float _sfxVolume = 1f;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            LoadVolumeSettings();
        }

        private void LoadVolumeSettings()
        {
            _musicVolume = PlayerPrefs.GetFloat("MusicVolume", 0.7f);
            _sfxVolume = PlayerPrefs.GetFloat("SfxVolume", 1f);
            ApplyVolume();
        }

        private void ApplyVolume()
        {
            if (_musicSource != null)
            {
                _musicSource.volume = _musicVolume;
            }

            if (_sfxSource != null)
            {
                _sfxSource.volume = _sfxVolume;
            }

            if (_audioMixer != null)
            {
                _audioMixer.SetFloat("MusicVolume", Mathf.Log10(Mathf.Max(_musicVolume, 0.001f)) * 20f);
                _audioMixer.SetFloat("SfxVolume", Mathf.Log10(Mathf.Max(_sfxVolume, 0.001f)) * 20f);
            }
        }

        public void SetMusicVolume(float volume)
        {
            _musicVolume = Mathf.Clamp01(volume);
            PlayerPrefs.SetFloat("MusicVolume", _musicVolume);
            ApplyVolume();
        }

        public void SetSfxVolume(float volume)
        {
            _sfxVolume = Mathf.Clamp01(volume);
            PlayerPrefs.SetFloat("SfxVolume", _sfxVolume);
            ApplyVolume();
        }

        public void PlayMusic(MusicType type)
        {
            if (_musicSource == null) return;

            AudioClip clip = type switch
            {
                MusicType.Menu => _menuMusic,
                MusicType.Game => _gameMusic,
                MusicType.Tension => _tensionMusic,
                MusicType.Victory => _victoryMusic,
                MusicType.Defeat => _defeatMusic,
                _ => null
            };

            if (clip != null && _musicSource.clip != clip)
            {
                _musicSource.clip = clip;
                _musicSource.Play();
            }
        }

        public void PlaySfx(SfxType type)
        {
            if (_sfxSource == null) return;

            AudioClip clip = type switch
            {
                SfxType.ButtonClick => _buttonClick,
                SfxType.TurnEnd => _turnEnd,
                SfxType.EventPopup => _eventPopup,
                SfxType.ActionExecute => _actionExecute,
                SfxType.Warning => _warning,
                _ => null
            };

            if (clip != null)
            {
                _sfxSource.PlayOneShot(clip);
            }
        }

        public void StopMusic()
        {
            if (_musicSource != null)
            {
                _musicSource.Stop();
            }
        }

        public void PauseMusic()
        {
            if (_musicSource != null)
            {
                _musicSource.Pause();
            }
        }

        public void ResumeMusic()
        {
            if (_musicSource != null)
            {
                _musicSource.UnPause();
            }
        }
    }

    public enum MusicType
    {
        Menu,
        Game,
        Tension,
        Victory,
        Defeat
    }

    public enum SfxType
    {
        ButtonClick,
        TurnEnd,
        EventPopup,
        ActionExecute,
        Warning
    }
}
