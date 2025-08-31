/**
 * Habit Log Modal UI Component
 * File: js/ui/components/habit-log-modal.js
 */

class HabitLogModal {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
        this.loggingSystem = null;
        this.currentType = null;
        this.currentData = {};
        this.currentStep = 0;
        this.animating = false;
    }
    
    init() {
        // Initialize or get the logging system
        if (!this.game.systems.habitLogging) {
            this.game.systems.habitLogging = new HabitLoggingSystem();
        }
        this.loggingSystem = this.game.systems.habitLogging;
    }
    
    open(type) {
        this.init();
        this.currentType = type;
        this.currentData = {};
        this.currentStep = 0;
        
        const template = this.loggingSystem.templates[type];
        if (!template) {
            console.error(`No template for type: ${type}`);
            return;
        }
        
        this.render();
        this.show();
    }
    
    render() {
        const template = this.loggingSystem.templates[this.currentType];
        const container = document.getElementById('modal-container');
        if (!container) return;
        
        const modalHTML = `
            <div class="habit-modal-backdrop" onclick="habitLogModal.handleBackdropClick(event)">
                <div class="habit-modal ${this.currentType}-modal">
                    ${this.renderHeader()}
                    <div class="habit-modal-body">
                        ${this.renderProgress()}
                        <form id="habit-log-form" onsubmit="return false;">
                            <div class="form-step" data-step="${this.currentStep}">
                                ${this.renderFields(template.fields)}
                            </div>
                        </form>
                    </div>
                    ${this.renderFooter()}
                </div>
            </div>
        `;
        
        container.innerHTML = modalHTML;
        container.classList.add('active');
        
        // Store reference globally for event handlers
        window.habitLogModal = this;
        
        // Initialize interactive elements
        requestAnimationFrame(() => {
            this.initializeInteractiveElements();
        });
    }
    
    renderHeader() {
        const icons = {
            nutrition: '🥗',
            movement: '🏃',
            recovery: '😴',
            mindfulness: '🧘',
            weight: '⚖️'
        };
        
        const titles = {
            nutrition: 'Log Nutrition',
            movement: 'Log Movement',
            recovery: 'Log Recovery',
            mindfulness: 'Log Mindfulness',
            weight: 'Track Weight'
        };
        
        return `
            <div class="habit-modal-header">
                <div class="habit-header-icon">${icons[this.currentType]}</div>
                <h2>${titles[this.currentType]}</h2>
                <button class="habit-close-btn" onclick="habitLogModal.close()">×</button>
            </div>
        `;
    }
    
    renderProgress() {
        const template = this.loggingSystem.templates[this.currentType];
        const totalFields = template.fields.filter(f => f.required).length;
        const filledFields = Object.keys(this.currentData).length;
        const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
        
        return `
            <div class="habit-progress">
                <div class="habit-progress-bar">
                    <div class="habit-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }
    
    renderFields(fields) {
        return fields.map(field => {
            // Check if field should be shown based on conditions
            if (field.showIf && !this.evaluateCondition(field.showIf)) {
                return '';
            }
            
            return `
                <div class="habit-field ${field.required ? 'required' : ''}" data-field="${field.id}">
                    ${this.renderField(field)}
                </div>
            `;
        }).join('');
    }
    
    renderField(field) {
        const value = this.currentData[field.id] || field.default || '';
        
        switch(field.type) {
            case 'select':
                return this.renderSelect(field, value);
            case 'text':
                return this.renderText(field, value);
            case 'textarea':
                return this.renderTextarea(field, value);
            case 'number':
                return this.renderNumber(field, value);
            case 'slider':
                return this.renderSlider(field, value);
            case 'checkbox':
                return this.renderCheckbox(field, value);
            case 'checkbox-group':
                return this.renderCheckboxGroup(field, value);
            case 'radio':
                return this.renderRadio(field, value);
            case 'time':
                return this.renderTime(field, value);
            case 'counter':
                return this.renderCounter(field, value);
            case 'emoji-select':
                return this.renderEmojiSelect(field, value);
            case 'icon-select':
                return this.renderIconSelect(field, value);
            case 'duration-picker':
                return this.renderDurationPicker(field, value);
            case 'intensity-select':
                return this.renderIntensitySelect(field, value);
            case 'star-rating':
                return this.renderStarRating(field, value);
            case 'tab-select':
                return this.renderTabSelect(field, value);
            case 'quality-select':
                return this.renderQualitySelect(field, value);
            case 'body-map':
                return this.renderBodyMap(field, value);
            case 'multi-select':
                return this.renderMultiSelect(field, value);
            case 'card-select':
                return this.renderCardSelect(field, value);
            case 'duration-wheel':
                return this.renderDurationWheel(field, value);
            case 'mood-grid':
                return this.renderMoodGrid(field, value);
            case 'list-input':
                return this.renderListInput(field, value);
            case 'progress-bar':
                return this.renderProgressBar(field, value);
            case 'pills':
                return this.renderPills(field, value);
            case 'toggle':
                return this.renderToggle(field, value);
            case 'emoji-scale':
                return this.renderEmojiScale(field, value);
            case 'measurements':
                return this.renderMeasurements(field, value);
            case 'photo':
                return this.renderPhotoUpload(field, value);
            default:
                return this.renderText(field, value);
        }
    }
    
    renderSelect(field, value) {
        return `
            <label>${field.label}</label>
            <select class="habit-select" data-field="${field.id}" onchange="habitLogModal.updateField('${field.id}', this.value)">
                ${!field.required ? '<option value="">Select...</option>' : ''}
                ${field.options.map(opt => `
                    <option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>
                `).join('')}
            </select>
        `;
    }
    
    renderText(field, value) {
        return `
            <label>${field.label}</label>
            <input type="text" 
                   class="habit-input" 
                   data-field="${field.id}"
                   value="${value}"
                   placeholder="${field.placeholder || ''}"
                   ${field.required ? 'required' : ''}
                   onchange="habitLogModal.updateField('${field.id}', this.value)">
        `;
    }
    
    renderNumber(field, value) {
        return `
            <label>${field.label}</label>
            <input type="number" 
                   class="habit-input" 
                   data-field="${field.id}"
                   value="${value}"
                   min="${field.min || ''}"
                   max="${field.max || ''}"
                   step="${field.step || '1'}"
                   placeholder="${field.placeholder || ''}"
                   ${field.required ? 'required' : ''}
                   onchange="habitLogModal.updateField('${field.id}', parseFloat(this.value))">
        `;
    }
    
    renderSlider(field, value) {
        const percentage = ((value - field.min) / (field.max - field.min)) * 100;
        
        return `
            <label>${field.label}</label>
            <div class="habit-slider-container">
                <input type="range" 
                       class="habit-slider" 
                       data-field="${field.id}"
                       value="${value}"
                       min="${field.min}"
                       max="${field.max}"
                       step="${field.step || 1}"
                       oninput="habitLogModal.updateSlider('${field.id}', this.value)">
                <div class="habit-slider-value" id="slider-${field.id}">${field.labels?.[value] || value}</div>
                ${field.labels ? `
                    <div class="habit-slider-labels">
                        ${Object.entries(field.labels).map(([val, label]) => `
                            <span data-value="${val}">${label}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderCounter(field, value) {
        return `
            <label>${field.label}</label>
            <div class="habit-counter">
                <button type="button" class="counter-btn minus" onclick="habitLogModal.updateCounter('${field.id}', -1)">−</button>
                <input type="number" 
                       class="counter-value" 
                       id="counter-${field.id}"
                       value="${value}"
                       min="${field.min}"
                       max="${field.max}"
                       readonly>
                <button type="button" class="counter-btn plus" onclick="habitLogModal.updateCounter('${field.id}', 1)">+</button>
            </div>
        `;
    }
    
    renderEmojiSelect(field, value) {
        return `
            <label>${field.label}</label>
            <div class="habit-emoji-select">
                ${field.options.map(opt => `
                    <button type="button" 
                            class="emoji-option ${value === opt.value ? 'selected' : ''}"
                            data-value="${opt.value}"
                            onclick="habitLogModal.selectEmoji('${field.id}', '${opt.value}')">
                        <span class="emoji">${opt.emoji}</span>
                        <span class="label">${opt.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    renderIconSelect(field, value) {
        return `
            <label>${field.label}</label>
            <div class="habit-icon-grid">
                ${field.options.map(opt => `
                    <button type="button" 
                            class="icon-option ${value === opt.value ? 'selected' : ''}"
                            data-value="${opt.value}"
                            onclick="habitLogModal.selectIcon('${field.id}', '${opt.value}')">
                        <span class="icon">${opt.icon}</span>
                        <span class="label">${opt.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    renderDurationPicker(field, value) {
        return `
            <label>${field.label}</label>
            <div class="habit-duration-picker">
                <div class="quick-options">
                    ${field.quickOptions.map(mins => `
                        <button type="button" 
                                class="duration-quick ${value === mins ? 'selected' : ''}"
                                onclick="habitLogModal.setDuration('${field.id}', ${mins})">
                            ${mins}min
                        </button>
                    `).join('')}
                </div>
                <div class="duration-custom">
                    <input type="number" 
                           class="duration-input"
                           id="duration-${field.id}"
                           value="${value}"
                           min="${field.min}"
                           max="${field.max}"
                           onchange="habitLogModal.updateField('${field.id}', parseInt(this.value))">
                    <span>minutes</span>
                </div>
            </div>
        `;
    }
    
    renderIntensitySelect(field, value) {
        return `
            <label>${field.label}</label>
            <div class="habit-intensity-select">
                ${field.options.map(opt => `
                    <button type="button" 
                            class="intensity-option ${value === opt.value ? 'selected' : ''}"
                            style="--intensity-color: ${opt.color}"
                            onclick="habitLogModal.selectIntensity('${field.id}', '${opt.value}')">
                        <span class="intensity-label">${opt.label}</span>
                        <span class="intensity-desc">${opt.description}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    renderStarRating(field, value) {
        return `
            <label>${field.label}</label>
            <div class="habit-star-rating">
                ${Array.from({length: field.max}, (_, i) => i + 1).map(star => `
                    <button type="button" 
                            class="star ${star <= value ? 'filled' : ''}"
                            onclick="habitLogModal.setRating('${field.id}', ${star})">
                        ★
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    renderMoodGrid(field, value) {
        return `
            <label>${field.label}</label>
            <div class="habit-mood-grid">
                <div class="mood-axes">
                    <span class="axis-x">${field.axes.x} →</span>
                    <span class="axis-y">↑ ${field.axes.y}</span>
                </div>
                <div class="mood-quadrants">
                    ${field.quadrants.map(mood => `
                        <button type="button" 
                                class="mood-option ${value === mood.value ? 'selected' : ''}"
                                style="--x: ${mood.x}; --y: ${mood.y}"
                                onclick="habitLogModal.selectMood('${field.id}', '${mood.value}')">
                            <span class="mood-emoji">${mood.emoji}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderBodyMap(field, value = []) {
        return `
            <label>${field.label}</label>
            <div class="habit-body-map">
                ${field.areas.map(area => `
                    <button type="button" 
                            class="body-area ${value.includes(area) ? 'selected' : ''}"
                            onclick="habitLogModal.toggleBodyArea('${field.id}', '${area}')">
                        ${area}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    renderFooter() {
        const template = this.loggingSystem.templates[this.currentType];
        const isValid = this.validateCurrentData();
        
        return `
            <div class="habit-modal-footer">
                <button type="button" class="btn btn-secondary" onclick="habitLogModal.close()">
                    Cancel
                </button>
                <button type="button" 
                        class="btn btn-primary ${!isValid ? 'disabled' : ''}"
                        ${!isValid ? 'disabled' : ''}
                        onclick="habitLogModal.save()">
                    <span class="btn-text">Log ${this.currentType}</span>
                    <span class="btn-xp">+${template.xpReward} XP</span>
                </button>
            </div>
        `;
    }
    
    // Event Handlers
    updateField(fieldId, value) {
        this.currentData[fieldId] = value;
        this.updateProgress();
        this.checkConditionalFields();
    }
    
    updateSlider(fieldId, value) {
        const field = this.getField(fieldId);
        this.currentData[fieldId] = parseFloat(value);
        
        const displayElement = document.getElementById(`slider-${fieldId}`);
        if (displayElement) {
            displayElement.textContent = field.labels?.[value] || value;
        }
        
        this.updateProgress();
    }
    
    updateCounter(fieldId, delta) {
        const field = this.getField(fieldId);
        const current = this.currentData[fieldId] || field.default || 0;
        const newValue = Math.max(field.min, Math.min(field.max, current + delta));
        
        this.currentData[fieldId] = newValue;
        
        const input = document.getElementById(`counter-${fieldId}`);
        if (input) input.value = newValue;
        
        this.updateProgress();
    }
    
    selectEmoji(fieldId, value) {
        this.currentData[fieldId] = value;
        
        // Update UI
        document.querySelectorAll(`[data-field="${fieldId}"] .emoji-option`).forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.value === value);
        });
        
        this.updateProgress();
    }
    
    selectIcon(fieldId, value) {
        this.currentData[fieldId] = value;
        
        document.querySelectorAll(`[data-field="${fieldId}"] .icon-option`).forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.value === value);
        });
        
        this.updateProgress();
    }
    
    setDuration(fieldId, minutes) {
        this.currentData[fieldId] = minutes;
        
        // Update quick options
        document.querySelectorAll(`[data-field="${fieldId}"] .duration-quick`).forEach(btn => {
            btn.classList.toggle('selected', parseInt(btn.textContent) === minutes);
        });
        
        // Update custom input
        const input = document.getElementById(`duration-${fieldId}`);
        if (input) input.value = minutes;
        
        this.updateProgress();
    }
    
    selectIntensity(fieldId, value) {
        this.currentData[fieldId] = value;
        
        document.querySelectorAll(`[data-field="${fieldId}"] .intensity-option`).forEach(btn => {
            btn.classList.toggle('selected', btn.onclick.toString().includes(value));
        });
        
        this.updateProgress();
    }
    
    setRating(fieldId, rating) {
        this.currentData[fieldId] = rating;
        
        document.querySelectorAll(`[data-field="${fieldId}"] .star`).forEach((star, index) => {
            star.classList.toggle('filled', index < rating);
        });
        
        this.updateProgress();
    }
    
    selectMood(fieldId, mood) {
        this.currentData[fieldId] = mood;
        
        document.querySelectorAll(`[data-field="${fieldId}"] .mood-option`).forEach(btn => {
            btn.classList.toggle('selected', btn.onclick.toString().includes(mood));
        });
        
        this.updateProgress();
    }
    
    toggleBodyArea(fieldId, area) {
        if (!this.currentData[fieldId]) {
            this.currentData[fieldId] = [];
        }
        
        const areas = this.currentData[fieldId];
        const index = areas.indexOf(area);
        
        if (index > -1) {
            areas.splice(index, 1);
        } else {
            areas.push(area);
        }
        
        document.querySelectorAll(`[data-field="${fieldId}"] .body-area`).forEach(btn => {
            btn.classList.toggle('selected', areas.includes(btn.textContent.trim()));
        });
        
        this.updateProgress();
    }
    
    // Utility Methods
    getField(fieldId) {
        const template = this.loggingSystem.templates[this.currentType];
        return template.fields.find(f => f.id === fieldId);
    }
    
    evaluateCondition(condition) {
        const [fieldId, expectedValue] = condition.split(':');
        return this.currentData[fieldId] === expectedValue;
    }
    
    checkConditionalFields() {
        const template = this.loggingSystem.templates[this.currentType];
        
        template.fields.forEach(field => {
            if (field.showIf) {
                const element = document.querySelector(`[data-field="${field.id}"]`);
                if (element) {
                    const shouldShow = this.evaluateCondition(field.showIf);
                    element.style.display = shouldShow ? 'block' : 'none';
                }
            }
        });
    }
    
    updateProgress() {
        const progressBar = document.querySelector('.habit-progress-fill');
        if (!progressBar) return;
        
        const template = this.loggingSystem.templates[this.currentType];
        const requiredFields = template.fields.filter(f => f.required && !f.showIf);
        const filledRequired = requiredFields.filter(f => this.currentData[f.id]).length;
        const progress = requiredFields.length > 0 ? (filledRequired / requiredFields.length) * 100 : 0;
        
        progressBar.style.width = `${progress}%`;
        
        // Update save button state
        const saveBtn = document.querySelector('.habit-modal-footer .btn-primary');
        if (saveBtn) {
            const isValid = this.validateCurrentData();
            saveBtn.disabled = !isValid;
            saveBtn.classList.toggle('disabled', !isValid);
        }
    }
    
    validateCurrentData() {
        const template = this.loggingSystem.templates[this.currentType];
        
        // Check all required fields
        for (const field of template.fields) {
            if (field.required && !field.showIf) {
                if (!this.currentData[field.id]) {
                    return false;
                }
            }
            
            // Check conditional required fields
            if (field.required && field.showIf) {
                if (this.evaluateCondition(field.showIf) && !this.currentData[field.id]) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    initializeInteractiveElements() {
        // Auto-calculate sleep hours
        const bedtimeInput = document.querySelector('[data-field="bedtime"]');
        const wakeTimeInput = document.querySelector('[data-field="wakeTime"]');
        
        if (bedtimeInput && wakeTimeInput) {
            const calculateSleep = () => {
                if (this.currentData.bedtime && this.currentData.wakeTime) {
                    const hours = this.loggingSystem.calculateSleepHours(
                        this.currentData.bedtime,
                        this.currentData.wakeTime
                    );
                    this.currentData.sleepHours = hours;
                    
                    const sleepInput = document.querySelector('[data-field="sleepHours"]');
                    if (sleepInput) sleepInput.value = hours;
                }
            };
            
            bedtimeInput.addEventListener('change', calculateSleep);
            wakeTimeInput.addEventListener('change', calculateSleep);
        }
    }
    
    // Main Actions
    async save() {
        if (!this.validateCurrentData()) {
            this.ui.showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        this.animating = true;
        
        // Add saving animation
        const saveBtn = document.querySelector('.habit-modal-footer .btn-primary');
        if (saveBtn) {
            saveBtn.classList.add('saving');
            saveBtn.innerHTML = '<span class="spinner"></span> Saving...';
        }
        
        try {
            const result = await this.loggingSystem.logHabit(this.currentType, this.currentData);
            
            if (result.success) {
                // Success animation
                this.showSuccess(result);
                
                // Update game state
                this.game.saveGame();
                
                // Refresh UI if needed
                if (this.ui.currentTab === 'dashboard' || this.ui.currentTab === 'progress') {
                    this.ui.switchTab(this.ui.currentTab);
                }
                
                // Close modal after delay
                setTimeout(() => this.close(), 1500);
                
            } else {
                this.ui.showToast(result.errors?.join(', ') || 'Failed to log habit', 'error');
                
                // Reset button
                if (saveBtn) {
                    saveBtn.classList.remove('saving');
                    saveBtn.innerHTML = `
                        <span class="btn-text">Log ${this.currentType}</span>
                        <span class="btn-xp">+${this.loggingSystem.templates[this.currentType].xpReward} XP</span>
                    `;
                }
            }
        } catch (error) {
            console.error('Error saving habit:', error);
            this.ui.showToast('An error occurred. Please try again.', 'error');
        } finally {
            this.animating = false;
        }
    }
    
    showSuccess(result) {
        const modal = document.querySelector('.habit-modal');
        if (!modal) return;
        
        // Create success overlay
        const successHTML = `
            <div class="habit-success-overlay">
                <div class="success-animation">
                    <div class="success-icon">✅</div>
                    <h3>${result.message}</h3>
                    <div class="success-xp">+${result.xp.xpGained} XP</div>
                    ${result.achievements?.length > 0 ? `
                        <div class="success-achievements">
                            ${result.achievements.map(a => `<span class="achievement-badge">🏆 ${a}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${result.patterns?.length > 0 ? `
                        <div class="success-patterns">
                            ${result.patterns.map(p => `<div class="pattern-insight">${p.message}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.insertAdjacentHTML('beforeend', successHTML);
    }
    
    close() {
        const container = document.getElementById('modal-container');
        if (!container) return;
        
        // Add closing animation
        const modal = document.querySelector('.habit-modal');
        if (modal) {
            modal.classList.add('closing');
        }
        
        setTimeout(() => {
            container.innerHTML = '';
            container.classList.remove('active');
            delete window.habitLogModal;
        }, 300);
    }
    
    handleBackdropClick(event) {
        if (event.target.classList.contains('habit-modal-backdrop')) {
            this.close();
        }
    }
    
    show() {
        const modal = document.querySelector('.habit-modal');
        if (modal) {
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.HabitLogModal = HabitLogModal;
}
