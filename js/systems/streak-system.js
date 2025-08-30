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
