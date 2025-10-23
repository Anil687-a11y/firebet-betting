# 🛠️ Admin Tools - Manual Payment Management

Quick scripts to manage user accounts and balances manually.

## 📋 Available Commands

### 1. Add Balance (Manual Deposit)
```bash
node add-balance.js <email> <amount>
```

**Example:**
```bash
node add-balance.js user@example.com 500
```

**When to use:**
- User sends you money via eSewa
- You verify payment received
- Run this to add balance to their account

---

### 2. Make Admin
```bash
node make-admin.js <email>
```

**Example:**
```bash
node make-admin.js admin@example.com
```

**When to use:**
- Create your first admin account
- Give admin access to trusted users

---

### 3. View User Details
```bash
node view-user.js <email>
```

**Example:**
```bash
node view-user.js user@example.com
```

**When to use:**
- Check user's balance
- Verify user information
- Check admin status

---

## 💰 Manual Payment Workflow

### For Deposits:

1. **User contacts you:** "I want to deposit ₹500"
2. **Give them your eSewa ID**
3. **User sends ₹500 to your eSewa**
4. **You verify payment received**
5. **Run command:**
   ```bash
   node add-balance.js user@example.com 500
   ```
6. **User can now play!**

### For Withdrawals:

1. **User requests withdrawal in app**
2. **Shows in Admin Panel → Withdrawals**
3. **You transfer money to their eSewa**
4. **Click "Approve" in admin panel**
5. **Done!**

---

## 🚀 Quick Start

**First Time Setup:**

1. Create your admin account:
   ```bash
   # Register in app first, then:
   node make-admin.js your-email@example.com
   ```

2. Add test balance to yourself:
   ```bash
   node add-balance.js your-email@example.com 1000
   ```

3. Test the app!

---

## 📝 Tips

- Keep a record of all manual deposits
- Always verify eSewa payment before adding balance
- Use view-user.js to check balances before withdrawals
- Transaction history is automatically recorded

---

## ⚠️ Important

- These scripts directly modify the database
- Always double-check email addresses
- Keep your MongoDB credentials secure
- Only run these from your secure computer

---

## 🔄 When You Get eSewa Merchant Account

Once you have eSewa merchant credentials:
1. Update `.env` with merchant details
2. Update `server/routes/wallet.js` with eSewa API
3. These manual scripts become backup tools
4. Payments become automatic!

---

**Need help?** Check SETUP.md for eSewa integration guide.
