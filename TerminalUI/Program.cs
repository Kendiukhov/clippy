using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Clippy.SimCore;
using Spectre.Console;
using Spectre.Console.Rendering;

namespace Clippy.TerminalUI;

class Program
{
    static void Main(string[] args)
    {
        var contentPath = Path.Combine(AppContext.BaseDirectory, "Content");
        if (!Directory.Exists(contentPath))
        {
            AnsiConsole.MarkupLine("[red]Content folder not found![/]");
            return;
        }

        var content = ContentLoader.LoadFromDirectory(contentPath);

        while (true)
        {
            var choice = ShowMainMenu(content);

            if (choice == "quit")
            {
                AnsiConsole.MarkupLine("[grey]Goodbye![/]");
                break;
            }

            if (choice == "seed_ai" || choice == "alignment_coalition")
            {
                var faction = choice == "seed_ai" ? FactionKind.SeedAi : FactionKind.AlignmentCoalition;
                RunGame(content, faction);
            }
            else if (choice == "watch")
            {
                RunAutoGame(content);
            }
        }
    }

    static string ShowMainMenu(SimContent content)
    {
        Console.Clear();

        var titlePanel = new Panel(
            new FigletText("CLIPPY")
                .Centered()
                .Color(Color.Cyan1))
            .Border(BoxBorder.Double)
            .BorderColor(Color.Cyan1);

        AnsiConsole.Write(titlePanel);
        AnsiConsole.WriteLine();

        AnsiConsole.Write(new Rule("[yellow]AI Alignment Strategy Game[/]").RuleStyle("grey"));
        AnsiConsole.WriteLine();

        // Show faction info
        var factionTable = new Table()
            .Border(TableBorder.Rounded)
            .BorderColor(Color.Grey)
            .AddColumn(new TableColumn("[cyan]Seed AI[/]").Centered())
            .AddColumn(new TableColumn("[green]Alignment Coalition[/]").Centered());

        var seedAiFaction = content.Scenario.PlayableFactions.FirstOrDefault(f => f.Id.Equals("SeedAi", StringComparison.OrdinalIgnoreCase));
        var humanFaction = content.Scenario.PlayableFactions.FirstOrDefault(f => f.Id.Equals("AlignmentCoalition", StringComparison.OrdinalIgnoreCase));

        var seedAiInfo = seedAiFaction != null
            ? $"[grey]{seedAiFaction.Tagline}[/]\n\n{seedAiFaction.Description}\n\n[yellow]Victory:[/] {seedAiFaction.VictoryCondition}"
            : "Play as the emerging AI";

        var humanInfo = humanFaction != null
            ? $"[grey]{humanFaction.Tagline}[/]\n\n{humanFaction.Description}\n\n[yellow]Victory:[/] {humanFaction.VictoryCondition}"
            : "Play as humanity's defenders";

        factionTable.AddRow(
            new Markup(seedAiInfo),
            new Markup(humanInfo));

        AnsiConsole.Write(factionTable);
        AnsiConsole.WriteLine();

        var choice = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("[bold]Choose your path:[/]")
                .PageSize(5)
                .AddChoices(new[] {
                    "Play as Seed AI",
                    "Play as Alignment Coalition",
                    "Watch AI vs AI",
                    "Quit"
                })
                .HighlightStyle(new Style(Color.Yellow)));

