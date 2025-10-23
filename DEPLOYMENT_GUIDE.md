# 🚀 FireBet Deployment Guide

## Quick Deployment (30 minutes)

### Step 1: Deploy Backend to Railway (10 min)

**1.1 Create Railway Account**
- Go to: https://railway.app
- Click "Login with GitHub"
- Authorize Railway

**1.2 Create New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your GitHub account
- Select your firebet-app repository

**1.3 Configure Environment Variables**
Click "Variables" and add these:

```
MONGODB_URI=mongodb+srv://firebetadmin:Dzkvud5Gqt2WPR5C@firebet-cluster.ym4ggne.mongodb.net/firebet?retryWrites=true&w=majority&appName=firebet-cluster

JWT_SECRET=firebet_super_secret_key_change_in_production_2024

PORT=3001

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=a2zchitwan@gmail.com
EMAIL_PASS=pikuttikitwpojkx

ESEWA_MERCHANT_ID=your-esewa-merchant-id
ESEWA_SECRET_KEY=your-esewa-secret-key
```

**1.4 Deploy**
- Railway will auto-deploy
- Wait 2-3 minutes
- Copy your backend URL (e.g., `https://firebet-production.up.railway.app`)

---

### Step 2: Deploy Frontend to Vercel (10 min)

**2.1 Create Vercel Account**
- Go to: https://vercel.com
- Click "Sign Up"
- Choose "Continue with GitHub"

**2.2 Import Project**
- Click "Add New" → "Project"
- Import your firebet-app repository
- Select "client" folder as root directory

**2.3 Configure Build Settings**
- Framework Preset: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

**2.4 Add Environment Variable**
Click "Environment Variables" and add:

```
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
```

(Replace with your actual Railway backend URL)

**2.5 Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Your app is live!

---

### Step 3: Update Backend CORS (5 min)

**3.1 Update server/index.js**

Add your Vercel URL to CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

**3.2 Push to GitHub**
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Railway will auto-redeploy.

---

### Step 4: Update Frontend API URL (5 min)

**4.1 Update client/package.json**

Remove the proxy line and update API calls to use environment variable.

**4.2 Update client/src/utils/api.js**

```javascript
const API_BASE = process.env.REACT_APP_API_URL || '/api';
```

**4.3 Push to GitHub**
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Vercel will auto-redeploy.

---

## ✅ Deployment Complete!

Your app is now live at:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-app.railway.app

---

## 📱 Test Your Live App

1. Open your Vercel URL
2. Register a new account
3. Check email for verification code
4. Login and test features
5. Create a room
6. Test admin panel

---

## 🔧 Post-Deployment

### Update MongoDB Atlas IP Whitelist
1. Go to MongoDB Atlas
2. Network Access
3. Add IP: `0.0.0.0/0` (allow all)
4. Save

### Create Admin Account
1. Register on your live site
2. Run locally:
   ```bash
   cd admin-tools
   node make-admin.js your-email@example.com
   ```
3. Refresh your live site
4. Admin tab appears!

---

## 🎯 Alternative: Deploy Both Together

### Option: Render (All-in-One)

**Pros:**
- Single platform
- Free tier
- Easy setup

**Cons:**
- Slower than Railway + Vercel
- Cold starts (app sleeps after 15 min)

**Steps:**
1. Go to: https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect repository
5. Configure:
   - Build: `npm install && cd client && npm install && npm run build`
   - Start: `node server/index.js`
6. Add environment variables
7. Deploy!

---

## 💡 Tips

- **Custom Domain:** Add your own domain in Vercel settings
- **HTTPS:** Automatic with Vercel and Railway
- **Monitoring:** Check Railway logs for errors
- **Updates:** Push to GitHub → Auto-deploys

---

## 🆘 Troubleshooting

**Backend not connecting?**
- Check Railway logs
- Verify MongoDB IP whitelist
- Check environment variables

**Frontend not loading?**
- Check Vercel deployment logs
- Verify API URL is correct
- Check browser console for errors

**Email not sending?**
- Verify Gmail app password
- Check Railway environment variables

---

## 🎉 You're Live!

Share your app URL and start getting users! 🔥

**Next Steps:**
1. Share with friends
2. Test with real users
3. Monitor admin panel
4. Handle deposits/withdrawals
5. Add eSewa when ready

Good luck! 🚀
