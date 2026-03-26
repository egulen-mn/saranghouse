# A-Bento - Safe Build & Deployment Guide

## ⚠️ IMPORTANT: Read This Before Building!

The most common issue is **port conflicts** when PM2 tries to restart while the old process is still running.

---

## 🛡️ SAFE BUILD PROCEDURE

### Method 1: Stop → Build → Start (RECOMMENDED)

```bash
# 1. Navigate to app directory
cd /srv/apps/saranghouse

# 2. Stop the app first
pm2 stop saranghouse

# 3. Build the application
npm run build

# 4. Start the app
pm2 start saranghouse

# 5. Check status
pm2 status saranghouse
```

### Method 2: Delete → Build → Start (If Method 1 Fails)

```bash
# 1. Navigate to app directory
cd /srv/apps/saranghouse

# 2. Delete the PM2 process completely
pm2 delete saranghouse

# 3. Build the application
npm run build

# 4. Start fresh from ecosystem config
pm2 start ecosystem.config.js

# 5. Save PM2 configuration
pm2 save

# 6. Check status
pm2 status
```

---

## ❌ WHAT NOT TO DO

### DON'T: Use `pm2 restart` during build
```bash
# ❌ BAD - This causes port conflicts!
npm run build && pm2 restart saranghouse
```

**Why?** PM2 restart tries to start the new process before the old one fully stops, causing "EADDRINUSE" errors.

### DON'T: Build while app is running
```bash
# ❌ BAD - Can cause file lock issues
npm run build  # (while PM2 is running)
```

---

## 🔧 TROUBLESHOOTING

### Problem: "EADDRINUSE: address already in use :::3013"

**Root Cause:** Orphaned Next.js processes from previous PM2 crashes.

**Solution:**
```bash
# Step 1: Find what's using the port
printf '%s\n' 'iA3fIHvXsv2EtoZxuvJq' | sudo -S ss -tulpn | grep :3013

# Step 2: Kill the orphaned process (replace PID with actual PID from step 1)
printf '%s\n' 'iA3fIHvXsv2EtoZxuvJq' | sudo -S kill -9 <PID>

# Step 3: Start the app
pm2 delete saranghouse
pm2 start ecosystem.config.js
pm2 save
```

**Quick Fix (if you don't want to find PID):**
```bash
# Option 1: Stop and restart
pm2 stop saranghouse
sleep 2
pm2 start saranghouse

# Option 2: Delete and recreate
pm2 delete saranghouse
pm2 start ecosystem.config.js
pm2 save
```

### Problem: "Permission denied" during build

**Solution:**
```bash
# Fix .next directory permissions
sudo chown -R deploy:saranghouse_ftp /srv/apps/saranghouse/.next
sudo chmod -R 775 /srv/apps/saranghouse/.next

# Try build again
npm run build
```

### Problem: Build succeeds but app won't start

**Solution:**
```bash
# Check logs for errors
pm2 logs saranghouse --lines 50

# Verify port is free
lsof -i :3013

# If port is occupied, kill the process
pm2 delete saranghouse
pm2 start ecosystem.config.js
```

---

## 📋 COMPLETE WORKFLOW

### For Code Changes:

```bash
# Step 1: Navigate to directory
cd /srv/apps/saranghouse

# Step 2: Stop the application
pm2 stop saranghouse

# Step 3: Make your code changes
# (edit files in /app/ directory)

# Step 4: Build
npm run build

# Step 5: Check for build errors
# If build failed, fix errors and repeat step 4

# Step 6: Start the application
pm2 start saranghouse

# Step 7: Verify it's running
pm2 status saranghouse
pm2 logs saranghouse --lines 20

# Step 8: Test the website
curl -I https://saranghouse.tengerly.com
```

### For Image Uploads Only:

```bash
# No rebuild needed!
# Just upload images via FTP to /public/images/
# Images are immediately available at:
# https://saranghouse.tengerly.com/images/your-image.jpg
```

---

## 🚀 QUICK COMMANDS

### Check Status
```bash
pm2 status saranghouse
```

### View Logs (Real-time)
```bash
pm2 logs saranghouse
```

### View Last 50 Log Lines
```bash
pm2 logs saranghouse --lines 50 --nostream
```

### Safe Restart (After Build)
```bash
pm2 stop saranghouse
sleep 2
pm2 start saranghouse
```

### Nuclear Option (Complete Reset)
```bash
pm2 delete saranghouse
cd /srv/apps/saranghouse
npm run build
pm2 start ecosystem.config.js
pm2 save
```

---

## 📝 CHECKLIST BEFORE BUILDING

- [ ] Navigate to `/srv/apps/saranghouse`
- [ ] Stop PM2 process: `pm2 stop saranghouse`
- [ ] Wait 2 seconds for port to free
- [ ] Run build: `npm run build`
- [ ] Check for errors in build output
- [ ] Start PM2: `pm2 start saranghouse`
- [ ] Verify status: `pm2 status saranghouse`
- [ ] Check logs: `pm2 logs saranghouse --lines 20`
- [ ] Test URL: `curl -I https://saranghouse.tengerly.com`

---

## 🎯 GOLDEN RULE

**ALWAYS stop before building, NEVER restart during build!**

```bash
# ✅ CORRECT
pm2 stop saranghouse
npm run build
pm2 start saranghouse

# ❌ WRONG
npm run build && pm2 restart saranghouse
```

---

## 📞 NEED HELP?

If you're stuck:
1. Check logs: `pm2 logs saranghouse --lines 50`
2. Check if port is free: `lsof -i :3013`
3. Try the "Nuclear Option" above
4. Check file permissions: `ls -la /srv/apps/saranghouse/.next`

---

**Last Updated:** February 13, 2026
