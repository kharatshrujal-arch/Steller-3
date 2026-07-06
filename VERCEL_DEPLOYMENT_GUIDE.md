# 🚀 Vercel Deployment Guide

Complete guide to deploy AidPulse to Vercel.

---

## 📋 Prerequisites

- ✅ Node.js installed
- ✅ Project builds successfully (`npm run build`)
- ✅ Git repository
- ✅ Vercel account (free at https://vercel.com)

---

## 🎯 Quick Deploy (3 Methods)

### **Method 1: Using Script (Easiest)** ⭐

```powershell
# Deploy with automated script
.\deploy-vercel.ps1
```

Choose option:
- **1** = Production deployment
- **2** = Preview/test deployment
- **3** = Login to Vercel first

### **Method 2: Vercel CLI (Manual)**

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### **Method 3: Vercel Dashboard (No CLI)**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Deploy"
4. Done!

---

## 📝 Step-by-Step Deployment

### Step 1: Prepare Your Project

```powershell
# Test build locally
npm run build

# Check if dist/ folder is created
ls dist/
```

If build succeeds, you're ready! ✅

### Step 2: Install Vercel CLI

```powershell
npm install -g vercel
```

Or use Chocolatey:
```powershell
choco install vercel
```

### Step 3: Login to Vercel

```powershell
vercel login
```

This will:
- Open browser
- Ask you to login/signup
- Connect CLI to your account

### Step 4: Deploy Preview (Test First)

```powershell
vercel
```

This creates a **preview URL** like:
- `https://aidpulse-abc123.vercel.app`

Test the preview URL to make sure everything works!

### Step 5: Deploy to Production

```powershell
vercel --prod
```

This creates your **production URL** like:
- `https://aidpulse.vercel.app`

### Step 6: Update README

```powershell
# Run helper script
.\update-readme-with-vercel.ps1

# Or manually edit README.md
# Replace: https://your-app.vercel.app
# With: https://aidpulse.vercel.app (your actual URL)
```

### Step 7: Commit Changes

```powershell
git add README.md vercel.json
git commit -m "Add Vercel deployment configuration"
git push
```

---

## ⚙️ Configuration

Your project includes `vercel.json` with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

This tells Vercel:
- ✅ Use Vite framework
- ✅ Run `npm run build`
- ✅ Serve files from `dist/`
- ✅ Enable SPA routing

---

## 🌍 Environment Variables

If your app needs environment variables:

### On Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add variables:
   - `VITE_AID_PULSE_CONTRACT_ID`
   - `VITE_REPUTATION_CONTRACT_ID`
   - `VITE_STELLAR_NETWORK`
   - etc.

### Via CLI:
```powershell
vercel env add VITE_AID_PULSE_CONTRACT_ID
```

---

## 🔄 Automatic Deployments

Once connected to GitHub:
- ✅ Every `git push` to main = Production deploy
- ✅ Every Pull Request = Preview deploy
- ✅ Automatic builds on commits

To enable:
1. Go to Vercel Dashboard
2. Import your GitHub repo
3. Connect repository
4. Done! Auto-deploys enabled

---

## 🎨 Custom Domain

Want `aidpulse.com` instead of `aidpulse.vercel.app`?

1. Go to Vercel Dashboard
2. Your Project → Settings → Domains
3. Add custom domain
4. Follow DNS setup instructions
5. Done!

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Problem:** Build succeeds locally but fails on Vercel

**Solution:**
```powershell
# Check Node version
node --version

# Set Node version in package.json
{
  "engines": {
    "node": "18.x"
  }
}
```

### Environment Variables Not Working

**Problem:** App can't read environment variables

**Solution:**
- All env vars MUST start with `VITE_`
- Add them in Vercel Dashboard
- Redeploy after adding

### 404 on Refresh

**Problem:** Page refreshes show 404 error

**Solution:** Already fixed in `vercel.json` with rewrites:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### Wallet Connection Issues

**Problem:** Freighter wallet doesn't connect on Vercel

**Solution:**
- Check CORS headers in `vercel.json` ✅ (already configured)
- Make sure using HTTPS URL
- Clear browser cache

---

## 📊 Deployment Status

After deploying, check:
- ✅ Deployment URL works
- ✅ Wallet connection works
- ✅ Contract calls work
- ✅ All pages load correctly

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Deployment Logs:** https://vercel.com/[your-project]/deployments
- **Analytics:** https://vercel.com/[your-project]/analytics

---

## 💡 Best Practices

1. **Test locally first:** Always run `npm run build` before deploying
2. **Use preview deployments:** Test changes before production
3. **Environment variables:** Never commit secrets, use Vercel env vars
4. **Custom domain:** Use custom domain for professional look
5. **Monitor:** Check Vercel analytics for errors

---

## 🎯 Quick Commands Reference

```powershell
# Deploy preview
vercel

# Deploy production
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]

# Open project in browser
vercel open
```

---

## 📋 Deployment Checklist

Before deploying:
- [ ] Project builds successfully (`npm run build`)
- [ ] All environment variables documented
- [ ] vercel.json configured
- [ ] README updated with deployment info
- [ ] Contract IDs added to env vars
- [ ] Tested wallet connection locally

After deploying:
- [ ] Deployment URL works
- [ ] Updated README with actual URL
- [ ] Tested on mobile
- [ ] Tested wallet connection on live site
- [ ] Verified contract calls work
- [ ] Committed changes to Git

---

## 🚀 Next Steps

After successful deployment:

1. **Share your app:**
   - Add link to README ✅
   - Share on social media
   - Add to portfolio

2. **Monitor:**
   - Check Vercel analytics
   - Monitor error logs
   - Track usage

3. **Improve:**
   - Set up custom domain
   - Enable Vercel Speed Insights
   - Configure caching

---

**Need help?** Run `.\deploy-vercel.ps1` for guided deployment!
