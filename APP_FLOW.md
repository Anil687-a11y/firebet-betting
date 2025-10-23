# 📱 FireBet App Flow

## User Journey

### 1. Registration & Login
```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ├─→ Register
       │   ├─ Email
       │   ├─ Password
       │   ├─ Free Fire UID
       │   └─ Free Fire Name
       │
       ├─→ Verify Email
       │   └─ Enter 6-digit code
       │
       └─→ Login
           └─ Access Dashboard
```

### 2. Dashboard (Home)
```
┌──────────────────────────┐
│      DASHBOARD           │
├──────────────────────────┤
│  💰 Wallet Card          │
│  ├─ Deposit Balance      │
│  ├─ Winning Balance      │
│  └─ Total Balance        │
├──────────────────────────┤
│  🎮 Quick Actions        │
│  ├─ Create Room          │
│  └─ Join Room            │
├──────────────────────────┤
│  📋 My Active Rooms      │
│  ├─ Room 1 (Waiting)     │
│  ├─ Room 2 (Active)      │
│  └─ Room 3 (Disputed)    │
└──────────────────────────┘
```

### 3. Create Room Flow
```
Dashboard
   │
   ├─→ Click "Create Room"
   │
   ├─→ Select Match Type
   │   └─ 1v1 / 2v2 / 3v3 / 4v4
   │
   ├─→ Enter Room Details
   │   ├─ Free Fire Room ID
   │   ├─ Room Password
   │   └─ Stake Amount (₹20-₹1000)
   │
   ├─→ Review Prize Breakdown
   │   ├─ Total Pool: ₹200
   │   ├─ Admin Cut: ₹40 (20%)
   │   └─ Winner Gets: ₹160
   │
   ├─→ Click "Create Room & Pay"
   │   └─ Money deducted from wallet
   │
   └─→ Room Created!
       └─ Visible to all players
```

### 4. Join Room Flow
```
Rooms Tab
   │
   ├─→ Browse Available Rooms
   │   ├─ Filter by match type
   │   └─ Search by Room ID
   │
   ├─→ Click on Room
   │
   ├─→ View Room Details
   │   ├─ Creator's FF UID/Name
   │   ├─ Room ID & Password
   │   ├─ Entry Fee
   │   └─ Prize Amount
   │
   ├─→ Click "Join Room"
   │   └─ Money deducted from wallet
   │
   └─→ Room Status: Active
       └─ 1 hour countdown starts
```

### 5. Play Match Flow
```
Active Room
   │
   ├─→ Copy Room ID & Password
   │
   ├─→ Open Free Fire Game
   │
   ├─→ Create/Join Custom Room
   │   └─ Use copied ID & Password
   │
   ├─→ Verify Opponent
   │   └─ Check UID/Name matches
   │
   ├─→ Play Match
   │
   └─→ Take Screenshot of Result
```

### 6. Submit Result Flow
```
After Match
   │
   ├─→ Go to Room Details
   │
   ├─→ Click "Submit Match Result"
   │
   ├─→ Upload Screenshot
   │   └─ Shows both players' names
   │
   ├─→ Click "Submit Screenshot"
   │
   └─→ Wait for Admin Verification
       └─ Status: Pending Review
```

### 7. Dispute Flow (If Cheating)
```
Active Room
   │
   ├─→ Click "Report Cheating"
   │
   ├─→ Enter Reason
   │   └─ "Opponent used hacks"
   │
   ├─→ Upload Proof
   │   └─ Screenshot/Video
   │
   ├─→ Click "Submit Dispute"
   │
   └─→ Room Status: Disputed
       └─ Admin will review
```

### 8. Wallet Flow
```
Wallet Tab
   │
   ├─→ View Balances
   │   ├─ Deposit Balance
   │   └─ Winning Balance
   │
   ├─→ Deposit Money
   │   ├─ Enter amount
   │   ├─ Click "Pay via eSewa"
   │   └─ Money added to Deposit
   │
   ├─→ Withdraw Winnings
   │   ├─ Enter amount (min ₹150)
   │   ├─ Click "Request Withdrawal"
   │   └─ Admin approves within 24h
   │
   └─→ View Transaction History
       └─ All deposits/withdrawals/wins
```

