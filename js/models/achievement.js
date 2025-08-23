/**
 * Achievement Model
 * File: js/models/achievement.js
 */

class Achievement {
    constructor(data = {}) {
        this.id = data.id || `achievement_${Date.now()}`;
        this.name = data.name || 'Achievement';
        this.description = data.description || '';
        this.icon = data.icon || '🏆';
        this.category = data.category || 'general';
        this.xp = data.xp || 50;
        this.unlocked = data.unlocked || false;
        this.unlockedAt = data.unlockedAt || null;
        this.progress = data.progress || 0;
        this.target = data.target || 1;
        this.tier = data.tier || 'bronze'; // bronze, silver, gold, platinum
        this.hidden = data.hidden || false;
        this.rewards = data.rewards || [];
        this.requirements = data.requirements || [];
    }
    
    unlock() {
        if (this.unlocked) {
            return { success: false, reason: 'Already unlocked' };
        }
        
        this.unlocked = true;
        this.unlockedAt = new Date().toISOString();
        this.progress = this.target;
        
        return {
            success: true,
            xp: this.xp,
            rewards: this.rewards
        };
    }
    
    updateProgress(amount = 1) {
        if (this.unlocked) return false;
        
        this.progress = Math.min(this.progress + amount, this.target);
        
        if (this.progress >= this.target) {
            return this.unlock();
        }
        
        return {
            success: true,
            progress: this.progress,
            target: this.target,
            percentage: this.getProgressPercentage()
        };
    }
    
    getProgressPercentage() {
        return Math.min(100, (this.progress / this.target) * 100);
    }
    
    isAvailable(player) {
        if (this.hidden && !this.unlocked && this.progress === 0) {
            return false;
        }
        
        // Check requirements
        for (const req of this.requirements) {
            switch (req.type) {
                case 'level':
                    if (player.level < req.value) return false;
                    break;
                case 'achievement':
                    if (!player.hasAchievement(req.achievementId)) return false;
                    break;
            }
        }
        
        return true;
    }
    
    getTierColor() {
        const colors = {
            bronze: '#cd7f32',
            silver: '#c0c0c0',
            gold: '#ffd700',
            platinum: '#e5e4e2',
            legendary: '#a78bfa'
        };
        return colors[this.tier] || '#4ade80';
    }
    
    getDisplayInfo() {
        if (this.hidden && !this.unlocked && this.progress === 0) {
            return {
                name: '???',
                description: 'Hidden Achievement',
                icon: '❓'
            };
        }
        
        return {
            name: this.name,
            description: this.description,
            icon: this.icon
        };
    }
    
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            icon: this.icon,
            category: this.category,
            xp: this.xp,
            unlocked: this.unlocked,
            unlockedAt: this.unlockedAt,
            progress: this.progress,
            target: this.target,
            tier: this.tier,
            hidden: this.hidden,
            rewards: this.rewards,
            requirements: this.requirements
        };
    }
    
    static fromJSON(data) {
        return new Achievement(data);
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Achievement = Achievement;
}
