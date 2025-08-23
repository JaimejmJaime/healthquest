/**
 * Header Component
 * File: js/ui/components/header.js
 */

class HeaderComponent {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        const player = this.game.player;
        
        return `
            <header class="header">
                <div class="header-content">
                    <div class="logo">
                        <span class="logo-icon">🌱</span>
                        <span class="logo-text">HealthQuest</span>
                    </div>
                    
                    <div class="user-info">
                        <span class="user-name">${player.name}</span>
                        <span class="level-badge" id="level-badge">Level ${player.level}</span>
                        <button class="btn-icon" onclick="UI.openAccountModal()" title="Account Settings">
                            ⚙️
                        </button>
                    </div>
                </div>
            </header>
        `;
    }
    
    update() {
        const levelBadge = document.getElementById('level-badge');
        if (levelBadge) {
            levelBadge.textContent = `Level ${this.game.player.level}`;
        }
    }
}

/**
 * Navigation Component
 * File: js/ui/components/navigation.js
 */

class NavigationComponent {
    constructor(uiManager) {
        this.ui = uiManager;
        this.tabs = [
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'quests', icon: '⚔️', label: 'Daily Quests' },
            { id: 'log', icon: '📝', label: 'Quick Log' },
            { id: 'squad', icon: '👥', label: 'Squad' },
            { id: 'events', icon: '🎉', label: 'Live Events' },
            { id: 'progress', icon: '📊', label: 'Progress' }
        ];
    }
    
    render() {
        return `
            <nav class="nav-tabs">
                <div class="nav-tabs-inner">
                    ${this.tabs.map(tab => `
                        <button class="tab-btn ${tab.id === 'dashboard' ? 'active' : ''}" 
                                data-tab="${tab.id}">
                            <span class="tab-icon">${tab.icon}</span>
                            <span class="tab-label">${tab.label}</span>
                        </button>
                    `).join('')}
                </div>
            </nav>
        `;
    }
}

/**
 * Avatar Component
 * File: js/ui/components/avatar.js
 */

class AvatarComponent {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        const player = this.game.player;
        
        return `
            <div class="avatar-component">
                <div class="avatar-display" id="player-avatar">
                    ${player.getAvatar()}
                </div>
                <h3 class="avatar-title" id="avatar-title">${player.getTitle()}</h3>
            </div>
        `;
    }
    
    update() {
        const avatarDisplay = document.getElementById('player-avatar');
        const avatarTitle = document.getElementById('avatar-title');
        
        if (avatarDisplay) {
            avatarDisplay.textContent = this.game.player.getAvatar();
        }
        
        if (avatarTitle) {
            avatarTitle.textContent = this.game.player.getTitle();
        }
    }
}

/**
 * Progress Bar Component
 * File: js/ui/components/progress-bar.js
 */

class ProgressBarComponent {
    constructor(uiManager) {
        this.ui = uiManager;
    }
    
