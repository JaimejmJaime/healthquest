/**
 * Storage System
 * Handles all data persistence with fallback options
 */

class StorageSystem {
    constructor() {
        this.type = this.detectStorageType();
        this.prefix = 'healthquest_';
        this.cache = new Map();
        this.initialized = false;
    }
    
    /**
     * Initialize storage system
     */
    async init() {
        try {
            // Test storage availability
            const testKey = this.prefix + 'test';
            await this.setRaw(testKey, 'test');
            await this.removeRaw(testKey);
            
            // Load cache for frequently accessed data
            await this.loadCache();
            
            this.initialized = true;
            console.log(`Storage initialized: ${this.type}`);
            
            return true;
        } catch (error) {
            console.error('Storage initialization failed:', error);
            this.type = 'memory';
            this.initialized = true;
            return false;
        }
    }
    
    /**
     * Detect available storage type
     */
    detectStorageType() {
        // Check localStorage
        if (this.isLocalStorageAvailable()) {
            return 'localStorage';
        }
        
        // Check sessionStorage
        if (this.isSessionStorageAvailable()) {
            return 'sessionStorage';
        }
        
        // Fallback to memory
        return 'memory';
    }
    
    /**
     * Check if localStorage is available
     */
    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            window.localStorage.setItem(test, test);
            window.localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Check if sessionStorage is available
     */
    isSessionStorageAvailable() {
        try {
            const test = '__storage_test__';
            window.sessionStorage.setItem(test, test);
            window.sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Get item from storage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if not found
     * @returns {any} Stored value or default
     */
    get(key, defaultValue = null) {
        const fullKey = this.prefix + key;
        
        // Check cache first
        if (this.cache.has(fullKey)) {
            return this.cache.get(fullKey);
        }
        
        try {
            const raw = this.getRaw(fullKey);
            if (raw === null) {
                return defaultValue;
            }
            
            const parsed = JSON.parse(raw);
            
            // Check expiration
            if (parsed.expires && parsed.expires < Date.now()) {
                this.remove(key);
                return defaultValue;
            }
            
            const value = parsed.data !== undefined ? parsed.data : parsed;
            
            // Update cache
            this.cache.set(fullKey, value);
            
            return value;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return defaultValue;
        }
    }
    
    /**
     * Set item in storage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @param {number} ttl - Time to live in milliseconds (optional)
     * @returns {boolean} Success status
     */
    set(key, value, ttl = null) {
        const fullKey = this.prefix + key;
        
        try {
            const data = {
                data: value,
                timestamp: Date.now()
            };
            
            if (ttl) {
                data.expires = Date.now() + ttl;
            }
            
            const serialized = JSON.stringify(data);
            
            // Check storage quota
            if (this.type === 'localStorage' && !this.checkQuota(serialized.length)) {
                this.cleanup();
            }
            
            this.setRaw(fullKey, serialized);
            
            // Update cache
            this.cache.set(fullKey, value);
            
            return true;
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
            
            // Try to clear some space and retry
            if (error.name === 'QuotaExceededError') {
                this.cleanup();
                try {
                    this.setRaw(fullKey, JSON.stringify({ data: value, timestamp: Date.now() }));
                    this.cache.set(fullKey, value);
                    return true;
                } catch (retryError) {
                    console.error('Retry failed:', retryError);
                }
            }
            
            return false;
        }
    }
    
    /**
     * Remove item from storage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        const fullKey = this.prefix + key;
        
        try {
            this.removeRaw(fullKey);
            this.cache.delete(fullKey);
            return true;
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            return false;
        }
    }
    
    /**
     * Clear all storage
     * @param {boolean} preserveSettings - Whether to preserve settings
     */
    clear(preserveSettings = false) {
        try {
            const settings = preserveSettings ? this.get('settings') : null;
            
            if (this.type === 'localStorage') {
                // Clear only our keys
                const keys = Object.keys(window.localStorage);
                keys.forEach(key => {
                    if (key.startsWith(this.prefix)) {
                        window.localStorage.removeItem(key);
                    }
                });
            } else if (this.type === 'sessionStorage') {
                const keys = Object.keys(window.sessionStorage);
                keys.forEach(key => {
                    if (key.startsWith(this.prefix)) {
                        window.sessionStorage.removeItem(key);
                    }
                });
            }
            
            this.cache.clear();
            
            if (preserveSettings && settings) {
                this.set('settings', settings);
            }
            
            console.log('Storage cleared');
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
    
    /**
     * Get all keys
     * @returns {array} Array of keys (without prefix)
     */
    keys() {
        const keys = [];
        
        if (this.type === 'localStorage') {
            Object.keys(window.localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    keys.push(key.substring(this.prefix.length));
                }
            });
        } else if (this.type === 'sessionStorage') {
            Object.keys(window.sessionStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    keys.push(key.substring(this.prefix.length));
                }
            });
        } else {
            this.cache.forEach((value, key) => {
                keys.push(key.substring(this.prefix.length));
            });
        }
        
        return keys;
    }
    
    /**
     * Get storage size
     * @returns {object} Size information
     */
    getSize() {
        let totalSize = 0;
        let itemCount = 0;
        
        const keys = this.keys();
        keys.forEach(key => {
            const value = this.get(key);
            if (value !== null) {
                totalSize += JSON.stringify(value).length;
                itemCount++;
            }
        });
        
        return {
            bytes: totalSize,
            kilobytes: Math.round(totalSize / 1024),
            megabytes: Math.round(totalSize / (1024 * 1024) * 100) / 100,
            items: itemCount,
            keys: keys
        };
    }
    
