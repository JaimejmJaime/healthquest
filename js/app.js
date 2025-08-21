/**
 * HealthQuest App Initialization
 * Entry point for the application
 */

(function() {
    'use strict';
    
    // Check browser compatibility
    const checkCompatibility = () => {
        const required = {
            localStorage: typeof(Storage) !== 'undefined',
            promises: typeof(Promise) !== 'undefined',
            fetch: typeof(fetch) !== 'undefined',
            serviceWorker: 'serviceWorker' in navigator
        };
        
        const missing = [];
        Object.entries(required).forEach(([feature, supported]) => {
            if (!supported) {
                missing.push(feature);
            }
        });
        
        if (missing.length > 0) {
            console.warn('Missing browser features:', missing);
            
            // Show compatibility warning
            const message = `
                Your browser is missing some features required for the best experience.
                Please update to a modern browser for full functionality.
                Missing: ${missing.join(', ')}
            `;
            
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.innerHTML = `
                    <div class="compatibility-warning">
                        <h2>⚠️ Browser Update Needed</h2>
                        <p>${message}</p>
                        <button onclick="window.location.reload()" class="btn">
                            Try Anyway
                        </button>
                    </div>
                `;
            }
            
            return false;
        }
        
        return true;
    };
    
    // Initialize app
    const initApp = async () => {
        console.log('🌱 HealthQuest v' + Config.VERSION + ' starting...');
        
        try {
            // Check compatibility
            if (!checkCompatibility()) {
                console.warn('Browser compatibility issues detected');
            }
            
            // Initialize storage
            await Storage.init();
            
            // Set up error handling
            setupErrorHandling();
            
            // Initialize game
            await Game.init();
            
            // Register service worker
            registerServiceWorker();
            
            // Set up app lifecycle handlers
            setupLifecycleHandlers();
            
            // Check for updates
            checkForUpdates();
            
            console.log('✅ HealthQuest initialized successfully!');
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            handleCriticalError(error);
        }
    };
    
    // Error handling
    const setupErrorHandling = () => {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            
            // Track error
            if (window.Game && Game.systems.analytics) {
                Game.systems.analytics.track('error', {
                    message: event.error.message,
                    stack: event.error.stack,
                    url: event.filename,
                    line: event.lineno,
                    column: event.colno
                });
            }
            
            // Show user-friendly error message
            if (window.UI) {
                UI.showToast('Something went wrong. Please refresh the page.', 'error');
            }
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            // Track error
            if (window.Game && Game.systems.analytics) {
                Game.systems.analytics.track('unhandled_rejection', {
                    reason: event.reason
                });
            }
            
            event.preventDefault();
        });
    };
    
    // Handle critical errors
    const handleCriticalError = (error) => {
        console.error('Critical error:', error);
        
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">❌</div>
                    <h2>Oops! Something went wrong</h2>
                    <p>We couldn't load HealthQuest properly.</p>
                    <details>
                        <summary>Error Details</summary>
                        <pre>${error.message}\n${error.stack}</pre>
                    </details>
                    <div class="error-actions">
                        <button onclick="window.location.reload()" class="btn">
                            🔄 Reload Page
                        </button>
                        <button onclick="clearDataAndReload()" class="btn btn-secondary">
                            🗑️ Clear Data & Reload
                        </button>
                    </div>
                </div>
            `;
        }
    };
    
    // Clear data and reload (for recovery)
    window.clearDataAndReload = () => {
        if (confirm('This will delete all your progress. Are you sure?')) {
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear IndexedDB if used
            if (window.indexedDB) {
                indexedDB.deleteDatabase('healthquest');
            }
            
            // Clear service worker cache
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                });
            }
            
            // Reload
            window.location.reload(true);
        }
    };
    
    // Register service worker
    const registerServiceWorker = async () => {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return;
        }
        
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker registered:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                console.log('Service Worker update found');
                
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker available
                        if (window.UI) {
                            UI.showToast(
                                'New version available! Refresh to update.',
                                'info',
                                10000,
                                [
                                    {
                                        text: 'Refresh',
                                        action: () => window.location.reload()
                                    }
                                ]
                            );
                        }
                    }
                });
            });
            
        } catch (error) {
            console.warn('Service Worker registration failed:', error);
        }
    };
    
    // App lifecycle handlers
    const setupLifecycleHandlers = () => {
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('App backgrounded');
                
                // Save game state
                if (window.Game) {
                    Game.saveGame();
                }
                
                // Pause timers
                pauseTimers();
                
            } else {
                console.log('App foregrounded');
                
                // Resume timers
                resumeTimers();
                
                // Check for daily reset
                if (window.Game) {
                    Game.checkDailyReset();
                }
            }
        });
        
        // Before unload
        window.addEventListener('beforeunload', (event) => {
            // Save game
            if (window.Game) {
                Game.saveGame();
            }
            
            // Show warning if there are unsaved changes
            if (hasUnsavedChanges()) {
                event.preventDefault();
                event.returnValue = 'You have unsaved progress. Are you sure you want to leave?';
            }
        });
        
        // Online/offline status
        window.addEventListener('online', () => {
            console.log('App online');
            if (window.UI) {
                UI.showToast('Connection restored', 'success');
            }
            
            // Sync data if needed
            syncData();
        });
        
        window.addEventListener('offline', () => {
            console.log('App offline');
            if (window.UI) {
                UI.showToast('You\'re offline. Progress will be saved locally.', 'warning');
            }
        });
        
        // App install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            showInstallPrompt();
        });
        
        // App installed
        window.addEventListener('appinstalled', () => {
            console.log('App installed');
            if (window.UI) {
                UI.showToast('HealthQuest installed successfully!', 'success');
            }
            
            // Track installation
            if (window.Game && Game.systems.analytics) {
                Game.systems.analytics.track('app_installed');
            }
        });
    };
    
    // Check for unsaved changes
    const hasUnsavedChanges = () => {
        if (!window.Game) return false;
        
        const lastSave = Game.data.lastSaveTime || 0;
        const timeSinceLastSave = Date.now() - lastSave;
        
        // If more than 5 seconds since last save, assume there are changes
        return timeSinceLastSave > 5000;
    };
    
    // Timer management
    let activeTimers = [];
    
    const pauseTimers = () => {
        // Pause any active timers
        activeTimers.forEach(timer => clearInterval(timer));
        activeTimers = [];
    };
    
    const resumeTimers = () => {
        // Resume timers
        if (window.Game) {
            // Restart auto-save
            const autoSaveTimer = setInterval(() => {
                Game.saveGame();
            }, Config.STORAGE.AUTO_SAVE_INTERVAL);
            
            activeTimers.push(autoSaveTimer);
        }
    };
    
    // Data sync (for future cloud sync)
    const syncData = async () => {
        if (!navigator.onLine) return;
        
        // This will be implemented when cloud sync is added
        console.log('Data sync placeholder');
    };
    
    // Show install prompt
    const showInstallPrompt = () => {
        // Create install button if it doesn't exist
        const existingButton = document.getElementById('install-button');
        if (existingButton) return;
        
        const button = document.createElement('button');
        button.id = 'install-button';
        button.className = 'install-button';
        button.innerHTML = '📱 Install App';
        button.onclick = async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('User accepted install prompt');
                } else {
                    console.log('User dismissed install prompt');
                }
                
                deferredPrompt = null;
                button.remove();
            }
        };
        
        document.body.appendChild(button);
    };
    
    // Check for updates
    const checkForUpdates = async () => {
        if (!navigator.onLine) return;
        
        try {
            // Check version from GitHub or API
            // This is a placeholder - implement actual version checking
            const response = await fetch('https://api.github.com/repos/yourusername/healthquest/releases/latest');
            
            if (response.ok) {
                const data = await response.json();
                const latestVersion = data.tag_name?.replace('v', '');
                
                if (latestVersion && latestVersion !== Config.VERSION) {
                    console.log(`Update available: ${latestVersion}`);
                    
                    if (window.UI) {
                        UI.showToast(
                            `New version ${latestVersion} available!`,
                            'info',
                            10000,
                            [
                                {
                                    text: 'Update',
                                    action: () => window.location.reload(true)
                                }
                            ]
                        );
                    }
                }
            }
        } catch (error) {
            console.log('Update check failed:', error);
        }
    };
    
    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    
})();
