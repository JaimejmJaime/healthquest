/**
 * Model Stubs
 * Temporary implementations for missing model files
 */

// Quest Model
class Quest {
    constructor(data = {}) {
        this.id = data.id || `quest_${Date.now()}`;
        this.title = data.title || 'Quest';
        this.description = data.description || '';
        this.xp = data.xp || 20;
        this.category = data.category || 'general';
        this.difficulty = data.difficulty || 'easy';
        this.completed = data.completed || false;
    }
}

// Achievement Model
class Achievement {
    constructor(data = {}) {
        this.id = data.id || `achievement_${Date.now()}`;
        this.name = data.name || 'Achievement';
        this.description = data.description || '';
        this.icon = data.icon || '🏆';
        this.xp = data.xp || 50;
        this.unlocked = data.unlocked || false;
    }
}

// Habit Model
class Habit {
    constructor(data = {}) {
        this.id = data.id || `habit_${Date.now()}`;
        this.name = data.name || 'Habit';
        this.category = data.category || 'general';
        this.frequency = data.frequency || 'daily';
        this.completed = data.completed || false;
    }
}

// Meal Model
class Meal {
    constructor(data = {}) {
        this.id = data.id || `meal_${Date.now()}`;
        this.name = data.name || '';
        this.type = data.type || 'meal';
        this.feeling = data.feeling || 'neutral';
        this.portion = data.portion || 'medium';
        this.timestamp = data.timestamp || Date.now();
    }
}

// Activity Model
class Activity {
    constructor(data = {}) {
        this.id = data.id || `activity_${Date.now()}`;
        this.type = data.type || 'walk';
        this.duration = data.duration || 0;
        this.intensity = data.intensity || 'moderate';
        this.timestamp = data.timestamp || Date.now();
    }
}

// Sleep Model
class Sleep {
    constructor(data = {}) {
        this.id = data.id || `sleep_${Date.now()}`;
        this.hours = data.hours || 8;
        this.quality = data.quality || 'good';
        this.bedtime = data.bedtime || '';
        this.waketime = data.waketime || '';
        this.timestamp = data.timestamp || Date.now();
    }
}

// Mood Model
class Mood {
    constructor(data = {}) {
        this.id = data.id || `mood_${Date.now()}`;
        this.feeling = data.feeling || 'neutral';
        this.energy = data.energy || 5;
        this.stress = data.stress || 5;
        this.notes = data.notes || '';
        this.timestamp = data.timestamp || Date.now();
    }
}

// Export all models
if (typeof window !== 'undefined') {
    window.Quest = Quest;
    window.Achievement = Achievement;
    window.Habit = Habit;
    window.Meal = Meal;
    window.Activity = Activity;
    window.Sleep = Sleep;
    window.Mood = Mood;
}
