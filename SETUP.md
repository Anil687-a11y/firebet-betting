# FireBet Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd firebet-app
npm install
cd client
npm install
cd ..
```

### 2. Configure Environment

The `.env` file is already created with your MongoDB connection. Update these if needed:

- **Email Settings** (for verification codes):
  - Get Gmail App Password: https://myaccount.google.com/apppasswords
  - Update `EMAIL_USER` and `EMAIL_PASS`

- **eSewa Settings** (for payments):
  - Get merchant credentials from eSewa
  - Update `ESEWA_MERCHANT_ID` and `ESEWA_SECRET_KEY`

### 3. Create First Admin User

After starting the server, register a normal user, then manually update in MongoDB:

```javascript
// In MongoDB Atlas, find your user and update:
{
  "isAdmin": true
}
```

### 4. Start Development

```bash
# Terminal 1 - Start Backend
npm run server

# Terminal 2 - Start Frontend
cd client
npm start
```

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:3000

## 📱 PWA Installation

Once deployed, users can install the app on their phones:

1. Open in mobile browser
2. Click "Add to Home Screen"
3. App will work like a native app

## 🔧 Production Deployment

### Backend (Node.js)
- Deploy to: Heroku, Railway, Render, or DigitalOcean
- Set environment variables
- Ensure MongoDB Atlas IP whitelist includes deployment server

### Frontend (React)
- Build: `cd client && npm run build`
- Deploy to: Vercel, Netlify, or serve from backend

### Important for Production:
1. Change `JWT_SECRET` to a strong random string
2. Setup proper email service (SendGrid, Mailgun, or Gmail)
3. Integrate real eSewa payment gateway
4. Setup HTTPS (required for PWA)
5. Configure CORS properly

## 📋 Features Implemented

✅ User registration with email verification
✅ Wallet system (deposit + winning balances)
✅ Room creation/joining (1v1, 2v2, 3v3, 4v4)
✅ Real-time countdown timers (1 hour deadline)
✅ Screenshot submission
✅ Dispute system with proof upload
✅ Admin panel (declare winners, ban users, approve withdrawals)
✅ Ban system (temporary/permanent) with penalties
✅ Negative balance tracking
✅ Free Fire UID/Name verification
✅ Mobile-responsive PWA design
✅ All business rules implemented

## 🎮 How It Works

### For Players:
1. Register with email + Free Fire UID/Name
2. Verify email with 6-digit code
3. Deposit money via eSewa
4. Create or join rooms
5. Play match in Free Fire
6. Submit result screenshot within 1 hour
7. Admin verifies and transfers winnings
8. Withdraw winnings (min ₹150)

### For Admin:
1. Review active rooms
2. Check both players' screenshots
3. Declare winner manually
4. Handle disputes
5. Ban cheaters
6. Approve withdrawals

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Email verification required
- Locked Free Fire UID/Name (prevents account switching)
- Admin manual verification (prevents automated fraud)
- Negative balance tracking (debt system)

## 💰 Money Flow

Example: ₹100 entry fee, 1v1 match

- Player 1 pays: ₹100
- Player 2 pays: ₹100
- Total pool: ₹200
- Admin commission (20%): ₹40
- Winner gets: ₹160

## 📞 Support

For issues or questions, check:
- MongoDB Atlas dashboard for database
- Browser console for frontend errors
- Server logs for backend errors

## 🎯 Next Steps

1. Test all features locally
2. Setup email service
3. Integrate eSewa payment
4. Deploy to production
5. Test on mobile devices
6. Launch! 🚀
