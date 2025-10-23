# 📤 Upload to GitHub - Step by Step

## ✅ Your Files Are Ready!

Everything is built and ready to upload. Follow these simple steps:

---

## 🚀 Step 1: Create GitHub Repository

1. Go to: **https://github.com/new**
2. Fill in:
   - **Repository name:** `firebet-app`
   - **Description:** "FireBet - Free Fire Gaming Platform"
   - **Visibility:** Public (or Private if you prefer)
   - ✅ Check "Add a README file"
3. Click **"Create repository"**

---

## 📁 Step 2: Prepare Files for Upload

### ⚠️ IMPORTANT: Remove These Before Upload

**Delete these folders** (they're too big and will be regenerated):
1. `firebet-app/node_modules/` (if exists)
2. `firebet-app/client/node_modules/` (if exists)
3. `firebet-app/uploads/` (if exists)

**Keep the `.env` file for now** - we'll handle it securely.

---

## 📤 Step 3: Upload to GitHub

### Method 1: Drag & Drop (Easiest)

1. Open your GitHub repository
2. Click **"uploading an existing file"** link (or "Add file" → "Upload files")
3. **Drag the entire `firebet-app` folder** into the upload area
4. Wait for all files to upload (may take 2-3 minutes)
5. Scroll down to bottom
6. Add commit message: "Initial commit - FireBet app"
7. Click **"Commit changes"**

### Method 2: GitHub Desktop

1. Download: https://desktop.github.com
2. Install and login with GitHub
3. Click **"Add"** → **"Add Existing Repository"**
4. Browse to your `firebet-app` folder
5. Click **"Publish repository"**
6. Choose Public or Private
7. Click **"Publish repository"**

---

## 🔒 Step 4: Secure Your Credentials

### After upload, delete .env from GitHub:

1. In your GitHub repository, find `.env` file
2. Click on it
3. Click the **trash icon** (🗑️)
4. Click **"Commit changes"**

**Why?** The `.env` file contains:
- Your email password
- MongoDB credentials
- Should never be public!

**Don't worry!** You'll add these as environment variables in Railway (more secure).

---

## ✅ Step 5: Verify Upload

Check that these files are in your GitHub repo:

**Root Files:**
- ✅ package.json
- ✅ README.md
- ✅ .gitignore
- ✅ railway.json
- ✅ vercel.json
- ✅ .env.example (safe template)

**Folders:**
- ✅ server/ (backend code)
- ✅ client/ (frontend code)
- ✅ admin-tools/ (admin scripts)

**Should NOT see:**
- ❌ node_modules/
- ❌ .env (deleted for security)
- ❌ uploads/

---

## 🎯 Next Steps

Once uploaded to GitHub:

1. ✅ Code is on GitHub
2. ✅ Ready for Railway (backend)
3. ✅ Ready for Vercel (frontend)

**Continue with:** `DEPLOY_NOW.md` - Step 2 (Deploy Backend)

---

## 💡 Tips

- **First time?** Use drag & drop method (easiest)
- **Have Git installed?** Use GitHub Desktop
- **Tech savvy?** Use command line (see DEPLOY_NOW.md)

---

## 🆘 If Upload Fails

**"File too large" error?**
- Make sure you deleted `node_modules/` folders
- These will be regenerated during deployment

**Upload stuck?**
- Try uploading in smaller batches
- Or use GitHub Desktop instead

---

## ✅ You're Ready!

Once your code is on GitHub, you're 90% done with deployment! 🎉

**Next:** Deploy to Railway and Vercel (takes 20 minutes)

---

**Need help?** Check DEPLOY_NOW.md for complete deployment guide.
