# Dental Bids MVP — Backup & Restore Guide

Created: March 6, 2026
Purpose: Recovery instructions in case of AWS suspension or infrastructure loss.

---

## 1. PostgreSQL Database Restore

### Step 1 — Start a fresh PostgreSQL container

```bash
docker run --name dentaldash-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dentaldash \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Step 2 — Wait for container to be ready

```bash
docker ps
# Verify dentaldash-db is listed and running
```

### Step 3 — Restore from the SQL dump

```bash
psql -U postgres -d dentaldash -f dentaldash-backup.sql
```

Or if connecting remotely:

```bash
psql -h localhost -p 5432 -U postgres -d dentaldash -f dentaldash-backup.sql
```

---

## 2. Create a Fresh Database Backup (if container is running)

```bash
docker exec dentaldash-db pg_dump -U postgres dentaldash > dentaldash-backup.sql
```

Verify the file was created:

```bash
ls -lh dentaldash-backup.sql
```

---

## 3. Re-run the Backend Without AWS

```bash
# Clone the repo
git clone https://github.com/Pac12lives808/dental-bids-mvp.git
cd dental-bids-mvp

# Install dependencies
cd backend && npm install

# Set up local .env (copy .env.example and fill in values)
cp .env.example .env

# Start local database container (see Step 1 above)

# Run backend
npm run dev
```

---

## 4. Re-run the Frontend Without AWS

```bash
cd frontend && npm install
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## 5. Local Zip Backup Commands

Run these from the parent directory containing both projects:

```bash
zip -r dental-marketplace-demo-backup.zip dental-marketplace-demo
zip -r dental-bids-mvp-backup.zip dental-bids-mvp
```

Store both .zip files in a safe location (external drive, Google Drive, Dropbox).

---

## 6. GitHub Repositories

| Project | GitHub URL |
|---|---|
| dental-bids-mvp | https://github.com/Pac12lives808/dental-bids-mvp |
| dental-marketplace-demo | https://github.com/Pac12lives808/dental-marketplace-demo |

To push local changes to GitHub:

```bash
git add .
git commit -m "backup before AWS suspension"
git push origin main
```

---

## 7. Emergency Checklist

- [ ] GitHub repos are up to date
- [ ] dentaldash-backup.sql exists and is current
- [ ] dental-bids-mvp-backup.zip created
- [ ] dental-marketplace-demo-backup.zip created
- [ ] .env values documented securely (NOT in git)
- [ ] Stripe keys saved separately
- [ ] Static demo deployed to Netlify (see DEPLOY_DEMO.md)
