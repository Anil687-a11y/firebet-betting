# 🔥 FireBet - Free Fire Real Money Gaming Platform

A mobile-friendly PWA web application for Free Fire players to compete in real-money matches.

![FireBet](https://img.shields.io/badge/Status-Ready-success)
![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### For Players
- 📧 Email verification with 6-digit code
- 💰 Dual wallet system (deposit + winnings)
- 🎮 Create/join rooms (1v1, 2v2, 3v3, 4v4)
- ⏱️ Real-time countdown timers (1 hour deadline)
- 📸 Screenshot submission for match results
- ⚠️ Dispute system with proof upload
- 🔒 Locked Free Fire UID/Name (anti-fraud)
- 📱 Mobile-responsive PWA (installable)

### For Admins
- 👑 Admin panel dashboard
- ✅ Manual winner verification
- 🚫 Ban system (temporary/permanent)
- 💸 Penalty system with negative balance
- 💳 Withdrawal approval system
- 👥 User management

## 🚀 Quick Start

**See [START.md](START.md) for quick setup!**

```bash
# Install everything
npm run install-all

# Start both backend and frontend
npm run dev
```

Open http://localhost:3000 and start playing!

## 📱 Tech Stack

- **Frontend**: React 18 + PWA
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: JWT + bcrypt
- **UI**: Custom CSS (mobile-first)
- **Icons**: React Icons
- **Notifications**: React Toastify

## 📋 Complete Setup

See [SETUP.md](SETUP.md) for detailed instructions including:
- Email configuration
- eSewa payment integration
- Production deployment
- Admin account creation

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/verify` - Verify email with code
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Rooms
- POST `/api/rooms/create` - Create room
- GET `/api/rooms/available` - Get available rooms
- POST `/api/rooms/:roomId/join` - Join room
- DELETE `/api/rooms/:roomId` - Delete room (before opponent joins)
- POST `/api/rooms/:roomId/submit-result` - Submit screenshot
- POST `/api/rooms/:roomId/dispute` - Submit dispute
- GET `/api/rooms/my-rooms` - Get user's active rooms

### Wallet
- GET `/api/wallet/balance` - Get wallet balance
- POST `/api/wallet/deposit` - Deposit money
- POST `/api/wallet/withdraw` - Withdraw winnings
- GET `/api/wallet/transactions` - Get transaction history

### Admin
- GET `/api/admin/rooms` - Get all rooms
- POST `/api/admin/rooms/:roomId/declare-winner` - Declare winner
- POST `/api/admin/rooms/:roomId/expire` - Handle expired rooms
- POST `/api/admin/users/:userId/ban` - Ban user
- POST `/api/admin/users/:userId/unban` - Unban user
- GET `/api/admin/users` - Get all users
- GET `/api/admin/withdrawals` - Get pending withdrawals
- POST `/api/admin/withdrawals/:transactionId/approve` - Approve withdrawal

## Rules

- Stake amount: ₹20-₹1000 (multiples of 5)
- Admin commission: 20% of total pool
- Screenshot deadline: 1 hour after room creation
- Minimum withdrawal: ₹150 (winning balance only)
- Deposited money cannot be withdrawn
- Free Fire UID/Name locked after registration

## Next Steps

1. Build React frontend
2. Integrate eSewa payment gateway
3. Setup email service (Gmail SMTP)
4. Deploy to hosting platform
5. Configure PWA manifest for mobile installation
