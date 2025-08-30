/**
 * UI Manager
 * Main UI controller that manages all views and components
 */

class UIManager {
    constructor(game) {
        this.game = game;
        this.currentTab = 'dashboard';
        this.initialized = false;
    }
    
    async init() {
        console.log('Initializing UI Manager...');
        
        // Render initial UI structure
        this.renderUI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial view
        this.switchTab('dashboard');
        
        this.initialized = true;
        console.log('UI Manager initialized');
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
                            <span class="level-badge">Level ${this.game.player.level}</span>
                        </div>
                    </div>
                </header>
                
                <nav class="nav-tabs">
                    <button class="tab-btn active" data-tab="dashboard">🏠 Dashboard</button>
                    <button class="tab-btn" data-tab="quests">⚔️ Quests</button>
                    <button class="tab-btn" data-tab="log">📝 Quick Log</button>
                    <button class="tab-btn" data-tab="progress">📊 Progress</button>
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
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
            
            if (e.target.classList.contains('quest-complete-btn')) {
                const questId = e.target.dataset.questId;
                this.game.completeQuest(questId);
            }
            
            if (e.target.classList.contains('log-btn')) {
                this.openLogModal(e.target.dataset.logType);
            }
        });
        
        // Game events
        EventBus.on('quest-completed', () => this.loadQuests());
        EventBus.on('level-up', (data) => this.handleLevelUp(data));
        EventBus.on('xp-gained', () => this.updateXPDisplay());
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
        }
    }
    
    renderDashboard() {
        const player = this.game.player;
        const xpProgress = player.getXPProgress();
        
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
                    <p>Daily XP: ${player.dailyXP} / ${Config.GAME.MAX_DAILY_XP}</p>
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
                    <h2>Today's Habits</h2>
                    <div class="habit-indicators">
                        ${this.renderHabitIndicators()}
                    </div>
                </div>
                
                <div class="card">
                    <h2>Quick Stats</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${player.stats.questsCompleted}</div>
                            <div class="stat-label">Quests Done</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${player.achievements.length}</div>
                            <div class="stat-label">Achievements</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${player.getTotalSkillLevel()}</div>
                            <div class="stat-label">Total Skill Level</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderQuests() {
        const quests = this.game.systems.quests.dailyQuests;
        
        document.getElementById('view-container').innerHTML = `
            <div class="card">
                <h2>Today's Quests</h2>
                <div id="quests-list">
                    ${quests.map(quest => `
                        <div class="quest-item ${quest.category} ${quest.completed ? 'completed' : ''}">
                            <div class="quest-info">
                                <h4>${quest.title}</h4>
                                <p>${quest.description}</p>
                                <span class="xp-badge">${quest.xp} XP</span>
                                <span class="difficulty ${quest.difficulty}">${quest.difficulty}</span>
                            </div>
                            <button class="btn quest-complete-btn" data-quest-id="${quest.id}" 
                                    ${quest.completed ? 'disabled' : ''}>
                                ${quest.completed ? '✅ Done' : 'Complete'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderQuickLog() {
        document.getElementById('view-container').innerHTML = `
            <div class="card">
                <h2>Quick Log</h2>
                <div class="quick-log-grid">
                    <div class="log-card log-btn" data-log-type="nutrition">
                        <div class="log-icon">🥗</div>
                        <div>Nutrition</div>
                    </div>
                    <div class="log-card log-btn" data-log-type="movement">
                        <div class="log-icon">🏃</div>
                        <div>Movement</div>
                    </div>
                    <div class="log-card log-btn" data-log-type="recovery">
                        <div class="log-icon">😴</div>
                        <div>Recovery</div>
                    </div>
                    <div class="log-card log-btn" data-log-type="mindfulness">
                        <div class="log-icon">🧘</div>
                        <div>Mindfulness</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderProgress() {
        const player = this.game.player;
        
        document.getElementById('view-container').innerHTML = `
            <div class="card">
                <h2>Your Progress</h2>
                <h3>Skills</h3>
                <div class="skills-grid">
                    ${Object.entries(player.skills).map(([name, skill]) => `
                        <div class="skill-item">
                            <div class="skill-name">${name}</div>
                            <div class="skill-level">Level ${skill.level}</div>
                            <div class="progress-bar mini">
                                <div class="progress-fill" style="width: ${(skill.xp / (skill.level * 50)) * 100}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <h3>Recent Achievements</h3>
                <p>${player.achievements.length > 0 ? 
                    player.achievements.slice(-3).join(', ') : 
                    'No achievements yet'}</p>
            </div>
        `;
    }
    
    renderWeekCircles() {
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const wahd = this.game.player.stats.wahd.current;
        
        return days.map((day, i) => 
            `<div class="day-circle ${i < wahd ? 'active' : ''}">${day}</div>`
        ).join('');
    }
    
    renderHabitIndicators() {
        const habits = this.game.data.todaysHabits;
        const icons = {
            nutrition: '🥗',
            movement: '🏃',
            recovery: '😴',
            mindfulness: '🧘'
        };
        
        return Object.entries(habits).map(([habit, done]) => 
            `<div class="habit-indicator ${done ? 'complete' : ''}">${icons[habit]}</div>`
        ).join('');
    }
    
    openLogModal(type) {
        const modal = document.getElementById('modal-container');
        if (!modal) return;
        
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="UI.closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <h2>Log ${type}</h2>
                    <div class="form-group">
                        <label>Details</label>
                        <input type="text" class="form-control" id="log-input" 
                               placeholder="Enter ${type} details">
                    </div>
                    <div class="modal-footer">
                        <button class="btn" onclick="UI.saveLog('${type}')">Save</button>
                        <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    closeModal() {
        const modal = document.getElementById('modal-container');
        if (modal) {
            modal.innerHTML = '';
            modal.style.display = 'none';
        }
    }
    
    saveLog(type) {
        const input = document.getElementById('log-input');
        if (!input) return;
        
        // Log the habit
        switch(type) {
            case 'nutrition':
                this.game.player.logMeal({ description: input.value });
                break;
            case 'movement':
                this.game.player.logActivity({ type: 'general', duration: 30 });
                break;
            case 'recovery':
                this.game.player.logSleep({ hours: 8 });
                break;
            case 'mindfulness':
                this.game.player.logMood({ feeling: 'calm' });
                break;
        }
        
        this.showToast(`${type} logged!`, 'success');
        this.closeModal();
        this.game.saveGame();
    }
    
    loadQuests() {
        if (this.currentTab === 'quests') {
            this.renderQuests();
        }
    }
    
    updateXPDisplay() {
        // Update XP in header
        const levelBadge = document.querySelector('.level-badge');
        if (levelBadge) {
            levelBadge.textContent = `Level ${this.game.player.level}`;
        }
        
        // Refresh current view
        if (this.currentTab === 'dashboard') {
            this.renderDashboard();
        }
    }
    
    handleLevelUp(data) {
        this.showCelebration('Level Up!', `You reached level ${data.newLevel}!`);
        this.updateXPDisplay();
    }
    
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    showCelebration(title, message) {
        const modal = document.getElementById('modal-container');
        if (!modal) return;
        
        modal.innerHTML = `
            <div class="modal-backdrop celebration" onclick="UI.closeModal()">
                <div class="celebration-modal">
                    <div class="celebration-icon">🎉</div>
                    <h2>${title}</h2>
                    <p>${message}</p>
                    <button class="btn" onclick="UI.closeModal()">Awesome!</button>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    showOnboarding(config) {
        // Simple onboarding implementation
        this.showToast('Welcome to HealthQuest! Complete quests to level up!', 'info', 5000);
    }
    
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.UIManager = UIManager;
}