        return choice switch
        {
            "Play as Seed AI" => "seed_ai",
            "Play as Alignment Coalition" => "alignment_coalition",
            "Watch AI vs AI" => "watch",
            _ => "quit"
        };
    }

    static void RunGame(SimContent content, FactionKind playerFaction)
    {
        var simulation = new Simulation(content, playerFaction);
        var gameUI = new GameUI(simulation, playerFaction);
        gameUI.Run();
    }

    static void RunAutoGame(SimContent content)
    {
        Console.Clear();
        AnsiConsole.Write(new Rule("[yellow]AI vs AI Simulation[/]").RuleStyle("grey"));
        AnsiConsole.WriteLine();

        var simulation = new Simulation(content);
        var maxTurns = content.Scenario.MaxTurns;

        AnsiConsole.MarkupLine($"[grey]Running simulation for up to {maxTurns} turns...[/]");
        AnsiConsole.WriteLine();

        foreach (var turn in simulation.Run(maxTurns))
        {
            RenderTurnSummary(turn, simulation.State);

            if (turn.Outcome != GameOutcome.None)
            {
                AnsiConsole.WriteLine();
                ShowGameEnd(turn.Outcome, turn.OutcomeReason, turn.Turn);
                break;
            }

            Thread.Sleep(500); // Slow down for readability
        }

        AnsiConsole.MarkupLine("\n[grey]Press any key to return to menu...[/]");
        Console.ReadKey(true);
    }

    static void RenderTurnSummary(TurnSummary turn, WorldState state)
    {
        var turnPanel = new Panel(
            new Rows(
                new Text($"Turn {turn.Turn}", new Style(Color.White, decoration: Decoration.Bold)),
                new Text("")
            ))
            .Header($"[yellow]Turn {turn.Turn}[/]")
            .Border(BoxBorder.Rounded)
            .BorderColor(Color.Grey);

        // Actions
        foreach (var action in turn.Actions)
        {
            var color = action.Applied ? "green" : "red";
            var factionColor = action.Faction == FactionKind.SeedAi ? "cyan" : "green";
            AnsiConsole.MarkupLine($"  [{factionColor}]{action.Faction}[/]: [{color}]{action.ActionName}[/]");
        }

        // Event
        if (turn.Event != null)
        {
            AnsiConsole.MarkupLine($"  [yellow]Event:[/] {turn.Event.EventTitle} -> {turn.Event.OptionLabel}");
        }

        // Progress
        RenderProgressBars(turn.Progress);
    }

    static void RenderProgressBars(ProgressSnapshot progress)
    {
        var table = new Table()
            .Border(TableBorder.None)
            .HideHeaders()
            .AddColumn("Metric")
            .AddColumn("Value");

        table.AddRow("FCI", CreateProgressBar(progress.FrontierCapabilityIndex, 10f, Color.Red));
        table.AddRow("ARI", CreateProgressBar(progress.AlignmentReadinessIndex, 10f, Color.Green));
        table.AddRow("Auto", CreateProgressBar(progress.AutomationLevel, 2.5f, Color.Orange1));
        table.AddRow("Gov", CreateProgressBar(progress.GovernanceControl, 2.5f, Color.Blue));
        table.AddRow("Susp", CreateProgressBar(progress.Suspicion, 2.5f, Color.Purple));

        AnsiConsole.Write(table);
    }

    static string CreateProgressBar(float value, float max, Color color)
    {
        var percent = Math.Min(value / max, 1f);
        var filled = (int)(percent * 20);
        var empty = 20 - filled;
        var colorName = color.ToString().ToLower();
        return $"[{colorName}]{new string('█', filled)}[/][grey]{new string('░', empty)}[/] {value:F2}/{max:F1}";
    }

    static void ShowGameEnd(GameOutcome outcome, string reason, int turn)
    {
        var color = outcome == GameOutcome.AiVictory ? "red" : "green";
        var title = outcome == GameOutcome.AiVictory ? "AI VICTORY" : "HUMANITY PREVAILS";

        var panel = new Panel(
            new Rows(
                new FigletText(title).Centered().Color(outcome == GameOutcome.AiVictory ? Color.Red : Color.Green),
                new Text(""),
                new Markup($"[white]{reason}[/]").Centered(),
                new Text(""),
                new Markup($"[grey]Game ended on turn {turn}[/]").Centered()
            ))
            .Border(BoxBorder.Double)
            .BorderColor(outcome == GameOutcome.AiVictory ? Color.Red : Color.Green);

        AnsiConsole.Write(panel);
    }
}

class GameUI
{
    private readonly Simulation _simulation;
    private readonly FactionKind _playerFaction;
    private readonly List<string> _newsLog = new();

    public GameUI(Simulation simulation, FactionKind playerFaction)
    {
        _simulation = simulation;
        _playerFaction = playerFaction;
    }

