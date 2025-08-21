# 🌟 HealthQuest - Holistic Fitness RPG v2.0

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/healthquest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Transform your health journey into an epic adventure! Level up through balanced habits across nutrition, movement, recovery, and mindfulness - not just weight loss.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel Button (Easiest)
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Name your project and deploy!

### Option 2: Deploy from GitHub
1. Fork this repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your forked repo
5. Click "Deploy" (no configuration needed!)

### Option 3: Deploy via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Clone the repo
git clone https://github.com/yourusername/healthquest.git
cd healthquest

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

## 📁 Project Structure

```
healthquest/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── package.json            # NPM configuration
├── vercel.json            # Vercel configuration
├── README.md              # Documentation
├── LICENSE                # MIT License
├── .gitignore            # Git ignore rules
│
├── js/                   # JavaScript modules
│   ├── core/            # Core systems
│   │   ├── config.js    # Configuration
│   │   ├── constants.js # Game constants
│   │   ├── eventbus.js  # Event system
│   │   └── storage.js   # Storage abstraction
│   │
│   ├── models/          # Data models
│   │   ├── player.js    # Player model
│   │   ├── quest.js     # Quest model
│   │   ├── achievement.js
│   │   ├── habit.js
│   │   ├── meal.js
│   │   ├── activity.js
│   │   ├── sleep.js
│   │   └── mood.js
│   │
│   ├── systems/         # Game systems
│   │   ├── quest-system.js
│   │   ├── achievement-system.js
│   │   ├── analytics-system.js
│   │   ├── notification-system.js
│   │   ├── wahd-system.js
│   │   └── streak-system.js
│   │
│   ├── ui/             # UI components
│   │   ├── components/ # Reusable components
│
