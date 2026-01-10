# Status

## Current Work Summary
- **Date-based time system implemented**: Game now uses daily time flow instead of abstract turns
  - Starts: January 1, 2022
  - Ends: ~Late 2026 (approximately 5 years of in-game time)
  - Each tick = 2 days (900 ticks total = ~1800 days)
- Top bar shows current date and end year instead of turn counters
- News ticker displays dates (e.g., "Jan 15, 2022: AI completed...")
- Action durations shown in days (e.g., "24 days" instead of "12 ticks")
- Game end screen shows final date

## Previous Work Summary
- WebUI now uses a longer tick scale (TICK_SCALE = 25) with higher time-speed options (0.5x, 1x, 2x, 4x, 8x, 16x).
- Actions are HOI4-style focuses: one active focus at a time, resource cost upfront, effects on completion, and completion toasts.
- Focus-tree gating is implemented via RequiredFlags/GrantsFlag in WebUI content, and mirrored in Content/ and Unity content files.
- Lab popups include lab-specific actions (filtered by lab effects) and display new lab metrics.
- Dynamic lab stats were added (Capabilities Level, Research Speed, AI-Led Acceleration, Available Compute) and are updated each tick.
- World Trends chart was added to WebUI (aggregate normalized trends for capabilities, compute, and R&D acceleration).
- Victory thresholds were raised (FCI/ARI >= 14, Autonomy/Governance >= 1.8) and strings were updated across WebUI, Content/, Unity, and SimCore.

## Problem Reported By User
- In WebUI, no visible UI changes are appearing: the new lab metrics and the World Trends chart are not showing up (or appear unchanged), even after the earlier changes.

## Fixes Applied
1. **Timing fix**: Used `requestAnimationFrame` in `startGame()` to ensure DOM layout is complete before first render. This prevents canvas dimension issues when the game screen first appears.

2. **Canvas sizing fix**: The `renderWorldTrends()` method now always updates canvas dimensions and explicitly sets both the canvas attributes and CSS style dimensions. Also falls back to parent container width if chart rect is 0.

3. **Window resize handler**: Added a resize event listener to redraw the chart when the window is resized.

4. **Chart visibility fix**: Added dots at each data point in the World Trends chart, making it visible even with just one data point initially.

5. **Resource list fix**: Corrected the resource names displayed to match what's actually defined in scenario.js (replaced 'Energy' with 'Infiltration' for AI faction and 'Oversight' for Human faction).

**Note**: If the changes still don't appear, try a hard refresh (Ctrl+F5 or Cmd+Shift+R) to clear browser cache.
