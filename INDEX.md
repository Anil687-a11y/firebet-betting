# 📚 FireBet Documentation Index

Welcome to FireBet! This index will help you find the right documentation.

## 🚀 Getting Started (Choose One)

### I want to start IMMEDIATELY
→ **[START.md](START.md)** - 2-minute quick start

### I'm new to this project
→ **[GETTING_STARTED.md](GETTING_STARTED.md)** - Beginner-friendly guide

### I want detailed instructions
→ **[SETUP.md](SETUP.md)** - Complete setup guide

## 📖 Understanding the Project

### What is this project?
→ **[README.md](README.md)** - Project overview

### How does the app work?
→ **[APP_FLOW.md](APP_FLOW.md)** - Visual user journey

### What's been built?
→ **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete feature list

### What do I need to do before launch?
→ **[FINAL_CHECKLIST.md](FINAL_CHECKLIST.md)** - Pre-launch checklist

## 🎯 Quick Reference

### Installation
```bash
# Windows users
Double-click: install.bat

# Everyone else
npm run install-all
```

### Starting the App
```bash
# Windows users
Double-click: start.bat

# Everyone else
npm run dev
```

### Accessing the App
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 File Structure

```
firebet-app/
├── 📄 Documentation
│   ├── README.md              ← Project overview
│   ├── START.md               ← Quick start (2 min)
│   ├── GETTING_STARTED.md     ← Beginner guide
│   ├── SETUP.md               ← Detailed setup
│   ├── APP_FLOW.md            ← User journey
│   ├── PROJECT_SUMMARY.md     ← Feature list
│   ├── FINAL_CHECKLIST.md     ← Pre-launch tasks
│   └── INDEX.md               ← This file
│
├── 🖥️ Backend
│   ├── server/
│   │   ├── models/            ← Database schemas
│   │   ├── routes/            ← API endpoints
│   │   ├── middleware/        ← Auth middleware
│   │   └── index.js           ← Server entry
│   └── .env                   ← Configuration
│
├── 📱 Frontend
│   └── client/
│       ├── public/            ← Static files
│       └── src/
│           ├── components/    ← Reusable UI
│           ├── pages/         ← App screens
│           ├── context/       ← State management
│           ├── utils/         ← Helpers & API
│           └── App.js         ← Main component
│
├── 📦 Scripts
│   ├── install.bat            ← Windows installer
│   ├── start.bat              ← Windows starter
│   └── package.json           ← npm scripts
│
└── 📂 Data
    └── uploads/               ← Screenshot storage
```

## 🎓 Learning Path

### Day 1: Setup & Test
1. Read [START.md](START.md)
2. Install dependencies
3. Start the app
4. Create test account
5. Explore features

### Day 2: Understand
1. Read [APP_FLOW.md](APP_FLOW.md)
2. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
3. Review code structure
4. Test all features

### Day 3: Configure
1. Read [SETUP.md](SETUP.md)
2. Setup email service
3. Integrate eSewa
4. Create admin account

### Day 4: Deploy
1. Read [FINAL_CHECKLIST.md](FINAL_CHECKLIST.md)
2. Deploy backend
3. Deploy frontend
4. Test production

### Day 5: Launch
1. Final testing
2. Monitor logs
3. Launch! 🚀

## 🔍 Find Specific Information

### Authentication
- Code: `server/routes/auth.js`
- Frontend: `client/src/pages/Login.js`, `Register.js`, `Verify.js`

### Room Management
- Code: `server/routes/rooms.js`
- Frontend: `client/src/pages/Rooms.js`, `CreateRoom.js`, `RoomDetail.js`

### Wallet System
- Code: `server/routes/wallet.js`
- Frontend: `client/src/pages/Wallet.js`

### Admin Panel
- Code: `server/routes/admin.js`
- Frontend: `client/src/pages/AdminPanel.js`

### Database Models
- User: `server/models/User.js`
- Room: `server/models/Room.js`
- Transaction: `server/models/Transaction.js`

## 🆘 Troubleshooting

### App won't start?
→ Check [GETTING_STARTED.md](GETTING_STARTED.md) - Common Issues section

### Need to configure something?
→ Check [SETUP.md](SETUP.md) - Configuration section

### Want to understand a feature?
→ Check [APP_FLOW.md](APP_FLOW.md) - Visual guides

### Ready to deploy?
→ Check [FINAL_CHECKLIST.md](FINAL_CHECKLIST.md) - Deployment section

## 📞 Quick Commands

```bash
# Install everything
npm run install-all

# Start development
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Install backend deps
npm install

# Install frontend deps
cd client && npm install
```

## 🎯 Common Tasks

### Create Admin Account
1. Register normally
2. Go to MongoDB Atlas
3. Edit user: `isAdmin: true`

### Test Payment Flow
1. Go to Wallet
2. Click Deposit
3. Enter amount
4. Currently adds directly (eSewa not integrated yet)

### Test Complete Flow
1. Create room (User A)
2. Join room (User B in incognito)
3. Submit screenshots (both)
4. Login as admin
5. Declare winner

## 📊 Project Status

### ✅ Complete
- All features implemented
- Frontend & backend working
- Documentation complete
- Ready for local testing

### ⚠️ Needs Configuration
- Email service (for production)
- eSewa payment (for real money)
- Deployment (for public access)

### 🚀 Next Steps
1. Test locally
2. Configure email
3. Integrate eSewa
4. Deploy
5. Launch!

## 🎉 You're Ready!

Pick a guide and start:
- **Fastest**: [START.md](START.md)
- **Easiest**: [GETTING_STARTED.md](GETTING_STARTED.md)
- **Most Detailed**: [SETUP.md](SETUP.md)

---

**Happy Building!** 🔥
