using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Clippy.SimCore
{
    public static class ContentLoader
    {
        private static JsonSerializerOptions CreateOptions()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip,
                AllowTrailingCommas = true
            };
            options.Converters.Add(new JsonStringEnumConverter());
            return options;
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

            var options = CreateOptions();

            var content = new SimContent
            {
                Scenario = LoadFile<ScenarioDefinition>(Path.Combine(directory, "scenario.json"), options) ?? new ScenarioDefinition(),
                Actions = LoadFile<List<ActionDefinition>>(Path.Combine(directory, "actions.json"), options) ?? new List<ActionDefinition>(),
                Events = LoadFile<List<EventDefinition>>(Path.Combine(directory, "events.json"), options) ?? new List<EventDefinition>(),
                Characters = LoadFile<List<CharacterDefinition>>(Path.Combine(directory, "characters.json"), options) ?? new List<CharacterDefinition>()
            };

            var upgradesPath = Path.Combine(directory, "upgrades.json");
            var upgrades = LoadFile<List<ActionDefinition>>(upgradesPath, options);
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
            var options = CreateOptions();

            var content = new SimContent
            {
                Scenario = ParseJson<ScenarioDefinition>(scenarioJson, options) ?? new ScenarioDefinition(),
                Actions = ParseJson<List<ActionDefinition>>(actionsJson, options) ?? new List<ActionDefinition>(),
                Events = ParseJson<List<EventDefinition>>(eventsJson, options) ?? new List<EventDefinition>(),
                Characters = !string.IsNullOrEmpty(charactersJson) ? ParseJson<List<CharacterDefinition>>(charactersJson, options) ?? new List<CharacterDefinition>() : new List<CharacterDefinition>()
            };

            if (!string.IsNullOrEmpty(upgradesJson))
            {
                var upgrades = ParseJson<List<ActionDefinition>>(upgradesJson, options);
                if (upgrades != null)
                {
                    content.Actions.AddRange(upgrades);
                }
            }

            return content;
        }

        private static T? LoadFile<T>(string path, JsonSerializerOptions options)
        {
            if (!File.Exists(path))
            {
                return default;
            }

            var json = File.ReadAllText(path);
            return JsonSerializer.Deserialize<T>(json, options);
        }

        private static T? ParseJson<T>(string json, JsonSerializerOptions options)
        {
            if (string.IsNullOrEmpty(json))
            {
                return default;
            }

            return JsonSerializer.Deserialize<T>(json, options);
        }
    }
}
