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
        
        return logTypes.map(log => `
            <div class="log-card log-btn" data-log-type="${log.type}">
                <div class="log-card-icon">${log.icon}</div>
                <div class="log-card-title">${log.title}</div>
                <div class="log-card-description">${log.description}</div>
            </div>
        `).join('');
    }
    
    renderTodaysLogs() {
        const logs = this.game.data.todaysLogs || [];
        
        if (logs.length === 0) {
            return '<p class="empty-state">No logs yet today. Start tracking!</p>';
        }
        
        return `
            <div class="logs-list">
                ${logs.map(log => `
                    <div class="log-entry">
                        <span class="log-time">${new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span class="log-type">${log.type}</span>
                        <span class="log-details">${this.getLogSummary(log)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderRecentActivity() {
        const recentDays = this.getRecentActivityData();
        
        return `
            <div class="activity-chart">
                ${recentDays.map(day => `
                    <div class="activity-day">
                        <div class="activity-bar" style="height: ${day.percentage}%"></div>
                        <div class="activity-label">${day.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    getLogSummary(log) {
        // Generate a brief summary based on log type and data
        switch(log.type) {
            case 'nutrition': return log.data.meal || 'Meal logged';
            case 'movement': return `${log.data.duration || 0} min activity`;
            case 'recovery': return `${log.data.hours || 0} hours sleep`;
            case 'mindfulness': return log.data.activity || 'Mindfulness';
            default: return 'Activity logged';
        }
    }
    
    getRecentActivityData() {
        // Get last 7 days of activity
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                label: date.toLocaleDateString('en', { weekday: 'short' }),
                percentage: Math.random() * 100 // Would use real data
            });
        }
        return days;
    }
    
    afterRender() {
        // Log card clicks handled by global handler
    }
    
    refresh() {
        const logsContainer = document.getElementById('todays-logs');
        if (logsContainer) {
            logsContainer.innerHTML = this.renderTodaysLogs();
        }
    }
}

/**
 * Squad View
 * File: js/ui/views/squad-view.js
 */

class SquadView {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        return `
            <div class="squad-container">
                ${this.renderSquadHub()}
                ${this.renderSquadLeaderboard()}
                ${this.renderSquadChat()}
            </div>
        `;
    }
    
    renderSquadHub() {
        const hasSquad = false; // Check if player is in a squad
        
        if (!hasSquad) {
            return `
                <div class="card">
                    <h2>Squad Hub</h2>
                    <div class="squad-empty-state">
                        <div class="squad-icon">👥</div>
                        <h3>Join or Create a Squad</h3>
                        <p>Team up with friends for motivation and accountability</p>
                        <div class="squad-actions">
                            <button class="btn" onclick="UI.showToast('Squad feature coming soon!', 'info')">
                                Find Squad
                            </button>
                            <button class="btn btn-secondary" onclick="UI.showToast('Create squad coming soon!', 'info')">
                                Create Squad
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Would show squad info if player has one
        return `
            <div class="card">
                <h2>Your Squad</h2>
                <!-- Squad details here -->
            </div>
        `;
    }
    
    renderSquadLeaderboard() {
        return `
            <div class="card">
                <h2>Squad Leaderboard</h2>
                <div class="leaderboard">
                    <div class="leaderboard-header">
                        <span>Rank</span>
                        <span>Squad</span>
                        <span>WAHD</span>
                        <span>XP</span>
                    </div>
                    ${this.renderLeaderboardEntries()}
                </div>
            </div>
        `;
    }
    
    renderLeaderboardEntries() {
        // Placeholder data
        const squads = [
            { rank: 1, name: 'Wellness Warriors', wahd: 6.2, xp: 12500 },
            { rank: 2, name: 'Health Heroes', wahd: 5.8, xp: 11200 },
            { rank: 3, name: 'Fit Friends', wahd: 5.5, xp: 10800 }
        ];
        
        return squads.map(squad => `
            <div class="leaderboard-entry">
                <span class="rank">#${squad.rank}</span>
                <span class="squad-name">${squad.name}</span>
                <span class="squad-wahd">${squad.wahd}</span>
                <span class="squad-xp">${squad.xp.toLocaleString()}</span>
            </div>
        `).join('');
    }
    
    renderSquadChat() {
        return `
            <div class="card">
                <h2>Squad Chat</h2>
                <p class="empty-state">Join a squad to chat with your team!</p>
            </div>
        `;
    }
    
    afterRender() {
        // Set up squad-specific interactions
    }
    
    refresh() {
        // Refresh squad data
    }
}

/**
 * Events View
 * File: js/ui/views/events-view.js
 */

class EventsView {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        return `
            <div class="events-container">
                ${this.renderCurrentEvent()}
                ${this.renderEventQuests()}
                ${this.renderUpcomingEvents()}
            </div>
        `;
    }
    
    renderCurrentEvent() {
        // Would fetch from event system
        const currentEvent = {
            name: '❄️ Winter Wellness Challenge',
            description: 'Stay active during the cold months!',
            startDate: 'December 1',
            endDate: 'January 31',
            progress: 35
        };
        
        return `
            <div class="card">
                <h2>${currentEvent.name}</h2>
                <p>${currentEvent.description}</p>
                <p class="event-dates">${currentEvent.startDate} - ${currentEvent.endDate}</p>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${currentEvent.progress}%">
                        <span class="progress-text">${currentEvent.progress}% Complete</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderEventQuests() {
        const eventQuests = [
            { id: 'eq1', title: '❄️ Winter Walking', description: 'Take a 20-minute winter walk', xp: 50, completed: false },
            { id: 'eq2', title: '☕ Mindful Morning', description: 'Start your day with 5 minutes of gratitude', xp: 30, completed: false },
            { id: 'eq3', title: '🎿 Winter Sport', description: 'Try a winter activity', xp: 75, completed: false }
        ];
        
        return `
            <div class="card">
                <h2>Event Quests</h2>
                <div class="event-quests-list">
                    ${eventQuests.map(quest => `
                        <div class="quest-item seasonal ${quest.completed ? 'completed' : ''}">
                            <div class="quest-info">
                                <h4>${quest.title}</h4>
                                <p>${quest.description}</p>
                                <div class="quest-meta">
                                    <span class="xp-badge">${quest.xp} XP</span>
                                    <span class="difficulty easy">seasonal</span>
                                </div>
                            </div>
                            <button class="btn btn-sm" ${quest.completed ? 'disabled' : ''}>
                                ${quest.completed ? '✅' : 'Complete'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderUpcomingEvents() {
        const upcoming = [
            { name: '🎊 New Year Reset', date: 'January 1' },
            { name: '💝 Heart Health Month', date: 'February' },
            { name: '🌸 Spring Into Fitness', date: 'March' }
        ];
        
        return `
            <div class="card">
                <h2>Upcoming Events</h2>
                <div class="upcoming-events">
                    ${upcoming.map(event => `
                        <div class="upcoming-event">
                            <span class="event-name">${event.name}</span>
                            <span class="event-date">${event.date}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    afterRender() {
        // Set up event-specific interactions
    }
    
    refresh() {
        // Refresh event data
    }
}

/**
 * Progress View
 * File: js/ui/views/progress-view.js
 */

class ProgressView {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        return `
            <div class="progress-container">
                <div class="dashboard-grid">
                    ${this.renderWeightTracker()}
                    ${this.renderAchievements()}
                    ${this.renderMonthlyStats()}
                    ${this.renderProgressChart()}
                </div>
            </div>
        `;
    }
    
    renderWeightTracker() {
        const weightTracking = this.game.player.stats.weight.trackingEnabled;
        const currentWeight = this.game.player.stats.weight.current;
        
        return `
            <div class="card">
                <h2>Weight Tracker</h2>
                ${weightTracking ? `
                    <p class="current-weight">Current: ${currentWeight || '--'}</p>
                    <button class="btn btn-secondary log-btn" data-log-type="weight">
                        Log Weight
                    </button>
                ` : `
                    <p class="body-positive-message">
                        Focus on habits, not numbers! 💪
                        <br><br>
                        Weight tracking is optional. Your worth isn't measured on a scale.
                    </p>
                    <button class="btn btn-secondary" onclick="UI.showToast('Weight tracking can be enabled in settings', 'info')">
                        Enable Weight Tracking
                    </button>
                `}
            </div>
        `;
    }
    
    renderAchievements() {
        const achievements = [
            { id: 'first_quest', name: 'First Quest', description: 'Complete your first quest', icon: '🏆', unlocked: true },
            { id: 'week_warrior', name: 'Week Warrior', description: '7-day streak', icon: '🔥', unlocked: false },
            { id: 'strength_5', name: 'Strength Builder', description: 'Reach Level 5 in Strength', icon: '💪', unlocked: false },
            { id: 'zen_master', name: 'Zen Master', description: '30 minutes of meditation', icon: '🧘', unlocked: false }
        ];
        
        return `
            <div class="card">
                <h2>Achievements</h2>
                <div class="achievements-grid">
                    ${achievements.map(ach => `
                        <div class="achievement ${ach.unlocked ? 'unlocked' : 'locked'}">
                            <div class="achievement-icon">${ach.icon}</div>
                            <div class="achievement-name">${ach.name}</div>
                            <div class="achievement-desc">${ach.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderMonthlyStats() {
        const stats = {
            activeDays: 15,
            questsCompleted: 42,
            avgWAHD: 3.5,
            totalXP: 850
        };
        
        return `
            <div class="card">
                <h2>Monthly Summary</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${stats.activeDays}</div>
                        <div class="stat-label">Active Days</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.questsCompleted}</div>
                        <div class="stat-label">Quests Done</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.avgWAHD}</div>
                        <div class="stat-label">Avg WAHD</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.totalXP}</div>
                        <div class="stat-label">Total XP</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderProgressChart() {
        return `
            <div class="card">
                <h2>Progress Over Time</h2>
                <div class="chart-container">
                    <canvas id="progress-chart"></canvas>
                </div>
            </div>
        `;
    }
    
    afterRender() {
        // Initialize charts if needed
    }
    
    refresh() {
        // Refresh progress data
    }
}

// Export all views
if (typeof window !== 'undefined') {
    window.DashboardView = DashboardView;
    window.QuestsView = QuestsView;
    window.QuickLogView = QuickLogView;
    window.SquadView = SquadView;
    window.EventsView = EventsView;
    window.ProgressView = ProgressView;
}
