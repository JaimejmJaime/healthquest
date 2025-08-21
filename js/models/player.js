/**
 * Player Model
 * Represents the player's character, progress, and stats
 */

class Player {
    constructor(data = {}) {
        // Basic Info
        this.id = data.id || this.generateId();
        this.name = data.name || 'Health Seeker';
        this.email = data.email || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastActiveDate = data.lastActiveDate || new Date().toDateString();
        
        // Progress
        this.level = data.level || 1;
        this.totalXP = data.totalXP || 0;
        this.currentXP = data.currentXP || 0;
        this.dailyXP = data.dailyXP || 0;
        
        // Avatar
        this.avatar = {
            stage: data.avatar?.stage || 1,
            emoji: data.avatar?.emoji || '🌱',
            title: data.avatar?.title || 'Novice Wellness Warrior',
            customization: data.avatar?.customization || {
                color: 'green',
                accessory: null,
                background: 'forest'
            }
        };
        
        // Skills
        this.skills = {
            nutrition: this.initSkill(data.skills?.nutrition),
            strength: this.initSkill(data.skills?.strength),
            cardio: this.initSkill(data.skills?.cardio),
            recovery: this.initSkill(data.skills?.recovery),
            mindfulness: this.initSkill(data.skills?.mindfulness)
        };
        
        // Stats
        this.stats = {
            // WAHD (Weekly Active Healthy Days)
            wahd: {
                current: data.stats?.wahd?.current || 0,
                best: data.stats?.wahd?.best || 0,
                average: data.stats?.wahd?.average || 0,
                history: data.stats?.wahd?.history || []
            },
            
            // Streaks
            streaks: {
                current: data.stats?.streaks?.current || 0,
                best: data.stats?.streaks?.best || 0,
                forgiveness: data.stats?.streaks?.forgiveness || 1,
                lastActiveDate: data.stats?.streaks?.lastActiveDate || new Date().toDateString()
            },
            
            // Completion Stats
            questsCompleted: data.stats?.questsCompleted || 0,
            challengesCompleted: data.stats?.challengesCompleted || 0,
            perfectDays: data.stats?.perfectDays || 0,
            
            // Activity Stats
            totalMealsLogged: data.stats?.totalMealsLogged || 0,
            totalActivitiesLogged: data.stats?.totalActivitiesLogged || 0,
            totalSleepLogged: data.stats?.totalSleepLogged || 0,
            totalMoodCheckins: data.stats?.totalMoodCheckins || 0,
            
            // Time Stats
            totalMinutesActive: data.stats?.totalMinutesActive || 0,
            totalMinutesMeditation: data.stats?.totalMinutesMeditation || 0,
            averageSleepHours: data.stats?.averageSleepHours || 0,
            
            // Weight Tracking (optional, body-positive approach)
            weight: {
                current: data.stats?.weight?.current || null,
                goal: data.stats?.weight?.goal || null,
                history: data.stats?.weight?.history || [],
                trackingEnabled: data.stats?.weight?.trackingEnabled || false
            }
        };
        
        // Achievements
        this.achievements = data.achievements || [];
        
        // Settings
        this.settings = {
            notifications: {
                daily: data.settings?.notifications?.daily ?? true,
                achievements: data.settings?.notifications?.achievements ?? true,
                streaks: data.settings?.notifications?.streaks ?? true,
                hydration: data.settings?.notifications?.hydration ?? false,
                movement: data.settings?.notifications?.movement ?? false
            },
            privacy: {
                shareProgress: data.settings?.privacy?.shareProgress ?? true,
                anonymousMode: data.settings?.privacy?.anonymousMode ?? false,
                dataCollection: data.settings?.privacy?.dataCollection ?? true
            },
            gameplay: {
                difficulty: data.settings?.gameplay?.difficulty || 'normal',
                autoQuests: data.settings?.gameplay?.autoQuests ?? true,
                soundEnabled: data.settings?.gameplay?.soundEnabled ?? true,
                hapticFeedback: data.settings?.gameplay?.hapticFeedback ?? true
            },
            display: {
                theme: data.settings?.display?.theme || 'dark',
                largeText: data.settings?.display?.largeText ?? false,
                highContrast: data.settings?.display?.highContrast ?? false,
                reducedMotion: data.settings?.display?.reducedMotion ?? false
            }
        };
        
        // Inventory (for future features)
        this.inventory = data.inventory || {
            badges: [],
            titles: [],
            themes: [],
            powerups: []
        };
    }
    
