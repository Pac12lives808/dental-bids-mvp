# Free Infrastructure Migration Plan — Dental Dash Pro

**Created:** March 6, 2026  
**Context:** AWS account at risk of suspension due to non-payment (~$153/mo bill)  
**Goal:** Rebuild entire stack on free-tier services at $0/month  
**AWS Shutdown Initiated:** March 6, 2026 (RDS stopped, EC2 stopped)

---

## Monthly Cost Comparison

| Component | Current (AWS) | Free Alternative | New Cost |
|-----------|---------------|-----------------|----------|
| PostgreSQL DB | $135.65 (RDS) | Neon or Supabase | **$0** |
| Node.js API | $1.48 (EC2) | Railway or Render | **$0** |
| File Storage | $0.02 (S3) | Cloudinary | **$0** |
| DNS | $0 (no Route53) | Cloudflare | **$0** |
| Static Demo | $0 (no CloudFront) | Netlify | **$0** |
| **TOTAL** | **$153.39/mo** | | **$0/mo** |

---

## Phase 1 — Database Migration (Most Critical)

### Recommended: Neon (neon.tech)
- Free tier: 0.5 GB storage, unlimited requests
- PostgreSQL compatible — no code changes needed
- Serverless, auto-pauses (perfect for low-traffic periods)

### Steps
```bash
# Step 1: Sign up at https://neon.tech
# Create project: dental-bids
# Note your connection string (looks like):
# postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dentalbids

# Step 2: Restore your backup
pg_restore \
  --no-privileges \
  --no-owner \
  -d "postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dentalbids" \
  aws-backups/dental_bids_backup_YYYYMMDD.dump

# Step 3: Verify tables
psql "postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dentalbids" \
  -c "\dt"
```

### Alternative: Supabase (supabase.com)
- Free tier: 500 MB storage, 2 GB bandwidth
- PostgreSQL with built-in Auth, Storage, and API
- Good for future feature expansion

```bash
# After creating project at supabase.com, restore:
pg_restore \
  --no-privileges \
  --no-owner \
  -d "postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres" \
  aws-backups/dental_bids_backup_YYYYMMDD.dump
```

---

## Phase 2 — Backend API Migration

### Recommended: Railway (railway.app)
- Free tier: $5 credit/month (enough for hobby projects)
- Deploys directly from GitHub
- Supports Node.js natively
- Easy environment variable management

### Steps
```
1. Sign up at https://railway.app
2. New Project > Deploy from GitHub
3. Select: Pac12lives808/dental-bids-mvp
4. Configure start command: npm start (or check package.json)
5. Add environment variables:
   DB_HOST=[neon or supabase connection string]
   DB_NAME=dentalbids
   DB_USER=[new db user]
   DB_PASSWORD=[new db password]
   NODE_ENV=production
   PORT=8080
   STRIPE_SECRET_KEY=[your stripe key]
   JWT_SECRET=[your jwt secret]
   AWS_S3_BUCKET=[new cloudinary or backblaze info]
6. Deploy
```

### Alternative: Render (render.com)
- Free tier: Web services with 512 MB RAM
- Auto-deploys from GitHub
- Free PostgreSQL (90-day limit, then upgrade)

```
1. Sign up at https://render.com
2. New > Web Service > Connect GitHub
3. Select: Pac12lives808/dental-bids-mvp
4. Build Command: npm install
5. Start Command: npm start
6. Add environment variables (same as above)
7. Deploy
```

### Alternative: Fly.io
- Free tier: 3 shared-CPU VMs, 256 MB RAM each
- Closer to traditional server (good for Node.js)

---

## Phase 3 — File Storage Migration

### Recommended: Cloudinary
- Free tier: 25 GB storage, 25 GB bandwidth
- Automatic image optimization
- Works great for dental office profile images

### Steps
```
1. Sign up at https://cloudinary.com
2. Note: Cloud Name, API Key, API Secret
3. Upload existing S3 files:
   - Files are in: aws-backups/s3-dental-bids-phi-2026/
   - Use Cloudinary upload widget or CLI
4. Update app config:
   Replace all S3 upload logic with Cloudinary SDK
   (search codebase for 'aws-sdk' or 's3.upload')
```

### Alternative: Backblaze B2
- Free tier: 10 GB storage, 1 GB/day download
- S3-compatible API — minimal code changes

