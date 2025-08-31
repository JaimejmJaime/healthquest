/**
 * Habit Logging System
 * File: js/systems/habit-logging-system.js
 */

class HabitLoggingSystem {
    constructor() {
        this.logs = [];
        this.todaysLogs = [];
        this.validators = this.initializeValidators();
        this.templates = this.initializeTemplates();
    }
    
    initializeValidators() {
        return {
            nutrition: {
                mealType: (value) => ['breakfast', 'lunch', 'dinner', 'snack'].includes(value.toLowerCase()),
                portions: (value) => value >= 0.5 && value <= 3,
                waterGlasses: (value) => value >= 0 && value <= 20,
                quality: (value) => ['home-cooked', 'restaurant', 'fast-food', 'meal-prep'].includes(value)
            },
            movement: {
                duration: (value) => value >= 5 && value <= 300,
                intensity: (value) => ['light', 'moderate', 'vigorous'].includes(value),
                heartRate: (value) => value >= 40 && value <= 220,
                steps: (value) => value >= 0 && value <= 100000
            },
            recovery: {
                sleepHours: (value) => value >= 3 && value <= 14,
                quality: (value) => ['poor', 'fair', 'good', 'excellent'].includes(value),
                napDuration: (value) => value >= 5 && value <= 120,
                stressLevel: (value) => value >= 1 && value <= 10
            },
            mindfulness: {
                duration: (value) => value >= 1 && value <= 120,
                mood: (value) => value >= 1 && value <= 10,
                gratitudeCount: (value) => value >= 1 && value <= 10,
                focusLevel: (value) => value >= 1 && value <= 10
            }
        };
    }
    
