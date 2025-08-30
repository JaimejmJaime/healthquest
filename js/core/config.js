/**
 * HealthQuest Configuration Module
 * Central configuration for all app settings
 */

const Config = {
    // App Version
    VERSION: '2.0.0',
    BUILD_DATE: '2024-01-20',
    
    // Game Mechanics
    GAME: {
        MAX_DAILY_XP: 200,
        XP_PER_LEVEL: 100,
        SKILL_XP_PER_LEVEL: 50,
        MIN_HABITS_FOR_WAHD: 3,
        STREAK_FORGIVENESS_DAYS: 1,
        QUEST_HISTORY_DAYS: 30,
        MAX_PLAYER_LEVEL: 100,
        MAX_SKILL_LEVEL: 50,
        DAILY_QUEST_COUNT: 4,
        XP_MULTIPLIERS: {
            easy: 1.0,
            medium: 1.5,
            hard: 2.0,
            challenge: 2.5
        }
    },
    
    // Storage Keys
    STORAGE: {
        PLAYER_DATA: 'healthquest_player',
        QUEST_HISTORY: 'healthquest_quests',
        ACHIEVEMENTS: 'healthquest_achievements',
        ANALYTICS: 'healthquest_analytics',
        SETTINGS: 'healthquest_settings',
        BACKUP_PREFIX: 'healthquest_backup_',
        MAX_BACKUPS: 3,
        AUTO_SAVE_INTERVAL: 30000, // 30 seconds
        SYNC_INTERVAL: 300000 // 5 minutes
    },
    
    // Feature Flags
    FEATURES: {
        SQUADS: false,
        EVENTS: false,
        CLOUD_SYNC: false,
        WEARABLE_SYNC: false,
        BARCODE_SCANNER: false,
        AI_INSIGHTS: false,
        PREMIUM: false,
        VOICE_COMMANDS: false,
        SOCIAL_SHARING: true,
        ACHIEVEMENTS: true,
        ANALYTICS: true,
        NOTIFICATIONS: true,
        DARK_MODE: true,
        OFFLINE_MODE: true,
        DATA_EXPORT: true,
        ONBOARDING: true,
        WEIGHT_TRACKING: true,
        PHOTOS: false,
        CHARTS: true
    },
    
    // API Configuration (for future backend)
    API: {
        BASE_URL: 'https://api.healthquest.app',
        VERSION: 'v1',
        ENDPOINTS: {
            AUTH: '/auth',
            SYNC: '/sync',
            QUESTS: '/quests',
            ACHIEVEMENTS: '/achievements',
            LEADERBOARD: '/leaderboard',
            SQUADS: '/squads',
            ANALYTICS: '/analytics'
        },
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    },
    
    // UI Configuration
    UI: {
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        MODAL_BACKDROP_OPACITY: 0.8,
        MAX_TOAST_COUNT: 3,
        DEBOUNCE_DELAY: 300,
        CHART_UPDATE_DELAY: 500,
        CELEBRATION_DURATION: 3000,
        TRANSITION_DURATION: 200,
        THEMES: {
            DEFAULT: 'dark',
            AVAILABLE: ['dark', 'light', 'nature', 'ocean']
        }
    },
    
    // Nutrition Configuration
    NUTRITION: {
        DAILY_WATER_GOAL: 8,
        MEAL_TYPES: ['breakfast', 'lunch', 'dinner', 'snack'],
        PORTION_SIZES: ['small', 'medium', 'large'],
        FOOD_FEELINGS: ['energized', 'satisfied', 'neutral', 'sluggish', 'bloated'],
        MACRO_TRACKING: false,
        CALORIE_TRACKING: false,
        PHOTO_MEALS: false
    },
    
    // Movement Configuration
    MOVEMENT: {
        ACTIVITY_TYPES: [
            'walk', 'run', 'bike', 'swim', 'yoga', 
            'strength', 'sports', 'dance', 'hike', 'other'
        ],
        INTENSITY_LEVELS: ['light', 'moderate', 'vigorous'],
        MIN_ACTIVITY_DURATION: 5,
        MAX_ACTIVITY_DURATION: 300,
        STEP_GOAL_DEFAULT: 8000,
        WORKOUT_LIBRARY: false
    },
    
    // Recovery Configuration
    RECOVERY: {
        SLEEP_GOAL_DEFAULT: 8,
        MIN_SLEEP_HOURS: 4,
        MAX_SLEEP_HOURS: 12,
        SLEEP_QUALITY: ['poor', 'fair', 'good', 'excellent'],
        NAP_DURATION_OPTIONS: [10, 15, 20, 30, 45, 60],
        BEDTIME_ROUTINES: [
            'no_screens', 'meditation', 'reading', 'stretching', 
            'journaling', 'bath', 'tea', 'music'
        ]
    },
    
    // Mindfulness Configuration
    MINDFULNESS: {
        MEDITATION_DURATIONS: [3, 5, 10, 15, 20, 30],
        MOOD_OPTIONS: [
            'happy', 'calm', 'energized', 'focused', 'grateful',
            'tired', 'stressed', 'anxious', 'sad', 'frustrated'
        ],
        GRATITUDE_PROMPTS: [
            "What made you smile today?",
            "Who are you grateful for?",
            "What small win did you have today?",
            "What's something beautiful you noticed?",
            "What challenge helped you grow?"
        ],
        BREATHING_PATTERNS: {
            BOX: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
            RELAXING: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
            ENERGIZING: { inhale: 6, hold: 0, exhale: 2, pause: 0 }
        }
    },
    
    // Notification Configuration
    NOTIFICATIONS: {
        ENABLED_BY_DEFAULT: true,
        TIMES: {
            MORNING: '08:00',
            LUNCH: '12:00',
            EVENING: '18:00',
            BEDTIME: '21:00'
        },
        TYPES: {
            DAILY_QUEST: true,
            ACHIEVEMENT: true,
            STREAK_REMINDER: true,
            HYDRATION: true,
            MOVEMENT_BREAK: true,
            BEDTIME: true,
            WEEKLY_REPORT: true
        }
    },
    
    // Analytics Configuration
    ANALYTICS: {
        TRACK_EVENTS: true,
        SESSION_TIMEOUT: 1800000,
        MAX_EVENTS_PER_SESSION: 1000,
        BATCH_SIZE: 50,
        RETENTION_DAYS: 90,
        METRICS: {
            ENGAGEMENT: true,
            HABITS: true,
            PROGRESS: true,
            HEALTH: true
        }
    },
    
    // Safety & Ethics Configuration
    SAFETY: {
        RESTRICTION_WARNING_THRESHOLD: 3,
        MIN_DAILY_CALORIES: 1200,
        MAX_EXERCISE_HOURS_DAILY: 4,
        REQUIRED_REST_DAYS_WEEKLY: 1,
        MENTAL_HEALTH_CHECK_DAYS: 7,
        BODY_POSITIVE_LANGUAGE: true,
        WEIGHT_FOCUS: false,
        APPEARANCE_BASED_GOALS: false
    },
    
    // Development Configuration
    DEV: {
        DEBUG: false,
        LOG_LEVEL: 'info',
        SHOW_FPS: false,
        MOCK_DATA: false,
        SKIP_ONBOARDING: false,
        FAST_ANIMATIONS: false,
        SHOW_ELEMENT_BORDERS: false
    },
    
    // Initialize configuration
    init() {
        // Load environment-specific overrides
        this.loadEnvironmentConfig();
        
        // Validate configuration
        this.validateConfig();
        
        // Apply feature flags
        this.applyFeatureFlags();
        
        console.log(`HealthQuest ${this.VERSION} initialized`);
    },
    
    loadEnvironmentConfig() {
        // Override with environment-specific settings
        if (typeof window !== 'undefined' && window.location) {
            const hostname = window.location.hostname;
            
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                this.DEV.DEBUG = true;
                this.DEV.LOG_LEVEL = 'debug';
            }
            
            // Load from localStorage if exists
            const savedConfig = localStorage.getItem('healthquest_dev_config');
            if (savedConfig) {
                try {
                    const overrides = JSON.parse(savedConfig);
                    Object.assign(this.DEV, overrides);
                } catch (e) {
                    console.warn('Failed to load dev config:', e);
                }
            }
        }
    },
    
    validateConfig() {
        // Ensure critical values are within valid ranges
        if (this.GAME.MAX_DAILY_XP < 50) {
            console.warn('MAX_DAILY_XP too low, setting to minimum of 50');
            this.GAME.MAX_DAILY_XP = 50;
        }
        
        if (this.STORAGE.AUTO_SAVE_INTERVAL < 10000) {
            console.warn('AUTO_SAVE_INTERVAL too frequent, setting to 10 seconds minimum');
            this.STORAGE.AUTO_SAVE_INTERVAL = 10000;
        }
    },
    
    applyFeatureFlags() {
        // Disable dependent features
        if (!this.FEATURES.ANALYTICS) {
            this.ANALYTICS.TRACK_EVENTS = false;
        }
        
        if (!this.FEATURES.NOTIFICATIONS) {
            this.NOTIFICATIONS.ENABLED_BY_DEFAULT = false;
        }
    },
    
    // Utility methods
    isFeatureEnabled(feature) {
        return this.FEATURES[feature] === true;
    },
    
    getStorageKey(key) {
        return this.STORAGE[key] || `healthquest_${key}`;
    },
    
    getAPIEndpoint(endpoint) {
        return `${this.API.BASE_URL}/${this.API.VERSION}${this.API.ENDPOINTS[endpoint]}`;
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    window.Config = Config;
    window.HealthQuestConfig = Config;
    Config.init();
}
