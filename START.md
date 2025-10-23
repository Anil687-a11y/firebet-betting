# 🔥 FireBet - Quick Start

## Install Everything

Open terminal in `firebet-app` folder and run:

```bash
npm run install-all
```

This installs both backend and frontend dependencies.

## Start the App

### Option 1: Run Both Together (Recommended)

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000).

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Access the App

Open browser: **http://localhost:3000**

## First Time Setup

1. **Register** a new account
2. **Verify** email (check console for code if email not configured)
3. **Login** and start using!

## Create Admin Account

1. Register normally
2. Go to MongoDB Atlas
3. Find your user in the `users` collection
4. Edit and set `isAdmin: true`
5. Refresh the app

## Test the App

1. Create a room (you'll need deposit balance)
2. Open in incognito/another browser
3. Register another user
4. Join the room
5. Submit screenshots
6. Login as admin
7. Declare winner

## Troubleshooting

**Backend won't start?**
- Check if MongoDB connection string is correct in `.env`
- Make sure port 5000 is not in use

**Frontend won't start?**
- Make sure you're in the `client` folder
- Try deleting `node_modules` and reinstalling

**Can't connect to MongoDB?**
- Check MongoDB Atlas IP whitelist (should have 0.0.0.0/0)
- Verify username/password in connection string

## Need Help?

Check `SETUP.md` for detailed instructions!
