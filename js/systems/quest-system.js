/**
 * Quest System
 * Manages daily quests, weekly challenges, and quest generation
 */

class QuestSystem {
    constructor() {
        this.dailyQuests = [];
        this.weeklyChallenge = null;
        this.eventQuests = [];
        this.history = [];
        this.templates = this.loadQuestTemplates();
        this.lastGeneratedDate = null;
        
        this.init();
    }
    
    init() {
        // Load quest history from storage
        this.loadHistory();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    loadQuestTemplates() {
        return {
            nutrition: [
                // Easy (15-25 XP) - Level 1+
                { id: 'n_mindful_1', title: 'Mindful Eating', description: 'Eat one meal without distractions', xp: 25, difficulty: 'easy', minLevel: 1, category: 'awareness' },
                { id: 'n_color_1', title: 'Colorful Plate', description: 'Include 3+ different colored foods in one meal', xp: 20, difficulty: 'easy', minLevel: 1, category: 'variety' },
                { id: 'n_hydrate_1', title: 'Hydration Hero', description: 'Drink 8 glasses of water throughout the day', xp: 20, difficulty: 'easy', minLevel: 1, category: 'hydration' },
                { id: 'n_breakfast_1', title: 'Breakfast Champion', description: 'Eat something within 2 hours of waking up', xp: 15, difficulty: 'easy', minLevel: 1, category: 'timing' },
                { id: 'n_veggie_1', title: 'Veggie Victory', description: 'Include vegetables in 2+ meals today', xp: 25, difficulty: 'easy', minLevel: 1, category: 'vegetables' },
                { id: 'n_fruit_1', title: 'Fruit Focus', description: 'Eat 2 servings of fresh fruit today', xp: 20, difficulty: 'easy', minLevel: 1, category: 'fruit' },
                { id: 'n_snack_1', title: 'Smart Snacking', description: 'Choose a healthy snack over processed food', xp: 15, difficulty: 'easy', minLevel: 1, category: 'snacks' },
                { id: 'n_slow_1', title: 'Slow Down', description: 'Take at least 20 minutes to eat a meal', xp: 20, difficulty: 'easy', minLevel: 1, category: 'awareness' },
                { id: 'n_share_1', title: 'Social Meal', description: 'Share a meal with someone', xp: 20, difficulty: 'easy', minLevel: 1, category: 'social' },
                
                // Medium (25-35 XP) - Level 3+
                { id: 'n_cook_1', title: 'Home Cooking', description: 'Prepare a meal from scratch using whole ingredients', xp: 35, difficulty: 'medium', minLevel: 3, category: 'cooking' },
                { id: 'n_protein_1', title: 'Protein Power', description: 'Include a protein source in each main meal', xp: 30, difficulty: 'medium', minLevel: 3, category: 'macros' },
                { id: 'n_fiber_1', title: 'Fiber Focus', description: 'Choose whole grains over refined grains today', xp: 25, difficulty: 'medium', minLevel: 3, category: 'fiber' },
                { id: 'n_fats_1', title: 'Healthy Fats', description: 'Include nuts, seeds, avocado, or olive oil in your meals', xp: 25, difficulty: 'medium', minLevel: 4, category: 'fats' },
                { id: 'n_sugar_1', title: 'Sugar Awareness', description: 'Read labels and choose items with <10g added sugar', xp: 30, difficulty: 'medium', minLevel: 4, category: 'sugar' },
                { id: 'n_portion_1', title: 'Portion Wisdom', description: 'Use smaller plates and eat until satisfied, not full', xp: 30, difficulty: 'medium', minLevel: 5, category: 'portions' },
                { id: 'n_swap_1', title: 'Healthy Swaps', description: 'Make 3 conscious healthy food swaps today', xp: 28, difficulty: 'medium', minLevel: 5, category: 'choices' },
                { id: 'n_plan_1', title: 'Meal Planning', description: 'Plan tomorrow\'s meals tonight', xp: 30, difficulty: 'medium', minLevel: 6, category: 'planning' },
                { id: 'n_rainbow_1', title: 'Eat the Rainbow', description: 'Eat 5+ different colored foods today', xp: 32, difficulty: 'medium', minLevel: 6, category: 'variety' },
                
                // Hard (35-45 XP) - Level 7+
                { id: 'n_prep_1', title: 'Meal Prep Master', description: 'Prepare 3+ meals for tomorrow or this week', xp: 45, difficulty: 'hard', minLevel: 7, category: 'planning' },
                { id: 'n_anti_1', title: 'Anti-Inflammatory', description: 'Include 3+ anti-inflammatory foods', xp: 40, difficulty: 'hard', minLevel: 8, category: 'health' },
                { id: 'n_gut_1', title: 'Gut Health Guardian', description: 'Include 2+ fermented or probiotic foods', xp: 40, difficulty: 'hard', minLevel: 8, category: 'gut' },
                { id: 'n_local_1', title: 'Local Harvest', description: 'Choose locally-sourced ingredients for one meal', xp: 35, difficulty: 'hard', minLevel: 10, category: 'sustainable' },
                { id: 'n_zero_1', title: 'Zero Waste Warrior', description: 'Complete a day with no food waste', xp: 42, difficulty: 'hard', minLevel: 10, category: 'sustainable' },
                { id: 'n_batch_1', title: 'Batch Cooking', description: 'Cook a large batch of a healthy staple', xp: 40, difficulty: 'hard', minLevel: 12, category: 'cooking' },
                { id: 'n_new_1', title: 'Culinary Explorer', description: 'Try a new healthy recipe', xp: 38, difficulty: 'hard', minLevel: 8, category: 'variety' }
            ],
            
            movement: [
                // Easy (15-25 XP) - Level 1+
                { id: 'm_morning_1', title: 'Morning Movement', description: '5-minute gentle stretching or walking upon waking', xp: 20, difficulty: 'easy', minLevel: 1, category: 'flexibility' },
                { id: 'm_stairs_1', title: 'Stair Climber', description: 'Take stairs instead of elevators today', xp: 15, difficulty: 'easy', minLevel: 1, category: 'daily' },
                { id: 'm_desk_1', title: 'Desk Break', description: 'Stand and move for 2 minutes every hour', xp: 20, difficulty: 'easy', minLevel: 1, category: 'breaks' },
                { id: 'm_walk_1', title: 'Walking Meditation', description: 'Take a 10-minute mindful walk', xp: 25, difficulty: 'easy', minLevel: 1, category: 'walking' },
                { id: 'm_dance_1', title: 'Dance Party', description: 'Dance to 3+ songs', xp: 25, difficulty: 'easy', minLevel: 1, category: 'fun' },
                { id: 'm_park_1', title: 'Park Farther', description: 'Park in the farthest spot and walk', xp: 15, difficulty: 'easy', minLevel: 1, category: 'daily' },
                { id: 'm_tv_1', title: 'TV Exercises', description: 'Do simple exercises during TV commercials', xp: 18, difficulty: 'easy', minLevel: 1, category: 'home' },
                { id: 'm_play_1', title: 'Playful Movement', description: 'Play actively with kids or pets for 10 minutes', xp: 22, difficulty: 'easy', minLevel: 1, category: 'fun' },
                { id: 'm_clean_1', title: 'Active Cleaning', description: 'Do 15 minutes of vigorous housework', xp: 20, difficulty: 'easy', minLevel: 1, category: 'daily' },
                
                // Medium (25-35 XP) - Level 3+
                { id: 'm_steps_1', title: 'Step Challenge', description: 'Take 8,000+ steps today', xp: 30, difficulty: 'medium', minLevel: 3, category: 'walking' },
                { id: 'm_strength_1', title: 'Strength Builder', description: '15-minute strength training session', xp: 35, difficulty: 'medium', minLevel: 3, category: 'strength' },
                { id: 'm_cardio_1', title: 'Cardio Burst', description: '20 minutes of elevated heart rate activity', xp: 30, difficulty: 'medium', minLevel: 4, category: 'cardio' },
                { id: 'm_outdoor_1', title: 'Fresh Air Fitness', description: 'Exercise outdoors for 20+ minutes', xp: 28, difficulty: 'medium', minLevel: 4, category: 'outdoor' },
                { id: 'm_yoga_1', title: 'Flexibility Flow', description: '20-minute yoga or stretching routine', xp: 30, difficulty: 'medium', minLevel: 5, category: 'flexibility' },
                { id: 'm_sport_1', title: 'Sport & Play', description: 'Engage in recreational sports for 30+ minutes', xp: 35, difficulty: 'medium', minLevel: 5, category: 'sports' },
                { id: 'm_commute_1', title: 'Active Commute', description: 'Walk or bike part of your commute', xp: 32, difficulty: 'medium', minLevel: 6, category: 'daily' },
                { id: 'm_hiit_1', title: 'HIIT Session', description: 'Complete a 15-minute HIIT workout', xp: 35, difficulty: 'medium', minLevel: 7, category: 'cardio' },
                { id: 'm_swim_1', title: 'Water Workout', description: 'Swim or do water exercises for 20 minutes', xp: 32, difficulty: 'medium', minLevel: 5, category: 'swimming' },
                
                // Hard (35-45 XP) - Level 7+
                { id: 'm_endure_1', title: 'Endurance Explorer', description: '45+ minute continuous cardio activity', xp: 45, difficulty: 'hard', minLevel: 7, category: 'cardio' },
                { id: 'm_circuit_1', title: 'Strength Circuit', description: 'Complete a 30-minute full-body circuit', xp: 42, difficulty: 'hard', minLevel: 8, category: 'strength' },
                { id: 'm_balance_1', title: 'Balance Master', description: '20-minute balance and stability training', xp: 38, difficulty: 'hard', minLevel: 9, category: 'balance' },
                { id: 'm_adventure_1', title: 'Active Adventure', description: 'Try a new physical activity or sport', xp: 40, difficulty: 'hard', minLevel: 10, category: 'variety' },
                { id: 'm_marathon_1', title: 'Distance Training', description: 'Complete a long-distance training session', xp: 45, difficulty: 'hard', minLevel: 12, category: 'endurance' },
                { id: 'm_climb_1', title: 'Elevation Gain', description: 'Hike or climb with 500+ ft elevation gain', xp: 42, difficulty: 'hard', minLevel: 10, category: 'outdoor' },
                { id: 'm_double_1', title: 'Double Session', description: 'Complete two different workouts today', xp: 45, difficulty: 'hard', minLevel: 15, category: 'variety' }
            ],
            
            recovery: [
                // Easy (15-25 XP) - Level 1+
                { id: 'r_early_1', title: 'Early Bird', description: 'Go to bed 30 minutes earlier than usual', xp: 20, difficulty: 'easy', minLevel: 1, category: 'sleep' },
                { id: 'r_digital_1', title: 'Digital Sunset', description: 'No screens 1 hour before bedtime', xp: 25, difficulty: 'easy', minLevel: 1, category: 'habits' },
                { id: 'r_breathe_1', title: 'Breathing Space', description: '5-minute deep breathing exercise', xp: 15, difficulty: 'easy', minLevel: 1, category: 'relaxation' },
                { id: 'r_evening_1', title: 'Gentle Evening', description: 'Create a calming evening routine', xp: 20, difficulty: 'easy', minLevel: 1, category: 'habits' },
                { id: 'r_nap_1', title: 'Power Nap', description: 'Take a 10-20 minute power nap', xp: 20, difficulty: 'easy', minLevel: 1, category: 'rest' },
                { id: 'r_stretch_1', title: 'Stretch Break', description: '5-minute stretching every 2 hours', xp: 18, difficulty: 'easy', minLevel: 1, category: 'flexibility' },
                { id: 'r_tea_1', title: 'Herbal Helper', description: 'Drink herbal tea instead of caffeine after 2pm', xp: 15, difficulty: 'easy', minLevel: 1, category: 'habits' },
                { id: 'r_quiet_1', title: 'Quiet Time', description: 'Spend 15 minutes in quiet reflection', xp: 20, difficulty: 'easy', minLevel: 1, category: 'mental' },
                { id: 'r_comfort_1', title: 'Comfort Zone', description: 'Wear comfortable clothes and relax for 30 minutes', xp: 15, difficulty: 'easy', minLevel: 1, category: 'comfort' },
                
                // Medium (25-35 XP) - Level 3+
                { id: 'r_sleep_1', title: 'Sleep Sanctuary', description: '7+ hours of quality sleep', xp: 35, difficulty: 'medium', minLevel: 3, category: 'sleep' },
                { id: 'r_stress_1', title: 'Stress Release', description: '20 minutes of stress-relief activity', xp: 30, difficulty: 'medium', minLevel: 3, category: 'stress' },
                { id: 'r_active_1', title: 'Active Recovery', description: 'Gentle movement like restorative yoga', xp: 28, difficulty: 'medium', minLevel: 4, category: 'movement' },
                { id: 'r_bath_1', title: 'Bath Ritual', description: 'Take a relaxing bath with Epsom salts', xp: 25, difficulty: 'medium', minLevel: 4, category: 'relaxation' },
                { id: 'r_body_1', title: 'Body Scan', description: '15-minute progressive muscle relaxation', xp: 30, difficulty: 'medium', minLevel: 5, category: 'relaxation' },
                { id: 'r_social_1', title: 'Social Recharge', description: 'Quality time with loved ones without devices', xp: 32, difficulty: 'medium', minLevel: 5, category: 'social' },
                { id: 'r_nature_1', title: 'Nature Recovery', description: 'Spend 30 minutes in nature', xp: 30, difficulty: 'medium', minLevel: 6, category: 'outdoor' },
                { id: 'r_massage_1', title: 'Self-Massage', description: '15-minute self-massage or foam rolling', xp: 28, difficulty: 'medium', minLevel: 6, category: 'physical' },
                { id: 'r_music_1', title: 'Music Therapy', description: 'Listen to calming music for 20 minutes', xp: 25, difficulty: 'medium', minLevel: 3, category: 'mental' },
                
                // Hard (35-45 XP) - Level 7+
                { id: 'r_protocol_1', title: 'Recovery Protocol', description: 'Complete full recovery routine', xp: 45, difficulty: 'hard', minLevel: 7, category: 'comprehensive' },
                { id: 'r_optimize_1', title: 'Sleep Optimization', description: '8+ hours with consistent schedule', xp: 40, difficulty: 'hard', minLevel: 8, category: 'sleep' },
                { id: 'r_master_1', title: 'Stress Mastery', description: 'Advanced stress management session', xp: 42, difficulty: 'hard', minLevel: 9, category: 'stress' },
                { id: 'r_detox_1', title: 'Digital Detox', description: '4+ hours completely offline', xp: 38, difficulty: 'hard', minLevel: 10, category: 'digital' },
                { id: 'r_day_1', title: 'Recovery Day', description: 'Full day focused on rest and recovery', xp: 45, difficulty: 'hard', minLevel: 12, category: 'comprehensive' },
                { id: 'r_spa_1', title: 'Spa Day', description: 'Create a home spa experience', xp: 40, difficulty: 'hard', minLevel: 10, category: 'self-care' },
                { id: 'r_retreat_1', title: 'Mini Retreat', description: '2+ hours of recovery activities', xp: 45, difficulty: 'hard', minLevel: 15, category: 'comprehensive' }
            ],
            
            mindfulness: [
                // Easy (15-25 XP) - Level 1+
                { id: 'mi_gratitude_1', title: 'Gratitude Moment', description: 'Write down 3 things you\'re grateful for', xp: 20, difficulty: 'easy', minLevel: 1, category: 'gratitude' },
                { id: 'mi_body_1', title: 'Body Check-In', description: 'Notice how your body feels without judgment', xp: 15, difficulty: 'easy', minLevel: 1, category: 'awareness' },
                { id: 'mi_mindful_1', title: 'Mindful Bites', description: 'Eat one meal with full attention', xp: 20, difficulty: 'easy', minLevel: 1, category: 'eating' },
                { id: 'mi_pause_1', title: 'Present Pause', description: 'Take 5 mindful minutes', xp: 15, difficulty: 'easy', minLevel: 1, category: 'presence' },
                { id: 'mi_kind_1', title: 'Kindness Practice', description: 'Perform one act of kindness', xp: 25, difficulty: 'easy', minLevel: 1, category: 'kindness' },
                { id: 'mi_smile_1', title: 'Smile Practice', description: 'Smile at 5 people today', xp: 18, difficulty: 'easy', minLevel: 1, category: 'social' },
                { id: 'mi_compliment_1', title: 'Compliment Giver', description: 'Give 3 genuine compliments', xp: 20, difficulty: 'easy', minLevel: 1, category: 'kindness' },
                { id: 'mi_notice_1', title: 'Mindful Noticing', description: 'Notice 5 beautiful things today', xp: 20, difficulty: 'easy', minLevel: 1, category: 'awareness' },
                { id: 'mi_breath_1', title: 'Breath Awareness', description: 'Take 10 conscious breaths', xp: 15, difficulty: 'easy', minLevel: 1, category: 'breathing' },
                
                // Medium (25-35 XP) - Level 3+
                { id: 'mi_meditate_1', title: 'Meditation Session', description: '10-minute focused meditation', xp: 30, difficulty: 'medium', minLevel: 3, category: 'meditation' },
                { id: 'mi_emotion_1', title: 'Emotion Explorer', description: 'Journal about your emotions today', xp: 28, difficulty: 'medium', minLevel: 3, category: 'emotional' },
                { id: 'mi_nature_1', title: 'Nature Connection', description: '15+ minutes mindfully observing nature', xp: 25, difficulty: 'medium', minLevel: 4, category: 'nature' },
                { id: 'mi_values_1', title: 'Values Reflection', description: 'Reflect on your core values', xp: 30, difficulty: 'medium', minLevel: 4, category: 'reflection' },
                { id: 'mi_movement_1', title: 'Mindful Movement', description: 'Move with full awareness for 20 minutes', xp: 32, difficulty: 'medium', minLevel: 5, category: 'movement' },
                { id: 'mi_create_1', title: 'Creativity Flow', description: '20+ minutes of creative expression', xp: 28, difficulty: 'medium', minLevel: 5, category: 'creative' },
                { id: 'mi_forgive_1', title: 'Forgiveness Practice', description: 'Practice forgiving yourself or others', xp: 35, difficulty: 'medium', minLevel: 6, category: 'emotional' },
                { id: 'mi_loving_1', title: 'Loving Thoughts', description: 'Send loving thoughts to 5 people', xp: 25, difficulty: 'medium', minLevel: 5, category: 'kindness' },
                { id: 'mi_journal_1', title: 'Deep Journaling', description: 'Journal for 15+ minutes', xp: 30, difficulty: 'medium', minLevel: 4, category: 'reflection' },
                
                // Hard (35-45 XP) - Level 7+
                { id: 'mi_extended_1', title: 'Extended Meditation', description: '20+ minute deep meditation', xp: 45, difficulty: 'hard', minLevel: 7, category: 'meditation' },
                { id: 'mi_shadow_1', title: 'Shadow Work', description: 'Explore challenging emotions deeply', xp: 40, difficulty: 'hard', minLevel: 8, category: 'emotional' },
                { id: 'mi_loving_kind_1', title: 'Loving-Kindness', description: 'Complete loving-kindness meditation', xp: 38, difficulty: 'hard', minLevel: 9, category: 'meditation' },
                { id: 'mi_vision_1', title: 'Life Vision', description: 'Deep reflection on purpose and goals', xp: 42, difficulty: 'hard', minLevel: 10, category: 'reflection' },
                { id: 'mi_silent_1', title: 'Silent Hour', description: 'Spend an hour in complete silence', xp: 45, difficulty: 'hard', minLevel: 12, category: 'silence' },
                { id: 'mi_retreat_1', title: 'Mindfulness Retreat', description: '2+ hours of mindfulness practices', xp: 45, difficulty: 'hard', minLevel: 15, category: 'comprehensive' },
                { id: 'mi_wisdom_1', title: 'Wisdom Reflection', description: 'Deep contemplation on life lessons', xp: 40, difficulty: 'hard', minLevel: 10, category: 'reflection' }
            ]
        };
    }
    
    generateDailyQuests(player, date = new Date()) {
        const dateString = date.toDateString();
        
        // Check if quests already generated for today
        if (this.lastGeneratedDate === dateString && this.dailyQuests.length > 0) {
            return this.dailyQuests;
        }
        
        this.dailyQuests = [];
        const categories = ['nutrition', 'movement', 'recovery', 'mindfulness'];
        
        categories.forEach(category => {
            const quest = this.selectQuest(category, player);
            if (quest) {
                this.dailyQuests.push({
                    ...quest,
                    id: `${quest.id}_${Date.now()}`,
                    category,
                    completed: false,
                    date: dateString,
                    progress: 0
                });
            }
        });
        
        this.lastGeneratedDate = dateString;
        this.saveToHistory();
        
        EventBus.emit('quests-generated', {
            quests: this.dailyQuests,
            date: dateString
        });
        
        return this.dailyQuests;
    }
    
    selectQuest(category, player) {
        const templates = this.templates[category];
        const playerLevel = player.level;
        
        // Filter available quests
        let availableQuests = templates.filter(quest => 
            quest.minLevel <= playerLevel &&
            !this.wasRecentlyUsed(quest.id)
        );
        
        // If no quests available, use all eligible quests
        if (availableQuests.length === 0) {
            availableQuests = templates.filter(quest => quest.minLevel <= playerLevel);
        }
        
        // Weight selection based on difficulty and player level
        const difficultyWeights = this.calculateDifficultyWeights(playerLevel);
        
        // Select quest based on weights
        return this.weightedSelection(availableQuests, difficultyWeights);
    }
    
    calculateDifficultyWeights(level) {
        if (level < 5) {
            return { easy: 0.7, medium: 0.25, hard: 0.05 };
        } else if (level < 10) {
            return { easy: 0.4, medium: 0.45, hard: 0.15 };
        } else if (level < 20) {
            return { easy: 0.2, medium: 0.5, hard: 0.3 };
        } else {
            return { easy: 0.1, medium: 0.4, hard: 0.5 };
        }
    }
    
    weightedSelection(quests, weights) {
        if (quests.length === 0) return null;
        
        // Calculate total weight
        let totalWeight = 0;
        const weightedQuests = quests.map(quest => {
            const weight = weights[quest.difficulty] || 0.33;
            totalWeight += weight;
            return { quest, weight };
        });
        
        // Random selection
        let random = Math.random() * totalWeight;
        for (const item of weightedQuests) {
            random -= item.weight;
            if (random <= 0) {
                return item.quest;
            }
        }
        
        // Fallback to last quest
        return quests[quests.length - 1];
    }
    
    generateWeeklyChallenge(player) {
        const challenges = [
            {
                id: 'wc_balanced',
                title: 'Balanced Warrior',
                description: 'Complete at least 1 quest from each category daily for 5 days',
                xp: 200,
                progress: 0,
                target: 5,
                type: 'balanced'
            },
            {
                id: 'wc_consistent',
                title: 'Consistency Champion',
                description: 'Complete all daily quests for 3 consecutive days',
                xp: 250,
                progress: 0,
                target: 3,
                type: 'streak'
            },
            {
                id: 'wc_master',
                title: 'Skill Master',
                description: 'Level up any skill tree this week',
                xp: 300,
                progress: 0,
                target: 1,
                type: 'skill'
            },
            {
                id: 'wc_explorer',
                title: 'Quest Explorer',
                description: 'Complete 10 different types of quests this week',
                xp: 225,
                progress: 0,
                target: 10,
                type: 'variety'
            },
            {
                id: 'wc_achiever',
                title: 'Achievement Hunter',
                description: 'Unlock 3 achievements this week',
                xp: 275,
                progress: 0,
                target: 3,
                type: 'achievements'
            },
            {
                id: 'wc_perfect',
                title: 'Perfect Week',
                description: 'Achieve 7 WAHD (Weekly Active Healthy Days)',
                xp: 350,
                progress: 0,
                target: 7,
                type: 'wahd'
            }
        ];
        
        // Select challenge based on player behavior
        const suitableChallenges = challenges.filter(challenge => {
            if (challenge.type === 'skill' && player.level < 5) return false;
            if (challenge.type === 'wahd' && player.level < 10) return false;
            return true;
        });
        
        this.weeklyChallenge = suitableChallenges[Math.floor(Math.random() * suitableChallenges.length)];
        this.weeklyChallenge.startDate = new Date().toISOString();
        this.weeklyChallenge.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        EventBus.emit('weekly-challenge-generated', {
            challenge: this.weeklyChallenge
        });
        
        return this.weeklyChallenge;
    }
    
    completeQuest(questId, player) {
        const quest = this.dailyQuests.find(q => q.id === questId);
        
        if (!quest) {
            return { success: false, reason: 'Quest not found' };
        }
        
        if (quest.completed) {
            return { success: false, reason: 'Quest already completed' };
        }
        
        // Mark as completed
        quest.completed = true;
        quest.completedAt = new Date().toISOString();
        
        // Add XP
        const xpResult = player.addXP(quest.xp, quest.category);
        
        if (xpResult.success) {
            // Update stats
            player.incrementStat('questsCompleted');
            
            // Update weekly challenge
            this.updateWeeklyChallenge(quest, player);
            
            // Save to history
            this.saveToHistory();
            
            // Emit event
            EventBus.emit('quest-completed', {
                quest,
                player,
                xpGained: xpResult.xpGained
            });
            
            return {
                success: true,
                quest,
                xpGained: xpResult.xpGained,
                levelUp: xpResult.levelUp
            };
        }
        
        return xpResult;
    }
    
    updateWeeklyChallenge(quest, player) {
        if (!this.weeklyChallenge) return;
        
        const challenge = this.weeklyChallenge;
        
        switch (challenge.type) {
            case 'balanced':
                // Check if all categories completed today
                const todaysCategories = this.dailyQuests
                    .filter(q => q.completed)
                    .map(q => q.category);
                const uniqueCategories = [...new Set(todaysCategories)];
                
                if (uniqueCategories.length === 4) {
                    challenge.progress++;
                }
                break;
                
            case 'streak':
                // Track consecutive days
                // This would need more complex tracking
                break;
                
            case 'variety':
                // Track unique quest types
                const completedTypes = this.history
                    .filter(h => {
                        const questDate = new Date(h.date);
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return questDate > weekAgo && h.completed;
                    })
                    .map(h => h.questId);
                
                challenge.progress = [...new Set(completedTypes)].length;
                break;
        }
        
        // Check if challenge completed
        if (challenge.progress >= challenge.target && !challenge.completed) {
            challenge.completed = true;
            player.addXP(challenge.xp, 'challenge');
            player.incrementStat('challengesCompleted');
            
            EventBus.emit('challenge-completed', {
                challenge,
                player
            });
        }
    }
    
    wasRecentlyUsed(questId, days = 3) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        return this.history.some(entry => 
            entry.questId === questId && 
            new Date(entry.date) > cutoff
        );
    }
    
