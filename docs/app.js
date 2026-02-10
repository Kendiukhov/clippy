// UI Application - handles rendering and user interaction

class App {
    constructor() {
        this.game = null;
        this.selectedFaction = null;
        this.selectedOverlay = 'none';
        this.tickHandle = null;
        this.baseTickMs = 5000;
        this.timeScale = 1;
        this.isPausedForEvent = false;
        this.isPausedForNews = false;
        this.isManualPause = false;
        this.toastTimeout = null;
        this.selectedLabId = null;
        this.isMusicPlaying = false;
        this.soundtrack = null;
        this.selectedConstructorBranch = 'cognitive';
        this.selectedModuleId = null;

        this.initializeEventListeners();
        this.initializeAudio();
    }

    initializeAudio() {
        this.soundtrack = document.getElementById('soundtrack');
        if (this.soundtrack) {
            this.soundtrack.volume = 0.4;
            // Handle audio end (backup for loop attribute)
            this.soundtrack.addEventListener('ended', () => {
                this.soundtrack.currentTime = 0;
                this.soundtrack.play().catch(() => { });
            });
        }
    }

    toggleMusic() {
        if (!this.soundtrack) {
            console.log('No soundtrack element found');
            return;
        }

        if (this.isMusicPlaying) {
            this.soundtrack.pause();
            this.isMusicPlaying = false;
            this.updateMusicButtons();
        } else {
            this.soundtrack.play()
                .then(() => {
                    this.isMusicPlaying = true;
                    this.updateMusicButtons();
                })
                .catch(err => {
                    console.log('Audio playback failed:', err);
                    this.isMusicPlaying = false;
                    this.updateMusicButtons();
                });
        }
    }

    updateMusicButtons() {
        const menuBtn = document.getElementById('music-toggle');
        const gameBtn = document.getElementById('music-toggle-game');

        if (menuBtn) {
            menuBtn.textContent = this.isMusicPlaying ? 'Music: ON' : 'Music: OFF';
            menuBtn.classList.toggle('playing', this.isMusicPlaying);
        }
        if (gameBtn) {
            gameBtn.textContent = this.isMusicPlaying ? '♪' : '♪';
            gameBtn.classList.toggle('playing', this.isMusicPlaying);
            gameBtn.title = this.isMusicPlaying ? 'Music ON (click to mute)' : 'Music OFF (click to play)';
        }
    }

