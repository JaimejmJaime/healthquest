/**
 * UI Manager - Fixed Version
 * File: js/ui/ui-manager.js
 */

class UIManager {
    constructor(game) {
        this.game = game;
        this.currentTab = 'dashboard';
        this.initialized = false;
        this.components = {};
        this.toastContainer = null;
    }
    
    async init() {
        console.log('Initializing UI Manager...');
        
        // Initialize components
        this.initializeComponents();
        
        // Create toast container if it doesn't exist
        this.createToastContainer();
        
        // Render initial UI structure
        this.renderUI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial view
        this.switchTab('dashboard');
        
        // Apply saved theme
        this.applyTheme(this.game.player.settings.display.theme);
        
        this.initialized = true;
        console.log('UI Manager initialized');
    }
    
    initializeComponents() {
        // Initialize habit logging modal
        this.components.habitLogModal = new HabitLogModal(this);
        this.components.habitLogModal.init();
        
        // Initialize other components as needed
        this.components.toasts = [];
    }
    
    createToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        this.toastContainer = container;
    }
    
    renderUI() {
        const appRoot = document.getElementById('app-root');
        if (!appRoot) return;
        
        appRoot.innerHTML = `
            <div class="app-container">
                <header class="header">
                    <div class="header-content">
                        <div class="logo">
                            <span class="logo-icon">🌱</span>
                            <span>HealthQuest</span>
                        </div>
                        <div class="user-info">
                            <span id="player-name">${this.game.player.name}</span>
                            <span class="level-badge" id="player-level">Level ${this.game.player.level}</span>
                            <button class="btn-icon" onclick="UI.openAccountModal()" title="Settings">⚙️</button>
                        </div>
                    </div>
                </header>
                
                <nav class="nav-tabs">
                    <div class="nav-tabs-inner">
                        <button class="tab-btn active" data-tab="dashboard">
                            <span class="tab-icon">🏠</span>
                            <span class="tab-label">Dashboard</span>
                        </button>
                        <button class="tab-btn" data-tab="quests">
                            <span class="tab-icon">⚔️</span>
                            <span class="tab-label">Quests</span>
                        </button>
                        <button class="tab-btn" data-tab="log">
                            <span class="tab-icon">📝</span>
                            <span class="tab-label">Quick Log</span>
                        </button>
                        <button class="tab-btn" data-tab="progress">
                            <span class="tab-icon">📊</span>
                            <span class="tab-label">Progress</span>
                        </button>
                    </div>
                </nav>
                
                <main class="main-content">
                    <div id="view-container"></div>
                </main>
                
                <div id="modal-container"></div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Tab navigation
        document.addEventListener('click', (e) => {
            // Tab switching
            if (e.target.classList.contains('tab-btn') || e.target.closest('.tab-btn')) {
                const btn = e.target.classList.contains('tab-btn') ? e.target : e.target.closest('.tab-btn');
                this.switchTab(btn.dataset.tab);
            }
            
            // Quest completion
            if (e.target.classList.contains('quest-complete-btn')) {
                const questId = e.target.dataset.questId;
                this.game.completeQuest(questId);
            }
            
            // Habit logging
            if (e.target.classList.contains('log-btn') || e.target.closest('.log-btn')) {
                const btn = e.target.classList.contains('log-btn') ? e.target : e.target.closest('.log-btn');
                const logType = btn.dataset.logType;
                this.openLogModal(logType);
            }
        });
        
        // Game events
        EventBus.on('quest-completed', () => this.refreshCurrentView());
        EventBus.on('level-up', (data) => this.handleLevelUp(data));
        EventBus.on('xp-gained', () => this.updateHeaderStats());
        EventBus.on('habit-logged', (data) => this.handleHabitLogged(data));
        EventBus.on('achievement-unlocked', (data) => this.handleAchievementUnlocked(data));
    }
    
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Render view
        const viewContainer = document.getElementById('view-container');
        if (!viewContainer) return;
        
        switch(tabName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'quests':
                this.renderQuests();
                break;
            case 'log':
                this.renderQuickLog();
                break;
            case 'progress':
                this.renderProgress();
                break;
            default:
                this.renderDashboard();
        }
    }
    
    renderDashboard() {
        const player = this.game.player;
        const xpProgress = player.getXPProgress();
        const habitSystem = this.game.systems.habitLogging;
        
        document.getElementById('view-container').innerHTML = `
            <div class="dashboard-grid">
                <div class="card">
                    <h2>Welcome, ${player.name}!</h2>
                    <div class="avatar-display">${player.getAvatar()}</div>
                    <h3>${player.getTitle()}</h3>
                    <p>Level ${player.level}</p>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${xpProgress.percentage}%">
                            <span class="progress-text">${xpProgress.current} / ${xpProgress.needed} XP</span>
                        </div>
                    </div>
                    <p class="daily-xp ${player.dailyXP >= Config.GAME.MAX_DAILY_XP ? 'maxed' : ''}">
                        Daily XP: ${player.dailyXP} / ${Config.GAME.MAX_DAILY_XP}
                    </p>
                </div>
                
                <div class="card">
                    <h2>Weekly Progress</h2>
                    <div class="wahd-display">
                        <span class="wahd-current">${player.stats.wahd.current}</span> / 7 WAHD
                    </div>
                    <div class="week-progress">
                        ${this.renderWeekCircles()}
                    </div>
                    <p>Current Streak: 🔥 ${player.stats.streaks.current} days</p>
                </div>
                
                <div class="card">
                    <h2>Today's Activity</h2>
                    <div class="habit-summary">
                        ${this.renderTodaysHabits()}
                    </div>
                    <button class="btn btn-primary" onclick="UI.openQuickLogMenu()">
                        Log Activity
                    </button>
                </div>
                
                <div class="card">
                    <h2>Quick Stats</h2>
                    ${this.renderQuickStats()}
                </div>
            </div>
        `;
    }
    
    renderQuests() {
        const quests = this.game.systems.quests.dailyQuests;
        const weeklyChallenge = this.game.systems.quests.weeklyChallenge;
        
        document.getElementById('view-container').innerHTML = `
            <div class="quests-container">
                <div class="card">
                    <h2>Today's Quests</h2>
                    <div id="quests-list">
                        ${quests.length > 0 ? quests.map(quest => this.renderQuestItem(quest)).join('') :
                          '<p class="empty-state">No quests available today. Check back tomorrow!</p>'}
                    </div>
                </div>
                
                ${weeklyChallenge ? `
                    <div class="card">
                        <h2>Weekly Challenge</h2>
                        ${this.renderWeeklyChallenge(weeklyChallenge)}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderQuickLog() {
        const habitSystem = this.game.systems.habitLogging;
        const todaysLogs = habitSystem?.getTodaysLogs() || [];
        
        document.getElementById('view-container').innerHTML = `
            <div class="quick-log-container">
                <div class="card">
                    <h2>Quick Log</h2>
                    <p>Track your daily habits quickly and easily</p>
                    
                    <div class="quick-log-grid">
                        <div class="log-card log-btn" data-log-type="nutrition">
                            <div class="log-card-icon">🥗</div>
                            <div class="log-card-title">Nutrition</div>
                            <div class="log-card-description">Log meals & water</div>
                        </div>
                        <div class="log-card log-btn" data-log-type="movement">
                            <div class="log-card-icon">🏃</div>
                            <div class="log-card-title">Movement</div>
                            <div class="log-card-description">Track activities</div>
                        </div>
                        <div class="log-card log-btn" data-log-type="recovery">
                            <div class="log-card-icon">😴</div>
                            <div class="log-card-title">Recovery</div>
                            <div class="log-card-description">Log sleep & rest</div>
                        </div>
                        <div class="log-card log-btn" data-log-type="mindfulness">
                            <div class="log-card-icon">🧘</div>
                            <div class="log-card-title">Mindfulness</div>
                            <div class="log-card-description">Track mood & meditation</div>
                        </div>
                        ${this.game.player.settings.gameplay.weightTracking ? `
                            <div class="log-card log-btn" data-log-type="weight">
                                <div class="log-card-icon">⚖️</div>
                                <div class="log-card-title">Weight</div>
                                <div class="log-card-description">Optional tracking</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="card">
                    <h2>Today's Logs (${todaysLogs.length})</h2>
                    <div id="todays-logs">
                        ${todaysLogs.length > 0 ? this.renderTodaysLogs(todaysLogs) :
                          '<p class="empty-state">No logs yet today. Start tracking!</p>'}
                    </div>
                </div>
                
                ${habitSystem ? `
                    <div class="card">
                        <h2>Weekly Summary</h2>
                        ${this.renderWeeklySummary()}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderProgress() {
        const player = this.game.player;
        const habitSystem = this.game.systems.habitLogging;
        
        document.getElementById('view-container').innerHTML = `
            <div class="progress-container">
                <div class="card">
                    <h2>Skills Progress</h2>
                    ${this.renderSkillsProgress()}
                </div>
                
                <div class="card">
                    <h2>Achievements</h2>
                    ${this.renderAchievements()}
                </div>
                
                ${habitSystem ? `
                    <div class="card">
                        <h2>Habit Trends</h2>
                        ${this.renderHabitTrends()}
                    </div>
                ` : ''}
                
                <div class="card">
                    <h2>All-Time Stats</h2>
                    ${this.renderAllTimeStats()}
                </div>
            </div>
        `;
    }
    
    // Helper render methods
    renderQuestItem(quest) {
        const categoryIcons = {
            nutrition: '🥗',
            movement: '🏃',
            recovery: '😴',
            mindfulness: '🧘'
        };
        
        return `
            <div class="quest-item ${quest.category} ${quest.completed ? 'completed' : ''}">
                <div class="quest-info">
                    <h4>${categoryIcons[quest.category] || '⭐'} ${quest.title}</h4>
                    <p>${quest.description}</p>
                    <div class="quest-meta">
                        <span class="xp-badge">${quest.xp} XP</span>
                        <span class="difficulty ${quest.difficulty}">${quest.difficulty}</span>
                    </div>
                </div>
                <button class="btn btn-sm quest-complete-btn" 
                        data-quest-id="${quest.id}" 
                        ${quest.completed ? 'disabled' : ''}>
                    ${quest.completed ? '✅ Done' : 'Complete'}
                </button>
            </div>
        `;
    }
    
    renderWeekCircles() {
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const wahd = this.game.player.stats.wahd.current;
        const today = new Date().getDay();
        const adjustedToday = today === 0 ? 6 : today - 1;
        
        return days.map((day, i) => `
            <div class="day-circle ${i < wahd ? 'active' : ''} ${i === adjustedToday ? 'today' : ''}">${day}</div>
        `).join('');
    }
    
    renderTodaysHabits() {
        const habitSystem = this.game.systems.habitLogging;
        if (!habitSystem) return '<p>No habits logged today</p>';
        
        const todaysLogs = habitSystem.getTodaysLogs();
        const categories = ['nutrition', 'movement', 'recovery', 'mindfulness'];
        
        return categories.map(cat => {
            const count = todaysLogs.filter(log => log.category === cat).length;
            return `
                <div class="habit-indicator ${count > 0 ? 'active' : ''}">
                    <span class="habit-count">${count}</span>
                    <span class="habit-label">${cat}</span>
                </div>
            `;
        }).join('');
    }
    
    renderTodaysLogs(logs) {
        return `
            <div class="logs-timeline">
                ${logs.map(log => `
                    <div class="log-entry">
                        <div class="log-time">${new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div class="log-content">
                            <span class="log-type">${log.type}</span>
                            <span class="log-xp">+${log.xpAwarded} XP</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderWeeklySummary() {
        const habitSystem = this.game.systems.habitLogging;
        const types = ['nutrition', 'movement', 'recovery', 'mindfulness'];
        
        return `
            <div class="weekly-stats">
                ${types.map(type => {
                    const stats = habitSystem.getStats(type, 'week');
                    return `
                        <div class="stat-row">
                            <span>${type}:</span>
                            <span>${stats.count} logs</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    renderQuickStats() {
        const player = this.game.player;
        const stats = player.getTotalStats();
        
        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.questsCompleted}</div>
                    <div class="stat-label">Quests Done</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.achievementsUnlocked}</div>
                    <div class="stat-label">Achievements</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${player.getTotalSkillLevel()}</div>
                    <div class="stat-label">Total Skill Level</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.currentStreak}</div>
                    <div class="stat-label">Day Streak</div>
                </div>
            </div>
        `;
    }
    
    renderSkillsProgress() {
        const skills = this.game.player.skills;
        
        return `
            <div class="skills-grid">
                ${Object.entries(skills).map(([name, skill]) => `
                    <div class="skill-item">
                        <div class="skill-name">${name}</div>
                        <div class="skill-level">Level ${skill.level}</div>
                        <div class="progress-bar mini">
                            <div class="progress-fill" 
                                 style="width: ${(skill.xp / (skill.level * Config.GAME.SKILL_XP_PER_LEVEL)) * 100}%">
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderAchievements() {
        const unlocked = this.game.player.achievements;
        
        if (unlocked.length === 0) {
            return '<p class="empty-state">No achievements yet. Keep playing!</p>';
        }
        
        return `
            <div class="achievements-grid">
                ${unlocked.slice(-6).map(id => `
                    <div class="achievement-badge">🏆 ${id}</div>
                `).join('')}
            </div>
        `;
    }
    
    renderHabitTrends() {
        const habitSystem = this.game.systems.habitLogging;
        const types = ['nutrition', 'movement', 'recovery', 'mindfulness'];
        
        return `
            <div class="trends-grid">
                ${types.map(type => {
                    const stats = habitSystem.getStats(type, 'week');
                    const streak = habitSystem.calculateStreak(type);
                    return `
                        <div class="trend-card">
                            <h4>${type}</h4>
                            <p>${stats.count} this week</p>
                            <p>${streak} day streak</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    renderAllTimeStats() {
        const player = this.game.player;
        const stats = player.stats;
        
        return `
            <div class="all-time-stats">
                <div class="stat-row">
                    <span>Total XP Earned:</span>
                    <span>${player.totalXP}</span>
                </div>
                <div class="stat-row">
                    <span>Quests Completed:</span>
                    <span>${stats.questsCompleted}</span>
                </div>
                <div class="stat-row">
                    <span>Best Streak:</span>
                    <span>${stats.streaks.best} days</span>
                </div>
                <div class="stat-row">
                    <span>Best WAHD Week:</span>
                    <span>${stats.wahd.best}/7</span>
                </div>
            </div>
        `;
    }
    
    renderWeeklyChallenge(challenge) {
        const progress = (challenge.progress / challenge.target) * 100;
        
        return `
            <div class="challenge-card">
                <h3>${challenge.title}</h3>
                <p>${challenge.description}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%">
                        <span class="progress-text">${challenge.progress} / ${challenge.target}</span>
                    </div>
                </div>
                <div class="challenge-reward">
                    <span class="xp-badge">${challenge.xp} XP</span>
                    ${challenge.completed ? '<span class="completed-badge">✅ Completed</span>' : ''}
                </div>
            </div>
        `;
    }
    
    // Modal methods
    openLogModal(type) {
        if (this.components.habitLogModal) {
            this.components.habitLogModal.open(type);
        } else {
            console.error('Habit log modal not initialized');
            this.showToast('Unable to open log modal', 'error');
        }
    }
    
    openQuickLogMenu() {
        // Could show a quick menu or go to log tab
        this.switchTab('log');
    }
    
    closeModal() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = '';
            modalContainer.classList.remove('active');
        }
    }
    
    openAccountModal() {
        // Implement account settings modal
        this.showToast('Account settings coming soon!', 'info');
    }
    
    // Toast notifications
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        if (this.toastContainer) {
            this.toastContainer.appendChild(toast);
            
            // Animate in
            setTimeout(() => toast.classList.add('show'), 10);
            
            // Remove after duration
            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }
    
    // Event handlers
    handleLevelUp(data) {
        this.showCelebration('Level Up!', `You've reached level ${data.newLevel}!`);
        this.updateHeaderStats();
        this.refreshCurrentView();
    }
    
    handleHabitLogged(data) {
        this.showToast(data.log.message || `${data.type} logged! +${data.xpAwarded} XP`, 'success');
        
        // Show patterns if any
        if (data.patterns && data.patterns.length > 0) {
            data.patterns.forEach(pattern => {
                if (pattern.positive) {
                    setTimeout(() => this.showToast(pattern.message, 'info', 5000), 1000);
                }
            });
        }
        
        this.refreshCurrentView();
    }
    
    handleAchievementUnlocked(data) {
        const achievement = this.game.systems.achievements.getAchievement(data.achievementId);
        if (achievement) {
            this.showCelebration('Achievement Unlocked!', achievement.name);
        }
    }
    
    showCelebration(title, message) {
        // Simple celebration for now
        this.showToast(`🎉 ${title}: ${message}`, 'success', 5000);
        
        // Could add confetti or modal animation here
    }
    
    // UI updates
    updateHeaderStats() {
        const player = this.game.player;
        
        const nameElement = document.getElementById('player-name');
        if (nameElement) nameElement.textContent = player.name;
        
        const levelElement = document.getElementById('player-level');
        if (levelElement) levelElement.textContent = `Level ${player.level}`;
    }
    
    refreshCurrentView() {
        this.switchTab(this.currentTab);
    }
    
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme || 'dark');
    }
    
    // Utility methods
    updateXPDisplay() {
        this.updateHeaderStats();
        if (this.currentTab === 'dashboard') {
            this.refreshCurrentView();
        }
    }
    
    updateLevelDisplay() {
        this.updateHeaderStats();
    }
    
    loadQuests() {
        if (this.currentTab === 'quests') {
            this.renderQuests();
        }
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.UIManager = UIManager;
}
