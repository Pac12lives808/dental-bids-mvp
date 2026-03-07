# AWS Infrastructure Backup — Dental Dash Pro

**Last Updated:** March 6, 2026  
**Purpose:** Complete AWS disaster recovery documentation  
**Account ID:** 670833622671  
**Region:** us-east-2 (US East — Ohio)  
**Status:** RDS and EC2 STOPPED to prevent charges (March 6, 2026)

---

## CRITICAL SERVICES SUMMARY

| Service | Resource | Status | Monthly Cost |
|---------|----------|--------|--------------|
| RDS PostgreSQL | dental-bids-db | STOPPED (Mar 6) | ~$135.65 |
| EC2 t3.micro | dental-bids-api | STOPPED (Mar 6) | ~$1.48 |
| Elastic Beanstalk | dental-bids-api | Suspended | (included) |
| S3 | dental-bids-phi-2026 | Active | ~$0.02 |
| CloudWatch | Monitoring | Active | ~$3.35 |
| VPC | Default VPC us-east-2 | Active | ~$0.67 |
| Secrets Manager | RDS credentials | Active | ~$0.36 |
| **TOTAL** | | | **~$153.39/mo** |

---

## 1. RDS PostgreSQL Database

### Connection Details (VERIFIED FROM ELASTIC BEANSTALK)
```
DB Identifier:   dental-bids-db
Engine:          PostgreSQL
Endpoint:        dental-bids-db.czyxOtJlpb9p.us-east-2.rds.amazonaws.com
Port:            5432
Database Name:   dentalbids
Username:        admin
Password:        Heidi$2016
Instance Class:  db.t3.micro
Storage:         400 GB gp2
Multi-AZ:        Yes
AZ:              us-east-2a
Backup Retention: 7 days automated
```

### Step 1 — Export Database (Run This Command Locally)
```bash
# IMPORTANT: Run this BEFORE stopping RDS, or while RDS is running
PGPASSWORD='Heidi$2016' pg_dump \
  -h dental-bids-db.czyxOtJlpb9p.us-east-2.rds.amazonaws.com \
  -U admin \
  -d dentalbids \
  -F c \
  -f dental_bids_backup_$(date +%Y%m%d).dump

# Confirm file created:
ls -lh dental_bids_backup_*.dump

# Move to backup folder:
mkdir -p aws-backups
mv dental_bids_backup_*.dump aws-backups/
```

### Restore Database Locally
```bash
# Create local database
createdb dentalbids

# Restore from dump
PGPASSWORD='your_local_password' pg_restore \
  -U postgres \
  -d dentalbids \
  aws-backups/dental_bids_backup_YYYYMMDD.dump
```

---

## 2. EC2 Instance

```
Name:           dental-bids-api
Instance ID:    i-0581c22e622405921
Instance Type:  t3.micro
AMI ID:         ami-070b3a6c16cf5db48
State:          STOPPED (March 6, 2026)
AZ:             us-east-2a
Public IPv4:    3.149.114.36 (Elastic IP — retained when stopped)
Elastic IP:     3.149.114.36
Public DNS:     ec2-3-149-114-36.us-east-2.compute.amazonaws.com
Security Group: sg-079f3c9fc37df3da4
VPC:            vpc-02c8e837f0e21bd94
Subnets:        subnet-00777a8327abdc7de, subnet-095333d8afd4b3d9c, subnet-0c23a0ceebe5bf1ed
Proxy Server:   nginx
```

### To Restart EC2 Later
```
EC2 Console > Instances > i-0581c22e622405921 > Instance State > Start
```

---

## 3. Elastic Beanstalk Application

```
Application:      dental-bids-backend
Environment:      dental-bids-api
Environment ID:   e-mrdpbzdmn9
Platform:         Node.js 24 on Amazon Linux 2023/6.8.0
Domain:           dental-bids-api.eba-mkrmmfv.us-east-2.elasticbeanstalk.com
Deployment:       Single instance
Service Role:     arn:aws:iam::670833622671:role/aws-elasticbeanstalk-service-role
EC2 Profile:      aws-elasticbeanstalk-ec2-role
Proxy:            nginx
Log Retention:    7 days
```

### Environment Variables (ALL CONFIRMED)
```bash
DB_HOST=dental-bids-db.czyxOtJlpb9p.us-east-2.rds.amazonaws.com
DB_NAME=dentalbids
DB_USER=admin
DB_PASSWORD=Heidi$2016
```

### .env.backup File (Save Locally — Do NOT Commit to GitHub)
```
DB_HOST=dental-bids-db.czyxOtJlpb9p.us-east-2.rds.amazonaws.com
DB_NAME=dentalbids
DB_USER=admin
DB_PASSWORD=Heidi$2016
NODE_ENV=production
PORT=8080
STRIPE_SECRET_KEY=[retrieve from code/codebase — search for STRIPE_SECRET_KEY]
JWT_SECRET=[retrieve from code/codebase — search for JWT_SECRET]
AWS_REGION=us-east-2
AWS_S3_BUCKET=dental-bids-phi-2026
```

---

## 4. S3 Buckets