## Admin Journey

### 1. Admin Dashboard
```
┌──────────────────────────┐
│     ADMIN PANEL          │
├──────────────────────────┤
│  📋 Tabs                 │
│  ├─ Rooms                │
│  ├─ Users                │
│  └─ Withdrawals          │
└──────────────────────────┘
```

### 2. Verify Match & Declare Winner
```
Admin Panel → Rooms
   │
   ├─→ View Active Rooms
   │
   ├─→ Click on Room
   │
   ├─→ Review Screenshots
   │   ├─ Player 1's screenshot
   │   └─ Player 2's screenshot
   │
   ├─→ Verify Results
   │   └─ Check names match
   │
   ├─→ Click Winner's Name
   │   └─ "Player 1 Wins" or "Player 2 Wins"
   │
   ├─→ Enter Admin Notes (optional)
   │
   └─→ Money Transferred!
       ├─ Winner gets ₹160
       └─ Admin gets ₹40
```

### 3. Handle Disputes
```
Admin Panel → Rooms
   │
   ├─→ Filter: Disputed
   │
   ├─→ View Dispute Details
   │   ├─ Reporter's reason
   │   ├─ Proof uploaded
   │   └─ Both screenshots
   │
   ├─→ Review Evidence
   │
   ├─→ Make Decision
   │   ├─ If cheating confirmed:
   │   │   ├─ Declare opponent winner
   │   │   └─ Ban cheater
   │   └─ If false report:
   │       └─ Declare original winner
   │
   └─→ Room Completed
```

### 4. Ban User
```
Admin Panel → Users
   │
   ├─→ Find User
   │
   ├─→ Click "Ban User"
   │
   ├─→ Select Ban Type
   │   ├─ Temporary (X days)
   │   └─ Permanent
   │
   ├─→ Enter Reason
   │   └─ "Using hacks"
   │
   ├─→ Set Penalty Amount
   │   └─ ₹100 penalty
   │
   └─→ User Banned!
       ├─ Cannot play
       ├─ Penalty deducted
       └─ If permanent: balance forfeited
```

### 5. Approve Withdrawals
```
Admin Panel → Withdrawals
   │
   ├─→ View Pending Requests
   │
   ├─→ Check User Details
   │   ├─ Name
   │   ├─ Email
   │   └─ Amount
   │
   ├─→ Verify Winning Balance
   │
   ├─→ Click "Approve & Transfer"
   │
   └─→ Transfer via eSewa
       └─ Mark as completed
```

## Bottom Navigation

```
┌─────────────────────────────────────┐
│  🏠 Home  │  🔥 Rooms  │  💰 Wallet │
│           │            │            │
│  👤 Profile  │  👑 Admin (if admin) │
└─────────────────────────────────────┘
```

## Status Flow

```
Room Status Lifecycle:

Waiting → Active → Completed
   │         │         │
   │         ├─→ Disputed → Completed
   │         │
   │         └─→ Expired (no screenshots)
   │
   └─→ Cancelled (no opponent)
```

## Money Flow Example

```
Player 1 creates room: ₹100
Player 2 joins room: ₹100
─────────────────────────────
Total Pool: ₹200

Admin Commission (20%): ₹40
Winner Prize: ₹160

After Match:
├─ Winner: +₹160 (winning balance)
├─ Loser: ₹0
└─ Admin: +₹40
```

## Time Flow

```
Room Created
   │
   ├─ 1 hour countdown starts
   │
   ├─ Players play match
   │
   ├─ Submit screenshots
   │
   ├─ Admin reviews (manual)
   │
   └─ Winner declared
       └─ Money transferred

If no screenshots by deadline:
   └─ Money goes to admin
```

This visual guide shows the complete user journey through the FireBet app!