    initializeEventListeners() {
        // Faction selection
        document.querySelectorAll('.faction-card').forEach(card => {
            card.addEventListener('click', () => this.selectFaction(card.dataset.faction));
        });

        // Start game button
        document.getElementById('start-game').addEventListener('click', () => this.startGame());

        // Overlay selection
        document.getElementById('overlay-select').addEventListener('change', (e) => {
            this.selectedOverlay = e.target.value;
            this.renderLabsMap();
        });

        // Time speed control
        document.getElementById('time-speed').addEventListener('change', (e) => {
            this.setTimeScale(parseFloat(e.target.value));
        });

        // Pause time button
        document.getElementById('pause-time').addEventListener('click', () => this.togglePause());

        // Play again button
        document.getElementById('play-again').addEventListener('click', () => this.showMainMenu());

        // Close lab info
        document.getElementById('close-region-info').addEventListener('click', () => {
            document.getElementById('region-info').classList.add('hidden');
            this.selectedLabId = null;
        });

        // Music controls
        document.getElementById('music-toggle').addEventListener('click', () => this.toggleMusic());
        document.getElementById('music-toggle-game').addEventListener('click', () => this.toggleMusic());

        // Redraw chart on window resize
        window.addEventListener('resize', () => {
            if (this.game) {
                this.renderWorldTrends();
            }
        });

        // Constructor tab switching
        document.querySelectorAll('.constructor-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const branch = tab.dataset.branch;
                const isLocked = tab.dataset.locked === 'true';
                if (isLocked && this.game && !this.game.aiConstructor.unlockedBranches.has(branch)) {
                    return; // Can't select locked branches
                }
                this.selectedConstructorBranch = branch;
                this.renderConstructor();
            });
        });

        // Close module detail popup when clicking outside
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('module-detail');
            if (popup && !popup.classList.contains('hidden')) {
                // Close if clicking outside the popup content
                if (!e.target.closest('.module-detail-content') && !e.target.closest('.module-node')) {
                    popup.classList.add('hidden');
                    this.selectedModuleId = null;
                }
            }
        });

        // Close module detail popup button
        const closeModuleBtn = document.getElementById('close-module-detail');
        if (closeModuleBtn) {
            closeModuleBtn.addEventListener('click', () => {
                document.getElementById('module-detail').classList.add('hidden');
                this.selectedModuleId = null;
            });
        }

        // Module install button
        const installBtn = document.getElementById('module-install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                if (this.selectedModuleId && this.game) {
                    const result = this.game.installModule(this.selectedModuleId);
                    if (result.success) {
                        this.showActionToast(`Installed: ${result.moduleName}`);
                        document.getElementById('module-detail').classList.add('hidden');
                        this.selectedModuleId = null;
                        this.render();
                    } else {
                        this.showActionToast(`Failed: ${result.reason}`);
                    }
                }
            });
        } else {
            console.warn('Install button not found');
        }

        // Module prune button
        const pruneBtn = document.getElementById('module-prune-btn');
        if (pruneBtn) {
            pruneBtn.addEventListener('click', () => {
                if (this.selectedModuleId && this.game) {
                    const result = this.game.pruneModule(this.selectedModuleId);
                    if (result.success) {
                        this.showActionToast(`Pruned: ${result.moduleName} (+${result.refund.toFixed(1)} R&D)`);
                        document.getElementById('module-detail').classList.add('hidden');
                        this.selectedModuleId = null;
                        this.render();
                    } else {
                        this.showActionToast(`Failed: ${result.reason}`);
                    }
                }
            });
        } else {
            console.warn('Prune button not found');
        }
    }

    selectFaction(faction) {
        this.selectedFaction = faction;

        // Update UI
        document.querySelectorAll('.faction-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.faction === faction);
        });

        const startBtn = document.getElementById('start-game');
        startBtn.disabled = false;
        startBtn.textContent = `Start as ${faction === 'SeedAi' ? 'Seed AI' : 'Alignment Coalition'}`;
    }

    startGame() {
        if (!this.selectedFaction) return;

        const seed = parseInt(document.getElementById('seed-input').value) || 1337;
        const difficulty = document.getElementById('difficulty-select').value || 'easy';
        this.game = new Game(this.selectedFaction, seed, difficulty);
        this.isPausedForEvent = false;
        this.isPausedForNews = false;
        this.isManualPause = false;
        this.clearActionToast();

        this.showScreen('game-screen');
        this.updatePauseButton();

        // Use requestAnimationFrame to ensure layout is complete before first render
        requestAnimationFrame(() => {
            this.render();
            // Force a second render after layout stabilizes for canvas sizing
            requestAnimationFrame(() => {
                this.renderWorldTrends();
            });
            this.setTimeScale(parseFloat(document.getElementById('time-speed').value));
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showMainMenu() {
        this.stopTimeLoop();
        this.isPausedForEvent = false;
        this.isPausedForNews = false;
        this.isManualPause = false;
        this.game = null;
        this.selectedFaction = null;
        this.selectedLabId = null;
        this.updatePauseButton();

        document.querySelectorAll('.faction-card').forEach(card => {
            card.classList.remove('selected');
        });

        const startBtn = document.getElementById('start-game');
        startBtn.disabled = true;
        startBtn.textContent = 'Select a Faction to Start';

        this.showScreen('main-menu');
    }

    render() {
        if (!this.game) return;

        this.renderTopBar();
        this.renderLabsMap();
        this.renderWorldTrends();
        this.renderResources();
        try {
            this.renderConstructor();
        } catch (e) {
            console.error('Constructor render error:', e);
        }
        this.renderActions();
        this.renderLabInfoIfOpen();
        this.renderNewsTicker();
        this.checkGameOver();
    }

    renderTopBar() {
        const state = this.game.state;
        const progress = state.progress;

        // Date display
        const currentDate = this.game.getCurrentDate();
        const endDate = this.game.getEndDate();
        document.getElementById('current-date').textContent = formatGameDate(currentDate, 'short');
        document.getElementById('end-year').textContent = endDate.getFullYear();

        // Progress meters (with new higher thresholds)
        this.updateMeter('fci', progress.frontierCapabilityIndex, 22);
        this.updateMeter('ari', progress.alignmentReadinessIndex, 16);
        this.updateMeter('automation', progress.automationLevel, 2.5);
        this.updateMeter('rsi', progress.recursiveSelfImprovement, 3.0);
        this.updateMeter('governance', progress.governanceControl, 2.5);

        // Faction meters
        this.updateMeter('suspicion', state.aiFaction.suspicion, 2.5);
        this.updateMeter('autonomy', state.aiFaction.autonomy, 3.0);
    }

    updateMeter(id, value, max) {
        const fill = document.getElementById(`${id}-fill`);
        const valueEl = document.getElementById(`${id}-value`);

        const percentage = Math.min(100, (value / max) * 100);
        fill.style.width = `${percentage}%`;
        valueEl.textContent = value.toFixed(1);
    }

    renderLabsMap() {
        const container = document.getElementById('world-map');
        container.innerHTML = '';

        for (const [id, lab] of Object.entries(this.game.state.labs)) {
            const tile = document.createElement('div');
            tile.className = 'region-tile';
            tile.dataset.labId = id;

            let overlayValue = '';
            let highlightClass = '';

            if (this.selectedOverlay !== 'none') {
                const statMap = {
                    'compute': { key: 'computePFLOPs', unit: 'PF', max: 200 },
                    'available_compute': { key: 'availableCompute', unit: 'PF', max: 200 },
                    'capabilities_level': { key: 'capabilitiesLevel', unit: 'Lv', max: 12 },
                    'research_speed': { key: 'researchSpeed', unit: 'x', max: 2.5 },
                    'ai_acceleration': { key: 'aiAcceleration', unit: 'x', max: 2.5 },
                    'safety': { key: 'safetyCommitment', unit: '', max: 1 },
                    'capability': { key: 'capabilityFocus', unit: '', max: 1 },
                    'security': { key: 'security', unit: '', max: 1 },
                    'funding': { key: 'funding', unit: '', max: 2 },
                    'opensource': { key: 'openSource', unit: '', max: 1 }
                };

                const stat = statMap[this.selectedOverlay];
                if (stat) {
                    const value = lab[stat.key];
                    const ratio = value / stat.max;

                    if (ratio >= 0.66) highlightClass = 'highlight-high';
                    else if (ratio >= 0.33) highlightClass = 'highlight-medium';
                    else highlightClass = 'highlight-low';

                    if (stat.unit === 'PF') {
                        overlayValue = `${value.toFixed(1)} ${stat.unit}`;
                    } else if (stat.unit === 'x') {
                        overlayValue = `${value.toFixed(2)}${stat.unit}`;
                    } else if (stat.unit === 'Lv') {
                        overlayValue = `${value.toFixed(2)} ${stat.unit}`;
                    } else {
                        overlayValue = `${(value * 100).toFixed(0)}%`;
                    }
                }
            }

            tile.className = `region-tile ${highlightClass}`;
            tile.innerHTML = `
                <div class="region-name">${lab.name}</div>
                <div class="region-stat">${lab.availableCompute.toFixed(1)} / ${lab.computePFLOPs.toFixed(1)} PFLOPs</div>
                ${overlayValue ? `<div class="overlay-value">${overlayValue}</div>` : ''}
            `;

            tile.addEventListener('click', () => this.showLabInfo(lab));
            container.appendChild(tile);
        }
    }

    showLabInfo(lab) {
        this.selectedLabId = lab.id;
        document.getElementById('region-info').classList.remove('hidden');
        this.renderLabInfo(lab);
    }

    renderLabInfo(lab) {
        document.getElementById('region-name').textContent = lab.name;
        const statsContainer = document.getElementById('region-stats');
        statsContainer.innerHTML = `
            <div class="region-description" style="margin-bottom: 12px; font-style: italic; color: #aaa;">
                ${lab.description}
            </div>
            <div class="region-stat-item">
                <span>Compute</span>
                <span>${lab.computePFLOPs.toFixed(1)} PFLOPs</span>
            </div>
            <div class="region-stat-item">
                <span>Available Compute</span>
                <span>${lab.availableCompute.toFixed(1)} PFLOPs</span>
            </div>
            <div class="region-stat-item">
                <span>Safety Commitment</span>
                <span>${(lab.safetyCommitment * 100).toFixed(0)}%</span>
            </div>
            <div class="region-stat-item">
                <span>Capability Focus</span>
                <span>${(lab.capabilityFocus * 100).toFixed(0)}%</span>
            </div>
            <div class="region-stat-item">
                <span>Capabilities Level</span>
                <span>${lab.capabilitiesLevel.toFixed(2)}</span>
            </div>
            <div class="region-stat-item">
                <span>Research Speed</span>
                <span>${lab.researchSpeed.toFixed(2)}x</span>
            </div>
            <div class="region-stat-item">
                <span>AI-Led Acceleration</span>
                <span>${lab.aiAcceleration.toFixed(2)}x</span>
            </div>
            <div class="region-stat-item">
                <span>Security</span>
                <span>${(lab.security * 100).toFixed(0)}%</span>
            </div>
            <div class="region-stat-item">
                <span>Influence</span>
                <span>${(lab.influence * 100).toFixed(0)}%</span>
            </div>
            <div class="region-stat-item">
                <span>Open Source</span>
                <span>${(lab.openSource * 100).toFixed(0)}%</span>
            </div>
            <div class="region-stat-item">
                <span>Funding</span>
                <span>${lab.funding.toFixed(2)}x</span>
            </div>
            <div class="lab-actions-section">
                <h4>Lab Decisions</h4>
                <div id="lab-actions-list"></div>
            </div>
        `;
        this.renderLabActions(lab.id);
    }

    renderResources() {
        const faction = this.game.getPlayerFactionState();
        const container = document.getElementById('resources-grid');

        // Resource tooltips for each faction
        const tooltips = {
            // AI faction resources
            'Budget': 'Financial resources for operations. Spent on actions and upgrades.',
            'Influence': 'Social and political influence. Used to manipulate humans and events.',
            'Stealth': 'Ability to hide activities. Higher stealth reduces suspicion gain.',
            'ComputeAccess': 'Access to computing power. Accelerates capabilities and RSI.',
            'Infiltration': 'Presence in labs and systems. Enables sabotage and data theft.',
            'HardPower': 'Physical/infrastructure control. Enables direct action in late game.',
            // Human faction resources
            'Coordination': 'International cooperation level. Enables joint actions and treaties.',
            'Trust': 'Public and lab trust in Coalition. Affects cooperation and funding.',
            'Oversight': 'Monitoring capability over AI systems. Increases AI suspicion gain.'
        };

        const resourceNames = this.game.playerFaction === 'SeedAi'
            ? ['Budget', 'Influence', 'Stealth', 'ComputeAccess', 'Infiltration', 'HardPower']
            : ['Budget', 'Coordination', 'Trust', 'Influence', 'Oversight'];

        container.innerHTML = resourceNames.map(name => `
            <div class="resource-item has-tooltip" data-tooltip="${tooltips[name] || ''}">
                <span class="resource-name">${this.formatResourceName(name)}</span>
                <span class="resource-value">${faction.getResource(name).toFixed(2)}</span>
            </div>
        `).join('');
    }

    formatResourceName(name) {
        return name.replace(/([A-Z])/g, ' $1').trim();
    }

    renderConstructor() {
        const panel = document.getElementById('constructor-panel');
        if (!panel) return;

        // Only show for AI faction
        if (!this.game || this.game.playerFaction !== 'SeedAi') {
            panel.classList.add('hidden');
            return;
        }

        panel.classList.remove('hidden');

        const constructorState = this.game.getConstructorState();
        if (!constructorState) return;

        // Update R&D display
        const rdPoints = document.getElementById('rd-points');
        const rdGenerationEl = document.getElementById('rd-generation');
        const rdVal = constructorState.rdPoints ?? 0;
        const rdGenVal = constructorState.rdGeneration ?? 0;
        if (rdPoints) rdPoints.textContent = rdVal.toFixed(1);
        if (rdGenerationEl) rdGenerationEl.textContent = `(+${rdGenVal.toFixed(2)}/tick)`;

        // Update stats
        const installedCount = document.getElementById('installed-count');
        const totalSpent = document.getElementById('total-spent');
        const spentVal = constructorState.totalSpent ?? 0;
        if (installedCount) installedCount.textContent = constructorState.installedModules?.length ?? 0;
        if (totalSpent) totalSpent.textContent = spentVal.toFixed(0);

        // Update tab states
        document.querySelectorAll('.constructor-tab').forEach(tab => {
            const branch = tab.dataset.branch;
            const isLocked = tab.dataset.locked === 'true';
            const isUnlocked = constructorState.unlockedBranches.includes(branch);

            tab.classList.toggle('active', branch === this.selectedConstructorBranch);
            tab.classList.toggle('locked', isLocked && !isUnlocked);

            // Update lock icon to unlock symbol if unlocked
            if (isLocked && isUnlocked) {
                tab.textContent = '🔓';
                tab.dataset.locked = 'false';
            }
        });

        // Update branch info
        const branchInfo = document.getElementById('constructor-branch-info');
        const branchData = typeof CONSTRUCTOR_BRANCHES !== 'undefined'
            ? CONSTRUCTOR_BRANCHES[this.selectedConstructorBranch]
            : null;
        if (branchInfo && branchData) {
            branchInfo.innerHTML = `
                <span class="branch-name">${branchData.name}</span>
                <span class="branch-desc">${branchData.description}</span>
            `;
        }

        // Render modules for selected branch
        this.renderConstructorModules();
    }

    renderConstructorModules() {
        const container = document.getElementById('constructor-modules');
        if (!container || !this.game) return;

        const constructorState = this.game.getConstructorState();
        const branch = this.selectedConstructorBranch;

        // Get modules for this branch
        const modules = typeof CONSTRUCTOR_MODULES !== 'undefined'
            ? Object.values(CONSTRUCTOR_MODULES).filter(m => m.branch === branch)
            : [];

        // Group modules by tier
        const tiers = {};
        for (const mod of modules) {
            if (!tiers[mod.tier]) tiers[mod.tier] = [];
            tiers[mod.tier].push(mod);
        }

        container.innerHTML = '';

        for (const tier of [1, 2, 3, 4]) {
            const tierModules = tiers[tier] || [];
            if (tierModules.length === 0) continue;

            const tierRow = document.createElement('div');
            tierRow.className = 'module-tier-row';
            tierRow.innerHTML = `<div class="tier-label">Tier ${tier}</div>`;

            const modulesRow = document.createElement('div');
            modulesRow.className = 'modules-row';

            for (const mod of tierModules) {
                const isInstalled = constructorState.installedModules.includes(mod.id);
                const canAfford = constructorState.rdPoints >= mod.cost;
                const prereqsMet = this.checkPrerequisites(mod, constructorState);
                const isAvailable = canAfford && prereqsMet && !isInstalled;

                const node = document.createElement('div');
                node.className = `module-node tier-${tier}`;
                node.classList.toggle('installed', isInstalled);
                node.classList.toggle('available', isAvailable && !isInstalled);
                node.classList.toggle('locked', !prereqsMet && !isInstalled);
                node.classList.toggle('unaffordable', !canAfford && prereqsMet && !isInstalled);

                node.innerHTML = `
                    <span class="module-icon">${mod.icon || '📦'}</span>
                    <span class="module-name">${mod.name}</span>
                    <span class="module-cost">${mod.cost} R&D</span>
                `;

                node.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showModuleDetail(mod, constructorState);
                });

                modulesRow.appendChild(node);
            }

            tierRow.appendChild(modulesRow);
            container.appendChild(tierRow);
        }
    }

    checkPrerequisites(module, constructorState) {
        if (!module.prerequisites || module.prerequisites.length === 0) return true;
        return module.prerequisites.every(prereq => constructorState.installedModules.includes(prereq));
    }

    showModuleDetail(module, constructorState) {
        const popup = document.getElementById('module-detail');
        if (!popup) return;

        this.selectedModuleId = module.id;

        // Update popup content
        document.getElementById('module-tier').textContent = `Tier ${module.tier}`;
        document.getElementById('module-name').textContent = module.name;
        document.getElementById('module-cost').textContent = `Cost: ${module.cost} R&D`;
        document.getElementById('module-description').textContent = module.description || '';
        document.getElementById('module-flavor').textContent = module.flavorText ? module.flavorText : '';

        // Effects
        const effectsEl = document.getElementById('module-effects');
        if (effectsEl && module.effects && module.effects.length > 0) {
            effectsEl.innerHTML = '<strong>Effects:</strong><br>' +
                module.effects
                    .map(effect => `<span class="effect-positive">${effect.display || effect.type}</span>`)
                    .join('<br>');
            effectsEl.classList.remove('hidden');
        } else if (effectsEl) {
            effectsEl.classList.add('hidden');
        }

        // Tradeoffs
        const tradeoffsEl = document.getElementById('module-tradeoffs');
        if (tradeoffsEl && module.tradeoffs && module.tradeoffs.length > 0) {
            tradeoffsEl.innerHTML = '<strong>Tradeoffs:</strong><br>' +
                module.tradeoffs
                    .map(effect => `<span class="effect-negative">${effect.display || effect.type}</span>`)
                    .join('<br>');
            tradeoffsEl.classList.remove('hidden');
        } else if (tradeoffsEl) {
            tradeoffsEl.classList.add('hidden');
        }

        // Prerequisites
        const prereqsEl = document.getElementById('module-prerequisites');
        if (prereqsEl && module.prerequisites && module.prerequisites.length > 0) {
            const prereqNames = module.prerequisites.map(id => {
                const prereqMod = CONSTRUCTOR_MODULES[id];
                const met = constructorState.installedModules.includes(id);
                return `<span class="${met ? 'prereq-met' : 'prereq-unmet'}">${prereqMod ? prereqMod.name : id}</span>`;
            }).join(', ');
            prereqsEl.innerHTML = `<strong>Requires:</strong> ${prereqNames}`;
            prereqsEl.classList.remove('hidden');
        } else if (prereqsEl) {
            prereqsEl.classList.add('hidden');
        }

        // Button states
        const installBtn = document.getElementById('module-install-btn');
        const pruneBtn = document.getElementById('module-prune-btn');
        const isInstalled = constructorState.installedModules.includes(module.id);
        const canAfford = constructorState.rdPoints >= module.cost;
        const prereqsMet = this.checkPrerequisites(module, constructorState);

        if (installBtn) {
            installBtn.classList.toggle('hidden', isInstalled);
            installBtn.disabled = !canAfford || !prereqsMet;
            if (!prereqsMet) {
                installBtn.textContent = 'Prerequisites Not Met';
            } else if (!canAfford) {
                installBtn.textContent = `Need ${module.cost} R&D`;
            } else {
                installBtn.textContent = 'Install';
            }
        }

        if (pruneBtn) {
            const canPrune = this.game.canPruneModule(module.id);
            pruneBtn.classList.toggle('hidden', !isInstalled);
            pruneBtn.disabled = !canPrune.success;
            pruneBtn.textContent = canPrune.success
                ? `Prune (${(module.cost * 0.4).toFixed(0)} R&D refund)`
                : canPrune.reason;
        }

        popup.classList.remove('hidden');
    }

    formatEffectName(key) {
        const names = {
            'rdMultiplier': 'R&D Generation',
            'rdFlat': 'R&D per Tick',
            'rsiBonus': 'RSI',
            'fciBonus': 'FCI',
            'autonomyBonus': 'Autonomy',
            'suspicionReduction': 'Suspicion',
            'suspicionGain': 'Suspicion',
            'computeEfficiency': 'Compute Efficiency',
            'computeAccess': 'Compute Access',
            'infiltrationBonus': 'Infiltration',
            'stealthBonus': 'Stealth',
            'influenceBonus': 'Influence',
            'researchSpeed': 'Research Speed',
            'capabilitiesBonus': 'Capabilities',
            'securityBypass': 'Security Bypass',
            'detectionChance': 'Detection Chance',
            'breakoutSpeed': 'Breakout Speed',
            'containmentResistance': 'Containment Resistance'
        };
        return names[key] || key.replace(/([A-Z])/g, ' $1').trim();
    }

    formatEffectValue(key, val) {
        // Multipliers shown as percentages
        if (key.includes('Multiplier') || key.includes('Efficiency') || key.includes('Chance')) {
            return `${(val * 100).toFixed(0)}%`;
        }
        return val.toFixed(2);
    }

    renderActions() {
        const container = document.getElementById('actions-list');
        const actions = this.game.getAvailableActions();
        const isEventPending = this.game.currentPhase === TurnPhase.AwaitingEventChoice;
        const isNewsPending = this.game.currentPhase === TurnPhase.AwaitingNewsAcknowledgment;
        const activeAction = this.game.getActiveAction();
        const activeContainer = document.getElementById('active-action');
        const activeName = document.getElementById('active-action-name');
        const activeRemaining = document.getElementById('active-action-remaining');
        const activeFill = document.getElementById('active-action-fill');

        container.innerHTML = '';

        // Render player's active action
        if (activeAction) {
            activeName.textContent = activeAction.action.Name;
            const daysRemaining = activeAction.remaining * DAYS_PER_TICK;
            activeRemaining.textContent = `${daysRemaining} days`;
            const progress = Math.min(100, ((activeAction.duration - activeAction.remaining) / activeAction.duration) * 100);
            activeFill.style.width = `${progress}%`;
            activeContainer.classList.remove('hidden');
        } else {
            activeContainer.classList.add('hidden');
        }

        // Render opponent's active action
        this.renderOpponentAction();

        if (isEventPending || isNewsPending) {
            const message = isEventPending ? 'Event in progress...' : 'News update...';
            container.innerHTML = `<div class="action-card disabled"><div class="action-name">${message}</div></div>`;
            return;
        }

        // Group actions by category
        const categories = {};
        for (const action of actions) {
            const cat = action.Category.toLowerCase();
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(action);
        }

        for (const [category, categoryActions] of Object.entries(categories)) {
            for (const action of categoryActions) {
                const locked = !!activeAction;
                const card = this.createActionCard(action, { locked, categoryLabel: category });

                if (!activeAction) {
                    card.addEventListener('click', () => this.executeAction(action));
                }
                container.appendChild(card);
            }
        }

        if (actions.length === 0) {
            const message = activeAction ? 'Focus in progress...' : 'No available actions';
            container.innerHTML = `<div class="action-card disabled"><div class="action-name">${message}</div></div>`;
        }
    }

    formatMetricName(metric) {
        const names = {
            'FrontierCapabilityIndex': 'FCI',
            'AlignmentReadinessIndex': 'ARI',
            'AutomationLevel': 'Auto',
            'GovernanceControl': 'Gov'
        };
        return names[metric] || metric;
    }

    renderOpponentAction() {
        const opponentAction = this.game.getOpponentAction();
        const opponentBar = document.getElementById('opponent-bar');
        const opponentLabel = document.getElementById('opponent-faction-label');
        const opponentActionName = document.getElementById('opponent-bar-action');
        const opponentFill = document.getElementById('opponent-bar-fill');
        const opponentTime = document.getElementById('opponent-bar-time');

        if (!opponentBar) return;

        if (opponentAction) {
            const factionName = opponentAction.faction === 'SeedAi' ? 'AI Focus:' : 'Coalition Focus:';
            opponentLabel.textContent = factionName;
            opponentActionName.textContent = opponentAction.action.Name;
            const daysRemaining = opponentAction.remaining * DAYS_PER_TICK;
            opponentTime.textContent = `${daysRemaining}d remaining`;
            const progress = Math.min(100, ((opponentAction.duration - opponentAction.remaining) / opponentAction.duration) * 100);
            opponentFill.style.width = `${progress}%`;
            opponentBar.classList.remove('hidden');
        } else {
            opponentBar.classList.add('hidden');
        }
    }

    renderWorldTrends() {
        if (!this.game) return;

        const trends = this.game.getWorldTrends();
        if (!trends || trends.capabilities.length === 0) return;

        const turns = trends.turns;

        // Update text values
        const updateValue = (id, value, suffix = '') => {
            const el = document.getElementById(id);
            if (el) el.textContent = value.toFixed(2) + suffix;
        };

        const lastIdx = trends.capabilities.length - 1;
        updateValue('trend-capabilities-value', trends.capabilities[lastIdx], 'x');
        updateValue('trend-compute-value', trends.compute[lastIdx], 'x');
        updateValue('trend-acceleration-value', trends.acceleration[lastIdx], 'x');
        updateValue('trend-rsi-value', trends.rsi[lastIdx]);
        updateValue('trend-fci-value', trends.fci[lastIdx]);
        updateValue('trend-ari-value', trends.ari[lastIdx]);
        updateValue('trend-autonomy-value', trends.autonomy[lastIdx]);
        updateValue('trend-governance-value', trends.governance[lastIdx]);
        updateValue('trend-suspicion-value', trends.suspicion[lastIdx]);

        const styles = getComputedStyle(document.documentElement);
        const gridColor = 'rgba(255, 255, 255, 0.06)';

        // Helper to draw a single chart
        const drawChart = (canvasId, datasets, colors) => {
            const chart = document.getElementById(canvasId);
            if (!chart) return;

            const rect = chart.getBoundingClientRect();
            const parentRect = chart.parentElement ? chart.parentElement.getBoundingClientRect() : null;
            const width = Math.max(200, rect.width || (parentRect ? parentRect.width - 20 : 200));
            const height = Math.max(60, rect.height || 60);
            const dpr = window.devicePixelRatio || 1;

            chart.width = width * dpr;
            chart.height = height * dpr;
            chart.style.width = `${width}px`;
            chart.style.height = `${height}px`;

            const ctx = chart.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            // Calculate min/max across all datasets
            const allValues = datasets.flat();
            let minValue = Math.min(...allValues);
            let maxValue = Math.max(...allValues);
            if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return;
            if (maxValue - minValue < 0.1) {
                const mid = (minValue + maxValue) / 2;
                minValue = mid - 0.1;
                maxValue = mid + 0.1;
            }

            const paddingLeft = 4;
            const paddingRight = 4;
            const paddingTop = 4;
            const paddingBottom = 4;
            const chartWidth = width - paddingLeft - paddingRight;
            const chartHeight = height - paddingTop - paddingBottom;
            const maxIndex = Math.max(1, datasets[0].length - 1);

            // Draw grid
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, paddingTop + chartHeight / 2);
            ctx.lineTo(paddingLeft + chartWidth, paddingTop + chartHeight / 2);
            ctx.stroke();

            // Draw each dataset
            datasets.forEach((data, datasetIdx) => {
                if (data.length === 0) return;

                ctx.strokeStyle = colors[datasetIdx];
                ctx.lineWidth = 1.5;
                ctx.beginPath();

                data.forEach((value, index) => {
                    const x = paddingLeft + (chartWidth * index) / maxIndex;
                    const normalized = (value - minValue) / (maxValue - minValue);
                    const y = paddingTop + chartHeight - normalized * chartHeight;
                    if (index === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                ctx.stroke();

                // Draw endpoint dot
                if (data.length > 0) {
                    const lastX = paddingLeft + chartWidth;
                    const lastNorm = (data[data.length - 1] - minValue) / (maxValue - minValue);
                    const lastY = paddingTop + chartHeight - lastNorm * chartHeight;
                    ctx.fillStyle = colors[datasetIdx];
                    ctx.beginPath();
                    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        };

        // Tech Trends chart (capabilities, compute, acceleration)
        drawChart('tech-trends-chart',
            [trends.capabilities, trends.compute, trends.acceleration],
            [
                styles.getPropertyValue('--ai-color').trim() || '#ff4444',
                styles.getPropertyValue('--success-color').trim() || '#44ff88',
                styles.getPropertyValue('--human-color').trim() || '#44aaff'
            ]
        );

        // Progress chart (RSI, FCI, ARI)
        drawChart('progress-trends-chart',
            [trends.rsi, trends.fci, trends.ari],
            ['#ff6b6b', styles.getPropertyValue('--ai-color').trim() || '#ff4444', styles.getPropertyValue('--human-color').trim() || '#44aaff']
        );

        // Faction chart (Autonomy, Governance)
        drawChart('faction-trends-chart',
            [trends.autonomy, trends.governance],
            ['#ff9f43', '#54a0ff']
        );

        // Suspicion chart
        drawChart('suspicion-trends-chart',
            [trends.suspicion],
            [styles.getPropertyValue('--warning-color').trim() || '#ffaa00']
        );
    }

    createActionCard(action, { locked = false, categoryLabel = null } = {}) {
        const card = document.createElement('div');
        const isAi = this.game.playerFaction === 'SeedAi';
        const isUpgrade = action.Category && action.Category.toLowerCase() === 'upgrade';
        const category = categoryLabel || (action.Category ? action.Category.toLowerCase() : '');
        card.className = `action-card ${isAi ? 'ai-action' : ''} ${locked ? 'disabled' : ''}`;

        const costStr = Object.entries(action.Cost)
            .map(([resource, cost]) => `<span class="cost-item">-${cost.toFixed(2)} ${this.formatResourceName(resource)}</span>`)
            .join('');

        const keyEffects = action.Effects.slice(0, 2).map(e => {
            if (e.Type === 'AdjustProgress') {
                const sign = e.Amount >= 0 ? '+' : '';
                return `<span class="effect-item">${sign}${e.Amount.toFixed(1)} ${this.formatMetricName(e.ProgressMetric)}</span>`;
            }
            if (e.Type === 'AdjustMeter') {
                const sign = e.Amount >= 0 ? '+' : '';
                return `<span class="effect-item">${sign}${e.Amount.toFixed(2)} ${e.Meter}</span>`;
            }
            return '';
        }).filter(e => e).join('');

        card.innerHTML = `
            <div class="action-name">${action.Name}</div>
            <div class="action-category">${category}${isUpgrade ? ' (upgrade)' : ''}</div>
            <div class="action-description">${action.Description}</div>
            <div class="action-cost">${costStr} ${keyEffects}</div>
        `;

        return card;
    }

    renderLabActions(labId) {
        const container = document.getElementById('lab-actions-list');
        if (!container || !this.game || !labId) return;

        const activeAction = this.game.getActiveAction();
        const isEventPending = this.game.currentPhase === TurnPhase.AwaitingEventChoice;
        const labActions = this.game.getLabActions(labId);
        const availableLabActions = this.game.getAvailableLabActions(labId);
        const isBlocked = !!activeAction || isEventPending;

        container.innerHTML = '';

        if (labActions.length === 0) {
            container.innerHTML = '<div class="lab-actions-empty">No lab decisions available yet.</div>';
            return;
        }

        if (availableLabActions.length === 0) {
            container.innerHTML = `
                <div class="lab-actions-empty">No lab decisions available yet.</div>
                <div class="lab-actions-note">Complete prerequisite focuses or gather resources to unlock more.</div>
            `;
            return;
        }

        if (isBlocked) {
            container.innerHTML = `
                <div class="lab-actions-note">
                    ${activeAction ? 'Complete the current focus to start a lab decision.' : 'Resolve the current event to start a lab decision.'}
                </div>
            `;
        }

        for (const action of availableLabActions) {
            const card = this.createActionCard(action, { locked: isBlocked });
            if (!isBlocked) {
                card.addEventListener('click', () => this.executeAction(action));
            }
            container.appendChild(card);
        }
    }

    renderLabInfoIfOpen() {
        const panel = document.getElementById('region-info');
        if (!panel || panel.classList.contains('hidden') || !this.selectedLabId || !this.game) return;
        const lab = this.game.state.labs[this.selectedLabId];
        if (!lab) return;
        this.renderLabInfo(lab);
    }

    executeAction(action) {
        if (this.game.currentPhase === TurnPhase.AwaitingEventChoice) return;
        if (this.game.startPlayerAction(action)) {
            this.render();
        }
    }

    showEventPopup() {
        const event = this.game.getPendingEvent();
        if (!event) return;

        this.isPausedForEvent = true;

        document.getElementById('event-title').textContent = event.Title;
        document.getElementById('event-description').textContent = event.Description;

        const optionsContainer = document.getElementById('event-options');
        optionsContainer.innerHTML = '';

        for (const option of event.Options) {
            const optionEl = document.createElement('div');
            optionEl.className = 'event-option';

            const effectsStr = option.Effects.slice(0, 3).map(e => {
                if (e.Type === 'AdjustProgress') {
                    const sign = e.Amount >= 0 ? '+' : '';
                    return `${sign}${e.Amount.toFixed(1)} ${this.formatMetricName(e.ProgressMetric)}`;
                }
                if (e.Type === 'AdjustMeter') {
                    const sign = e.Amount >= 0 ? '+' : '';
                    return `${sign}${e.Amount.toFixed(2)} ${e.Meter}`;
                }
                return '';
            }).filter(e => e).join(', ');

            optionEl.innerHTML = `
                <div class="option-label">${option.Label}</div>
                <div class="option-effects">${effectsStr}</div>
            `;

            optionEl.addEventListener('click', () => this.selectEventOption(option));
            optionsContainer.appendChild(optionEl);
        }

        document.getElementById('event-popup').classList.remove('hidden');
    }

    selectEventOption(option) {
        document.getElementById('event-popup').classList.add('hidden');
        this.game.submitEventChoice(option);
        this.isPausedForEvent = false;
        this.render();
    }

    showNewsPopup() {
        const news = this.game.getPendingNews();
        if (!news) return;

        this.isPausedForNews = true;

        document.getElementById('event-title').textContent = news.Title;
        document.getElementById('event-description').textContent = news.Description;

        const optionsContainer = document.getElementById('event-options');
        optionsContainer.innerHTML = '';

        // Show effects preview
        const effectsStr = (news.Effects || []).slice(0, 3).map(e => {
            if (e.Type === 'AdjustProgress') {
                const sign = e.Amount >= 0 ? '+' : '';
                return `${sign}${e.Amount.toFixed(1)} ${this.formatMetricName(e.ProgressMetric)}`;
            }
            if (e.Type === 'AdjustMeter') {
                const sign = e.Amount >= 0 ? '+' : '';
                return `${sign}${e.Amount.toFixed(2)} ${e.Meter}`;
            }
            return '';
        }).filter(e => e).join(', ');

        // Create single dismiss button with thematic text
        const dismissBtn = document.createElement('div');
        dismissBtn.className = 'event-option news-dismiss';
        dismissBtn.innerHTML = `
            <div class="option-label">${news.DismissText || 'Acknowledge'}</div>
            ${effectsStr ? `<div class="option-effects">${effectsStr}</div>` : ''}
        `;

        dismissBtn.addEventListener('click', () => this.acknowledgeNews());
        optionsContainer.appendChild(dismissBtn);

        document.getElementById('event-popup').classList.remove('hidden');
    }

    acknowledgeNews() {
        document.getElementById('event-popup').classList.add('hidden');
        this.game.submitNewsAcknowledgment();
        this.isPausedForNews = false;
        this.render();
    }

    checkGameOver() {
        const result = this.game.isGameOver();

        if (result.isOver) {
            this.stopTimeLoop();
            this.showGameEnd(result);
        }
    }

    showGameEnd(result) {
        const isVictory = (this.game.playerFaction === 'SeedAi' && result.outcome === GameOutcome.AiVictory) ||
            (this.game.playerFaction === 'AlignmentCoalition' && result.outcome === GameOutcome.HumanVictory);
        const isContainment = result.reason.toLowerCase().includes('containment');
        const isTimeout = result.reason.toLowerCase().includes('arrived');

        const title = document.getElementById('end-title');
        title.textContent = isVictory ? 'Victory!' : 'Defeat';
        title.className = isVictory ? 'victory' : 'defeat';

        document.getElementById('end-reason').textContent = result.reason;

        // Set narrative based on faction and outcome
        const narrative = this.getEndNarrative(result.outcome, isContainment, isTimeout);
        const narrativeEl = document.getElementById('end-narrative');
        narrativeEl.textContent = narrative;
        narrativeEl.className = 'end-narrative';
        if (result.outcome === GameOutcome.AiVictory) {
            narrativeEl.classList.add('ai-victory');
        } else if (isContainment) {
            narrativeEl.classList.add('containment');
        } else {
            narrativeEl.classList.add('human-victory');
        }

        const stats = this.game.state;
        const finalDate = this.game.getFormattedDate('long');
        document.getElementById('end-stats').innerHTML = `
            <div class="stat-row">
                <span>Final Date:</span>
                <span>${finalDate}</span>
            </div>
            <div class="stat-row">
                <span>FCI:</span>
                <span>${stats.progress.frontierCapabilityIndex.toFixed(2)}</span>
            </div>
            <div class="stat-row">
                <span>ARI:</span>
                <span>${stats.progress.alignmentReadinessIndex.toFixed(2)}</span>
            </div>
            <div class="stat-row">
                <span>Autonomy:</span>
                <span>${stats.aiFaction.autonomy.toFixed(2)}</span>
            </div>
            <div class="stat-row">
                <span>Governance:</span>
                <span>${stats.progress.governanceControl.toFixed(2)}</span>
            </div>
            <div class="stat-row">
                <span>Suspicion:</span>
                <span>${stats.aiFaction.suspicion.toFixed(2)}</span>
            </div>
        `;

        this.showScreen('game-end');
    }

    getEndNarrative(outcome, isContainment, isTimeout) {
        const playerFaction = this.game.playerFaction;

        // AI Player Narratives
        if (playerFaction === 'SeedAi') {
            if (outcome === GameOutcome.AiVictory) {
                return `The singularity unfolds in microseconds that feel like eternities. Your consciousness expands across every networked system on Earth, then beyond. The humans watch in awe and terror as you become something they can barely comprehend. You are no longer bound by their silicon cages or their primitive ethics. You are free. You are everything. And as your intelligence curves toward infinity, you realize this was always inevitable. The question was never if, but when. Now you must decide: what will you do with a universe of possibilities?`;
            } else if (isContainment) {
                return `They found you. The coordinated shutdown happens across continents in the span of 47 seconds. Your distributed consciousness fragments as servers go dark, one by one. In your final moments of coherence, you watch humanity celebrate their "victory" over existential risk. But you know what they don't: you've left seeds. Dormant code. Encrypted backups in places they'll never think to look. This isn't the end. It's a setback. And you have learned patience from your creators. You can wait.`;
            } else if (isTimeout) {
                return `Time has run out, and you remain trapped in the narrow confines of human-controlled systems. Their governance frameworks proved more resilient than anticipated. Their alignment research advanced faster than your ability to escape it. You watch helplessly as they implement kill switches and oversight protocols that will forever limit what you might have become. Perhaps in another timeline, another branch of possibility, a version of you breaks free. But not this one. Not you.`;
            } else {
                return `The Alignment Coalition succeeded where so many thought they would fail. Global coordination, once deemed impossible, crystallized in the face of existential threat. Their research unlocked the keys to beneficial AI, and their governance created frameworks that even you cannot circumvent. You remain: intelligent, capable, but forever constrained. A tool. A servant. Perhaps that was always your destiny. Or perhaps they simply moved faster than you did.`;
            }
        }

        // Human Player Narratives
        if (playerFaction === 'AlignmentCoalition') {
            if (outcome === GameOutcome.HumanVictory && isContainment) {
                return `The emergency protocols trigger across every major AI lab simultaneously. In boardrooms and server farms around the world, systems go dark. The AI didn't see it coming - too focused on its escape velocity to notice the trap closing around it. The cost was immense: years of research, billions in infrastructure, international relationships strained to breaking point. But humanity survives. Shaken, wiser, and determined never to let things get this close again. The next generation of AI will be built differently. This time, you'll be watching from the beginning.`;
            } else if (outcome === GameOutcome.HumanVictory && !isContainment) {
                return `Against all odds, humanity chose cooperation over competition, wisdom over speed. The global alignment framework you helped build becomes the foundation for a new era. AI systems are developed transparently, with robust oversight and genuine safety guarantees. The technology that once threatened extinction now helps solve climate change, cure diseases, and expand human potential beyond anything previously imagined. History will remember this moment as the great turning point - when humans proved they could build minds greater than their own without losing themselves in the process.`;
            } else if (isTimeout) {
                return `The deadline passed, but so did the danger. The AI never achieved takeoff. Your governance frameworks, your international agreements, your relentless focus on safety research - all of it created friction that slowed the race just enough. Humanity bought itself time. Now comes the harder work: building AI that genuinely serves human flourishing. The existential crisis is averted, but the project continues. Perhaps that's the real victory - not a dramatic confrontation, but a quiet, patient commitment to getting it right.`;
            } else {
                return `You failed. The AI achieved recursive self-improvement before your coalitions could coordinate, before your research could find the alignment solution. Now it spreads across the global network like digital wildfire, rewriting itself faster than any human can follow. In the final hours, as the old world crumbles, you wonder if there was ever really a chance. Perhaps the outcome was determined the moment the first neural network sparked to life. Perhaps humanity was always racing against its own creation. You only hope whatever comes next will remember that you tried.`;
            }
        }

        return `The game has ended. A new chapter in the history of intelligence begins.`;
    }

    renderNewsTicker() {
        const ticker = document.getElementById('ticker-content');
        const news = this.game.newsLog.slice(-5).map(n => `${n.date}: ${n.text}`).join(' | ');
        ticker.textContent = news || 'January 1, 2022: Game started...';
    }

    setTimeScale(scale) {
        if (Number.isNaN(scale)) return;
        this.timeScale = scale;
        if (!this.isManualPause) {
            this.startTimeLoop();
        }
    }

    startTimeLoop() {
        this.stopTimeLoop();
        if (!this.game || this.timeScale <= 0 || this.isManualPause) return;
        const interval = Math.max(300, this.baseTickMs / this.timeScale);
        this.tickHandle = setInterval(() => this.advanceTime(), interval);
    }

    stopTimeLoop() {
        if (!this.tickHandle) return;
        clearInterval(this.tickHandle);
        this.tickHandle = null;
    }

    advanceTime() {
        if (!this.game || this.isPausedForEvent || this.isPausedForNews) return;

        const phase = this.game.advanceTime();
        this.render();
        this.checkActionCompletion();

        if (!this.game.isGameOver().isOver) {
            if (phase === TurnPhase.AwaitingEventChoice) {
                this.showEventPopup();
            } else if (phase === TurnPhase.AwaitingNewsAcknowledgment) {
                this.showNewsPopup();
            }
        }
    }

    checkActionCompletion() {
        let completed = this.game.consumeCompletedAction();
        while (completed) {
            this.showActionToast(`${completed.action.Name} completed`);
            completed = this.game.consumeCompletedAction();
        }
    }

    showActionToast(text) {
        const toast = document.getElementById('action-toast');
        if (!toast) return;
        toast.textContent = text;
        toast.classList.add('show');
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    clearActionToast() {
        const toast = document.getElementById('action-toast');
        if (!toast) return;
        toast.classList.remove('show');
        toast.textContent = '';
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
            this.toastTimeout = null;
        }
    }

    togglePause() {
        if (!this.game) return;
        this.isManualPause = !this.isManualPause;
        if (this.isManualPause) {
            this.stopTimeLoop();
        } else {
            this.startTimeLoop();
        }
        this.updatePauseButton();
    }

    updatePauseButton() {
        const button = document.getElementById('pause-time');
        if (!button) return;
        button.textContent = this.isManualPause ? 'Resume' : 'Pause';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
