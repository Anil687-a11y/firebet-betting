# 🚀 Deploy FireBet NOW - Quick Guide

## ⚡ Fastest Way (30 minutes total)

### Prerequisites
- [ ] GitHub account
- [ ] Your code pushed to GitHub

---

## 📦 Step 1: Push to GitHub (5 min)

**If you haven't already:**

```bash
cd firebet-app

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - FireBet app ready"

# Create repo on GitHub (go to github.com/new)
# Then connect and push:
git remote add origin https://github.com/YOUR-USERNAME/firebet-app.git
git branch -M main
git push -u origin main
```

---

## 🚂 Step 2: Deploy Backend - Railway (10 min)

### 2.1 Sign Up
1. Go to: **https://railway.app**
2. Click **"Login with GitHub"**
3. Authorize Railway

### 2.2 Create Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **firebet-app** repository
4. Click **"Deploy Now"**

### 2.3 Add Environment Variables
1. Click your project
2. Click **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these one by one:

```
MONGODB_URI
mongodb+srv://firebetadmin:Dzkvud5Gqt2WPR5C@firebet-cluster.ym4ggne.mongodb.net/firebet?retryWrites=true&w=majority&appName=firebet-cluster

JWT_SECRET
firebet_super_secret_key_change_in_production_2024

PORT
3001

EMAIL_HOST
smtp.gmail.com

EMAIL_PORT
587

EMAIL_USER
a2zchitwan@gmail.com

EMAIL_PASS
pikuttikitwpojkx
```

### 2.4 Get Your Backend URL
1. Go to **"Settings"** tab
2. Find **"Domains"** section
3. Copy the URL (e.g., `firebet-production.up.railway.app`)
4. **SAVE THIS URL** - you'll need it!

---

## ⚡ Step 3: Deploy Frontend - Vercel (10 min)

### 3.1 Sign Up
1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find **firebet-app** repository
3. Click **"Import"**

### 3.3 Configure
1. **Root Directory:** Click "Edit" → Select **"client"**
2. **Framework Preset:** Create React App (auto-detected)
3. **Build Command:** `npm run build`
4. **Output Directory:** `build`

### 3.4 Add Environment Variable
1. Click **"Environment Variables"**
2. Add:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://YOUR-RAILWAY-URL` (from Step 2.4)
3. Click **"Add"**

### 3.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Click **"Visit"** to see your live app!

---

## 🔧 Step 4: Final Configuration (5 min)

### 4.1 Update MongoDB
1. Go to: **https://cloud.mongodb.com**
2. Click **"Network Access"**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"**
5. Enter: `0.0.0.0/0`
6. Click **"Confirm"**

### 4.2 Update Backend CORS
1. Open `server/index.js`
2. Find the `cors()` line
3. Update to:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'  // Replace with your Vercel URL
  ],
  credentials: true
}));
```

4. Save and push to GitHub:
```bash
git add .
git commit -m "Update CORS"
git push
```

Railway will auto-redeploy!

---

## ✅ You're Live!

Your app is now accessible at:
- **Your Vercel URL:** `https://your-app.vercel.app`

---

## 🎯 First Steps After Deployment

### 1. Create Admin Account
1. Open your live app
2. Register with your email
3. Verify email
4. Run locally:
   ```bash
   cd admin-tools
   node make-admin.js your-email@example.com
   ```
5. Refresh app → Admin tab appears!

### 2. Test Everything
- [ ] Register new user
- [ ] Email verification works
- [ ] Login works
- [ ] Create room
- [ ] View rooms
- [ ] Admin panel accessible
- [ ] All features working

### 3. Share Your App
- Share the Vercel URL with friends
- Test with real users
- Monitor admin panel

---

## 📱 Mobile Installation

Users can install your app on their phones:

1. Open in mobile browser
2. Click browser menu (⋮)
3. Click "Add to Home Screen"
4. App icon appears on home screen!

---

## 🆘 If Something Goes Wrong

**Backend not working?**
- Check Railway logs (click "Deployments" → "View Logs")
- Verify all environment variables are set
- Check MongoDB IP whitelist

**Frontend not connecting?**
- Verify REACT_APP_API_URL is correct
- Check browser console for errors
- Verify CORS is updated

**Email not sending?**
- Check Railway environment variables
- Verify Gmail app password is correct

---

## 🎉 Congratulations!

Your FireBet app is LIVE and ready to make money! 🔥💰

**What's Next:**
1. Share with Free Fire players
2. Handle deposits/withdrawals manually
3. Monitor admin panel daily
4. Add eSewa integration when ready
5. Scale up!

---

**Need Help?**
- Full guide: DEPLOYMENT_GUIDE.md
- Setup help: SETUP.md
- All docs: INDEX.md

Good luck with your launch! 🚀
