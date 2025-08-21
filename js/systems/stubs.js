/**
 * Temporary stub files for missing systems
 * These allow the app to load while full systems are being developed
 */

// Achievement System Stub
class AchievementSystem {
    constructor() {
        this.achievements = [];
        this.unlocked = [];
    }
    
    checkAchievements(player) {
        // Stub implementation
        return [];
    }
    
    getAchievement(id) {
        return this.achievements.find(a => a.id === id);
    }
    
    toJSON() {
        return {
            achievements: this.achievements,
            unlocked: this.unlocked
        };
    }
}

// Analytics System Stub
class AnalyticsSystem {
    constructor() {
        this.events = [];
    }
    
    track(event, data) {
        this.events.push({ event, data, timestamp: Date.now() });
    }
    
    startSession() {
        this.track('session_start', {});
    }
    
    pauseSession() {
        this.track('session_pause', {});
    }
    
    resumeSession() {
        this.track('session_resume', {});
    }
}

// Notification System Stub
class NotificationSystem {
    constructor() {
        this.enabled = false;
    }
    
    updateSettings(setting, value) {
        // Stub implementation
    }
    
    scheduleNotification(type, time) {
        // Stub implementation
    }
}

// WAHD System Stub
class WAHDSystem {
    constructor() {
        this.current = 0;
        this.history = [];
    }
    
    update(value) {
        this.current = value;
    }
    
    toJSON() {
        return {
            current: this.current,
            history: this.history
        };
    }
}

// Streak System Stub
class StreakSystem {
    constructor() {
        this.current = 0;
        this.best = 0;
    }
    
    updateStreak(player) {
        // Handled in player model
    }
    
    toJSON() {
        return {
            current: this.current,
            best: this.best
        };
    }
}

// UI Manager Stub
class UIManager {
    constructor(game) {
        this.game = game;
        this.currentTab = 'dashboard';
    }
    
    async init() {
        // Create basic UI
        const appRoot = document.getElementById('app-root');
        if (appRoot) {
            appRoot.innerHTML = `
                <div class="hero-section">
                    <h1>🌱 HealthQuest</h1>
                    <p>Your wellness adventure begins!</p>
                </div>
                
                <div class="card">
                    <h2>Welcome, ${this.game.player.name}!</h2>
                    <p>Level ${this.game.player.level} ${this.game.player.avatar.title}</p>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(this.game.player.currentXP / (this.game.player.level * 100)) * 100}%"></div>
                    </div>
                    <p>${this.game.player.currentXP} / ${this.game.player.level * 100} XP</p>
                    
                    <h3>Today's Quests</h3>
                    <div id="quests-list"></div>
                    
                    <button class="btn" onclick="location.reload()">Refresh</button>
                </div>
            `;
        }
        
        // Load quests
        this.loadQuests();
    }
    
    loadQuests() {
        const questsList = document.getElementById('quests-list');
        if (questsList && this.game.systems.quests) {
            const quests = this.game.systems.quests.dailyQuests;
            questsList.innerHTML = quests.map(quest => `
                <div class="quest-item ${quest.completed ? 'completed' : ''}">
                    <div>
                        <h4>${quest.title}</h4>
                        <p>${quest.description}</p>
                        <span>${quest.xp} XP</span>
                    </div>
                    <button onclick="Game.completeQuest('${quest.id}')" ${quest.completed ? 'disabled' : ''}>
                        ${quest.completed ? '✅' : 'Complete'}
                    </button>
                </div>
            `).join('');
        }
    }
    
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, duration);
        }
    }
    
    showCelebration(title, message, rewards) {
        alert(`${title}\n${message}`);
    }
    
    showOnboarding(config) {
        console.log('Onboarding:', config);
    }
    
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    }
    
    switchTab(tabName) {
        this.currentTab = tabName;
        // Stub implementation
    }
}

// Export all stubs
if (typeof window !== 'undefined') {
    window.AchievementSystem = AchievementSystem;
    window.AnalyticsSystem = AnalyticsSystem;
    window.NotificationSystem = NotificationSystem;
    window.WAHDSystem = WAHDSystem;
    window.StreakSystem = StreakSystem;
    window.UIManager = UIManager;
}
