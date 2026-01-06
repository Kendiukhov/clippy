#!/bin/bash
DOTNET="/opt/homebrew/Cellar/dotnet@6/6.0.136_1/bin/dotnet"
PROJECT="/Users/ihorkendiukhov/coding projects/clippy/SimRunner"

ai_wins=0
human_wins=0

for seed in $(seq 1 100); do
    result=$("$DOTNET" run --project "$PROJECT" -- --turns=30 --seed=$seed 2>/dev/null | grep "Outcome")
    if echo "$result" | grep -q "AiVictory"; then
        ai_wins=$((ai_wins + 1))
    elif echo "$result" | grep -q "HumanVictory"; then
        human_wins=$((human_wins + 1))
    fi
done

echo "=== BALANCE TEST (100 seeds) ==="
echo "AI Wins: $ai_wins ($((ai_wins * 100 / (ai_wins + human_wins)))%)"
echo "Human Wins: $human_wins ($((human_wins * 100 / (ai_wins + human_wins)))%)"
