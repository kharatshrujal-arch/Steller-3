# Media Guidelines

Guidelines for managing screenshots, videos, and other media assets in the AidPulse project.

## 📂 Directory Structure

All media assets are organized in the `assets/` directory:

```
assets/
├── screenshots/      # Application UI screenshots
├── videos/          # Demo and tutorial videos
└── README.md        # Asset documentation
```

## 📸 Screenshots

### Location
`assets/screenshots/`

### Current Screenshots
1. **UI1.png** - Dashboard interface with wallet connection
2. **UI2.png** - Aid case creation form
3. **UI3.png** - Real-time event stream ledger

### Guidelines
- **Format**: PNG (preferred) or JPG
- **Resolution**: Minimum 1280x720, preferably 1920x1080
- **File Size**: Keep under 2MB per image (use compression tools)
- **Naming**: Use descriptive kebab-case names (e.g., `wallet-connection.png`)
- **Content**: Capture full interface, avoid personal data or real wallet addresses

### How to Add New Screenshots

1. **Capture**: Use high-quality screen capture tool
2. **Edit**: Remove any sensitive information
3. **Optimize**: Compress image to reduce file size
4. **Save**: Place in `assets/screenshots/` with descriptive name
5. **Document**: Add reference in `assets/README.md`
6. **Use**: Reference in main README:
   ```markdown
   ![Description](assets/screenshots/filename.png)
   ```

### Recommended Tools
- **Windows**: Snipping Tool, ShareX, Greenshot
- **macOS**: Screenshot (Cmd+Shift+4), CleanShot X
- **Compression**: TinyPNG, ImageOptim, Squoosh

## 🎥 Videos

### Location
`assets/videos/`

### Current Videos
1. **demo.mp4** - Complete application walkthrough

### Guidelines
- **Format**: MP4 (H.264) for maximum compatibility
- **Resolution**: 1080p (1920x1080) minimum
- **Frame Rate**: 30 fps or 60 fps
- **Length**: Keep under 5 minutes for demos
- **File Size**: Compress to under 50MB if possible
- **Audio**: Include clear narration or captions
- **Content**: Show realistic demo flow, avoid sensitive data

### How to Add New Videos

1. **Record**: Use screen recording software
2. **Edit**: Trim, add captions, remove sensitive info
3. **Compress**: Reduce file size while maintaining quality
4. **Save**: Place in `assets/videos/` with descriptive name
5. **Document**: Add reference in `assets/README.md`
6. **Use**: Reference in main README:
   ```markdown
   [Watch Demo](assets/videos/filename.mp4)
   ```

### Recommended Tools
- **Recording**: OBS Studio, Loom, ScreenFlow, Camtasia
- **Editing**: DaVinci Resolve, Adobe Premiere, iMovie
- **Compression**: HandBrake, FFmpeg

### FFmpeg Compression Example
```bash
# Compress video to ~10MB target
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset fast output.mp4
```

## 🎨 Design Consistency

### Visual Style
- Use consistent window sizes when capturing
- Maintain same browser/application theme
- Show realistic but demo-safe data
- Highlight important UI elements when needed

### Privacy & Security
- ⚠️ **Never** include real wallet addresses with funds
- ⚠️ **Never** show actual secret keys or mnemonics
- ⚠️ **Always** use Testnet for demonstrations
- ⚠️ Blur or redact any personal information

## 📐 Size Recommendations

| Asset Type | Dimensions | Max File Size |
|------------|------------|---------------|
| Full screenshots | 1920x1080 | 2MB |
| Partial screenshots | 1280x720 | 1MB |
| Mobile screenshots | 375x812 | 500KB |
| Demo videos | 1920x1080 | 50MB |
| Tutorial videos | 1280x720 | 30MB |
| GIF animations | 800x600 | 5MB |

## 🔄 Updating Existing Media

When updating screenshots or videos:

1. Keep the same filename if replacing
2. Update date in `assets/README.md`
3. Note changes in commit message
4. Verify all README links still work

## 📝 Documentation Requirements

Every media file should have:
- Descriptive caption in README
- Purpose/context explanation
- Date added/updated (in asset README)
- Link to where it's used

## ✅ Checklist Before Committing

- [ ] File is properly named (descriptive, kebab-case)
- [ ] File is optimized/compressed
- [ ] No sensitive information visible
- [ ] Added to `assets/README.md`
- [ ] Referenced in main `README.md` if needed
- [ ] Tested on GitHub (images display, videos play)

## 🚀 GitHub-Specific Tips

### Images
- Use relative paths: `![Alt](assets/screenshots/file.png)`
- Images auto-display in GitHub markdown
- Support transparency (PNG)

### Videos
- GitHub supports direct MP4 playback
- Can also upload to Issues/PRs for CDN hosting
- Alternative: Use GIF for short clips (<10 seconds)

### Alternative Hosting
For large videos, consider:
- GitHub Releases (attachments)
- YouTube (unlisted videos)
- Vimeo
- Loom (with embedding)

## 📊 Current Asset Inventory

Last updated: December 2024

| File | Type | Size | Purpose |
|------|------|------|---------|
| UI1.png | Screenshot | - | Dashboard interface |
| UI2.png | Screenshot | - | Aid case creation |
| UI3.png | Screenshot | - | Event stream |
| demo.mp4 | Video | - | Full app walkthrough |

---

**Questions?** Check [assets/README.md](assets/README.md) or the main [README.md](README.md)
