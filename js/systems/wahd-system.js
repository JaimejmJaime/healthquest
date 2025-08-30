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
