/**
 * Main Game Manager
 * Orchestrates all game systems and manages game state
 */

class GameManager {
    constructor() {
        this.initialized = false;
        this.player = null;
        this.systems = {};
        this.data = {
            todaysHabits: {
                nutrition: false,
                movement: false,
                recovery: false,
                mindfulness: false
            },
            sessionStart: Date.now(),
            lastSaveTime: Date.now()
        };
    }
    
    async init() {
        try {
            console.log('Initializing HealthQuest Game...');
            
            // Show loading screen
            this.updateLoadingMessage('Loading player data...');
            
            // Initialize storage
            await Storage.init();
            
            // Load or create player
            this.updateLoadingMessage('Setting up your character...');
            await this.loadPlayer();
            
            // Initialize game systems
            this.updateLoadingMessage('Preparing quests...');
            await this.initializeSystems();
            
            // Check daily reset
            this.updateLoadingMessage('Checking daily progress...');
            this.checkDailyReset();
            
            // Generate daily content
            this.updateLoadingMessage('Generating today\'s adventures...');
            this.generateDailyContent();
            
            // Initialize UI
            this.updateLoadingMessage('Building interface...');
            await this.initializeUI();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start auto-save
            this.startAutoSave();
            
            // Mark as initialized
            this.initialized = true;
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Show onboarding if needed
            if (this.player.level === 1 && this.player.stats.questsCompleted === 0) {
                this.showOnboarding();
            }
            
            console.log('HealthQuest Game initialized successfully!');
            
            // Emit initialization complete
            EventBus.emit('game-initialized', {
                player: this.player,
                systems: this.systems
            });
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.handleInitializationError(error);
        }
    }
    
