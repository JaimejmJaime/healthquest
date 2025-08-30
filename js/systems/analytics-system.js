/**
 * Analytics System
 * File: js/systems/analytics-system.js
 */

class AnalyticsSystem {
    constructor() {
        this.events = [];
        this.session = null;
        this.metrics = {};
    }
    
    track(event, data = {}) {
        const entry = {
            event,
            data,
            timestamp: Date.now(),
            sessionId: this.session?.id
        };
        
        this.events.push(entry);
        
        // Update metrics
        if (!this.metrics[event]) {
            this.metrics[event] = 0;
        }
        this.metrics[event]++;
        
        // Keep only last 1000 events
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }
    }
    
    startSession() {
        this.session = {
            id: `session_${Date.now()}`,
            start: Date.now(),
            events: []
        };
        this.track('session_start');
    }
    
    pauseSession() {
        if (this.session) {
            this.session.paused = Date.now();
            this.track('session_pause');
        }
    }
    
    resumeSession() {
        if (this.session?.paused) {
            delete this.session.paused;
            this.track('session_resume');
        }
    }
    
    getSessionDuration() {
        if (!this.session) return 0;
        const end = this.session.paused || Date.now();
        return end - this.session.start;
    }
    
    getMetrics() {
        return {
            totalEvents: this.events.length,
            sessionDuration: this.getSessionDuration(),
            eventCounts: this.metrics,
            topEvents: Object.entries(this.metrics)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
        };
    }
    
    toJSON() {
        return {
            events: this.events.slice(-100), // Save only last 100
            session: this.session,
            metrics: this.metrics
        };
    }
    
    static fromJSON(data) {
        const system = new AnalyticsSystem();
        system.events = data.events || [];
        system.session = data.session || null;
        system.metrics = data.metrics || {};
        return system;
    }
}

/**
 * Notification System
 * File: js/systems/notification-system.js
 */

class NotificationSystem {
    constructor() {
        this.enabled = false;
        this.permission = 'default';
        this.scheduled = [];
        this.settings = {
            daily: true,
            achievements: true,
            streaks: true,
            hydration: false,
            movement: false
        };
    }
    
    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
            if (this.permission === 'default') {
                this.permission = await Notification.requestPermission();
            }
            this.enabled = this.permission === 'granted';
        }
    }
    
    updateSettings(setting, value) {
        if (this.settings.hasOwnProperty(setting)) {
            this.settings[setting] = value;
        }
    }
    
    scheduleNotification(type, time, message) {
        if (!this.enabled) return false;
        
        const notification = {
            type,
            time,
            message,
            id: `notif_${Date.now()}`
        };
        
        this.scheduled.push(notification);
        
        // Set timeout for notification
        const delay = time - Date.now();
        if (delay > 0) {
            setTimeout(() => this.showNotification(message), delay);
        }
        
        return notification.id;
    }
    
    showNotification(message, options = {}) {
        if (!this.enabled) return;
        
        const notification = new Notification('HealthQuest', {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="24" font-size="24">🌱</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="24" font-size="24">🌱</text></svg>',
            ...options
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
    
    toJSON() {
        return {
            enabled: this.enabled,
            permission: this.permission,
            settings: this.settings,
            scheduled: this.scheduled
        };
    }
    
    static fromJSON(data) {
        const system = new NotificationSystem();
        system.enabled = data.enabled || false;
        system.permission = data.permission || 'default';
        system.settings = data.settings || system.settings;
        system.scheduled = data.scheduled || [];
        return system;
    }
}

/**
 * WAHD System
 * File: js/systems/wahd-system.js
 */

class WAHDSystem {
    constructor() {
        this.current = 0;
        this.history = [];
        this.weekStart = this.getWeekStart();
    }
    
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff)).toDateString();
    }
    
    update(completedHabits) {
        const today = new Date().toDateString();
        
        // Check if new week
        if (this.weekStart !== this.getWeekStart()) {
            this.resetWeek();
        }
        
        // Check if WAHD achieved today
        if (completedHabits >= 3) {
            const todayEntry = this.history.find(h => h.date === today);
            
            if (!todayEntry) {
                this.current++;
                this.history.push({
                    date: today,
                    habits: completedHabits,
                    week: this.weekStart
                });
                
                EventBus.emit('wahd-achieved', {
                    current: this.current,
                    date: today
                });
                
                return true;
            }
        }
        
        return false;
    }
    
    resetWeek() {
        this.current = 0;
        this.weekStart = this.getWeekStart();
    }
    
    getWeeklyAverage() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentHistory = this.history.filter(h => 
            new Date(h.date).getTime() > thirtyDaysAgo
        );
        
        if (recentHistory.length === 0) return 0;
        
        // Group by week and calculate average
        const weeks = {};
        recentHistory.forEach(entry => {
            if (!weeks[entry.week]) {
                weeks[entry.week] = 0;
            }
            weeks[entry.week]++;
        });
        
        const weekValues = Object.values(weeks);
        return weekValues.reduce((a, b) => a + b, 0) / weekValues.length;
    }
    
    toJSON() {
        return {
            current: this.current,
            history: this.history,
            weekStart: this.weekStart
        };
    }
    
    static fromJSON(data) {
        const system = new WAHDSystem();
        system.current = data.current || 0;
        system.history = data.history || [];
        system.weekStart = data.weekStart || system.getWeekStart();
        return system;
    }
}

