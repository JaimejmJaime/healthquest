/**
 * Dashboard View
 * File: js/ui/views/dashboard-view.js
 */

class DashboardView {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        const player = this.game.player;
        const stats = player.getTotalStats();
        
        return `
            <div class="dashboard-grid">
                <!-- Avatar Card -->
                <div class="card avatar-section">
                    <h2>Your Avatar</h2>
                    <div class="avatar-display" id="player-avatar">
                        ${player.getAvatar()}
                    </div>
                    <h3 id="avatar-title">${player.getTitle()}</h3>
                    <p class="avatar-subtitle">Transform through balanced habits</p>
                </div>
                
                <!-- XP Progress Card -->
                <div class="card">
                    <h2>Experience Progress</h2>
                    ${this.renderXPProgress()}
                    ${this.renderSkillTree()}
                </div>
                
                <!-- Week Progress Card -->
                <div class="card">
                    <h2>This Week's WAHD</h2>
                    ${this.renderWAHDProgress()}
                    ${this.renderStreak()}
                </div>
                
                <!-- Quick Stats Card -->
                <div class="card">
                    <h2>Your Stats</h2>
                    ${this.renderStats()}
                </div>
                
                <!-- Today's Summary Card -->
                <div class="card">
                    <h2>Today's Progress</h2>
                    ${this.renderTodaySummary()}
                </div>
            </div>
        `;
    }
    
    renderXPProgress() {
        const player = this.game.player;
        const xpProgress = player.getXPProgress();
        
        return `
            <div class="xp-section">
                <div class="progress-bar">
                    <div class="progress-fill" id="xp-progress-bar" style="width: ${xpProgress.percentage}%">
                        <span class="progress-text" id="xp-text">
                            ${xpProgress.current} / ${xpProgress.needed} XP
                        </span>
                    </div>
                </div>
                <p id="daily-xp">Daily: ${player.dailyXP} / ${Config.GAME.MAX_DAILY_XP}</p>
            </div>
        `;
    }
    
    renderSkillTree() {
        const skills = this.game.player.skills;
        
        return `
            <div class="skill-tree-section">
                <h3>Skill Levels</h3>
                <div class="skills-grid">
                    ${Object.entries(skills).map(([name, skill]) => `
                        <div class="skill-item">
                            <div class="skill-icon">${this.getSkillIcon(name)}</div>
                            <div class="skill-name">${name}</div>
                            <div class="skill-level">Lv ${skill.level}</div>
                            <div class="skill-progress">
                                <div class="progress-bar mini">
                                    <div class="progress-fill" style="width: ${(skill.xp / (skill.level * Config.GAME.SKILL_XP_PER_LEVEL)) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderWAHDProgress() {
        const wahd = this.game.player.stats.wahd;
        const today = new Date().getDay();
        const adjustedToday = today === 0 ? 6 : today - 1;
        
        return `
            <div class="wahd-section">
                <p class="wahd-display">
                    <span class="wahd-current">${wahd.current}</span> / 7
                </p>
                <p class="wahd-label">Weekly Active Healthy Days</p>
                
                <div class="week-progress">
                    ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => `
                        <div class="day-circle ${index < wahd.current ? 'active' : ''} ${index === adjustedToday ? 'today' : ''}" data-day="${index}">
                            ${day}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderStreak() {
        const streak = this.game.player.stats.streaks;
        
        return `
            <div class="streak-section">
                <h3>Current Streak</h3>
                <p class="streak-display">
                    🔥 ${streak.current} days
                </p>
                <p class="streak-best">Best: ${streak.best} days</p>
            </div>
        `;
    }
    
    renderStats() {
        const stats = this.game.player.getTotalStats();
        
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
                    <div class="stat-value">${stats.totalActivities}</div>
                    <div class="stat-label">Activities</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.currentStreak}</div>
                    <div class="stat-label">Streak Days</div>
                </div>
            </div>
        `;
    }
    
    renderTodaySummary() {
        const completedQuests = this.game.systems.quests.dailyQuests.filter(q => q.completed).length;
        const totalQuests = this.game.systems.quests.dailyQuests.length;
        const todaysHabits = this.game.data.todaysHabits;
        
        return `
            <div class="today-summary">
                <div class="summary-item">
                    <span class="summary-label">Quests:</span>
                    <span class="summary-value">${completedQuests} / ${totalQuests}</span>
                </div>
                <div class="habit-indicators">
                    ${Object.entries(todaysHabits).map(([habit, done]) => `
                        <div class="habit-indicator ${done ? 'complete' : ''}">
                            ${this.getHabitIcon(habit)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getSkillIcon(skill) {
        const icons = {
            nutrition: '🥗',
            strength: '💪',
            cardio: '🏃',
            recovery: '😴',
            mindfulness: '🧘'
        };
        return icons[skill] || '⭐';
    }
    
    getHabitIcon(habit) {
        const icons = {
            nutrition: '🥗',
            movement: '🏃',
            recovery: '😴',
            mindfulness: '🧘'
        };
        return icons[habit] || '✨';
    }
    
    afterRender() {
        // Set up any event listeners specific to dashboard
        this.updateStats();
    }
    
    updateStats() {
        // Update dynamic elements
        this.ui.updateXPDisplay();
        this.ui.updateLevelDisplay();
    }
    
    refresh() {
        const viewContainer = document.getElementById('view-container');
        if (viewContainer && this.ui.currentTab === 'dashboard') {
            viewContainer.innerHTML = this.render();
            this.afterRender();
        }
    }
}

/**
 * Quests View
 * File: js/ui/views/quests-view.js
 */

class QuestsView {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        return `
            <div class="quests-container">
                <div class="card">
                    <h2>Today's Quests</h2>
                    <div id="daily-quests-list">
                        ${this.renderDailyQuests()}
                    </div>
                </div>
                
                <div class="card">
                    <h2>Weekly Challenge</h2>
                    <div id="weekly-challenge">
                        ${this.renderWeeklyChallenge()}
                    </div>
                </div>
                
                <div class="card">
                    <h2>Quest Stats</h2>
                    ${this.renderQuestStats()}
                </div>
            </div>
        `;
    }
    
    renderDailyQuests() {
        const quests = this.game.systems.quests.dailyQuests;
        
        if (!quests || quests.length === 0) {
            return '<p class="empty-state">No quests available. Check back tomorrow!</p>';
        }
        
        return quests.map(quest => `
            <div class="quest-item ${quest.category} ${quest.completed ? 'completed' : ''}" data-quest-id="${quest.id}">
                <div class="quest-info">
                    <h4>${this.getCategoryIcon(quest.category)} ${quest.title}</h4>
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
        `).join('');
    }
    
    renderWeeklyChallenge() {
        const challenge = this.game.systems.quests.weeklyChallenge;
        
        if (!challenge) {
            return '<p class="empty-state">Weekly challenge coming soon!</p>';
        }
        
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
    
    renderQuestStats() {
        const stats = this.game.systems.quests.getQuestStats();
        
        return `
            <div class="quest-stats">
                <div class="stat-row">
                    <span>Completion Rate:</span>
                    <span>${stats.completionRate}%</span>
                </div>
                <div class="stat-row">
                    <span>Total Completed:</span>
                    <span>${stats.totalCompleted}</span>
                </div>
                <h4>By Category</h4>
                <div class="category-stats">
                    ${Object.entries(stats.byCategory).map(([cat, data]) => `
                        <div class="category-stat">
                            <span>${this.getCategoryIcon(cat)} ${cat}:</span>
                            <span>${data.completed}/${data.total} (${data.rate}%)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getCategoryIcon(category) {
        const icons = {
            nutrition: '🥗',
            movement: '🏃',
            recovery: '😴',
            mindfulness: '🧘'
        };
        return icons[category] || '⭐';
    }
    
    afterRender() {
        // Quest complete buttons are handled by global click handler
    }
    
    refresh() {
        this.loadQuests();
    }
    
    loadQuests() {
        const questsList = document.getElementById('daily-quests-list');
        if (questsList) {
            questsList.innerHTML = this.renderDailyQuests();
        }
        
        const weeklyChallenge = document.getElementById('weekly-challenge');
        if (weeklyChallenge) {
            weeklyChallenge.innerHTML = this.renderWeeklyChallenge();
        }
    }
}

/**
 * Quick Log View
 * File: js/ui/views/quick-log-view.js
 */

class QuickLogView {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        return `
            <div class="quick-log-container">
                <div class="card">
                    <h2>Quick Log</h2>
                    <p>Track your daily habits quickly and easily</p>
                    
                    <div class="quick-log-grid">
                        ${this.renderLogCards()}
                    </div>
                </div>
                
                <div class="card">
                    <h2>Today's Logs</h2>
                    <div id="todays-logs">
                        ${this.renderTodaysLogs()}
                    </div>
                </div>
                
                <div class="card">
                    <h2>Recent Activity</h2>
                    ${this.renderRecentActivity()}
                </div>
            </div>
        `;
    }
    
    renderLogCards() {
        const logTypes = [
            { type: 'nutrition', icon: '🥗', title: 'Nutrition', description: 'Log meals & water' },
            { type: 'movement', icon: '🏃', title: 'Movement', description: 'Track activities' },
            { type: 'recovery', icon: '😴', title: 'Recovery', description: 'Log sleep & rest' },
            { type: 'mindfulness', icon: '🧘', title: 'Mindfulness', description: 'Track mood & meditation' },
            { type: 'weight', icon: '⚖️', title: 'Weight', description: 'Optional tracking' },
            { type: 'custom', icon: '✨', title: 'Custom', description: 'Track anything' }
        ];