    generateId() {
        return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    initSkill(skillData) {
        return {
            level: skillData?.level || 1,
            xp: skillData?.xp || 0,
            totalXP: skillData?.totalXP || 0,
            perks: skillData?.perks || [],
            milestones: skillData?.milestones || []
        };
    }
    
    // XP Management
    addXP(amount, source = 'general') {
        // Check daily cap
        if (this.dailyXP >= Config.GAME.MAX_DAILY_XP) {
            EventBus.emit('xp-limit-reached', { player: this });
            return {
                success: false,
                reason: 'daily_limit',
                message: 'Daily XP limit reached'
            };
        }
        
        // Apply XP with cap
        const remainingDaily = Config.GAME.MAX_DAILY_XP - this.dailyXP;
        const actualXP = Math.min(amount, remainingDaily);
        
        // Add XP
        this.totalXP += actualXP;
        this.currentXP += actualXP;
        this.dailyXP += actualXP;
        
        // Track source
        this.updateSkillXP(source, actualXP);
        
        // Check for level up
        const levelUpResult = this.checkLevelUp();
        
        // Emit events
        EventBus.emit('xp-gained', {
            player: this,
            amount: actualXP,
            source,
            levelUp: levelUpResult.leveled
        });
        
        return {
            success: true,
            xpGained: actualXP,
            totalXP: this.totalXP,
            dailyXP: this.dailyXP,
            levelUp: levelUpResult
        };
    }
    
    checkLevelUp() {
        let levelsGained = 0;
        let xpNeeded = this.getXPForNextLevel();
        
        while (this.currentXP >= xpNeeded && this.level < Config.GAME.MAX_PLAYER_LEVEL) {
            this.level++;
            this.currentXP -= xpNeeded;
            levelsGained++;
            
            // Update avatar on certain levels
            this.updateAvatar();
            
            // Unlock rewards
            this.unlockLevelRewards();
            
            // Emit level up event
            EventBus.emit('level-up', {
                player: this,
                newLevel: this.level
            });
            
            // Recalculate XP needed for next level
            xpNeeded = this.getXPForNextLevel();
        }
        
        return {
            leveled: levelsGained > 0,
            levelsGained,
            newLevel: this.level,
            nextLevelXP: xpNeeded,
            currentXP: this.currentXP
        };
    }
    
    getXPForNextLevel() {
        return this.level * Config.GAME.XP_PER_LEVEL;
    }
    
    getXPProgress() {
        const needed = this.getXPForNextLevel();
        return {
            current: this.currentXP,
            needed: needed,
            percentage: (this.currentXP / needed) * 100,
            total: this.totalXP
        };
    }
    
    // Skill Management
    updateSkillXP(source, xp) {
        const skillMap = {
            'nutrition': 'nutrition',
            'meal': 'nutrition',
            'hydration': 'nutrition',
            'strength': 'strength',
            'weights': 'strength',
            'cardio': 'cardio',
            'walk': 'cardio',
            'run': 'cardio',
            'bike': 'cardio',
            'swim': 'cardio',
            'recovery': 'recovery',
            'sleep': 'recovery',
            'rest': 'recovery',
            'meditation': 'mindfulness',
            'mindfulness': 'mindfulness',
            'breathing': 'mindfulness',
            'gratitude': 'mindfulness'
        };
        
        const skillName = skillMap[source.toLowerCase()];
        if (skillName && this.skills[skillName]) {
            const skill = this.skills[skillName];
            skill.xp += xp;
            skill.totalXP += xp;
            
            // Check skill level up
            this.checkSkillLevelUp(skillName);
        }
    }
    
    checkSkillLevelUp(skillName) {
        const skill = this.skills[skillName];
        let xpNeeded = skill.level * Config.GAME.SKILL_XP_PER_LEVEL;
        
        while (skill.xp >= xpNeeded && skill.level < Config.GAME.MAX_SKILL_LEVEL) {
            skill.level++;
            skill.xp -= xpNeeded;
            
            // Unlock skill perks
            this.unlockSkillPerk(skillName, skill.level);
            
            // Add milestone
            skill.milestones.push({
                level: skill.level,
                date: new Date().toISOString()
            });
            
            // Emit event
            EventBus.emit('skill-level-up', {
                player: this,
                skill: skillName,
                level: skill.level
            });
            
            // Recalculate XP needed for next level
            xpNeeded = skill.level * Config.GAME.SKILL_XP_PER_LEVEL;
        }
    }
    
    unlockSkillPerk(skillName, level) {
        const perks = {
            nutrition: {
                5: { id: 'meal_prep', name: 'Meal Prep Master', bonus: '10% XP bonus for meal logging' },
                10: { id: 'intuitive', name: 'Intuitive Eater', bonus: 'Unlock mindful eating quests' },
                15: { id: 'chef', name: 'Home Chef', bonus: '15% XP for home-cooked meals' },
                20: { id: 'nutritionist', name: 'Nutrition Expert', bonus: 'Unlock nutrition challenges' },
                25: { id: 'balanced', name: 'Balanced Plate', bonus: 'Double XP for balanced meals' }
            },
            strength: {
                5: { id: 'iron_will', name: 'Iron Will', bonus: '5% XP bonus for all activities' },
                10: { id: 'powerhouse', name: 'Powerhouse', bonus: 'Unlock strength challenges' },
                15: { id: 'titan', name: 'Titan Endurance', bonus: 'Reduced recovery time' },
                20: { id: 'hercules', name: 'Hercules Strength', bonus: '20% XP for strength training' },
                25: { id: 'olympian', name: 'Olympian', bonus: 'Unlock legendary workouts' }
            },
            cardio: {
                5: { id: 'runner', name: 'Runner\'s High', bonus: 'Extra XP for cardio streaks' },
                10: { id: 'marathoner', name: 'Marathon Ready', bonus: 'Unlock endurance challenges' },
                15: { id: 'speedster', name: 'Speedster', bonus: '15% XP for high-intensity cardio' },
                20: { id: 'ultrarunner', name: 'Ultra Runner', bonus: 'Double XP for long sessions' },
                25: { id: 'windrunner', name: 'Wind Runner', bonus: 'Unlock extreme challenges' }
            },
            recovery: {
                5: { id: 'restful', name: 'Restful Sleeper', bonus: 'Bonus XP for consistent sleep' },
                10: { id: 'recovery_pro', name: 'Recovery Pro', bonus: 'Faster daily XP reset' },
                15: { id: 'zen_master', name: 'Zen Master', bonus: 'Stress resistance bonus' },
                20: { id: 'restoration', name: 'Restoration Expert', bonus: '20% XP for recovery activities' },
                25: { id: 'phoenix', name: 'Phoenix Rising', bonus: 'Extra streak forgiveness' }
            },
            mindfulness: {
                5: { id: 'present', name: 'Present Mind', bonus: 'Unlock advanced meditations' },
                10: { id: 'serene', name: 'Serene Soul', bonus: '10% XP for mindfulness activities' },
                15: { id: 'enlightened', name: 'Enlightened', bonus: 'Mood boost effects' },
                20: { id: 'sage', name: 'Mindful Sage', bonus: 'Double XP for meditation streaks' },
                25: { id: 'guru', name: 'Wellness Guru', bonus: 'Master meditation unlocked' }
            }
        };
        
        const skillPerks = perks[skillName];
        if (skillPerks && skillPerks[level]) {
            const perk = skillPerks[level];
            this.skills[skillName].perks.push(perk);
            
            EventBus.emit('perk-unlocked', {
                player: this,
                skill: skillName,
                perk: perk
            });
            
            return perk;
        }
        
        return null;
    }
    
    // Avatar Management
    updateAvatar() {
        const avatarStages = {
            1: { emoji: '🌱', title: 'Novice Wellness Warrior' },
            5: { emoji: '🌿', title: 'Growing Guardian' },
            10: { emoji: '🌳', title: 'Balanced Builder' },
            15: { emoji: '🏔️', title: 'Harmony Hero' },
            20: { emoji: '⭐', title: 'Wellness Wizard' },
            25: { emoji: '🌟', title: 'Health Champion' },
            30: { emoji: '💎', title: 'Lifestyle Legend' },
            40: { emoji: '👑', title: 'Sovereign of Self-Care' },
            50: { emoji: '🏆', title: 'Grand Master of Wellness' },
            75: { emoji: '🌈', title: 'Transcendent Being' },
            100: { emoji: '∞', title: 'Eternal Wellness Guardian' }
        };
        
        Object.entries(avatarStages).forEach(([level, data]) => {
            if (this.level >= parseInt(level) && this.avatar.stage < parseInt(level)) {
                this.avatar.stage = parseInt(level);
                this.avatar.emoji = data.emoji;
                this.avatar.title = data.title;
                
                EventBus.emit('avatar-evolved', {
                    player: this,
                    newAvatar: this.avatar
                });
            }
        });
    }
    
    unlockLevelRewards() {
        const levelRewards = {
            5: { type: 'title', item: 'Dedicated Seeker' },
            10: { type: 'theme', item: 'ocean' },
            15: { type: 'badge', item: 'consistency_star' },
            20: { type: 'title', item: 'Wellness Warrior' },
            25: { type: 'theme', item: 'sunset' },
            30: { type: 'badge', item: 'master_badge' },
            40: { type: 'title', item: 'Legend' },
            50: { type: 'theme', item: 'galaxy' },
            60: { type: 'powerup', item: 'double_xp' },
            75: { type: 'badge', item: 'transcendent' },
            100: { type: 'title', item: 'Eternal Guardian' }
        };
        
        const reward = levelRewards[this.level];
        if (reward) {
            this.addToInventory(reward.type, reward.item);
            
            EventBus.emit('reward-unlocked', {
                player: this,
                reward: reward
            });
        }
    }
    
    addToInventory(type, item) {
        const pluralType = type + 's';
        if (this.inventory[pluralType]) {
            if (!this.inventory[pluralType].includes(item)) {
                this.inventory[pluralType].push(item);
            }
        }
    }
    
    // Daily Management
    resetDaily() {
        const today = new Date().toDateString();
        
        // Reset daily XP
        this.dailyXP = 0;
        
        // Update streak
        this.updateStreak(today);
        
        // Reset weekly forgiveness on Sunday
        if (new Date().getDay() === 0) {
            this.stats.streaks.forgiveness = Config.GAME.STREAK_FORGIVENESS_DAYS;
        }
        
        // Update last active date
        this.lastActiveDate = today;
        
        EventBus.emit('daily-reset', { player: this });
    }
    
    updateStreak(today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (this.stats.streaks.lastActiveDate === yesterdayString) {
            // Continue streak
            this.stats.streaks.current++;
            if (this.stats.streaks.current > this.stats.streaks.best) {
                this.stats.streaks.best = this.stats.streaks.current;
            }
        } else if (this.stats.streaks.forgiveness > 0) {
            // Use forgiveness
            this.stats.streaks.forgiveness--;
            EventBus.emit('streak-forgiveness-used', { player: this });
        } else {
            // Break streak
            const previousStreak = this.stats.streaks.current;
            this.stats.streaks.current = 0;
            
            if (previousStreak > 0) {
                EventBus.emit('streak-broken', {
                    player: this,
                    previousStreak
                });
            }
        }
        
        this.stats.streaks.lastActiveDate = today;
    }
    
    // WAHD Management
    updateWAHD(completedHabits) {
        if (completedHabits >= Config.GAME.MIN_HABITS_FOR_WAHD) {
            this.stats.wahd.current = Math.min(7, this.stats.wahd.current + 1);
            
            if (this.stats.wahd.current > this.stats.wahd.best) {
                this.stats.wahd.best = this.stats.wahd.current;
            }
            
            // Update history
            this.stats.wahd.history.push({
                date: new Date().toISOString(),
                value: this.stats.wahd.current
            });
            
            // Keep only last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            this.stats.wahd.history = this.stats.wahd.history.filter(
                entry => new Date(entry.date) > thirtyDaysAgo
            );
            
            // Calculate average
            if (this.stats.wahd.history.length > 0) {
                const sum = this.stats.wahd.history.reduce((acc, entry) => acc + entry.value, 0);
                this.stats.wahd.average = Math.round(sum / this.stats.wahd.history.length * 10) / 10;
            }
            
            EventBus.emit('wahd-updated', {
                player: this,
                wahd: this.stats.wahd
            });
            
            return true;
        }
        
        return false;
    }
    
