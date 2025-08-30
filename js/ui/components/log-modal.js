/**
 * Log Modal Component
 */

class LogModalComponent {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
        this.currentType = null;
    }
    
    open(type) {
        this.currentType = type;
        
        const modalHtml = `
            <div class="modal-backdrop" onclick="UI.closeModal()"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Log ${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                        <button class="close-btn" onclick="UI.closeModal()">×</button>
                    </div>
                    <div class="modal-body">
                        ${this.getFormContent(type)}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
                        <button class="btn" onclick="UI.components.logModal.save()">Save</button>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = modalHtml;
            modalContainer.classList.add('active');
        }
    }
    
    getFormContent(type) {
        const forms = {
            nutrition: `
                <div class="form-group">
                    <label>Meal Type</label>
                    <select class="form-control" id="log-meal-type">
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" class="form-control" id="log-meal-desc" 
                           placeholder="What did you eat?">
                </div>
            `,
            movement: `
                <div class="form-group">
                    <label>Activity Type</label>
                    <select class="form-control" id="log-activity-type">
                        <option>Walk</option>
                        <option>Run</option>
                        <option>Bike</option>
                        <option>Swim</option>
                        <option>Yoga</option>
                        <option>Strength</option>
                        <option>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Duration (minutes)</label>
                    <input type="number" class="form-control" id="log-activity-duration" 
                           placeholder="30" min="5" max="300">
                </div>
            `,
            recovery: `
                <div class="form-group">
                    <label>Sleep Hours</label>
                    <input type="number" class="form-control" id="log-sleep-hours" 
                           placeholder="8" step="0.5" min="4" max="12">
                </div>
                <div class="form-group">
                    <label>Sleep Quality</label>
                    <select class="form-control" id="log-sleep-quality">
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Poor</option>
                    </select>
                </div>
            `,
            mindfulness: `
                <div class="form-group">
                    <label>Activity</label>
                    <select class="form-control" id="log-mindfulness-type">
                        <option>Meditation</option>
                        <option>Breathing Exercise</option>
                        <option>Gratitude Journal</option>
                        <option>Mindful Walk</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Duration (minutes)</label>
                    <input type="number" class="form-control" id="log-mindfulness-duration" 
                           placeholder="10" min="3" max="60">
                </div>
            `
        };
        
        return forms[type] || '<p>Select a log type</p>';
    }
    
    save() {
        // Implement save logic based on currentType
        UI.showToast(`${this.currentType} logged successfully!`, 'success');
        UI.closeModal();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.LogModalComponent = LogModalComponent;
}
