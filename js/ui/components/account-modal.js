/**
 * Account Modal Component
 * File: js/ui/components/account-modal.js
 */

class AccountModalComponent {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    open() {
        const modal = document.getElementById('modal-container');
        if (!modal) return;
        
        const player = this.game.player;
        
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="UI.closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>Account Settings</h2>
                        <button class="close-btn" onclick="UI.closeModal()">×</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Player Name</label>
                            <input type="text" class="form-control" id="player-name" 
                                   value="${player.name}">
                        </div>
                        
                        <h3>Display Settings</h3>
                        <div class="form-group">
                            <label>Theme</label>
                            <select class="form-control" id="theme-select">
                                <option value="dark" ${player.settings.display.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                <option value="light" ${player.settings.display.theme === 'light' ? 'selected' : ''}>Light</option>
                                <option value="nature" ${player.settings.display.theme === 'nature' ? 'selected' : ''}>Nature</option>
                                <option value="ocean" ${player.settings.display.theme === 'ocean' ? 'selected' : ''}>Ocean</option>
                            </select>
                        </div>
                        
                        <h3>Notification Settings</h3>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="notif-daily" 
                                       ${player.settings.notifications.daily ? 'checked' : ''}>
                                Daily Reminders
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="notif-achievements" 
                                       ${player.settings.notifications.achievements ? 'checked' : ''}>
                                Achievement Notifications
                            </label>
                        </div>
                        
                        <h3>Data Management</h3>
                        <div class="button-group">
                            <button class="btn btn-secondary" onclick="UI.exportData()">
                                Export Data
                            </button>
                            <button class="btn btn-danger" onclick="UI.resetProgress()">
                                Reset Progress
                            </button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="UI.saveAccountSettings()">
                            Save Changes
                        </button>
                        <button class="btn btn-secondary" onclick="UI.closeModal()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}
