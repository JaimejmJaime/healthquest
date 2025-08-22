/**
 * UI Manager
 * Main UI controller that manages all views and components
 * File: js/ui/ui-manager.js
 */

class UIManager {
    constructor(game) {
        this.game = game;
        this.currentTab = 'dashboard';
        this.modals = {};
        this.views = {};
        this.components = {};
        this.initialized = false;
    }
    
    async init() {
        try {
            console.log('Initializing UI Manager...');
            
            // Initialize components
            this.initializeComponents();
            
            // Initialize views
            this.initializeViews();
            
            // Render initial UI
            this.renderUI();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize navigation
            this.initializeNavigation();
            
            // Load initial view
            this.switchTab('dashboard');
            
            this.initialized = true;
            console.log('UI Manager initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize UI:', error);
            throw error;
        }
    }
    
    initializeComponents() {
        // Initialize all UI components
        this.components = {
            header: new HeaderComponent(this),
            navigation: new NavigationComponent(this),
            avatar: new AvatarComponent(this),
            progressBar: new ProgressBarComponent(this),
            questCard: new QuestCardComponent(this),
            skillTree: new SkillTreeComponent(this),
            weekProgress: new WeekProgressComponent(this),
            statsCard: new StatsCardComponent(this),
            logModal: new LogModalComponent(this),
            accountModal: new AccountModalComponent(this),
            toast: new ToastComponent(this)
        };
    }
    
    initializeViews() {
        // Initialize all views
        this.views = {
            dashboard: new DashboardView(this),
            quests: new QuestsView(this),
            log: new QuickLogView(this),
            squad: new SquadView(this),
            events: new EventsView(this),
            progress: new ProgressView(this)
        };
    }
    
    renderUI() {
        const appRoot = document.getElementById('app-root');
        if (!appRoot) {
            console.error('App root element not found');
            return;
        }
        
        appRoot.innerHTML = `
            <div class="app-container">
                ${this.components.header.render()}
                ${this.components.navigation.render()}
                <main class="main-content">
                    <div id="view-container"></div>
                </main>
                <div id="modal-container"></div>
                <div id="toast-container" class="toast-container"></div>
            </div>
        `;
        
        // Apply styles
        this.injectStyles();
    }
    
    setupEventListeners() {
        // Listen to game events
        EventBus.on(GameEvents.XP_GAINED, (data) => this.handleXPGain(data));
        EventBus.on(GameEvents.LEVEL_UP, (data) => this.handleLevelUp(data));
        EventBus.on(GameEvents.QUEST_COMPLETED, (data) => this.handleQuestComplete(data));
        EventBus.on(GameEvents.ACHIEVEMENT_UNLOCKED, (data) => this.handleAchievementUnlock(data));
        EventBus.on(GameEvents.WAHD_UPDATED, (data) => this.handleWAHDUpdate(data));
        EventBus.on(GameEvents.DAILY_RESET, () => this.handleDailyReset());
        
        // Global UI events
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    initializeNavigation() {
        // Set up navigation click handlers
        const navContainer = document.querySelector('.nav-tabs-inner');
        if (navContainer) {
            navContainer.addEventListener('click', (e) => {
                const tabBtn = e.target.closest('.tab-btn');
                if (tabBtn) {
                    const tabName = tabBtn.dataset.tab;
                    if (tabName) {
                        this.switchTab(tabName);
                    }
                }
            });
        }
    }
    
    switchTab(tabName) {
        if (!this.views[tabName]) {
            console.error(`View not found: ${tabName}`);
            return;
        }
        
        // Update active tab
        this.currentTab = tabName;
        
        // Update navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Render view
        const viewContainer = document.getElementById('view-container');
        if (viewContainer) {
            viewContainer.innerHTML = this.views[tabName].render();
            this.views[tabName].afterRender();
        }
        
        // Emit event
        EventBus.emit(GameEvents.TAB_SWITCHED, { tab: tabName });
    }
    
    // Event Handlers
    handleXPGain(data) {
        const { amount, source } = data;
        
        // Update XP display
        this.updateXPDisplay();
        
        // Show XP gain animation
        this.showXPGainAnimation(amount);
        
        // Show toast
        this.showToast(`+${amount} XP`, 'success');
    }
    
    handleLevelUp(data) {
        const { newLevel } = data;
        
        // Update level display
        this.updateLevelDisplay();
        
        // Show celebration
        this.showCelebration(
            'Level Up!',
            `You've reached level ${newLevel}!`,
            [
                { icon: '🎉', text: `Level ${newLevel} achieved!` },
                { icon: '✨', text: 'New quests unlocked!' }
            ]
        );
        
        // Update avatar if needed
        this.components.avatar.update();
    }
    
    handleQuestComplete(data) {
        const { quest, xpGained } = data;
        
        // Refresh quest view if active
        if (this.currentTab === 'quests') {
            this.views.quests.refresh();
        }
        
        // Update dashboard if active
        if (this.currentTab === 'dashboard') {
            this.views.dashboard.updateStats();
        }
        
        // Show completion animation
        this.showQuestCompleteAnimation(quest);
    }
    
    handleAchievementUnlock(data) {
        const { achievementId } = data;
        const achievement = this.game.systems.achievements.getAchievement(achievementId);
        
        if (achievement) {
            this.showCelebration(
                'Achievement Unlocked!',
                achievement.name,
                [
                    { icon: achievement.icon, text: achievement.description },
                    { icon: '⭐', text: `+${achievement.xp} XP` }
                ]
            );
        }
    }
    
    handleWAHDUpdate(data) {
        const { wahd } = data;
        
        // Update week progress display
        this.components.weekProgress.update(wahd);
        
        // Show WAHD notification
        this.showToast(`WAHD Progress: ${wahd.current}/7`, 'info');
    }
    
    handleDailyReset() {
        // Refresh all views
        Object.values(this.views).forEach(view => {
            if (view.refresh) {
                view.refresh();
            }
        });
        
        // Show daily reset notification
        this.showToast('New day, new quests! 🌅', 'info');
    }
    
    handleGlobalClick(e) {
        // Handle modal close on backdrop click
        if (e.target.classList.contains('modal-backdrop')) {
            this.closeModal();
        }
        
        // Handle quest complete buttons
        if (e.target.classList.contains('quest-complete-btn')) {
            const questId = e.target.dataset.questId;
            if (questId) {
                this.game.completeQuest(questId);
            }
        }
        
        // Handle log buttons
        if (e.target.classList.contains('log-btn')) {
            const logType = e.target.dataset.logType;
            if (logType) {
                this.openLogModal(logType);
            }
        }
    }
    
    handleKeyPress(e) {
        // ESC to close modals
        if (e.key === 'Escape') {
            this.closeModal();
        }
        
        // Number keys for quick tab switching
        if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.altKey) {
            const tabs = ['dashboard', 'quests', 'log', 'squad', 'events', 'progress'];
            const index = parseInt(e.key) - 1;
            if (tabs[index]) {
                this.switchTab(tabs[index]);
            }
        }
    }
    