    updateLoadingMessage(message) {
        const element = document.getElementById('loading-message');
        if (element) {
            element.textContent = message;
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const appRoot = document.getElementById('app-root');
        
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (appRoot) {
            appRoot.style.display = 'block';
            appRoot.classList.add('fade-in');
        }
    }
    
    async loadPlayer() {
        const savedData = Storage.get(Config.STORAGE.PLAYER_DATA);
        
        if (savedData && savedData.player) {
            // Load existing player
            this.player = Player.fromJSON(savedData.player);
            this.data = { ...this.data, ...savedData.gameData };
            
            console.log(`Welcome back, ${this.player.name}!`);
        } else {
            // Create new player
            this.player = new Player();
            console.log('Created new player profile');
        }
        
        // Validate player data
        const validation = this.player.validate();
        if (!validation.valid) {
            console.warn('Player data validation issues:', validation.errors);
        }
    }
    
    async initializeSystems() {
        // Quest System
        this.systems.quests = new QuestSystem();
        
        // Achievement System
        this.systems.achievements = new AchievementSystem();
        
        // Analytics System
        if (Config.FEATURES.ANALYTICS) {
            this.systems.analytics = new AnalyticsSystem();
        }
        
        // Notification System
        if (Config.FEATURES.NOTIFICATIONS) {
            this.systems.notifications = new NotificationSystem();
        }
        
        // WAHD System
        this.systems.wahd = new WAHDSystem();
        
        // Streak System
        this.systems.streaks = new StreakSystem();
        
        console.log('Game systems initialized');
    }
    
    checkDailyReset() {
        const today = new Date().toDateString();
        const lastActive = this.player.lastActiveDate;
        
        if (lastActive !== today) {
            console.log('Performing daily reset...');
            
            // Reset player daily values
            this.player.resetDaily();
            
            // Reset today's habits
            this.data.todaysHabits = {
                nutrition: false,
                movement: false,
                recovery: false,
                mindfulness: false
            };
            
            // Update streak
            this.systems.streaks.updateStreak(this.player);
            
            // Check weekly reset (Sunday)
            if (new Date().getDay() === 0) {
                this.checkWeeklyReset();
            }
            
            // Emit daily reset event
            EventBus.emit('daily-reset', {
                player: this.player,
                date: today
            });
        }
    }
    
    checkWeeklyReset() {
        console.log('Performing weekly reset...');
        
        // Reset WAHD
        this.player.stats.wahd.current = 0;
        
        // Generate new weekly challenge
        this.systems.quests.generateWeeklyChallenge(this.player);
        
        // Emit weekly reset event
        EventBus.emit('weekly-reset', {
            player: this.player,
            week: this.getWeekNumber()
        });
    }
    
    generateDailyContent() {
        // Generate daily quests
        this.systems.quests.generateDailyQuests(this.player);
        
        // Check achievements
        this.systems.achievements.checkAchievements(this.player);
        
        // Update analytics
        if (this.systems.analytics) {
            this.systems.analytics.startSession();
        }
    }
    
    async initializeUI() {
        // Initialize UI Manager
        window.UI = new UIManager(this);
        await UI.init();
    }
    
    setupEventListeners() {
        // Quest completion
        EventBus.on('quest-completed', (data) => {
            this.handleQuestCompletion(data);
        });
        
        // Level up
        EventBus.on('level-up', (data) => {
            this.handleLevelUp(data);
        });
        
        // Achievement unlocked
        EventBus.on('achievement-unlocked', (data) => {
            this.handleAchievementUnlocked(data);
        });
        
        // Habit logged
        EventBus.on('habit-logged', (data) => {
            this.handleHabitLogged(data);
        });
        
        // Settings changed
        EventBus.on('settings-updated', (data) => {
            this.handleSettingsUpdate(data);
        });
        
        // App visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onAppBackground();
            } else {
                this.onAppForeground();
            }
        });
        
        // Before unload
        window.addEventListener('beforeunload', (e) => {
            this.saveGame();
        });
    }
    
    // QUEST COMPLETION METHOD - This was missing!
    completeQuest(questId) {
        const quest = this.systems.quests.dailyQuests.find(q => q.id === questId);
        
        if (!quest) {
            console.error('Quest not found:', questId);
            UI.showToast('Quest not found!', 'error');
            return;
        }
        
        if (quest.completed) {
            UI.showToast('Quest already completed!', 'warning');
            return;
        }
        
        // Use the quest system's complete method
        const result = this.systems.quests.completeQuest(questId, this.player);
        
        if (result.success) {
            // Update UI
            UI.loadQuests();
            
            // Show success message
            UI.showToast(`Quest completed! +${result.xpGained} XP`, 'success');
            
            // Check for level up
            if (result.levelUp && result.levelUp.leveled) {
                this.handleLevelUp({
                    player: this.player,
                    newLevel: result.levelUp.newLevel
                });
            }
            
            // Save game
            this.saveGame();
        } else {
            UI.showToast(result.message || 'Failed to complete quest', 'error');
        }
    }
    
    handleQuestCompletion(data) {
        const { quest, player, xpGained } = data;
        
        // Update today's habits
        this.data.todaysHabits[quest.category] = true;
        
        // Check WAHD
        const completedCount = Object.values(this.data.todaysHabits).filter(Boolean).length;
        if (completedCount >= Config.GAME.MIN_HABITS_FOR_WAHD) {
            this.player.updateWAHD(completedCount);
            UI.showToast(`WAHD Progress: ${this.player.stats.wahd.current}/7`, 'info');
        }
        
        // Check achievements
        this.systems.achievements.checkAchievements(this.player);
        
        // Track analytics
        if (this.systems.analytics) {
            this.systems.analytics.track('quest_completed', {
                questId: quest.id,
                category: quest.category,
                xpGained
            });
        }
        
        // Update UI to show new player stats
        const appRoot = document.getElementById('app-root');
        if (appRoot) {
            // Update level and XP display
            const levelDisplay = appRoot.querySelector('h2');
            if (levelDisplay) {
                levelDisplay.innerHTML = `Welcome, ${this.player.name}!`;
            }
            
            const statsDisplay = appRoot.querySelector('p');
            if (statsDisplay) {
                statsDisplay.innerHTML = `Level ${this.player.level} ${this.player.avatar.title}`;
            }
            
            // Update progress bar
            const progressBar = appRoot.querySelector('.progress-fill');
            if (progressBar) {
                const percentage = (this.player.currentXP / (this.player.level * Config.GAME.XP_PER_LEVEL)) * 100;
                progressBar.style.width = `${percentage}%`;
            }
            
            const xpDisplay = appRoot.querySelectorAll('p')[1];
            if (xpDisplay) {
                xpDisplay.innerHTML = `${this.player.currentXP} / ${this.player.level * Config.GAME.XP_PER_LEVEL} XP`;
            }
        }
        
        // Save game
        this.saveGame();
    }
    
    handleLevelUp(data) {
        const { player, newLevel } = data;
        
        // Show celebration
        UI.showCelebration(
            'Level Up!',
            `You've reached level ${newLevel}!`,
            [
                { icon: '🎉', text: `Level ${newLevel} achieved!` },
                { icon: '✨', text: 'New quests unlocked!' }
            ]
        );
        
        // Check for avatar evolution
        if (player.avatar.stage > this.getPreviousAvatarStage()) {
            UI.showToast(`Avatar evolved to ${player.avatar.title}!`, 'success', 5000);
        }
        
        // Track analytics
        if (this.systems.analytics) {
            this.systems.analytics.track('level_up', { newLevel });
        }
    }
    
    handleAchievementUnlocked(data) {
        const { player, achievementId } = data;
        const achievement = this.systems.achievements.getAchievement(achievementId);
        
        if (achievement) {
            UI.showCelebration(
                'Achievement Unlocked!',
                achievement.name,
                [
                    { icon: achievement.icon, text: achievement.description },
                    { icon: '⭐', text: `+${achievement.xp} XP` }
                ]
            );
        }
        
        // Track analytics
        if (this.systems.analytics) {
            this.systems.analytics.track('achievement_unlocked', { achievementId });
        }
    }
    
    handleHabitLogged(data) {
        const { type, details } = data;
        
        // Update stats based on type
        switch (type) {
            case 'meal':
                this.player.incrementStat('totalMealsLogged');
                break;
            case 'activity':
                this.player.incrementStat('totalActivitiesLogged');
                this.player.incrementStat('totalMinutesActive', details.duration || 0);
                break;
            case 'sleep':
                this.player.incrementStat('totalSleepLogged');
                break;
            case 'mood':
                this.player.incrementStat('totalMoodCheckins');
                break;
            case 'meditation':
                this.player.incrementStat('totalMinutesMeditation', details.duration || 0);
                break;
        }
        
        // Save game
        this.saveGame();
    }
    
    handleSettingsUpdate(data) {
        // Apply settings changes
        const { category, setting, value } = data;
        
        // Handle specific settings
        if (category === 'display' && setting === 'theme') {
            UI.applyTheme(value);
        }
        
        if (category === 'notifications' && this.systems.notifications) {
            this.systems.notifications.updateSettings(setting, value);
        }
        
        // Save settings
        this.saveGame();
    }
    
    getPreviousAvatarStage() {
        const stages = [1, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
        const currentStage = this.player.avatar.stage;
        const index = stages.indexOf(currentStage);
        return index > 0 ? stages[index - 1] : 1;
    }
    
    getWeekNumber() {
        const date = new Date();
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    // Save/Load Management
    saveGame() {
        try {
            const saveData = {
                version: Config.VERSION,
                timestamp: Date.now(),
                player: this.player.toJSON(),
                gameData: this.data,
                systems: {
                    quests: this.systems.quests.toJSON(),
                    achievements: this.systems.achievements.toJSON(),
                    wahd: this.systems.wahd.toJSON(),
                    streaks: this.systems.streaks.toJSON()
                }
            };
            
            Storage.set(Config.STORAGE.PLAYER_DATA, saveData);
            this.data.lastSaveTime = Date.now();
            
            console.log('Game saved successfully');
            
        } catch (error) {
            console.error('Failed to save game:', error);
            UI.showToast('Failed to save progress', 'error');
        }
    }
    
    startAutoSave() {
        setInterval(() => {
            this.saveGame();
        }, Config.STORAGE.AUTO_SAVE_INTERVAL);
    }
    
    onAppBackground() {
        // Save when app goes to background
        this.saveGame();
        
        // Pause analytics session
        if (this.systems.analytics) {
            this.systems.analytics.pauseSession();
        }
    }
    
    onAppForeground() {
        // Check for daily reset when app comes back
        this.checkDailyReset();
        
        // Resume analytics session
        if (this.systems.analytics) {
            this.systems.analytics.resumeSession();
        }
    }
    
    // Data Export/Import
    exportData() {
        const exportData = {
            version: Config.VERSION,
            exportDate: new Date().toISOString(),
            player: this.player.toJSON(),
            gameData: this.data,
            systems: {
                quests: this.systems.quests.toJSON(),
                achievements: this.systems.achievements.toJSON()
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `healthquest_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        UI.showToast('Data exported successfully!', 'success');
    }
    
    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (!data.version || !data.player) {
                throw new Error('Invalid backup file');
            }
            
            // Validate version compatibility
            if (!this.isVersionCompatible(data.version)) {
                throw new Error('Incompatible backup version');
            }
            
            // Import data
            this.player = Player.fromJSON(data.player);
            this.data = { ...this.data, ...data.gameData };
            
            // Rebuild systems
            await this.initializeSystems();
            
            // Save imported data
            this.saveGame();
            
            // Reload UI
            window.location.reload();
            
        } catch (error) {
            console.error('Failed to import data:', error);
            UI.showToast('Failed to import data: ' + error.message, 'error');
        }
    }
    
    isVersionCompatible(version) {
        // Simple version check - can be made more sophisticated
        const [major] = version.split('.');
        const [currentMajor] = Config.VERSION.split('.');
        return major === currentMajor;
    }
    
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
            if (confirm('Last chance! This will delete everything. Continue?')) {
                // Clear all storage
                Storage.clear();
                
                // Reload app
                window.location.reload();
            }
        }
    }
    
    // Onboarding
    showOnboarding() {
        UI.showOnboarding({
            steps: [
                {
                    title: 'Welcome to HealthQuest!',
                    content: 'Transform your health journey into an epic adventure.',
                    image: '🌱'
                },
                {
                    title: 'Complete Daily Quests',
                    content: 'Build healthy habits across nutrition, movement, recovery, and mindfulness.',
                    image: '⚔️'
                },
                {
                    title: 'Level Up Your Character',
                    content: 'Gain XP, unlock achievements, and watch your avatar evolve.',
                    image: '🌟'
                },
                {
                    title: 'Track Your WAHD',
                    content: 'Weekly Active Healthy Days - your north star metric for balanced wellness.',
                    image: '📊'
                },
                {
                    title: 'Ready to Begin?',
                    content: 'Complete your first quest to start your journey!',
                    image: '🎯',
                    action: () => {
                        UI.switchTab('quests');
                    }
                }
            ]
        });
    }
    
    handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h2>Failed to Load</h2>
                    <p>Something went wrong while loading HealthQuest.</p>
                    <p class="error-message">${error.message}</p>
                    <button onclick="window.location.reload()" class="btn">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Create global game instance
window.Game = new GameManager();
