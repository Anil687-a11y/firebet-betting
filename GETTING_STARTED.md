# 🚀 Getting Started with FireBet

## Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** (Free) - Already setup ✅

## Installation

### Windows Users (Easy Way)

1. **Double-click** `install.bat`
2. Wait for installation to complete
3. **Double-click** `start.bat` to run the app

### Manual Installation (All Platforms)

```bash
# 1. Install backend dependencies
npm install

# 2. Install frontend dependencies
cd client
npm install
cd ..

# 3. Start the app
npm run dev
```

## First Launch

1. Open browser: **http://localhost:3000**
2. You'll see the FireBet login page
3. Click **Register** to create an account

## Create Your First Account

1. Fill in:
   - Email
   - Password
   - Free Fire UID (your actual Free Fire UID)
   - Free Fire In-Game Name

2. Click **Register**

3. Check your email for verification code
   - If email not configured, check terminal/console for the code
   - Enter the 6-digit code

4. You're in! 🎉

## Make Yourself Admin

To access the admin panel:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **Browse Collections**
3. Find `firebet` database → `users` collection
4. Find your user (by email)
5. Click **Edit**
6. Add field: `"isAdmin": true`
7. Click **Update**
8. Refresh the app
9. You'll now see **Admin** tab in bottom navigation

## Test the App

### As Player:

1. **Deposit Money** (Wallet tab)
   - Click Deposit
   - Enter amount (e.g., 500)
   - Click "Pay via eSewa" (currently adds directly)

2. **Create Room** (Dashboard)
   - Click "Create Room"
   - Select match type (1v1, 2v2, etc.)
   - Enter Free Fire Room ID and Password
   - Enter stake amount (₹20-₹1000, multiples of 5)
   - Click "Create Room & Pay"

3. **Join Room** (as another user)
   - Open app in incognito/another browser
   - Register another account
   - Go to "Rooms" tab
   - Click on available room
   - Click "Join Room"

4. **Submit Result**
   - After playing match in Free Fire
   - Go to room details
   - Upload screenshot
   - Click "Submit Screenshot"

### As Admin:

1. Go to **Admin** tab
2. Click **Rooms** to see active matches
3. Review screenshots (you'll see file paths)
4. Click winner's name button to declare winner
5. Money automatically transfers to winner

## Common Issues

### "Cannot connect to MongoDB"
- Check `.env` file has correct connection string
- Verify MongoDB Atlas IP whitelist has `0.0.0.0/0`

### "Email verification code not received"
- Check terminal/console for the code
- Email service not configured yet (see SETUP.md)

### "Port 5000 already in use"
- Close other apps using port 5000
- Or change PORT in `.env` file

### "Cannot find module"
- Run `npm install` in root folder
- Run `npm install` in client folder

## Next Steps

1. **Configure Email** (SETUP.md)
   - Setup Gmail SMTP or SendGrid
   - Users will receive verification codes

2. **Integrate eSewa** (SETUP.md)
   - Get merchant credentials
   - Update payment flow

3. **Deploy to Production** (SETUP.md)
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify
   - Users can access from anywhere

4. **Test on Mobile**
   - Open on phone browser
   - Click "Add to Home Screen"
   - App works like native app

## File Structure

```
firebet-app/
├── server/           # Backend API
├── client/           # React frontend
├── uploads/          # Screenshot storage
├── .env             # Configuration
├── install.bat      # Windows installer
├── start.bat        # Windows starter
└── README.md        # Documentation
```

## Support

- **Quick Start**: START.md
- **Detailed Setup**: SETUP.md
- **Project Info**: PROJECT_SUMMARY.md
- **API Docs**: Check server/routes/ files

## Ready to Launch? 🚀

Once everything works locally:
1. Configure email service
2. Integrate eSewa payments
3. Deploy to production
4. Share with players!

---

**Need help?** Check other .md files or review the code comments.