    initializeTemplates() {
        return {
            nutrition: {
                fields: [
                    { id: 'mealType', label: 'Meal Type', type: 'select', required: true,
                      options: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
                    { id: 'description', label: 'What did you eat?', type: 'text', required: false,
                      placeholder: 'e.g., Grilled chicken salad with quinoa' },
                    { id: 'portions', label: 'Portion Size', type: 'slider', required: true,
                      min: 0.5, max: 3, step: 0.5, default: 1,
                      labels: { 0.5: 'Small', 1: 'Normal', 1.5: 'Large', 2: 'Extra', 3: 'Huge' } },
                    { id: 'quality', label: 'Meal Quality', type: 'select', required: true,
                      options: ['Home-cooked', 'Restaurant', 'Fast-food', 'Meal-prep'] },
                    { id: 'vegetables', label: 'Vegetable Servings', type: 'number', required: false,
                      min: 0, max: 10, default: 0 },
                    { id: 'water', label: 'Water Glasses', type: 'counter', required: false,
                      min: 0, max: 20, default: 0 },
                    { id: 'feeling', label: 'How do you feel?', type: 'emoji-select', required: true,
                      options: [
                          { value: 'energized', emoji: '⚡', label: 'Energized' },
                          { value: 'satisfied', emoji: '😊', label: 'Satisfied' },
                          { value: 'neutral', emoji: '😐', label: 'Neutral' },
                          { value: 'sluggish', emoji: '😴', label: 'Sluggish' },
                          { value: 'bloated', emoji: '🤢', label: 'Bloated' }
                      ]},
                    { id: 'mindful', label: 'Ate mindfully (no distractions)', type: 'checkbox' },
                    { id: 'photo', label: 'Add Photo', type: 'photo', required: false }
                ],
                xpReward: 10,
                category: 'nutrition'
            },
            
            movement: {
                fields: [
                    { id: 'activityType', label: 'Activity', type: 'icon-select', required: true,
                      options: [
                          { value: 'walk', icon: '🚶', label: 'Walk' },
                          { value: 'run', icon: '🏃', label: 'Run' },
                          { value: 'bike', icon: '🚴', label: 'Bike' },
                          { value: 'swim', icon: '🏊', label: 'Swim' },
                          { value: 'yoga', icon: '🧘', label: 'Yoga' },
                          { value: 'strength', icon: '💪', label: 'Strength' },
                          { value: 'sports', icon: '⚽', label: 'Sports' },
                          { value: 'dance', icon: '💃', label: 'Dance' },
                          { value: 'other', icon: '🏋️', label: 'Other' }
                      ]},
                    { id: 'duration', label: 'Duration (minutes)', type: 'duration-picker', required: true,
                      min: 5, max: 300, default: 30, quickOptions: [15, 30, 45, 60, 90] },
                    { id: 'intensity', label: 'Intensity', type: 'intensity-select', required: true,
                      options: [
                          { value: 'light', color: '#10b981', label: 'Light', description: 'Easy conversation' },
                          { value: 'moderate', color: '#fbbf24', label: 'Moderate', description: 'Can talk but breathless' },
                          { value: 'vigorous', color: '#ef4444', label: 'Vigorous', description: 'Hard to talk' }
                      ]},
                    { id: 'heartRate', label: 'Average Heart Rate', type: 'number', required: false,
                      min: 40, max: 220, placeholder: 'Optional' },
                    { id: 'steps', label: 'Steps (if applicable)', type: 'number', required: false,
                      min: 0, max: 100000 },
                    { id: 'location', label: 'Location', type: 'radio', required: false,
                      options: ['Indoor', 'Outdoor', 'Gym', 'Home'] },
                    { id: 'withOthers', label: 'Exercised with others', type: 'checkbox' },
                    { id: 'enjoyment', label: 'Enjoyment Level', type: 'star-rating', required: true,
                      max: 5, default: 3 },
                    { id: 'notes', label: 'Notes', type: 'textarea', required: false,
                      placeholder: 'Any PR? How did it feel?' }
                ],
                xpReward: 15,
                category: 'movement'
            },
            
            recovery: {
                fields: [
                    { id: 'type', label: 'Recovery Type', type: 'tab-select', required: true,
                      options: ['Sleep', 'Nap', 'Rest Day', 'Stretching', 'Massage'] },
                    // Sleep specific fields
                    { id: 'bedtime', label: 'Bedtime', type: 'time', required: true, showIf: 'type:Sleep' },
                    { id: 'wakeTime', label: 'Wake Time', type: 'time', required: true, showIf: 'type:Sleep' },
                    { id: 'sleepHours', label: 'Total Hours', type: 'number', required: true, showIf: 'type:Sleep',
                      min: 3, max: 14, step: 0.5, autoCalculate: true },
                    { id: 'quality', label: 'Sleep Quality', type: 'quality-select', required: true, showIf: 'type:Sleep',
                      options: [
                          { value: 'poor', emoji: '😫', color: '#ef4444' },
                          { value: 'fair', emoji: '😔', color: '#fbbf24' },
                          { value: 'good', emoji: '😊', color: '#10b981' },
                          { value: 'excellent', emoji: '😴', color: '#4ade80' }
                      ]},
                    { id: 'dreams', label: 'Remember dreams?', type: 'checkbox', showIf: 'type:Sleep' },
                    // Nap specific
                    { id: 'napDuration', label: 'Nap Duration (min)', type: 'select', showIf: 'type:Nap',
                      options: [10, 15, 20, 30, 45, 60, 90] },
                    // General recovery
                    { id: 'stressLevel', label: 'Current Stress Level', type: 'slider', required: true,
                      min: 1, max: 10, default: 5,
                      gradient: ['#10b981', '#fbbf24', '#ef4444'] },
                    { id: 'bodyFeeling', label: 'Body Feeling', type: 'body-map', required: false,
                      areas: ['Head', 'Neck', 'Shoulders', 'Back', 'Legs'] },
                    { id: 'routine', label: 'Bedtime Routine', type: 'multi-select', showIf: 'type:Sleep',
                      options: ['No screens', 'Reading', 'Meditation', 'Stretching', 'Tea', 'Bath'] }
                ],
                xpReward: 10,
                category: 'recovery'
            },
            
            mindfulness: {
                fields: [
                    { id: 'practice', label: 'Practice Type', type: 'card-select', required: true,
                      options: [
                          { value: 'meditation', icon: '🧘', title: 'Meditation', description: 'Formal sitting practice' },
                          { value: 'breathing', icon: '💨', title: 'Breathing', description: 'Focused breath work' },
                          { value: 'gratitude', icon: '🙏', title: 'Gratitude', description: 'Gratitude practice' },
                          { value: 'journaling', icon: '📝', title: 'Journaling', description: 'Reflective writing' },
                          { value: 'bodyscan', icon: '👤', title: 'Body Scan', description: 'Progressive relaxation' },
                          { value: 'walking', icon: '🚶', title: 'Mindful Walk', description: 'Walking meditation' }
                      ]},
                    { id: 'duration', label: 'Duration (minutes)', type: 'duration-wheel', required: true,
                      min: 1, max: 120, default: 10, presets: [3, 5, 10, 15, 20, 30] },
                    { id: 'mood', label: 'Current Mood', type: 'mood-grid', required: true,
                      axes: { x: 'Energy', y: 'Pleasantness' },
                      quadrants: [
                          { value: 'excited', emoji: '🤗', x: 1, y: 1 },
                          { value: 'happy', emoji: '😊', x: 0.5, y: 1 },
                          { value: 'calm', emoji: '😌', x: -0.5, y: 0.5 },
                          { value: 'tired', emoji: '😴', x: -1, y: 0 },
                          { value: 'stressed', emoji: '😰', x: 1, y: -1 },
                          { value: 'sad', emoji: '😢', x: -0.5, y: -1 }
                      ]},
                    { id: 'gratitude', label: 'Gratitude List', type: 'list-input', showIf: 'practice:gratitude',
                      min: 1, max: 10, placeholder: 'What are you grateful for?' },
                    { id: 'insights', label: 'Insights or Observations', type: 'textarea', required: false,
                      placeholder: 'What did you notice?' },
                    { id: 'focusLevel', label: 'Focus Level', type: 'progress-bar', required: true,
                      min: 1, max: 10, default: 5 },
                    { id: 'environment', label: 'Environment', type: 'pills', required: false,
                      options: ['Quiet', 'Nature', 'Music', 'Guided', 'Group'] },
                    { id: 'intention', label: "Today's Intention", type: 'text', required: false,
                      placeholder: 'Set an intention for today' }
                ],
                xpReward: 12,
                category: 'mindfulness'
            },
            
            weight: {
                fields: [
                    { id: 'weight', label: 'Current Weight', type: 'number', required: true,
                      min: 50, max: 500, step: 0.1 },
                    { id: 'unit', label: 'Unit', type: 'toggle', required: true,
                      options: ['lbs', 'kg'], default: 'lbs' },
                    { id: 'time', label: 'Time of Day', type: 'select', required: true,
                      options: ['Morning', 'Afternoon', 'Evening'] },
                    { id: 'conditions', label: 'Conditions', type: 'checkbox-group', required: false,
                      options: ['Before eating', 'After bathroom', 'Same clothes'] },
                    { id: 'bodyFeel', label: 'How does your body feel?', type: 'emoji-scale', required: false,
                      scale: ['😔', '😐', '😊', '💪', '🌟'] },
                    { id: 'measurements', label: 'Body Measurements', type: 'measurements', required: false,
                      fields: ['Chest', 'Waist', 'Hips', 'Arms', 'Thighs'] },
                    { id: 'progressPhoto', label: 'Progress Photo', type: 'photo', required: false },
                    { id: 'notes', label: 'Notes', type: 'textarea', required: false,
                      placeholder: 'Any observations about your journey?' }
                ],
                xpReward: 5,
                category: 'tracking',
                bodyPositiveMessage: true
            }
        };
    }
    
    async logHabit(type, data) {
        try {
            // Validate the data
            const validation = this.validateLog(type, data);
            if (!validation.valid) {
                return { success: false, errors: validation.errors };
            }
            
            // Create log entry
            const log = {
                id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type,
                data: this.processData(type, data),
                timestamp: Date.now(),
                date: new Date().toDateString(),
                xpAwarded: this.templates[type].xpReward,
                category: this.templates[type].category
            };
            
            // Add to logs
            this.logs.push(log);
            this.todaysLogs.push(log);
            
            // Award XP
            const xpResult = await this.awardXP(log);
            
            // Check for patterns and achievements
            const patterns = this.analyzePatterns(type);
            const achievements = this.checkAchievements(type, log);
            
            // Save to storage
            this.saveToStorage();
            
            // Emit events
            EventBus.emit('habit-logged', {
                type,
                log,
                xpAwarded: xpResult.xpGained,
                patterns,
                achievements
            });
            
            return {
                success: true,
                log,
                xp: xpResult,
                patterns,
                achievements,
                message: this.getSuccessMessage(type, data)
            };
            
        } catch (error) {
            console.error('Error logging habit:', error);
            return { success: false, error: error.message };
        }
    }
    
    validateLog(type, data) {
        const template = this.templates[type];
        const validators = this.validators[type];
        const errors = [];
        
        if (!template) {
            errors.push(`Invalid log type: ${type}`);
            return { valid: false, errors };
        }
        
        // Check required fields
        template.fields.forEach(field => {
            if (field.required && !data[field.id]) {
                errors.push(`${field.label} is required`);
            }
            
            // Run validators if value exists
            if (data[field.id] && validators[field.id]) {
                if (!validators[field.id](data[field.id])) {
                    errors.push(`Invalid value for ${field.label}`);
                }
            }
        });
        
        return { valid: errors.length === 0, errors };
    }
    
    processData(type, data) {
        const processed = { ...data };
        
        // Type-specific processing
        switch(type) {
            case 'nutrition':
                processed.calories = this.estimateCalories(data);
                processed.nutritionScore = this.calculateNutritionScore(data);
                break;
                
            case 'movement':
                processed.caloriesBurned = this.estimateCaloriesBurned(data);
                processed.metValue = this.getMETValue(data.activityType, data.intensity);
                break;
                
            case 'recovery':
                if (data.type === 'Sleep' && data.bedtime && data.wakeTime) {
                    processed.sleepHours = this.calculateSleepHours(data.bedtime, data.wakeTime);
                    processed.sleepScore = this.calculateSleepScore(processed.sleepHours, data.quality);
                }
                break;
                
            case 'mindfulness':
                processed.mindfulnessMinutes = data.duration;
                processed.weeklyTotal = this.getWeeklyMindfulnessTotal() + data.duration;
                break;
        }
        
        return processed;
    }
    
    estimateCalories(data) {
        // Basic calorie estimation based on meal type and portion
        const baseCalories = {
            breakfast: 400,
            lunch: 600,
            dinner: 700,
            snack: 200
        };
        
        const base = baseCalories[data.mealType.toLowerCase()] || 500;
        return Math.round(base * (data.portions || 1));
    }
    
    calculateNutritionScore(data) {
        let score = 50; // Base score
        
        if (data.quality === 'home-cooked') score += 20;
        if (data.vegetables >= 2) score += 15;
        if (data.water >= 2) score += 10;
        if (data.mindful) score += 10;
        if (data.feeling === 'energized') score += 10;
        if (data.feeling === 'bloated') score -= 15;
        
        return Math.min(100, Math.max(0, score));
    }
    
    estimateCaloriesBurned(data) {
        const metValues = {
            walk: { light: 2.5, moderate: 3.5, vigorous: 5 },
            run: { light: 6, moderate: 9.8, vigorous: 12.3 },
            bike: { light: 4, moderate: 6.8, vigorous: 10 },
            swim: { light: 6, moderate: 8.3, vigorous: 10 },
            yoga: { light: 2.5, moderate: 3, vigorous: 4 },
            strength: { light: 3, moderate: 5, vigorous: 8 }
        };
        
        const activity = metValues[data.activityType] || metValues.walk;
        const met = activity[data.intensity] || activity.moderate;
        const weight = 70; // Default weight in kg
        
        return Math.round((met * weight * data.duration) / 60);
    }
    
    getMETValue(activity, intensity) {
        const metTable = {
            walk: { light: 2.5, moderate: 3.5, vigorous: 5 },
            run: { light: 6, moderate: 9.8, vigorous: 12.3 }
            // Add more activities
        };
        
        return metTable[activity]?.[intensity] || 3.5;
    }
    
    calculateSleepHours(bedtime, wakeTime) {
        const bed = new Date(`2024-01-01 ${bedtime}`);
        let wake = new Date(`2024-01-01 ${wakeTime}`);
        
        // Handle next day wake time
        if (wake < bed) {
            wake = new Date(`2024-01-02 ${wakeTime}`);
        }
        
        const diff = wake - bed;
        return Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
    }
    
    calculateSleepScore(hours, quality) {
        let score = 50;
        
        // Optimal sleep is 7-9 hours
        if (hours >= 7 && hours <= 9) score += 30;
        else if (hours >= 6 && hours < 7) score += 15;
        else if (hours > 9 && hours <= 10) score += 15;
        
        // Quality adjustment
        const qualityScores = { poor: -20, fair: 0, good: 15, excellent: 30 };
        score += qualityScores[quality] || 0;
        
        return Math.min(100, Math.max(0, score));
    }
    
    getWeeklyMindfulnessTotal() {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return this.logs
            .filter(log => log.type === 'mindfulness' && log.timestamp > weekAgo)
            .reduce((total, log) => total + (log.data.duration || 0), 0);
    }
    
    async awardXP(log) {
        const player = window.Game?.player;
        if (!player) return { success: false };
        
        return player.addXP(log.xpAwarded, log.category);
    }
    
    analyzePatterns(type) {
        const patterns = [];
        const recentLogs = this.getRecentLogs(type, 7);
        
        if (recentLogs.length >= 3) {
            // Check for consistency
            const daysLogged = new Set(recentLogs.map(l => l.date)).size;
            if (daysLogged >= 5) {
                patterns.push({
                    type: 'consistency',
                    message: `Great consistency! ${daysLogged} days this week!`,
                    positive: true
                });
            }
            
            // Type-specific patterns
            if (type === 'nutrition') {
                const avgWater = this.getAverageField(recentLogs, 'water');
                if (avgWater >= 6) {
                    patterns.push({
                        type: 'hydration',
                        message: 'Excellent hydration habits!',
                        positive: true
                    });
                }
            }
            
            if (type === 'movement') {
                const totalMinutes = recentLogs.reduce((sum, log) => sum + (log.data.duration || 0), 0);
                if (totalMinutes >= 150) {
                    patterns.push({
                        type: 'active',
                        message: `${totalMinutes} minutes this week! WHO guidelines achieved!`,
                        positive: true
                    });
                }
            }
        }
        
        return patterns;
    }
    
    checkAchievements(type, log) {
        const achievements = [];
        
        // First log of type
        const typeCount = this.logs.filter(l => l.type === type).length;
        if (typeCount === 1) {
            achievements.push(`first_${type}_log`);
        }
        
        // Milestone counts
        const milestones = [10, 25, 50, 100, 250, 500, 1000];
        if (milestones.includes(typeCount)) {
            achievements.push(`${type}_${typeCount}`);
        }
        
        // Type-specific achievements
        if (type === 'movement' && log.data.duration >= 60) {
            achievements.push('hour_workout');
        }
        
        if (type === 'mindfulness' && log.data.duration >= 30) {
            achievements.push('meditation_master');
        }
        
        return achievements;
    }
    
    getSuccessMessage(type, data) {
        const messages = {
            nutrition: [
                "Great job logging your meal! 🍽️",
                "Nutrition tracked! Keep fueling your body well! 💪",
                "Meal logged! You're building awareness! 🌟"
            ],
            movement: [
                `Awesome ${data.duration}-minute workout! 🏃`,
                "Movement logged! Your body thanks you! 💪",
                "Activity tracked! Keep moving forward! 🚀"
            ],
            recovery: [
                "Recovery logged! Rest is part of progress! 😴",
                "Great job prioritizing recovery! 🌙",
                "Rest tracked! Your body is rebuilding! 💚"
            ],
            mindfulness: [
                "Mindfulness practice complete! 🧘",
                "Mental wellness logged! Inner peace achieved! ☮️",
                "Meditation tracked! Your mind is grateful! 🙏"
            ],
            weight: [
                "Progress tracked! Remember, you're more than a number! 💖",
                "Data logged! Focus on how you feel! 🌟",
                "Tracking complete! Every step counts! 👣"
            ]
        };
        
        const typeMessages = messages[type] || ["Habit logged successfully! ✅"];
        return typeMessages[Math.floor(Math.random() * typeMessages.length)];
    }
    
    getRecentLogs(type, days = 7) {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        return this.logs.filter(log => 
            log.type === type && log.timestamp > cutoff
        );
    }
    
    getAverageField(logs, field) {
        const values = logs.map(l => l.data[field] || 0).filter(v => v > 0);
        if (values.length === 0) return 0;
        return values.reduce((sum, v) => sum + v, 0) / values.length;
    }
    
    getTodaysLogs() {
        const today = new Date().toDateString();
        return this.logs.filter(log => log.date === today);
    }
    
    getLogsByDateRange(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return this.logs.filter(log => 
            log.timestamp >= start && log.timestamp <= end
        );
    }
    
    getStats(type, period = 'week') {
        const logs = period === 'week' ? 
            this.getRecentLogs(type, 7) : 
            this.getRecentLogs(type, 30);
        
        if (logs.length === 0) {
            return { count: 0, message: 'No logs yet' };
        }
        
        const stats = {
            count: logs.length,
            streak: this.calculateStreak(type),
            average: {}
        };
        
        // Calculate type-specific averages
        switch(type) {
            case 'nutrition':
                stats.average.water = this.getAverageField(logs, 'water');
                stats.average.vegetables = this.getAverageField(logs, 'vegetables');
                break;
            case 'movement':
                stats.average.duration = this.getAverageField(logs, 'duration');
                stats.totalMinutes = logs.reduce((sum, l) => sum + (l.data.duration || 0), 0);
                break;
            case 'recovery':
                stats.average.sleepHours = this.getAverageField(logs, 'sleepHours');
                break;
            case 'mindfulness':
                stats.totalMinutes = logs.reduce((sum, l) => sum + (l.data.duration || 0), 0);
                break;
        }
        
        return stats;
    }
    
    calculateStreak(type) {
        const sorted = this.logs
            .filter(l => l.type === type)
            .sort((a, b) => b.timestamp - a.timestamp);
        
        if (sorted.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date().toDateString();
        
        for (const log of sorted) {
            if (log.date === currentDate) {
                streak++;
                const prevDate = new Date(currentDate);
                prevDate.setDate(prevDate.getDate() - 1);
                currentDate = prevDate.toDateString();
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    saveToStorage() {
        if (window.Storage) {
            Storage.set('habit_logs', {
                logs: this.logs.slice(-1000), // Keep last 1000 logs
                lastSaved: Date.now()
            });
        }
    }
    
    loadFromStorage() {
        if (window.Storage) {
            const saved = Storage.get('habit_logs');
            if (saved && saved.logs) {
                this.logs = saved.logs;
                this.todaysLogs = this.getTodaysLogs();
            }
        }
    }
    
    toJSON() {
        return {
            logs: this.logs,
            todaysLogs: this.todaysLogs
        };
    }
    
    static fromJSON(data) {
        const system = new HabitLoggingSystem();
        system.logs = data.logs || [];
        system.todaysLogs = data.todaysLogs || [];
        return system;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.HabitLoggingSystem = HabitLoggingSystem;
}
