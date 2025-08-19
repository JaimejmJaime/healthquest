# 🌟 HealthQuest - Holistic Fitness RPG

Transform your health journey into an epic adventure! Level up through balanced habits across nutrition, movement, recovery, and mindfulness - not just weight loss.

![HealthQuest Hero](https://img.shields.io/badge/HealthQuest-Holistic%20Fitness%20RPG-4ade80?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

## ✨ Features

### 🎮 **Core Gamification**
- 🧙‍♀️ **Avatar Progression** - Cosmetic evolution based on balanced habits, never body size
- ⚔️ **Daily Quests** - 4 categories: Nutrition, Movement, Recovery, Mindfulness  
- 🌳 **Skill Trees** - Level up across all wellness areas
- 🏆 **Achievement System** - Unlock rewards for consistency and growth
- 📊 **WAHD Tracking** - Weekly Active Healthy Days as your North Star metric

### 👥 **Social Features**
- 🛡️ **Squad System** - 2-8 person teams for accountability
- 🐉 **Weekly Boss Battles** - Defeat challenges through collective habits
- 📈 **Improvement Leaderboards** - Rankings based on personal growth, not absolute performance

### 🛡️ **Safety & Ethics**
- ⚡ **Daily XP Caps** - Prevents unhealthy grinding behavior
- 💜 **Streak Forgiveness** - Life happens, get back on track without penalty
- 🔍 **Pattern Detection** - Gentle alerts for concerning restriction behaviors
- 🌈 **Body-Positive Language** - Focus on habits, not appearance
- 🔒 **Privacy First** - Anonymous play with optional account creation

### 📱 **Technical Features**
- 💾 **Offline Support** - Works without internet via Service Worker
- 📲 **PWA Ready** - Install as app on any device
- 📊 **Data Export** - Full data portability and ownership
- 🎨 **Responsive Design** - Beautiful on mobile, tablet, and desktop

## 🎯 Our North Star Metric

**WAHD (Weekly Active Healthy Days)**

Days per week you complete healthy habits across multiple wellness areas. This focuses on consistency and balance rather than just weight loss.

## 🚀 Live Demo

**[🌟 Play HealthQuest Now](https://healthquest-pi.vercel.app/)**

## 📸 Screenshots

### Dashboard
![Dashboard showing avatar, skill trees, and weekly progress](#)

### Daily Quests
![Quest interface with nutrition, movement, recovery, and mindfulness challenges](#)

### Squad Features
![Squad creation and boss battle interface](#)

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (no frameworks for fast loading)
- **Styling**: Custom CSS with modern gradients and animations
- **Storage**: localStorage with account sync capability
- **PWA**: Service Worker + Web App Manifest
- **Deployment**: Vercel (zero-config)

## 🏗️ Project Structure

```
healthquest/
├── index.html          # Complete single-page application
├── sw.js              # Service Worker for offline functionality
├── manifest.json      # PWA manifest for app installation
├── vercel.json        # Deployment configuration
├── package.json       # Project metadata and scripts
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## 🚀 Quick Start

### Local Development

1. **Clone and setup:**
   ```bash
   git clone https://github.com/yourusername/healthquest.git
   cd healthquest
   ```

2. **Run locally:**
   ```bash
   # Option 1: Simple HTTP server
   python -m http.server 8000
   # Then visit http://localhost:8000
   
   # Option 2: With Vercel CLI
   npm install -g vercel
   vercel dev
   ```

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Done!** Your app is live at `https://your-project.vercel.app`

### Deploy to Netlify

1. **Drag & Drop:** Go to [netlify.com](https://netlify.com) and drag your project folder
2. **Git Integration:** Connect your GitHub repo for auto-deploys

### Deploy to GitHub Pages

1. **Push to GitHub:** Upload files to a public repository
2. **Enable Pages:** Settings > Pages > Deploy from main branch
3. **Access:** `https://yourusername.github.io/healthquest`

## 🎮 How to Play

### Getting Started
1. **Open HealthQuest** in your browser
2. **Start anonymous** or create an account for full features
3. **Complete your first quest** to earn XP and level up
4. **Build streaks** across all 4 wellness areas

### Core Gameplay Loop
1. **Morning:** Check daily quests and plan your day
2. **Throughout Day:** Log meals, activities, and habits
3. **Evening:** Complete recovery quests and reflect
4. **Weekly:** Join squad boss battles and see progress

### Advanced Features
- **Create/Join Squads** for accountability and team challenges
- **Track WAHD** to see your consistency across wellness areas
- **Unlock Achievements** for major milestones
- **Export Data** to track long-term progress

## 🔧 Configuration

### Environment Variables (Optional)

For production deployments with backend features:

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Firebase (for real-time squads)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=healthquest.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=healthquest

# Stripe (for premium features)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

### Custom Domain Setup

1. **Buy domain** from Namecheap, Porkbun, etc.
2. **Add to Vercel:** Project Settings > Domains
3. **Update DNS** as instructed
4. **SSL auto-configured** by Vercel

## 📈 Roadmap

### Phase 1: MVP ✅
- [x] Core quest system
- [x] Avatar progression
- [x] Local data storage
- [x] Safety guardrails
- [x] PWA functionality

### Phase 2: Social (Q2 2024)
- [ ] Real-time squad features with Firebase
- [ ] Enhanced boss battles
- [ ] Global leaderboards
- [ ] Friend invitations

### Phase 3: Integrations (Q3 2024)
- [ ] HealthKit / Google Fit sync
- [ ] Barcode scanning for nutrition
- [ ] Wearable device support
- [ ] Third-party app integrations

### Phase 4: Premium (Q4 2024)
- [ ] Advanced analytics dashboard
- [ ] AI-powered insights
- [ ] Custom avatar skins
- [ ] Meal planning features

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup
```bash
git clone https://github.com/yourusername/healthquest.git
cd healthquest
# Make changes to index.html
# Test locally with any HTTP server
```

### Guidelines
- **Safety First**: All features must promote healthy behaviors
- **Inclusive Design**: Body-positive language and imagery only  
- **Privacy Focused**: Minimal data collection, maximum user control
- **Performance**: Keep the app fast and lightweight

### Areas We Need Help
- 🎨 **UI/UX Design** - Making wellness feel magical
- 🔬 **Behavioral Science** - Habit formation research
- 🏥 **Health Expertise** - RD and mental health guidance
- 🌍 **Localization** - Multi-language support
- ♿ **Accessibility** - Screen reader and mobility support

## 🏆 Recognition

### Built With Ethics
- **No Loot Boxes** - All progression is through healthy habits
- **No Pay-to-Win** - Premium features are convenience only
- **No Body Shaming** - Avatar progression is cosmetic, not body-based
- **No Extreme Restrictions** - Safety alerts for concerning patterns

### Inspired By
- **MyFitnessPal** - Comprehensive tracking
- **Duolingo** - Gamification done right
- **Stardew Valley** - Gentle, sustainable progression
- **Ring Fit Adventure** - Making fitness fun

## 📄 License

MIT License - feel free to fork and create your own wellness adventures!

## 🙏 Acknowledgments

- **Users** who prioritize health over appearance
- **Health professionals** promoting balanced wellness
- **Open source community** for amazing tools
- **Body-positive movement** for inclusive language

## 📞 Support

### Community
- **Discord**: [Join our wellness community](#)
- **Reddit**: [r/HealthQuest](#)
- **Twitter**: [@HealthQuestApp](#)

### Technical Support
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/healthquest/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/healthquest/discussions)
- **Email**: support@healthquest.app

---

**🌟 Start your holistic wellness adventure today! Transform healthy habits into an epic RPG journey.**

[**🎮 Play Now**](https://your-deployed-url.vercel.app) | [**⭐ Star on GitHub**](https://github.com/yourusername/healthquest) | [**🐦 Follow Updates**](https://twitter.com/healthquestapp)

