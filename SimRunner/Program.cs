using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using Clippy.SimCore;

var contentPath = Path.Combine(AppContext.BaseDirectory, "Content");
if (!Directory.Exists(contentPath))
{
    Console.WriteLine($"Content folder not found: {contentPath}");
    return;
}

int? turnLimit = null;
int? seedOverride = null;

foreach (var arg in args)
{
    if (arg.StartsWith("--turns=", StringComparison.OrdinalIgnoreCase) &&
        int.TryParse(arg.Split('=')[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out var turns))
    {
        turnLimit = turns;
    }
    else if (arg.StartsWith("--seed=", StringComparison.OrdinalIgnoreCase) &&
             int.TryParse(arg.Split('=')[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out var seed))
    {
        seedOverride = seed;
    }
}

var content = ContentLoader.LoadFromDirectory(contentPath);
if (seedOverride.HasValue)
{
    content.Scenario.Seed = seedOverride.Value;
}

var simulation = new Simulation(content);
var maxTurns = turnLimit ?? content.Scenario.MaxTurns;

Console.WriteLine($"Running scenario for up to {maxTurns} turns (seed {content.Scenario.Seed})");
Console.WriteLine("----------------------------------------------------------------");

foreach (var turn in simulation.Run(maxTurns))
{
    Console.WriteLine($"Turn {turn.Turn}");
    foreach (var action in turn.Actions)
    {
        var status = action.Applied ? "✓" : "x";
        Console.WriteLine($"  [{status}] {action.Faction}: {action.ActionName} ({action.Detail})");
    }

    if (turn.Event != null)
    {
        Console.WriteLine($"  Event: {turn.Event.EventTitle} -> {turn.Event.OptionLabel}");
    }

    Console.WriteLine($"  Progress: FCI {turn.Progress.FrontierCapabilityIndex:F2}, ARI {turn.Progress.AlignmentReadinessIndex:F2}, Auto {turn.Progress.AutomationLevel:F2}, Gov {turn.Progress.GovernanceControl:F2}, Susp {turn.Progress.Suspicion:F2}");
    if (turn.Notes.Count > 0)
    {
        Console.WriteLine($"  Notes: {string.Join("; ", turn.Notes)}");
    }

    if (turn.Outcome != GameOutcome.None)
    {
        Console.WriteLine($"Outcome: {turn.Outcome} — {turn.OutcomeReason}");
        break;
    }
}