    /**
     * Check available quota
     * @param {number} bytesNeeded - Bytes needed for new data
     * @returns {boolean} Whether there's enough space
     */
    checkQuota(bytesNeeded = 0) {
        if (this.type !== 'localStorage') return true;
        
        try {
            // Estimate available space (rough estimate)
            const used = new Blob(Object.values(window.localStorage)).size;
            const estimatedMax = 5 * 1024 * 1024; // 5MB estimate
            
            return (used + bytesNeeded) < estimatedMax;
        } catch (error) {
            return true; // Assume we have space if we can't check
        }
    }
    
    /**
     * Clean up old or expired data
     */
    cleanup() {
        console.log('Running storage cleanup...');
        
        const now = Date.now();
        const keys = this.keys();
        let removed = 0;
        
        keys.forEach(key => {
            try {
                const fullKey = this.prefix + key;
                const raw = this.getRaw(fullKey);
                
                if (raw) {
                    const parsed = JSON.parse(raw);
                    
                    // Remove expired items
                    if (parsed.expires && parsed.expires < now) {
                        this.remove(key);
                        removed++;
                    }
                    
                    // Remove old backup files (keep only last 3)
                    if (key.startsWith('backup_')) {
                        const backups = keys.filter(k => k.startsWith('backup_')).sort();
                        if (backups.indexOf(key) < backups.length - 3) {
                            this.remove(key);
                            removed++;
                        }
                    }
                }
            } catch (error) {
                // Invalid data, remove it
                this.remove(key);
                removed++;
            }
        });
        
        console.log(`Cleanup complete: ${removed} items removed`);
    }
    
    /**
     * Create backup
     * @param {string} label - Backup label
     * @returns {string} Backup key
     */
    createBackup(label = '') {
        const backupKey = `backup_${Date.now()}${label ? '_' + label : ''}`;
        const data = {};
        
        // Backup all non-backup keys
        this.keys().forEach(key => {
            if (!key.startsWith('backup_')) {
                data[key] = this.get(key);
            }
        });
        
        this.set(backupKey, data);
        
        // Clean old backups
        this.cleanOldBackups();
        
        return backupKey;
    }
    
    /**
     * Restore from backup
     * @param {string} backupKey - Backup key
     * @returns {boolean} Success status
     */
    restoreBackup(backupKey) {
        try {
            const backup = this.get(backupKey);
            
            if (!backup) {
                console.error('Backup not found:', backupKey);
                return false;
            }
            
            // Clear current data (except backups)
            this.keys().forEach(key => {
                if (!key.startsWith('backup_')) {
                    this.remove(key);
                }
            });
            
            // Restore backup data
            Object.entries(backup).forEach(([key, value]) => {
                this.set(key, value);
            });
            
            console.log('Backup restored:', backupKey);
            return true;
        } catch (error) {
            console.error('Error restoring backup:', error);
            return false;
        }
    }
    
    /**
     * List available backups
     * @returns {array} Array of backup info
     */
    listBackups() {
        return this.keys()
            .filter(key => key.startsWith('backup_'))
            .map(key => {
                const timestamp = parseInt(key.split('_')[1]);
                return {
                    key,
                    timestamp,
                    date: new Date(timestamp).toLocaleString(),
                    size: JSON.stringify(this.get(key)).length
                };
            })
            .sort((a, b) => b.timestamp - a.timestamp);
    }
    
    /**
     * Clean old backups
     */
    cleanOldBackups() {
        const backups = this.listBackups();
        
        // Keep only the 3 most recent backups
        if (backups.length > 3) {
            backups.slice(3).forEach(backup => {
                this.remove(backup.key);
            });
        }
    }
    
    /**
     * Load frequently accessed data into cache
     */
    async loadCache() {
        const cacheKeys = ['player', 'settings', 'quests', 'achievements'];
        
        cacheKeys.forEach(key => {
            const value = this.get(key);
            if (value !== null) {
                this.cache.set(this.prefix + key, value);
            }
        });
    }
    
    // Raw storage operations (internal use)
    getRaw(key) {
        switch (this.type) {
            case 'localStorage':
                return window.localStorage.getItem(key);
            case 'sessionStorage':
                return window.sessionStorage.getItem(key);
            case 'memory':
                return this.cache.has(key) ? JSON.stringify(this.cache.get(key)) : null;
            default:
                return null;
        }
    }
    
    setRaw(key, value) {
        switch (this.type) {
            case 'localStorage':
                window.localStorage.setItem(key, value);
                break;
            case 'sessionStorage':
                window.sessionStorage.setItem(key, value);
                break;
            case 'memory':
                this.cache.set(key, JSON.parse(value));
                break;
        }
    }
    
    removeRaw(key) {
        switch (this.type) {
            case 'localStorage':
                window.localStorage.removeItem(key);
                break;
            case 'sessionStorage':
                window.sessionStorage.removeItem(key);
                break;
            case 'memory':
                this.cache.delete(key);
                break;
        }
    }
}

// Create singleton instance
const Storage = new StorageSystem();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Storage = Storage;
}