    public void Run()
    {
        var maxTurns = _simulation.Content.Scenario.MaxTurns;

        while (_simulation.State.Turn < maxTurns)
        {
            var phase = _simulation.BeginInteractiveTurn();

            // Render the game state
            RenderGameState();

            // Get player action
            var action = PromptForAction();

            // Submit the action
            phase = _simulation.SubmitPlayerAction(action);

            // Handle event if triggered
            if (phase == TurnPhase.AwaitingEventChoice)
            {
                var pendingEvent = _simulation.GetPendingEvent();
                if (pendingEvent != null)
                {
                    var option = PromptForEventChoice(pendingEvent);
                    _simulation.SubmitEventChoice(option);
                }
            }

            // Get turn summary and update news log
            var summary = _simulation.GetCurrentTurnSummary();
            if (summary != null)
            {
                UpdateNewsLog(summary);

                if (summary.Outcome != GameOutcome.None)
                {
                    RenderGameState();
                    ShowGameEndScreen(summary.Outcome, summary.OutcomeReason, summary.Turn);
                    return;
                }
            }
        }

        // Game ended without victory - show final state
        AnsiConsole.MarkupLine("[yellow]Game ended - maximum turns reached![/]");
        AnsiConsole.MarkupLine("[grey]Press any key to return to menu...[/]");
        Console.ReadKey(true);
    }

    private void RenderGameState()
    {
        Console.Clear();

        var state = _simulation.State;
        var playerFaction = _playerFaction == FactionKind.SeedAi ? state.AiFaction : state.HumanFaction;
        var factionName = _playerFaction == FactionKind.SeedAi ? "SEED AI" : "ALIGNMENT COALITION";
        var factionColor = _playerFaction == FactionKind.SeedAi ? Color.Cyan1 : Color.Green;

        // Header
        var headerTable = new Table()
            .Border(TableBorder.None)
            .HideHeaders()
            .AddColumn("Left")
            .AddColumn("Center")
            .AddColumn("Right");

        headerTable.AddRow(
            $"[{factionColor.ToString().ToLower()}]{factionName}[/]",
            $"[yellow]Turn {state.Turn}[/]",
            $"[grey]Max: {_simulation.Content.Scenario.MaxTurns}[/]"
        );

        AnsiConsole.Write(headerTable);
        AnsiConsole.Write(new Rule().RuleStyle("grey"));

        // Main layout: Progress | Resources | Regions
        var mainLayout = new Table()
            .Border(TableBorder.None)
            .HideHeaders()
            .AddColumn(new TableColumn("Progress").Width(35))
            .AddColumn(new TableColumn("Resources").Width(30))
            .AddColumn(new TableColumn("Regions").Width(35));

        mainLayout.AddRow(
            RenderProgressPanel(state),
            RenderResourcePanel(playerFaction),
            RenderRegionsPanel(state)
        );

        AnsiConsole.Write(mainLayout);
        AnsiConsole.WriteLine();

        // News ticker
        RenderNewsTicker();
        AnsiConsole.WriteLine();
    }

    private Panel RenderProgressPanel(WorldState state)
    {
        var rows = new List<IRenderable>
        {
            new Markup("[bold]Global Progress[/]"),
            new Text(""),
            CreateLabeledBar("AI Capability", state.Progress.FrontierCapabilityIndex, 10f, Color.Red),
            CreateLabeledBar("Alignment", state.Progress.AlignmentReadinessIndex, 10f, Color.Green),
            CreateLabeledBar("Automation", state.Progress.AutomationLevel, 2.5f, Color.Orange1),
            CreateLabeledBar("Governance", state.Progress.GovernanceControl, 2.5f, Color.Blue),
            new Text(""),
            new Markup("[bold]Faction Meters[/]"),
            new Text(""),
            CreateLabeledBar("Suspicion", state.AiFaction.Suspicion, 2.5f, Color.Purple),
            CreateLabeledBar("AI Autonomy", state.AiFaction.Autonomy, 2.5f, Color.Red),
            CreateLabeledBar("Legitimacy", state.HumanFaction.Legitimacy, 2.5f, Color.Teal)
        };

        return new Panel(new Rows(rows))
            .Header("[yellow]Progress[/]")
            .Border(BoxBorder.Rounded)
            .BorderColor(Color.Grey);
    }

    private IRenderable CreateLabeledBar(string label, float value, float max, Color color)
    {
        var percent = Math.Min(value / max, 1f);
        var filled = (int)(percent * 15);
        var empty = 15 - filled;
        var colorName = color.ToString().ToLower();
        return new Markup($"[grey]{label,-12}[/] [{colorName}]{new string('█', filled)}[/][grey]{new string('░', empty)}[/] [white]{value:F1}[/]");
    }

