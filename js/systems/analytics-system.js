/**
 * Analytics System
 * File: js/systems/analytics-system.js
 */

class AnalyticsSystem {
    constructor() {
        this.events = [];
        this.session = null;
        this.metrics = {};
    }
    
    track(event, data = {}) {
        const entry = {
            event,
            data,
            timestamp: Date.now(),
            sessionId: this.session?.id
        };
        
        this.events.push(entry);
        
        // Update metrics
        if (!this.metrics[event]) {
            this.metrics[event] = 0;
        }
        this.metrics[event]++;
        
        // Keep only last 1000 events
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }
    }
    
    startSession() {
        this.session = {
            id: `session_${Date.now()}`,
            start: Date.now(),
            events: []
        };
        this.track('session_start');
    }
    
    pauseSession() {
        if (this.session) {
            this.session.paused = Date.now();
            this.track('session_pause');
        }
    }
    
    resumeSession() {
        if (this.session?.paused) {
            delete this.session.paused;
            this.track('session_resume');
        }
    }
    
    getSessionDuration() {
        if (!this.session) return 0;
        const end = this.session.paused || Date.now();
        return end - this.session.start;
    }
    
    getMetrics() {
        return {
            totalEvents: this.events.length,
            sessionDuration: this.getSessionDuration(),
            eventCounts: this.metrics,
            topEvents: Object.entries(this.metrics)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
        };
    }
    
    toJSON() {
        return {
            events: this.events.slice(-100), // Save only last 100
            session: this.session,
            metrics: this.metrics
        };
    }
    
    static fromJSON(data) {
        const system = new AnalyticsSystem();
        system.events = data.events || [];
        system.session = data.session || null;
        system.metrics = data.metrics || {};
        return system;
    }
}