### Confirmed Buckets
| Bucket | Region | Objects | Purpose |
|--------|--------|---------|---------|
| dental-bids-phi-2026 | us-east-2 | 10 | User uploads (images, HTML, logo, PHI files) |

### Step 2 — Download All S3 Files
```bash
# Sync entire bucket locally
aws s3 sync s3://dental-bids-phi-2026 ./aws-backups/s3-dental-bids-phi-2026 --region us-east-2

# Verify download
ls -la ./aws-backups/s3-dental-bids-phi-2026/

# Check all 3 buckets
aws s3 ls
```

---

## 5. Secrets Manager

```
Secret Name:  rds!db-8767e0ef-0b8c-4c40-9879-a5aeb2a6e1e7
Secret ARN:   arn:aws:secretsmanager:us-east-2:670833622671:secret:rds!db-8767e0ef-0b8c-4c40-9879-a5aeb2a6e1e7-iDf913
Type:         RDS managed (auto-rotated)
```

Note: The Secrets Manager stores the RDS system user (`postgres`). The actual application user is `admin` with password `Heidi$2016` (see Elastic Beanstalk env vars).

---

## 6. Route 53 / DNS

- No hosted zones configured
- No registered domains in Route53
- App accessed via Elastic Beanstalk domain or EC2 Elastic IP `3.149.114.36`
- EB URL: `dental-bids-api.eba-mkrmmfv.us-east-2.elasticbeanstalk.com`

---

## 7. Services NOT In Use

| Service | Status |
|---------|--------|
| AWS Amplify | No apps |
| AWS Lambda | No functions |
| ECS/ECR | No clusters |
| CloudFront | No distributions |
| Route53 | No hosted zones |
| Parameter Store | No parameters |

---

## 8. VPC Networking

```
VPC ID:    vpc-02c8e837f0e21bd94
Region:    us-east-2
Subnets:   subnet-00777a8327abdc7de (us-east-2a)
           subnet-095333d8afd4b3d9c (us-east-2b)
           subnet-0c23a0ceebe5bf1ed (us-east-2c)
SG (API):  sg-079f3c9fc37df3da4
```

### Security Group Rules to Recreate
```
Inbound: Port 80   (HTTP)   from 0.0.0.0/0
Inbound: Port 443  (HTTPS)  from 0.0.0.0/0
Inbound: Port 8080 (App)    from 0.0.0.0/0
Inbound: Port 22   (SSH)    from your IP only
Inbound: Port 5432 (PG)     from EC2 security group
```

---

## 9. Billing (March 2026)

```
Billing Period: March 1-31, 2026
Current Bill:   USD $153.39 (Pending)
Bill Status:    PENDING
Account ID:     670833622671
```

| Service | Cost |
|---------|------|
| Relational Database Service | $135.65 |
| CloudWatch | $3.35 |
| Elastic Compute Cloud | $1.48 |
| Virtual Private Cloud | $0.67 |
| Key Management Service | $0.36 |
| Other | ~$11.88 |
| **Total** | **$153.39** |

**Action Taken:** RDS and EC2 stopped March 6, 2026 to halt ongoing charges.

---

## 10. Infrastructure Rebuild Checklist

### Using Free Services (No AWS Required)

**Phase 1 — Database**
- [ ] Sign up for Neon (neon.tech) or Supabase (supabase.com) — free PostgreSQL
- [ ] Run pg_restore against new DB URL
- [ ] Update DB_HOST, DB_NAME, DB_USER, DB_PASSWORD in app

**Phase 2 — Backend API**
- [ ] Sign up for Railway (railway.app) or Render (render.com) — free Node.js
- [ ] Connect GitHub repo: `Pac12lives808/dental-bids-mvp`
- [ ] Set environment variables from .env.backup
- [ ] Deploy

**Phase 3 — File Storage**
- [ ] Sign up for Cloudinary or Backblaze B2 — free file storage
- [ ] Re-upload files from `aws-backups/s3-dental-bids-phi-2026/`
- [ ] Update S3 URLs in app config

**Phase 4 — Static Demo**
- [ ] Connect `Pac12lives808/dental-marketplace-demo` to Netlify
- [ ] Deploy (free, no configuration needed)

---

## 11. GitHub Repositories

| Repo | URL | Contents |
|------|-----|----------|
| dental-bids-mvp | https://github.com/Pac12lives808/dental-bids-mvp | Full app (TypeScript 94%, Node.js backend, React frontend) |
| dental-marketplace-demo | https://github.com/Pac12lives808/dental-marketplace-demo | Static HTML demo, Netlify-ready |

---

## 12. Immediate Manual Actions Required

1. **Run pg_dump** (Section 1) — export database to local file
2. **Run aws s3 sync** (Section 4) — download all uploaded files
3. **Save .env.backup** (Section 3) — store locally, NOT in GitHub
4. **Download EC2 key pair** — EC2 > Key Pairs > download .pem
5. **Search codebase for STRIPE_SECRET_KEY and JWT_SECRET** — add to .env.backup

---

*Generated March 6, 2026 | Dental Dash Pro AWS Account 670833622671*
