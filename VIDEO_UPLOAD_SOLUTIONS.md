# 🎬 Video Upload Solutions - Your demo.mp4 is 66.75 MB (Too Large for GitHub)

GitHub has a **25 MB file size limit**. Your video is 66.75 MB, so you need an alternative solution.

---

## 🚀 QUICK START (Recommended)

### **Option 1: Upload to YouTube** (Most Professional) ⭐

1. **Upload the video:**
   - Go to https://studio.youtube.com
   - Click "Create" → "Upload videos"
   - Select `vedio/demo.mp4`
   - Title: "AidPulse Demo - Stellar Blockchain"
   - Visibility: **"Unlisted"** (hidden from search, but link works)
   - Click "Publish"

2. **Update README automatically:**
   ```powershell
   .\update-video-link.ps1
   ```
   - Choose option 1 (YouTube)
   - Paste your YouTube URL
   - The script will generate the embed code

3. **Done!** Your README will have a professional video thumbnail.

---

## 📦 QUICK START (Alternative)

### **Option 2: Upload to Google Drive** (Fastest)

1. **Upload the video:**
   - Go to https://drive.google.com
   - Click "New" → "File upload"
   - Select `vedio/demo.mp4`
   - Right-click → "Share" → "Anyone with link"
   - Copy the link

2. **Update README:**
   ```powershell
   .\update-video-link.ps1
   ```
   - Choose option 2 (Google Drive)
   - Paste your link

3. **Done!**

---

## 🛠️ TECHNICAL SOLUTIONS

### **Option 3: Compress Video** (Keep in GitHub)

If you want video in the repository:

```powershell
# Install FFmpeg first
choco install ffmpeg

# Run compression script
.\compress-video.ps1
```

This will compress your video to ~20 MB.

### **Option 4: Git LFS** (For Large Files)

GitHub's official solution for large files:

```powershell
# Install Git LFS
choco install git-lfs

# Run setup
.\setup-git-lfs.ps1
```

---

## 📊 Comparison

| Method | Time | Quality | Professional | File in Repo |
|--------|------|---------|--------------|--------------|
| YouTube | 5 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |
| Google Drive | 2 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ❌ |
| Compress | 10 min | ⭐⭐⭐ | ⭐⭐⭐ | ✅ |
| Git LFS | 15 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ |

---

## 🎯 MY RECOMMENDATION

**Use YouTube (Option 1) because:**
- ✅ Most professional for GitHub projects
- ✅ Auto-generates beautiful thumbnails
- ✅ No file size limits
- ✅ Free forever
- ✅ Easy to embed

**It takes only 5 minutes and looks amazing!**

---

## 📝 Available Scripts

I've created helper scripts for you:

1. **`.\compress-video.ps1`** - Compress video to under 25 MB
2. **`.\setup-git-lfs.ps1`** - Setup Git LFS for large files
3. **`.\update-video-link.ps1`** - Update README with external video link
4. **`ALTERNATIVE_VIDEO_HOSTING.md`** - Detailed guide for all options

---

## 🆘 Need Help?

1. **Can't install FFmpeg?** → Use YouTube or Google Drive
2. **Want video in repo?** → Use Git LFS or compress
3. **Want professional look?** → Use YouTube
4. **Want fastest solution?** → Use Google Drive

---

## ✅ What to Do Next

**Choose ONE of these:**

### A. YouTube (Recommended)
```
1. Upload to YouTube (unlisted)
2. Run: .\update-video-link.ps1
3. Choose option 1
4. Paste YouTube URL
5. Update README with generated code
6. Commit and push
```

### B. Google Drive (Fastest)
```
1. Upload to Google Drive
2. Get shareable link
3. Run: .\update-video-link.ps1
4. Choose option 2
5. Paste Drive link
6. Update README with generated code
7. Commit and push
```

### C. Compress (Keep in Repo)
```
1. Install FFmpeg: choco install ffmpeg
2. Run: .\compress-video.ps1
3. Wait for compression
4. Commit and push
```

---

**Pick your solution and I'll help you complete it!** 🚀