```bash
# If using Backblaze B2 (S3-compatible):
# Change only the endpoint URL in your S3 config:
AWS_ENDPOINT=https://s3.us-west-004.backblazeb2.com
AWS_S3_BUCKET=[your-b2-bucket-name]
# Keep same aws-sdk, just update endpoint
```

---

## Phase 4 — Static Demo

### Recommended: Netlify (free forever)

```
1. Sign up at https://netlify.com
2. New site > Import from Git
3. Select: Pac12lives808/dental-marketplace-demo
4. Build command: (none — static HTML)
5. Publish directory: / (root)
6. Deploy
```

Your demo will be live at: `https://[project-name].netlify.app`

### Alternative: GitHub Pages (free)
```
1. Go to: github.com/Pac12lives808/dental-marketplace-demo
2. Settings > Pages
3. Source: main branch / root
4. Save
5. URL: https://pac12lives808.github.io/dental-marketplace-demo
```

---

## Phase 5 — DNS (Optional)

### Cloudflare (free)
- Free DNS management
- Free SSL certificate
- Free CDN (faster global loading)

```
1. Sign up at https://cloudflare.com
2. Add your domain (if you have one)
3. Point DNS to Railway/Render/Netlify URLs
4. Enable SSL: Full (Strict)
```

---

## Environment Variable Update Checklist

When migrating, update these variables in Railway/Render:

```bash
# OLD (AWS values - no longer work after shutdown)
DB_HOST=dental-bids-db.czyxOtJlpb9p.us-east-2.rds.amazonaws.com
DB_NAME=dentalbids
DB_USER=admin
DB_PASSWORD=Heidi$2016

# NEW (Neon example)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dentalbids
# OR keep individual vars:
DB_HOST=ep-xxx.us-east-2.aws.neon.tech
DB_NAME=dentalbids
DB_USER=[neon user]
DB_PASSWORD=[neon password]

# Keep these the same:
NODE_ENV=production
PORT=8080
STRIPE_SECRET_KEY=[your stripe key - retrieve from original code]
JWT_SECRET=[your jwt secret - retrieve from original code]
```

---

## Quick Start Order

Do these in order for fastest recovery:

1. **[1 hour]** Set up Neon PostgreSQL + restore dump
2. **[30 min]** Deploy API to Railway from GitHub
3. **[15 min]** Set env vars in Railway
4. **[5 min]** Deploy demo to Netlify
5. **[optional]** Migrate S3 files to Cloudinary

**Total time to restore full application: ~2 hours**

---

## Free Tier Limits Reference

| Service | Free Limit | Notes |
|---------|------------|-------|
| Neon | 0.5 GB DB, 3 GB bandwidth | Auto-pauses inactive projects |
| Supabase | 500 MB DB, 2 GB bandwidth | 2 projects max |
| Railway | $5 credit/mo | ~500 hours of compute |
| Render | 512 MB RAM, sleeps after 15 min | Cold start ~30s |
| Cloudinary | 25 GB storage, 25 GB bandwidth | 25 credits/mo |
| Netlify | 100 GB bandwidth, unlimited deploys | Perfect for static |
| Cloudflare | Unlimited DNS, CDN | Always free |
| GitHub Pages | Unlimited | Static only |

---

## Code Changes Required

### Minimal Changes (S3 → Backblaze B2)
If using Backblaze B2, only change environment variables — no code changes.

### Moderate Changes (S3 → Cloudinary)
Search codebase for:
```bash
grep -r 'aws-sdk\|s3\|S3\|putObject\|getObject' backend/src/
```
Replace S3 upload calls with Cloudinary SDK.

### DB Changes
If using DATABASE_URL instead of individual vars:
```bash
grep -r 'DB_HOST\|DB_NAME\|DB_USER\|DB_PASSWORD' backend/src/
```
Update connection configuration accordingly.

---

## Cost After Migration

```
Neon (DB):        $0/mo
Railway (API):    $0/mo (within $5 credit)
Cloudinary (S3):  $0/mo
Netlify (Demo):   $0/mo
Cloudflare (DNS): $0/mo
---
TOTAL:            $0/mo

VS AWS:           $153.39/mo
SAVINGS:          $153.39/mo = $1,840/year
```

---

*Created March 6, 2026 | Dental Dash Pro — Free Infrastructure Migration Plan*
