/**
 * Notification System
 * File: js/systems/notification-system.js
 */

class NotificationSystem {
    constructor() {
        this.enabled = false;
        this.permission = 'default';
        this.scheduled = [];
        this.settings = {
            daily: true,
            achievements: true,
            streaks: true,
            hydration: false,
            movement: false
        };
    }
    
    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
            if (this.permission === 'default') {
                this.permission = await Notification.requestPermission();
            }
            this.enabled = this.permission === 'granted';
        }
    }
    
    updateSettings(setting, value) {
        if (this.settings.hasOwnProperty(setting)) {
            this.settings[setting] = value;
        }
    }
    
    scheduleNotification(type, time, message) {
        if (!this.enabled) return false;
        
        const notification = {
            type,
            time,
            message,
            id: `notif_${Date.now()}`
        };
        
        this.scheduled.push(notification);
        
        // Set timeout for notification
        const delay = time - Date.now();
        if (delay > 0) {
            setTimeout(() => this.showNotification(message), delay);
        }
        
        return notification.id;
    }
    
    showNotification(message, options = {}) {
        if (!this.enabled) return;
        
        const notification = new Notification('HealthQuest', {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="24" font-size="24">🌱</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="24" font-size="24">🌱</text></svg>',
            ...options
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
    
    toJSON() {
        return {
            enabled: this.enabled,
            permission: this.permission,
            settings: this.settings,
            scheduled: this.scheduled
        };
    }
    
    static fromJSON(data) {
        const system = new NotificationSystem();
        system.enabled = data.enabled || false;
        system.permission = data.permission || 'default';
        system.settings = data.settings || system.settings;
        system.scheduled = data.scheduled || [];
        return system;
    }
}