    // Statistics
    incrementStat(statName, value = 1) {
        // Handle nested stats
        if (statName.includes('.')) {
            const parts = statName.split('.');
            let current = this.stats;
            
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            
            const finalKey = parts[parts.length - 1];
            if (typeof current[finalKey] === 'number') {
                current[finalKey] += value;
            } else {
                current[finalKey] = value;
            }
        } else {
            // Handle direct stats
            if (typeof this.stats[statName] === 'number') {
                this.stats[statName] += value;
            } else {
                this.stats[statName] = value;
            }
        }
    }
    
    getStat(statName) {
        if (statName.includes('.')) {
            const parts = statName.split('.');
            let current = this.stats;
            
            for (const part of parts) {
                if (current[part] === undefined) {
                    return 0;
                }
                current = current[part];
            }
            
            return current;
        }
        
        return this.stats[statName] || 0;
    }
    
    // Achievement Management
    hasAchievement(achievementId) {
        return this.achievements.includes(achievementId);
    }
    
    unlockAchievement(achievementId) {
        if (!this.hasAchievement(achievementId)) {
            this.achievements.push(achievementId);
            
            EventBus.emit('achievement-unlocked', {
                player: this,
                achievementId
            });
            
            return true;
        }
        
        return false;
    }
    
    // Settings Management
    updateSettings(category, setting, value) {
        if (this.settings[category] && this.settings[category][setting] !== undefined) {
            this.settings[category][setting] = value;
            
            EventBus.emit('settings-updated', {
                player: this,
                category,
                setting,
                value
            });
            
            return true;
        }
        
        return false;
    }
    