    // UI Update Methods
    updateXPDisplay() {
        const player = this.game.player;
        const maxXP = player.getXPForNextLevel();
        const percentage = (player.currentXP / maxXP) * 100;
        
        // Update XP bar
        const xpBar = document.getElementById('xp-progress-bar');
        if (xpBar) {
            xpBar.style.width = `${percentage}%`;
        }
        
        // Update XP text
        const xpText = document.getElementById('xp-text');
        if (xpText) {
            xpText.textContent = `${player.currentXP} / ${maxXP} XP`;
        }
        
        // Update daily XP
        const dailyXP = document.getElementById('daily-xp');
        if (dailyXP) {
            dailyXP.textContent = `Daily: ${player.dailyXP} / ${Config.GAME.MAX_DAILY_XP}`;
        }
    }
    
    updateLevelDisplay() {
        const player = this.game.player;
        
        // Update level badge
        const levelBadge = document.getElementById('level-badge');
        if (levelBadge) {
            levelBadge.textContent = `Level ${player.level}`;
        }
        
        // Update avatar title
        const avatarTitle = document.getElementById('avatar-title');
        if (avatarTitle) {
            avatarTitle.textContent = player.avatar.title;
        }
    }
    
    // Modal Methods
    openModal(modalId, data = {}) {
        const modal = this.modals[modalId];
        if (modal) {
            modal.open(data);
        }
    }
    
    closeModal() {
        Object.values(this.modals).forEach(modal => {
            if (modal.isOpen) {
                modal.close();
            }
        });
    }
    
    openLogModal(type) {
        this.components.logModal.open(type);
    }
    
    openAccountModal() {
        this.components.accountModal.open();
    }
    
    // Toast & Celebration Methods
    showToast(message, type = 'info', duration = 3000, actions = []) {
        this.components.toast.show(message, type, duration, actions);
    }
    
    showCelebration(title, message, rewards = []) {
        const celebrationModal = new CelebrationModal();
        celebrationModal.show(title, message, rewards);
    }
    
    showOnboarding(config) {
        const onboardingModal = new OnboardingModal();
        onboardingModal.show(config);
    }
    
    // Animation Methods
    showXPGainAnimation(amount) {
        const xpBar = document.getElementById('xp-progress-bar');
        if (xpBar) {
            const bubble = document.createElement('div');
            bubble.className = 'xp-bubble';
            bubble.textContent = `+${amount}`;
            bubble.style.animation = 'floatUp 1s ease-out forwards';
            xpBar.appendChild(bubble);
            
            setTimeout(() => bubble.remove(), 1000);
        }
    }
    
    showQuestCompleteAnimation(quest) {
        const questElement = document.querySelector(`[data-quest-id="${quest.id}"]`);
        if (questElement) {
            questElement.classList.add('quest-complete-animation');
            setTimeout(() => {
                questElement.classList.remove('quest-complete-animation');
            }, 1000);
        }
    }
    
    // Theme Methods
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.showToast(`Theme changed to ${theme}`, 'success');
    }
    
    // Style Injection
    injectStyles() {
        if (document.getElementById('ui-manager-styles')) return;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'ui-manager-styles';
        styleSheet.textContent = `
            .app-container {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            .main-content {
                flex: 1;
                max-width: 1400px;
                margin: 0 auto;
                padding: 2rem 1rem;
                width: 100%;
            }
            
            .xp-bubble {
                position: absolute;
                right: 10px;
                top: -10px;
                color: var(--primary);
                font-weight: bold;
                font-size: 1.2rem;
                pointer-events: none;
            }
            
            @keyframes floatUp {
                to {
                    transform: translateY(-50px);
                    opacity: 0;
                }
            }
            
            .quest-complete-animation {
                animation: questComplete 0.5s ease-out;
            }
            
            @keyframes questComplete {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); background: rgba(74, 222, 128, 0.2); }
                100% { transform: scale(1); }
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        
        document.head.appendChild(styleSheet);
    }
    
    // Utility Methods
    refresh() {
        // Refresh current view
        if (this.views[this.currentTab] && this.views[this.currentTab].refresh) {
            this.views[this.currentTab].refresh();
        }
        
        // Update displays
        this.updateXPDisplay();
        this.updateLevelDisplay();
    }
    
    loadQuests() {
        if (this.views.quests) {
            this.views.quests.loadQuests();
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.UIManager = UIManager;
}
