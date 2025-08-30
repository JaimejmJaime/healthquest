
/**
 * Onboarding Modal Component
 * File: js/ui/components/onboarding-modal.js
 */

class OnboardingModal {
    constructor() {
        this.currentStep = 0;
        this.steps = [];
    }
    
    show(config) {
        this.steps = config.steps || [
            {
                title: 'Welcome to HealthQuest!',
                content: 'Transform your health journey into an epic adventure.',
                image: '🌱'
            },
            {
                title: 'Complete Daily Quests',
                content: 'Build healthy habits across nutrition, movement, recovery, and mindfulness.',
                image: '⚔️'
            },
            {
                title: 'Level Up Your Character',
                content: 'Gain XP, unlock achievements, and watch your avatar evolve.',
                image: '🌟'
            },
            {
                title: 'Track Your WAHD',
                content: 'Weekly Active Healthy Days - your north star metric for balanced wellness.',
                image: '📊'
            },
            {
                title: 'Ready to Begin?',
                content: 'Complete your first quest to start your journey!',
                image: '🎯'
            }
        ];
        
        this.currentStep = 0;
        this.renderStep();
    }
    
    renderStep() {
        const modal = document.getElementById('modal-container');
        if (!modal) return;
        
        const step = this.steps[this.currentStep];
        const isLastStep = this.currentStep === this.steps.length - 1;
        
        modal.innerHTML = `
            <div class="modal-backdrop onboarding-backdrop">
                <div class="onboarding-modal">
                    <div class="onboarding-progress">
                        ${this.steps.map((_, i) => `
                            <div class="progress-dot ${i <= this.currentStep ? 'active' : ''}"></div>
                        `).join('')}
                    </div>
                    
                    <div class="onboarding-content">
                        <div class="onboarding-image">${step.image}</div>
                        <h2>${step.title}</h2>
                        <p>${step.content}</p>
                    </div>
                    
                    <div class="onboarding-footer">
                        ${this.currentStep > 0 ? `
                            <button class="btn btn-secondary" onclick="window.onboardingModal.previousStep()">
                                Back
                            </button>
                        ` : '<div></div>'}
                        
                        <button class="btn btn-primary" onclick="window.onboardingModal.${isLastStep ? 'finish' : 'nextStep'}()">
                            ${isLastStep ? "Let's Go!" : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        window.onboardingModal = this;
    }
    
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.renderStep();
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
        }
    }
    
    finish() {
        const lastStep = this.steps[this.steps.length - 1];
        if (lastStep.action) {
            lastStep.action();
        }
        
        UI.closeModal();
        UI.showToast('Welcome to HealthQuest! Complete your first quest to begin!', 'info', 5000);
        UI.switchTab('quests');
        
        delete window.onboardingModal;
    }
}

// Additional UI utility functions for UIManager
if (typeof window !== 'undefined' && window.UIManager) {
    // Add utility methods to UIManager prototype
    UIManager.prototype.exportData = function() {
        this.game.exportData();
    };
    
    UIManager.prototype.resetProgress = function() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
            this.game.resetProgress();
        }
    };
    
    UIManager.prototype.saveAccountSettings = function() {
        const nameInput = document.getElementById('player-name');
        const themeSelect = document.getElementById('theme-select');
        const notifDaily = document.getElementById('notif-daily');
        const notifAchievements = document.getElementById('notif-achievements');
        
        if (nameInput) {
            this.game.player.name = nameInput.value;
        }
        
        if (themeSelect) {
            this.game.player.updateSettings('display', 'theme', themeSelect.value);
            this.applyTheme(themeSelect.value);
        }
        
        if (notifDaily) {
            this.game.player.updateSettings('notifications', 'daily', notifDaily.checked);
        }
        
        if (notifAchievements) {
            this.game.player.updateSettings('notifications', 'achievements', notifAchievements.checked);
        }
        
        this.game.saveGame();
        this.showToast('Settings saved!', 'success');
        this.closeModal();
    };
}

// Export components
if (typeof window !== 'undefined') {
    window.ToastComponent = ToastComponent;
    window.CelebrationModal = CelebrationModal;
    window.AccountModalComponent = AccountModalComponent;
    window.OnboardingModal = OnboardingModal;
}