    saveToHistory() {
        this.dailyQuests.forEach(quest => {
            const existingEntry = this.history.find(h => 
                h.questId === quest.id && h.date === quest.date
            );
            
            if (!existingEntry) {
                this.history.push({
                    questId: quest.id,
                    templateId: quest.id.split('_')[0] + '_' + quest.id.split('_')[1] + '_' + quest.id.split('_')[2],
                    category: quest.category,
                    date: quest.date,
                    completed: quest.completed,
                    xp: quest.xp
                });
            } else if (quest.completed && !existingEntry.completed) {
                existingEntry.completed = true;
            }
        });
        
        // Keep only last 30 days
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - Config.GAME.QUEST_HISTORY_DAYS);
        
        this.history = this.history.filter(entry => 
            new Date(entry.date) > cutoff
        );
        
        // Save to storage
        Storage.set(Config.STORAGE.QUEST_HISTORY, this.history);
    }
    
    loadHistory() {
        this.history = Storage.get(Config.STORAGE.QUEST_HISTORY) || [];
    }
    
    getQuestStats() {
        const stats = {
            totalGenerated: this.history.length,
            totalCompleted: this.history.filter(h => h.completed).length,
            completionRate: 0,
            byCategory: {},
            byDifficulty: {},
            streakDays: 0,
            perfectDays: 0
        };
        
        if (stats.totalGenerated > 0) {
            stats.completionRate = Math.round((stats.totalCompleted / stats.totalGenerated) * 100);
        }
        
        // Category breakdown
        const categories = ['nutrition', 'movement', 'recovery', 'mindfulness'];
        categories.forEach(cat => {
            const catQuests = this.history.filter(h => h.category === cat);
            stats.byCategory[cat] = {
                total: catQuests.length,
                completed: catQuests.filter(h => h.completed).length,
                rate: catQuests.length > 0 ? 
                    Math.round((catQuests.filter(h => h.completed).length / catQuests.length) * 100) : 0
            };
        });
        
        return stats;
    }
    
    setupEventListeners() {
        // Listen for daily reset
        EventBus.on('daily-reset', (data) => {
            this.generateDailyQuests(data.player);
        });
        
        // Listen for week reset
        EventBus.on('week-reset', (data) => {
            this.generateWeeklyChallenge(data.player);
        });
    }
    
    toJSON() {
        return {
            dailyQuests: this.dailyQuests,
            weeklyChallenge: this.weeklyChallenge,
            history: this.history,
            lastGeneratedDate: this.lastGeneratedDate
        };
    }
    
    static fromJSON(data) {
        const system = new QuestSystem();
        system.dailyQuests = data.dailyQuests || [];
        system.weeklyChallenge = data.weeklyChallenge || null;
        system.history = data.history || [];
        system.lastGeneratedDate = data.lastGeneratedDate || null;
        return system;
    }
}