    render(current, max, label = '', showText = true) {
        const percentage = Math.min(100, (current / max) * 100);
        
        return `
            <div class="progress-bar-component">
                ${label ? `<label class="progress-label">${label}</label>` : ''}
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%">
                        ${showText ? `
                            <span class="progress-text">${current} / ${max}</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Quest Card Component
 * File: js/ui/components/quest-card.js
 */

class QuestCardComponent {
    constructor(uiManager) {
        this.ui = uiManager;
    }
    
    render(quest) {
        const categoryIcons = {
            nutrition: '🥗',
            movement: '🏃',
            recovery: '😴',
            mindfulness: '🧘'
        };
        
        return `
            <div class="quest-card ${quest.category} ${quest.completed ? 'completed' : ''}" 
                 data-quest-id="${quest.id}">
                <div class="quest-card-header">
                    <span class="quest-icon">${categoryIcons[quest.category] || '⭐'}</span>
                    <span class="quest-xp">${quest.xp} XP</span>
                </div>
                <div class="quest-card-body">
                    <h4 class="quest-title">${quest.title}</h4>
                    <p class="quest-description">${quest.description}</p>
                </div>
                <div class="quest-card-footer">
                    <span class="difficulty ${quest.difficulty}">${quest.difficulty}</span>
                    <button class="btn btn-sm quest-complete-btn" 
                            data-quest-id="${quest.id}"
                            ${quest.completed ? 'disabled' : ''}>
                        ${quest.completed ? '✅ Done' : 'Complete'}
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Skill Tree Component
 * File: js/ui/components/skill-tree.js
 */

class SkillTreeComponent {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        const skills = this.game.player.skills;
        const icons = {
            nutrition: '🥗',
            strength: '💪',
            cardio: '🏃',
            recovery: '😴',
            mindfulness: '🧘'
        };
        
        return `
            <div class="skill-tree-component">
                <h3>Skills</h3>
                <div class="skills-grid">
                    ${Object.entries(skills).map(([name, skill]) => `
                        <div class="skill-node" data-skill="${name}">
                            <div class="skill-icon">${icons[name]}</div>
                            <div class="skill-name">${name}</div>
                            <div class="skill-level">Lv ${skill.level}</div>
                            ${this.renderSkillProgress(skill)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderSkillProgress(skill) {
        const needed = skill.level * Config.GAME.SKILL_XP_PER_LEVEL;
        const percentage = (skill.xp / needed) * 100;
        
        return `
            <div class="skill-progress">
                <div class="progress-bar mini">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }
}

/**
 * Week Progress Component
 * File: js/ui/components/week-progress.js
 */

class WeekProgressComponent {
    constructor(uiManager) {
        this.ui = uiManager;
        this.game = uiManager.game;
    }
    
    render() {
        const wahd = this.game.player.stats.wahd;
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const today = new Date().getDay();
        const adjustedToday = today === 0 ? 6 : today - 1;
        
        return `
            <div class="week-progress-component">
                <div class="wahd-display">
                    <span class="wahd-current">${wahd.current}</span> / 7 WAHD
                </div>
                <div class="week-circles">
                    ${days.map((day, index) => `
                        <div class="day-circle ${index < wahd.current ? 'active' : ''} 
                                    ${index === adjustedToday ? 'today' : ''}"
                             data-day="${index}">
                            ${day}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    update(wahd) {
        const circles = document.querySelectorAll('.day-circle');
        circles.forEach((circle, index) => {
            circle.classList.toggle('active', index < wahd.current);
        });
        
        const wahdDisplay = document.querySelector('.wahd-current');
        if (wahdDisplay) {
            wahdDisplay.textContent = wahd.current;
        }
    }
}

/**
 * Stats Card Component
 * File: js/ui/components/stats-card.js
 */

class StatsCardComponent {
    constructor(uiManager) {
        this.ui = uiManager;
    }
    
    render(label, value, icon = '') {
        return `
            <div class="stat-card">
                ${icon ? `<div class="stat-icon">${icon}</div>` : ''}
                <div class="stat-value">${value}</div>
                <div class="stat-label">${label}</div>
            </div>
        `;
    }
}

/**
 * Log Modal Component
 * File: js/ui/components/log-modal.js
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
                <div class="form-group">
                    <label>How do you feel?</label>
                    <select class="form-control" id="log-meal-feeling">
                        <option>Energized</option>
                        <option>Satisfied</option>
                        <option>Neutral</option>
                        <option>Sluggish</option>
                    </select>
                </div>
            `,
            movement: `
                <div class="form-group">
                    <label>Activity Type</label>
                    <select class="form-control" id="log-activity-type">
                        ${Config.MOVEMENT.ACTIVITY_TYPES.map(type => 
                            `<option value="${type}">${type}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Duration (minutes)</label>
                    <input type="number" class="form-control" id="log-activity-duration" 
                           placeholder="30" min="5" max="300">
                </div>
                <div class="form-group">
                    <label>Intensity</label>
                    <select class="form-control" id="log-activity-intensity">
                        <option>Light</option>
                        <option>Moderate</option>
                        <option>Vigorous</option>
                    </select>
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
                <div class="form-group">
                    <label>Bedtime Routine</label>
                    <select class="form-control" id="log-bedtime-routine">
                        <option>No screens</option>
                        <option>Meditation</option>
                        <option>Reading</option>
                        <option>Stretching</option>
                        <option>Other</option>
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
                        <option>Yoga</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Duration (minutes)</label>
                    <input type="number" class="form-control" id="log-mindfulness-duration" 
                           placeholder="10" min="3" max="60">
                </div>
                <div class="form-group">
                    <label>Current Mood</label>
                    <select class="form-control" id="log-mood">
                        ${Config.MINDFULNESS.MOOD_OPTIONS.map(mood => 
                            `<option value="${mood}">${mood}</option>`
                        ).join('')}
                    </select>
                </div>
            `,
            weight: `
                <div class="form-group">
                    <label>Current Weight</label>
                    <input type="number" class="form-control" id="log-weight" 
                           placeholder="Enter weight" step="0.1">
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <select class="form-control" id="log-weight-unit">
                        <option>lbs</option>
                        <option>kg</option>
                    </select>
                </div>
                <p class="body-positive-note">
                    Remember: Focus on how you feel, not just the numbers! 
                    Weight is just one metric of many.
                </p>
            `,
            custom: `
                <div class="form-group">
                    <label>Custom Habit</label>
                    <input type="text" class="form-control" id="log-custom-name" 
                           placeholder="Habit name">
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select class="form-control" id="log-custom-category">
                        <option>Nutrition</option>
                        <option>Movement</option>
                        <option>Recovery</option>
                        <option>Mindfulness</option>
                        <option>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea class="form-control" id="log-custom-notes" 
                              rows="3" placeholder="Details about your habit"></textarea>
                </div>
            `
