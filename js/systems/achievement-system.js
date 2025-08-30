/**
 * Achievement System
 * Manages achievements and unlocks
 */

class AchievementSystem {
    constructor() {
        this.achievements = this.loadAchievementTemplates();
        this.unlocked = [];
    }
    
    loadAchievementTemplates() {
        return [
            // Starter Achievements
            { id: 'first_quest', name: 'First Steps', description: 'Complete your first quest', icon: '🏆', xp: 50, category: 'starter' },
            { id: 'first_level', name: 'Level Up!', description: 'Reach level 2', icon: '⬆️', xp: 100, category: 'starter' },
            { id: 'all_habits', name: 'Balanced Day', description: 'Complete all 4 habit types in one day', icon: '⚖️', xp: 150, category: 'balance' },
            
            // Streak Achievements
            { id: 'streak_3', name: 'On Fire', description: '3-day streak', icon: '🔥', xp: 100, category: 'streak' },
            { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '💪', xp: 200, category: 'streak' },
            { id: 'streak_30', name: 'Habit Master', description: '30-day streak', icon: '👑', xp: 500, category: 'streak' },
            
            // Quest Achievements
            { id: 'quests_10', name: 'Quest Hunter', description: 'Complete 10 quests', icon: '⚔️', xp: 150, category: 'quests' },
            { id: 'quests_50', name: 'Quest Champion', description: 'Complete 50 quests', icon: '🏅', xp: 300, category: 'quests' },
            { id: 'quests_100', name: 'Quest Legend', description: 'Complete 100 quests', icon: '🌟', xp: 500, category: 'quests' },
            
            // Skill Achievements
            { id: 'skill_5', name: 'Skill Builder', description: 'Reach level 5 in any skill', icon: '📈', xp: 200, category: 'skills' },
            { id: 'skill_10', name: 'Skill Expert', description: 'Reach level 10 in any skill', icon: '🎯', xp: 400, category: 'skills' },
            { id: 'all_skills_5', name: 'Well-Rounded', description: 'All skills to level 5', icon: '💎', xp: 600, category: 'skills' },
            
            // WAHD Achievements
            { id: 'wahd_perfect', name: 'Perfect Week', description: 'Achieve 7/7 WAHD', icon: '🌈', xp: 300, category: 'wahd' },
            { id: 'wahd_month', name: 'Consistent Month', description: 'Average 5+ WAHD for a month', icon: '📅', xp: 500, category: 'wahd' },
            
            // Special Achievements
            { id: 'early_bird', name: 'Early Bird', description: 'Complete quests before noon', icon: '🌅', xp: 100, category: 'special' },
            { id: 'night_owl', name: 'Night Owl', description: 'Log activities after 10pm', icon: '🦉', xp: 100, category: 'special' },
            { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Complete all quests on weekend', icon: '🎉', xp: 150, category: 'special' }
        ];
    }
    
    checkAchievements(player) {
        const newAchievements = [];
        
        this.achievements.forEach(achievement => {
            if (this.unlocked.includes(achievement.id)) return;
            
            let unlocked = false;
            
            switch(achievement.id) {
                case 'first_quest':
                    unlocked = player.stats.questsCompleted >= 1;
                    break;
                case 'first_level':
                    unlocked = player.level >= 2;
                    break;
                case 'all_habits':
                    unlocked = Object.values(this.getTodaysHabits()).every(h => h === true);
                    break;
                case 'streak_3':
                    unlocked = player.stats.streaks.current >= 3;
                    break;
                case 'streak_7':
                    unlocked = player.stats.streaks.current >= 7;
                    break;
                case 'streak_30':
                    unlocked = player.stats.streaks.current >= 30;
                    break;
                case 'quests_10':
                    unlocked = player.stats.questsCompleted >= 10;
                    break;
                case 'quests_50':
                    unlocked = player.stats.questsCompleted >= 50;
                    break;
                case 'quests_100':
                    unlocked = player.stats.questsCompleted >= 100;
                    break;
                case 'skill_5':
                    unlocked = Object.values(player.skills).some(s => s.level >= 5);
                    break;
                case 'skill_10':
                    unlocked = Object.values(player.skills).some(s => s.level >= 10);
                    break;
                case 'all_skills_5':
                    unlocked = Object.values(player.skills).every(s => s.level >= 5);
                    break;
                case 'wahd_perfect':
                    unlocked = player.stats.wahd.current === 7;
                    break;
            }
            
            if (unlocked) {
                this.unlockAchievement(achievement, player);
                newAchievements.push(achievement);
            }
        });
        
        return newAchievements;
    }
    
    unlockAchievement(achievement, player) {
        if (this.unlocked.includes(achievement.id)) return false;
        
        this.unlocked.push(achievement.id);
        player.unlockAchievement(achievement.id);
        player.addXP(achievement.xp, 'achievement');
        
        EventBus.emit('achievement-unlocked', {
            player,
            achievementId: achievement.id
        });
        
        return true;
    }
    
    getAchievement(id) {
        return this.achievements.find(a => a.id === id);
    }
    
    getTodaysHabits() {
        // Get from game data
        return window.Game?.data?.todaysHabits || {};
    }
    
    getProgress() {
        return {
            unlocked: this.unlocked.length,
            total: this.achievements.length,
            percentage: Math.round((this.unlocked.length / this.achievements.length) * 100)
        };
    }
    
    toJSON() {
        return {
            achievements: this.achievements,
            unlocked: this.unlocked
        };
    }
    
    static fromJSON(data) {
        const system = new AchievementSystem();
        if (data.unlocked) {
            system.unlocked = data.unlocked;
        }
        return system;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.AchievementSystem = AchievementSystem;
}