    getSetting(path) {
        const parts = path.split('.');
        let current = this.settings;
        
        for (const part of parts) {
            if (current[part] === undefined) {
                return null;
            }
            current = current[part];
        }
        
        return current;
    }
    
    // Weight Tracking (Optional, Body-Positive)
    updateWeight(weight) {
        if (!this.stats.weight.trackingEnabled) {
            return false;
        }
        
        this.stats.weight.current = weight;
        this.stats.weight.history.push({
            date: new Date().toISOString(),
            value: weight
        });
        
        // Keep only last 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        this.stats.weight.history = this.stats.weight.history.filter(
            entry => new Date(entry.date) > ninetyDaysAgo
        );
        
        EventBus.emit('weight-updated', {
            player: this,
            weight: weight
        });
        
        return true;
    }
    
    // Habit Logging
    logMeal(mealData) {
        this.incrementStat('totalMealsLogged');
        EventBus.emit('meal-logged', { player: this, meal: mealData });
        return true;
    }
    
    logActivity(activityData) {
        this.incrementStat('totalActivitiesLogged');
        this.incrementStat('totalMinutesActive', activityData.duration || 0);
        EventBus.emit('activity-logged', { player: this, activity: activityData });
        return true;
    }
    
    logSleep(sleepData) {
        this.incrementStat('totalSleepLogged');
        
        // Update average sleep hours
        const totalHours = this.stats.averageSleepHours * (this.stats.totalSleepLogged - 1) + sleepData.hours;
        this.stats.averageSleepHours = totalHours / this.stats.totalSleepLogged;
        
        EventBus.emit('sleep-logged', { player: this, sleep: sleepData });
        return true;
    }
    
    logMood(moodData) {
        this.incrementStat('totalMoodCheckins');
        EventBus.emit('mood-logged', { player: this, mood: moodData });
        return true;
    }
    
    // Export/Import
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt,
            lastActiveDate: this.lastActiveDate,
            level: this.level,
            totalXP: this.totalXP,
            currentXP: this.currentXP,
            dailyXP: this.dailyXP,
            avatar: this.avatar,
            skills: this.skills,
            stats: this.stats,
            achievements: this.achievements,
            settings: this.settings,
            inventory: this.inventory
        };
    }
    
    static fromJSON(data) {
        return new Player(data);
    }
    
    // Validation
    validate() {
        const errors = [];
        
        if (!this.name || this.name.length < 1) {
            errors.push('Player name is required');
        }
        
        if (this.name.length > 50) {
            errors.push('Player name must be less than 50 characters');
        }
        
        if (this.level < 1 || this.level > Config.GAME.MAX_PLAYER_LEVEL) {
            errors.push('Invalid player level');
        }
        
        if (this.totalXP < 0 || this.currentXP < 0 || this.dailyXP < 0) {
            errors.push('XP values cannot be negative');
        }
        
        if (this.dailyXP > Config.GAME.MAX_DAILY_XP) {
            errors.push('Daily XP exceeds maximum');
        }
        
        // Validate skills
        Object.entries(this.skills).forEach(([name, skill]) => {
            if (skill.level < 1 || skill.level > Config.GAME.MAX_SKILL_LEVEL) {
                errors.push(`Invalid ${name} skill level`);
            }
            if (skill.xp < 0 || skill.totalXP < 0) {
                errors.push(`Invalid ${name} skill XP`);
            }
        });
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    // Utility Methods
    getTitle() {
        return this.avatar.title || 'Health Seeker';
    }
    
    getAvatar() {
        return this.avatar.emoji || '🌱';
    }
    
    getTotalStats() {
        return {
            level: this.level,
            totalXP: this.totalXP,
            questsCompleted: this.stats.questsCompleted,
            achievementsUnlocked: this.achievements.length,
            currentStreak: this.stats.streaks.current,
            wahd: this.stats.wahd.current,
            totalActivities: this.stats.totalActivitiesLogged,
            totalMeals: this.stats.totalMealsLogged,
            averageSleep: Math.round(this.stats.averageSleepHours * 10) / 10
        };
    }
    
    getSkillLevels() {
        const levels = {};
        Object.entries(this.skills).forEach(([name, skill]) => {
            levels[name] = skill.level;
        });
        return levels;
    }
    
    getTotalSkillLevel() {
        return Object.values(this.skills).reduce((sum, skill) => sum + skill.level, 0);
    }
    
    isNewPlayer() {
        return this.level === 1 && this.stats.questsCompleted === 0;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Player = Player;
}