/**
 * Streak System  
 * File: js/systems/streak-system.js
 */

class StreakSystem {
    constructor() {
        this.current = 0;
        this.best = 0;
        this.lastActiveDate = null;
        this.forgiveness = 1;
        this.history = [];
    }
    
    updateStreak(player) {
        const today = new Date().toDateString();
        
        if (this.lastActiveDate === today) {
            return; // Already updated today
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (this.lastActiveDate === yesterdayString) {
            // Continue streak
            this.current++;
            if (this.current > this.best) {
                this.best = this.current;
            }
        } else if (this.forgiveness > 0 && this.lastActiveDate) {
            // Use forgiveness
            this.forgiveness--;
            EventBus.emit('streak-forgiveness-used', {
                remaining: this.forgiveness
            });
        } else if (this.lastActiveDate) {
            // Break streak
            const previousStreak = this.current;
            this.history.push({
                streak: previousStreak,
                startDate: this.getStreakStartDate(),
                endDate: this.lastActiveDate
            });
            
            this.current = 1; // Start new streak
            
            if (previousStreak > 0) {
                EventBus.emit('streak-broken', {
                    previousStreak,
                    best: this.best
                });
            }
        } else {
            // First day
            this.current = 1;
        }
        
        this.lastActiveDate = today;
        
        // Reset weekly forgiveness on Sunday
        if (new Date().getDay() === 0) {
            this.forgiveness = 1;
        }
        
        // Sync with player stats
        player.stats.streaks.current = this.current;
        player.stats.streaks.best = this.best;
        player.stats.streaks.lastActiveDate = today;
    }
    
    getStreakStartDate() {
        if (!this.lastActiveDate || this.current === 0) return null;
        
        const start = new Date(this.lastActiveDate);
        start.setDate(start.getDate() - this.current + 1);
        return start.toDateString();
    }
    
    toJSON() {
        return {
            current: this.current,
            best: this.best,
            lastActiveDate: this.lastActiveDate,
            forgiveness: this.forgiveness,
            history: this.history
        };
    }
    
    static fromJSON(data) {
        const system = new StreakSystem();
        system.current = data.current || 0;
        system.best = data.best || 0;
        system.lastActiveDate = data.lastActiveDate || null;
        system.forgiveness = data.forgiveness ?? 1;
        system.history = data.history || [];
        return system;
    }
}

// Export all systems
if (typeof window !== 'undefined') {
    window.AnalyticsSystem = AnalyticsSystem;
    window.NotificationSystem = NotificationSystem;
    window.WAHDSystem = WAHDSystem;
    window.StreakSystem = StreakSystem;
}
