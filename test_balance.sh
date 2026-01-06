#!/bin/bash
DOTNET="/opt/homebrew/Cellar/dotnet@6/6.0.136_1/bin/dotnet"
PROJECT="/Users/ihorkendiukhov/coding projects/clippy/SimRunner"

ai_wins=0
human_wins=0

for seed in 111 222 333 444 555 666 777 888 999 1111 2222 3333 4444 5555 6666 7777 8888 9999 11111 22222 33333 44444 55555 66666 77777 88888 99999 123 456 789; do
    result=$("$DOTNET" run --project "$PROJECT" -- --turns=30 --seed=$seed 2>/dev/null | grep "Outcome")
    echo "Seed $seed: $result"
    if echo "$result" | grep -q "AiVictory"; then
        ai_wins=$((ai_wins + 1))
    elif echo "$result" | grep -q "HumanVictory"; then
        human_wins=$((human_wins + 1))
    fi
done

echo ""
echo "=== SUMMARY ==="
echo "AI Wins: $ai_wins"
echo "Human Wins: $human_wins"
echo "Total: $((ai_wins + human_wins))"
