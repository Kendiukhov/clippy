using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Clippy.SimCore
{
    public static class ContentLoader
    {
        private static JsonSerializerSettings CreateSettings()
        {
            var settings = new JsonSerializerSettings
            {
                MissingMemberHandling = MissingMemberHandling.Ignore,
                NullValueHandling = NullValueHandling.Ignore
            };
            settings.Converters.Add(new StringEnumConverter());
            return settings;
        }

        /// <summary>
        /// Load content from directory (for CLI/standalone use).
        /// </summary>
        public static SimContent LoadFromDirectory(string directory)
        {
            if (!Directory.Exists(directory))
            {
                throw new DirectoryNotFoundException($"Content directory not found: {directory}");
            }

            var settings = CreateSettings();

            var content = new SimContent
            {
                Scenario = LoadFile<ScenarioDefinition>(Path.Combine(directory, "scenario.json"), settings) ?? new ScenarioDefinition(),
                Actions = LoadFile<List<ActionDefinition>>(Path.Combine(directory, "actions.json"), settings) ?? new List<ActionDefinition>(),
                Events = LoadFile<List<EventDefinition>>(Path.Combine(directory, "events.json"), settings) ?? new List<EventDefinition>(),
                Characters = LoadFile<List<CharacterDefinition>>(Path.Combine(directory, "characters.json"), settings) ?? new List<CharacterDefinition>()
            };

            var upgradesPath = Path.Combine(directory, "upgrades.json");
            var upgrades = LoadFile<List<ActionDefinition>>(upgradesPath, settings);
            if (upgrades != null)
            {
                content.Actions.AddRange(upgrades);
            }

            return content;
        }

        /// <summary>
        /// Load content from JSON strings (for Unity Resources loading).
        /// </summary>
        public static SimContent Load(string scenarioJson, string actionsJson, string eventsJson, string? upgradesJson = null, string? charactersJson = null)
        {
            var settings = CreateSettings();

            var content = new SimContent
            {
                Scenario = ParseJson<ScenarioDefinition>(scenarioJson, settings) ?? new ScenarioDefinition(),
                Actions = ParseJson<List<ActionDefinition>>(actionsJson, settings) ?? new List<ActionDefinition>(),
                Events = ParseJson<List<EventDefinition>>(eventsJson, settings) ?? new List<EventDefinition>(),
                Characters = !string.IsNullOrEmpty(charactersJson) ? ParseJson<List<CharacterDefinition>>(charactersJson, settings) ?? new List<CharacterDefinition>() : new List<CharacterDefinition>()
            };

            if (!string.IsNullOrEmpty(upgradesJson))
            {
                var upgrades = ParseJson<List<ActionDefinition>>(upgradesJson, settings);
                if (upgrades != null)
                {
                    content.Actions.AddRange(upgrades);
                }
            }

            return content;
        }

        private static T? LoadFile<T>(string path, JsonSerializerSettings settings)
        {
            if (!File.Exists(path))
            {
                return default;
            }

            var json = File.ReadAllText(path);
            return JsonConvert.DeserializeObject<T>(json, settings);
        }

        private static T? ParseJson<T>(string json, JsonSerializerSettings settings)
        {
            if (string.IsNullOrEmpty(json))
            {
                return default;
            }

            return JsonConvert.DeserializeObject<T>(json, settings);
        }
    }
}