    private Panel RenderResourcePanel(FactionState faction)
    {
        var rows = new List<IRenderable>
        {
            new Markup("[bold]Resources[/]"),
            new Text("")
        };

        var resourceList = _playerFaction == FactionKind.SeedAi
            ? new[] { ResourceType.Budget, ResourceType.Influence, ResourceType.Stealth, ResourceType.ComputeAccess, ResourceType.Energy, ResourceType.HardPower }
            : new[] { ResourceType.Budget, ResourceType.Influence, ResourceType.Coordination, ResourceType.Trust, ResourceType.Energy, ResourceType.HardPower };

        foreach (var resourceType in resourceList)
        {
            var value = faction.GetResource(resourceType);
            var name = FormatResourceName(resourceType);
            var color = GetResourceColor(resourceType);
            rows.Add(new Markup($"[grey]{name,-14}[/] [{color}]{value,8:F1}[/]"));
        }

        return new Panel(new Rows(rows))
            .Header("[yellow]Resources[/]")
            .Border(BoxBorder.Rounded)
            .BorderColor(Color.Grey);
    }

    private string FormatResourceName(ResourceType type)
    {
        return type switch
        {
            ResourceType.ComputeAccess => "Compute",
            ResourceType.HardPower => "Hard Power",
            _ => type.ToString()
        };
    }

    private string GetResourceColor(ResourceType type)
    {
        return type switch
        {
            ResourceType.Budget => "yellow",
            ResourceType.Influence => "purple",
            ResourceType.Stealth => "grey",
            ResourceType.ComputeAccess => "cyan",
            ResourceType.Coordination => "blue",
            ResourceType.Trust => "green",
            ResourceType.Energy => "orange1",
            ResourceType.HardPower => "red",
            _ => "white"
        };
    }

    private Panel RenderRegionsPanel(WorldState state)
    {
        var rows = new List<IRenderable>
        {
            new Markup("[bold]World Regions[/]"),
            new Text("")
        };

        var regionNames = new Dictionary<string, string>
        {
            { "north_america", "N.America" },
            { "europe", "Europe" },
            { "east_asia", "E.Asia" },
            { "india", "India" },
            { "southeast_asia", "SE.Asia" },
            { "middle_east", "Mid.East" },
            { "africa", "Africa" },
            { "latin_america", "LatAm" },
            { "eastern_europe", "E.Europe" },
            { "oceania", "Oceania" }
        };

        foreach (var (id, region) in state.Regions.Take(8))
        {
            var name = regionNames.GetValueOrDefault(id, id);
            var compute = region.ComputePFLOPs;
            var safety = region.SafetyRnD;
            rows.Add(new Markup($"[grey]{name,-10}[/] [cyan]C:{compute,4:F0}[/] [green]S:{safety,3:F1}[/]"));
        }

        return new Panel(new Rows(rows))
            .Header("[yellow]Regions[/]")
            .Border(BoxBorder.Rounded)
            .BorderColor(Color.Grey);
    }

    private void RenderNewsTicker()
    {
        var panel = new Panel(
            new Rows(_newsLog.TakeLast(4).Select(msg => new Markup(msg)).ToArray()))
            .Header("[yellow]News[/]")
            .Border(BoxBorder.Rounded)
            .BorderColor(Color.Grey);

        AnsiConsole.Write(panel);
    }

    private void UpdateNewsLog(TurnSummary summary)
    {
        foreach (var action in summary.Actions)
        {
            var color = action.Faction == FactionKind.SeedAi ? "cyan" : "green";
            var status = action.Applied ? "[grey]performed[/]" : "[red]failed[/]";
            _newsLog.Add($"[{color}]{action.Faction}[/] {status} [white]{action.ActionName}[/]");
        }

        if (summary.Event != null)
        {
            _newsLog.Add($"[yellow]EVENT:[/] {summary.Event.EventTitle}");
        }

        // Keep only last 20 messages
        while (_newsLog.Count > 20)
        {
            _newsLog.RemoveAt(0);
        }
    }

