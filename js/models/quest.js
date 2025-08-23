/**
 * Quest Model
 * File: js/models/quest.js
 */

class Quest {
    constructor(data = {}) {
        this.id = data.id || `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.title = data.title || 'Quest';
        this.description = data.description || '';
        this.category = data.category || 'general';
        this.difficulty = data.difficulty || 'easy';
        this.xp = data.xp || 20;
        this.completed = data.completed || false;
        this.completedAt = data.completedAt || null;
        this.date = data.date || new Date().toDateString();
        this.progress = data.progress || 0;
        this.target = data.target || 1;
        this.rewards = data.rewards || [];
        this.requirements = data.requirements || [];
        this.metadata = data.metadata || {};
    }
    
    complete() {
        if (this.completed) {
            return { success: false, reason: 'Already completed' };
        }
        
        this.completed = true;
        this.completedAt = new Date().toISOString();
        this.progress = this.target;
        
        return { success: true, xp: this.xp, rewards: this.rewards };
    }
    
    updateProgress(amount = 1) {
        if (this.completed) return false;
        
        this.progress = Math.min(this.progress + amount, this.target);
        
        if (this.progress >= this.target) {
            return this.complete();
        }
        
        return { success: true, progress: this.progress, target: this.target };
    }
    
    getProgressPercentage() {
        return Math.min(100, (this.progress / this.target) * 100);
    }
    
    isAvailable(player) {
        // Check if quest requirements are met
        if (!this.requirements || this.requirements.length === 0) {
            return true;
        }
        
        for (const req of this.requirements) {
            switch (req.type) {
                case 'level':
                    if (player.level < req.value) return false;
                    break;
                case 'skill':
                    if (player.skills[req.skill]?.level < req.value) return false;
                    break;
                case 'quest':
                    if (!player.hasCompletedQuest(req.questId)) return false;
                    break;
                case 'achievement':
                    if (!player.hasAchievement(req.achievementId)) return false;
                    break;
            }
        }
        
        return true;
    }
    
    getIcon() {
        const icons = {
            nutrition: '🥗',
            movement: '🏃',
            recovery: '😴',
            mindfulness: '🧘',
            challenge: '⚔️',
            special: '⭐',
            event: '🎉'
        };
        return icons[this.category] || '📋';
    }
    
    getDifficultyColor() {
        const colors = {
            easy: '#10b981',
            medium: '#fbbf24',
            hard: '#ef4444',
            legendary: '#a78bfa'
        };
        return colors[this.difficulty] || '#4ade80';
    }
    
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            category: this.category,
            difficulty: this.difficulty,
            xp: this.xp,
            completed: this.completed,
            completedAt: this.completedAt,
            date: this.date,
            progress: this.progress,
            target: this.target,
            rewards: this.rewards,
            requirements: this.requirements,
            metadata: this.metadata
        };
    }
    
    static fromJSON(data) {
        return new Quest(data);
    }
    
    static generateDaily(category, playerLevel) {
        // This would typically use the quest templates from quest-system.js
        const baseXP = 20;
        const levelBonus = Math.floor(playerLevel / 5) * 5;
        
        return new Quest({
            category,
            xp: baseXP + levelBonus,
            date: new Date().toDateString()
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Quest = Quest;
}
