/**
 * EventBus System
 * Handles all inter-component communication
 */

class EventBusSystem {
    constructor() {
        this.events = {};
        this.eventHistory = [];
        this.maxHistorySize = 100;
        this.debug = false;
    }
    
    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {function} callback - Callback function
     * @param {object} context - Optional context for callback
     * @returns {function} Unsubscribe function
     */
    on(event, callback, context = null) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        
        const listener = { callback, context, id: this.generateId() };
        this.events[event].push(listener);
        
        if (this.debug) {
            console.log(`[EventBus] Subscribed to "${event}"`, listener);
        }
        
        // Return unsubscribe function
        return () => this.off(event, listener.id);
    }
    
    /**
     * Subscribe to an event once
     * @param {string} event - Event name
     * @param {function} callback - Callback function
     * @param {object} context - Optional context
     */
    once(event, callback, context = null) {
        const wrapper = (...args) => {
            callback.apply(context, args);
            this.off(event, wrapper);
        };
        
        return this.on(event, wrapper, context);
    }
    
    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {string|function} callbackOrId - Callback function or listener ID
     */
    off(event, callbackOrId) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(listener => {
            if (typeof callbackOrId === 'string') {
                return listener.id !== callbackOrId;
            }
            return listener.callback !== callbackOrId;
        });
        
        if (this.events[event].length === 0) {
            delete this.events[event];
        }
        
        if (this.debug) {
            console.log(`[EventBus] Unsubscribed from "${event}"`);
        }
    }
    
    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {any} data - Event data
     */
    emit(event, data = {}) {
        // Add to history
        this.addToHistory(event, data);
        
        if (this.debug) {
            console.log(`[EventBus] Emitting "${event}"`, data);
        }
        
        if (!this.events[event]) return;
        
        // Create a copy to avoid issues if listeners are removed during emit
        const listeners = [...this.events[event]];
        
        listeners.forEach(listener => {
            try {
                if (listener.context) {
                    listener.callback.call(listener.context, data);
                } else {
                    listener.callback(data);
                }
            } catch (error) {
                console.error(`[EventBus] Error in listener for "${event}":`, error);
            }
        });
    }
    
    /**
     * Emit an event asynchronously
     * @param {string} event - Event name
     * @param {any} data - Event data
     * @returns {Promise}
     */
    async emitAsync(event, data = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.emit(event, data);
                resolve();
            }, 0);
        });
    }
    
    /**
     * Clear all listeners for an event or all events
     * @param {string} event - Optional event name
     */
    clear(event = null) {
        if (event) {
            delete this.events[event];
            if (this.debug) {
                console.log(`[EventBus] Cleared all listeners for "${event}"`);
            }
        } else {
            this.events = {};
            if (this.debug) {
                console.log('[EventBus] Cleared all listeners');
            }
        }
    }
    
    /**
     * Get all listeners for an event
     * @param {string} event - Event name
     * @returns {array} Array of listeners
     */
    getListeners(event) {
        return this.events[event] || [];
    }
    
    /**
     * Check if event has listeners
     * @param {string} event - Event name
     * @returns {boolean}
     */
    hasListeners(event) {
        return this.events[event] && this.events[event].length > 0;
    }
    
    /**
     * Get all registered events
     * @returns {array} Array of event names
     */
    getEvents() {
        return Object.keys(this.events);
    }
    
    /**
     * Add event to history
     * @param {string} event - Event name
     * @param {any} data - Event data
     */
    addToHistory(event, data) {
        this.eventHistory.push({
            event,
            data,
            timestamp: Date.now()
        });
        
        // Limit history size
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }
    
    /**
     * Get event history
     * @param {string} event - Optional event name to filter
     * @returns {array} Event history
     */
    getHistory(event = null) {
        if (event) {
            return this.eventHistory.filter(item => item.event === event);
        }
        return this.eventHistory;
    }
    
    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
    }
    
    /**
     * Generate unique ID for listeners
     * @returns {string} Unique ID
     */
    generateId() {
        return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Enable/disable debug mode
     * @param {boolean} enabled
     */
    setDebug(enabled) {
        this.debug = enabled;
    }
    
    /**
     * Get statistics about event bus usage
     * @returns {object} Statistics
     */
    getStats() {
        const stats = {
            totalEvents: this.getEvents().length,
            totalListeners: 0,
            eventDetails: {},
            historySize: this.eventHistory.length
        };
        
        this.getEvents().forEach(event => {
            const listeners = this.getListeners(event);
            stats.totalListeners += listeners.length;
            stats.eventDetails[event] = listeners.length;
        });
        
        return stats;
    }
}

// Create singleton instance
const EventBus = new EventBusSystem();

// Common game events
const GameEvents = {
    // System Events
    GAME_INITIALIZED: 'game-initialized',
    GAME_SAVED: 'game-saved',
    GAME_LOADED: 'game-loaded',
    
    // Player Events
    PLAYER_CREATED: 'player-created',
    PLAYER_UPDATED: 'player-updated',
    XP_GAINED: 'xp-gained',
    XP_LIMIT_REACHED: 'xp-limit-reached',
    LEVEL_UP: 'level-up',
    SKILL_LEVEL_UP: 'skill-level-up',
    AVATAR_EVOLVED: 'avatar-evolved',
    PERK_UNLOCKED: 'perk-unlocked',
    
    // Quest Events
    QUESTS_GENERATED: 'quests-generated',
    QUEST_COMPLETED: 'quest-completed',
    QUEST_FAILED: 'quest-failed',
    CHALLENGE_GENERATED: 'challenge-generated',
    CHALLENGE_COMPLETED: 'challenge-completed',
    CHALLENGE_PROGRESS: 'challenge-progress',
    
    // Achievement Events
    ACHIEVEMENT_UNLOCKED: 'achievement-unlocked',
    ACHIEVEMENT_PROGRESS: 'achievement-progress',
    
    // Habit Events
    HABIT_LOGGED: 'habit-logged',
    MEAL_LOGGED: 'meal-logged',
    ACTIVITY_LOGGED: 'activity-logged',
    SLEEP_LOGGED: 'sleep-logged',
    MOOD_LOGGED: 'mood-logged',
    WEIGHT_LOGGED: 'weight-logged',
    
    // WAHD Events
    WAHD_UPDATED: 'wahd-updated',
    WAHD_ACHIEVED: 'wahd-achieved',
    
    // Streak Events
    STREAK_UPDATED: 'streak-updated',
    STREAK_BROKEN: 'streak-broken',
    STREAK_FORGIVENESS_USED: 'streak-forgiveness-used',
    
    // Daily/Weekly Events
    DAILY_RESET: 'daily-reset',
    WEEKLY_RESET: 'weekly-reset',
    
    // UI Events
    TAB_SWITCHED: 'tab-switched',
    MODAL_OPENED: 'modal-opened',
    MODAL_CLOSED: 'modal-closed',
    TOAST_SHOWN: 'toast-shown',
    CELEBRATION_SHOWN: 'celebration-shown',
    
    // Settings Events
    SETTINGS_UPDATED: 'settings-updated',
    THEME_CHANGED: 'theme-changed',
    NOTIFICATIONS_TOGGLED: 'notifications-toggled',
    
    // Error Events
    ERROR_OCCURRED: 'error-occurred',
    WARNING_SHOWN: 'warning-shown'
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EventBus = EventBus;
    window.GameEvents = GameEvents;
}