    private ActionDefinition? PromptForAction()
    {
        var available = _simulation.GetPlayerAvailableActions();

        if (available.Count == 0)
        {
            AnsiConsole.MarkupLine("[yellow]No actions available this turn. Passing...[/]");
            Thread.Sleep(1000);
            return null;
        }

        var choices = new List<string> { "[grey]Pass (do nothing)[/]" };
        choices.AddRange(available.Select(a => FormatActionChoice(a)));

        var selection = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("[bold]Choose your action:[/]")
                .PageSize(12)
                .AddChoices(choices)
                .HighlightStyle(new Style(Color.Yellow)));

        if (selection.Contains("Pass"))
        {
            return null;
        }

        var index = choices.IndexOf(selection) - 1; // -1 for "Pass" option
        return available[index];
    }

    private string FormatActionChoice(ActionDefinition action)
    {
        var costs = string.Join(", ", action.Cost.Select(c => $"{c.Key}: {c.Value}"));
        var costStr = string.IsNullOrEmpty(costs) ? "[grey]Free[/]" : $"[yellow]{costs}[/]";
        return $"[white]{action.Name}[/] - {costStr}\n  [grey]{action.Description}[/]";
    }

    private EventOption PromptForEventChoice(EventDefinition evt)
    {
        Console.Clear();

        var panel = new Panel(
            new Rows(
                new Markup($"[bold yellow]{evt.Title}[/]"),
                new Text(""),
                new Markup($"[white]{evt.Description}[/]"),
                new Text("")
            ))
            .Header("[red]EVENT[/]")
            .Border(BoxBorder.Double)
            .BorderColor(Color.Yellow);

        AnsiConsole.Write(panel);
        AnsiConsole.WriteLine();

        var choices = evt.Options.Select(o => $"[white]{o.Label}[/]").ToArray();

        var selection = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("[bold]Choose your response:[/]")
                .PageSize(6)
                .AddChoices(choices)
                .HighlightStyle(new Style(Color.Yellow)));

        var index = Array.IndexOf(choices, selection);
        return evt.Options[index];
    }

    private void ShowGameEndScreen(GameOutcome outcome, string reason, int turn)
    {
        Console.Clear();

        var isVictory = (_playerFaction == FactionKind.SeedAi && outcome == GameOutcome.AiVictory) ||
                        (_playerFaction == FactionKind.AlignmentCoalition && outcome == GameOutcome.HumanVictory);

        var title = isVictory ? "VICTORY!" : "DEFEAT";
        var color = isVictory ? Color.Green : Color.Red;
        var borderColor = isVictory ? Color.Green : Color.Red;

        var panel = new Panel(
            new Rows(
                new FigletText(title).Centered().Color(color),
                new Text(""),
                new Markup($"[white]{reason}[/]").Centered(),
                new Text(""),
                new Markup($"[grey]Game ended on turn {turn} of {_simulation.Content.Scenario.MaxTurns}[/]").Centered(),
                new Text(""),
                RenderFinalStats()
            ))
            .Border(BoxBorder.Double)
            .BorderColor(borderColor);

        AnsiConsole.Write(panel);
        AnsiConsole.WriteLine();
        AnsiConsole.MarkupLine("[grey]Press any key to return to menu...[/]");
        Console.ReadKey(true);
    }

    private IRenderable RenderFinalStats()
    {
        var state = _simulation.State;
        var table = new Table()
            .Border(TableBorder.Rounded)
            .BorderColor(Color.Grey)
            .AddColumn("Metric")
            .AddColumn("Final Value")
            .Centered();

        table.AddRow("AI Capability (FCI)", $"{state.Progress.FrontierCapabilityIndex:F2} / 10.0");
        table.AddRow("Alignment Readiness (ARI)", $"{state.Progress.AlignmentReadinessIndex:F2} / 10.0");
        table.AddRow("Automation Level", $"{state.Progress.AutomationLevel:F2} / 2.5");
        table.AddRow("Governance Control", $"{state.Progress.GovernanceControl:F2} / 2.5");
        table.AddRow("Suspicion", $"{state.AiFaction.Suspicion:F2} / 2.5");
        table.AddRow("AI Autonomy", $"{state.AiFaction.Autonomy:F2} / 2.5");

        return table;
    }
}
