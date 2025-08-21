/**
 * Game Constants
 * Static values used throughout the application
 */

const Constants = {
    // Avatar Stages
    AVATAR_STAGES: {
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
    },
    
    // Quest Categories
    QUEST_CATEGORIES: ['nutrition', 'movement', 'recovery', 'mindfulness'],
    
    // Difficulty Levels
    DIFFICULTY: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard'
    },
    
    // XP Values
    XP_VALUES: {
        EASY_MIN: 15,
        EASY_MAX: 25,
        MEDIUM_MIN: 25,
        MEDIUM_MAX: 35,
        HARD_MIN: 35,
        HARD_MAX: 45
    },
    
    // Activity Types
    ACTIVITY_TYPES: [
        'walk', 'run', 'bike', 'swim', 'yoga',
        'strength', 'sports', 'dance', 'hike', 'other'
    ],
    
    // Meal Types
    MEAL_TYPES: ['breakfast', 'lunch', 'dinner', 'snack'],
    
    // Sleep Quality
    SLEEP_QUALITY: ['poor', 'fair', 'good', 'excellent'],
    
    // Mood Options
    MOOD_OPTIONS: [
        'happy', 'calm', 'energized', 'focused', 'grateful',
        'tired', 'stressed', 'anxious', 'sad', 'frustrated'
    ],
    
    // Food Feelings
    FOOD_FEELINGS: ['energized', 'satisfied', 'neutral', 'sluggish', 'bloated'],
    
    // Intensity Levels
    INTENSITY_LEVELS: ['light', 'moderate', 'vigorous']
};

// Export
if (typeof window !== 'undefined') {
    window.Constants = Constants;
}
