/**
 * UI Component and View Stubs
 * Temporary implementations for missing UI files
 */

// Component stubs
const Hero = {
    render: () => '<div class="hero">Hero Component</div>'
};

const Navigation = {
    render: () => '<nav>Navigation Component</nav>'
};

const Avatar = {
    render: (player) => `<div class="avatar">${player.avatar.emoji}</div>`
};

const ProgressBar = {
    render: (current, max) => `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${(current/max)*100}%"></div>
        </div>
    `
};

const QuestCard = {
    render: (quest) => `
        <div class="quest-card">
            <h4>${quest.title}</h4>
            <p>${quest.description}</p>
        </div>
    `
};

const AchievementCard = {
    render: (achievement) => `
        <div class="achievement-card">
            <span>${achievement.icon}</span>
            <h4>${achievement.name}</h4>
        </div>
    `
};

const StatCard = {
    render: (label, value) => `
        <div class="stat-card">
            <span>${label}</span>
            <strong>${value}</strong>
        </div>
    `
};

const Chart = {
    render: (data) => '<div class="chart">Chart Component</div>'
};

// View stubs
const DashboardView = {
    render: () => '<div class="view">Dashboard View</div>'
};

const QuestsView = {
    render: () => '<div class="view">Quests View</div>'
};

const ProgressView = {
    render: () => '<div class="view">Progress View</div>'
};

const NutritionView = {
    render: () => '<div class="view">Nutrition View</div>'
};

const MovementView = {
    render: () => '<div class="view">Movement View</div>'
};

const RecoveryView = {
    render: () => '<div class="view">Recovery View</div>'
};

const MindfulnessView = {
    render: () => '<div class="view">Mindfulness View</div>'
};

const AchievementsView = {
    render: () => '<div class="view">Achievements View</div>'
};

const SettingsView = {
    render: () => '<div class="view">Settings View</div>'
};

// Modal stubs
const MealModal = {
    show: () => console.log('Meal Modal'),
    hide: () => console.log('Hide Meal Modal')
};

const ActivityModal = {
    show: () => console.log('Activity Modal'),
    hide: () => console.log('Hide Activity Modal')
};

const SleepModal = {
    show: () => console.log('Sleep Modal'),
    hide: () => console.log('Hide Sleep Modal')
};

const MoodModal = {
    show: () => console.log('Mood Modal'),
    hide: () => console.log('Hide Mood Modal')
};

const CelebrationModal = {
    show: () => console.log('Celebration Modal'),
    hide: () => console.log('Hide Celebration Modal')
};

const OnboardingModal = {
    show: () => console.log('Onboarding Modal'),
    hide: () => console.log('Hide Onboarding Modal')
};

// Toast stub
const Toast = {
    show: (message, type) => {
        console.log(`Toast: ${type} - ${message}`);
    }
};

// Modal stub
const Modal = {
    show: (content) => console.log('Show modal:', content),
    hide: () => console.log('Hide modal')
};

// Export all UI components
if (typeof window !== 'undefined') {
    // Components
    window.Hero = Hero;
    window.Navigation = Navigation;
    window.Avatar = Avatar;
    window.ProgressBar = ProgressBar;
    window.QuestCard = QuestCard;
    window.AchievementCard = AchievementCard;
    window.StatCard = StatCard;
    window.Chart = Chart;
    
    // Views
    window.DashboardView = DashboardView;
    window.QuestsView = QuestsView;
    window.ProgressView = ProgressView;
    window.NutritionView = NutritionView;
    window.MovementView = MovementView;
    window.RecoveryView = RecoveryView;
    window.MindfulnessView = MindfulnessView;
    window.AchievementsView = AchievementsView;
    window.SettingsView = SettingsView;
    
    // Modals
    window.MealModal = MealModal;
    window.ActivityModal = ActivityModal;
    window.SleepModal = SleepModal;
    window.MoodModal = MoodModal;
    window.CelebrationModal = CelebrationModal;
    window.OnboardingModal = OnboardingModal;
    
    // UI utilities
    window.Toast = Toast;
    window.Modal = Modal;
}
