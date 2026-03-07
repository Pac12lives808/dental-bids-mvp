# AWS Infrastructure Backup

**Created:** March 6, 2026
**Purpose:** Complete AWS infrastructure documentation for disaster recovery if account is suspended
**Account ID:** 670833622671
**Primary Region:** us-east-2 (US East - Ohio)

---

## CRITICAL: Services In Use

If AWS account is suspended, the following services will become unavailable:

| Service | Resource | Status | Monthly Cost |
|---------|----------|--------|-------------|
| RDS PostgreSQL | dental-bids-db | Running | ~$135.65 |
| EC2 t3.micro | dental-bids-api | Running | ~$1.48 |
| Elastic Beanstalk | dental-bids-api env | Running | (EC2 included) |
| S3 | 3 buckets | Active | ~$0.02 |
| CloudWatch | Monitoring | Active | ~$3.35 |
| VPC | Default VPC | Active | ~$0.67 |
| Secrets Manager | RDS credentials | Active | ~$0.36 |
| **TOTAL** | | | **~$153.39/mo** |

---

## 1. RDS PostgreSQL Database

### Connection Details
```
DB Identifier:   dental-bids-db
Engine:          PostgreSQL (latest)
Endpoint:        dental-bids-db.c9q2g02muwb9.us-east-2.rds.amazonaws.com
Port:            5432
Database Name:   dental_bids (confirm in app)
Username:        postgres
Password:        [stored in Secrets Manager - see section 5]
Instance Class:  db.t3.micro (or similar)
Storage:         400 GB gp2
Multi-AZ:        Yes
Backups:         Automated (7-day retention)
AZ:              us-east-2a
```

### Automated Backup Status
- AWS RDS automated backups are enabled
- Snapshots available in AWS console under RDS > Snapshots
- If account is suspended, snapshots may still be accessible for 30 days

### How to Export Database (Run Locally or on EC2)
```bash
# Option 1: From local machine with VPN/tunnel to RDS
pg_dump \
  -h dental-bids-db.c9q2g02muwb9.us-east-2.rds.amazonaws.com \
  -U postgres \
  -d dental_bids \
  -F c \
  -f dental_bids_backup_$(date +%Y%m%d).dump

# Option 2: SSH into EC2 then pg_dump
ssh -i dental-bids-key.pem ec2-user@3.149.114.36
pg_dump -h dental-bids-db.c9q2g02muwb9.us-east-2.rds.amazonaws.com \
  -U postgres -d dental_bids -F c -f /tmp/dental_bids_backup.dump
scp -i dental-bids-key.pem ec2-user@3.149.114.36:/tmp/dental_bids_backup.dump ./

# Option 3: Plain SQL dump
pg_dump \
  -h dental-bids-db.c9q2g02muwb9.us-east-2.rds.amazonaws.com \
  -U postgres \
  -d dental_bids \
  > dental_bids_backup_$(date +%Y%m%d).sql
```

### How to Restore Database Locally
```bash
# Create local database
createdb dental_bids

# Restore from custom format dump
pg_restore -d dental_bids dental_bids_backup_YYYYMMDD.dump

# Restore from SQL dump
psql dental_bids < dental_bids_backup_YYYYMMDD.sql
```

---

## 2. EC2 Instance

```
Name:           dental-bids-api
Instance ID:    i-0581c22e622405921
Instance Type:  t3.micro
State:          Running
AMI:            (Elastic Beanstalk managed)
AZ:             us-east-2a
Public IPv4:    3.149.114.36
Elastic IP:     3.149.114.36
Public DNS:     ec2-3-149-114-36.us-east-2.compute.amazonaws.com
Key Pair:       (check EC2 > Key Pairs for name)
Security Group: (check EC2 > Security Groups)
VPC:            Default VPC us-east-2
```

### To Connect via SSH
```bash
ssh -i <your-key-pair>.pem ec2-user@3.149.114.36
```

---

## 3. Elastic Beanstalk Application

```
Application:    dental-bids-api
Environment:    dental-bids-api (environment name)
Platform:       Node.js
Region:         us-east-2
Status:         Running
```

### Environment Variables (Critical - Back These Up)
```
DB_HOST=dental-bids-db.c9q2g02muwb9.us-east-2.rds.amazonaws.com
DB_NAME=dental_bids
DB_USER=postgres
DB_PASSWORD=[retrieve from Secrets Manager - see section 5]
NODE_ENV=production
PORT=8080
```

### How to Export EB Config
```bash
# Install EB CLI, then:
eb init dental-bids-api --region us-east-2
eb config save --cfg dental-bids-config
# Saves to .elasticbeanstalk/saved_configs/dental-bids-config.cfg.yml
```

---

## 4. S3 Buckets

### Buckets Discovered
| Bucket Name | Region | Objects | Purpose |
|-------------|--------|---------|--------|
| dental-bids-phi-2026 | us-east-2 | 10 | PHI/images (profile photos, logo, HTML) |
| (bucket 2) | us-east-2 | unknown | (check console) |
| (bucket 3) | us-east-2 | unknown | (check console) |

### Objects in dental-bids-phi-2026
- Profile images (JPEG/PNG)
- Logo files
- HTML files
- ~10 objects total

### How to Download All S3 Files Locally
```bash
# Download entire bucket
aws s3 sync s3://dental-bids-phi-2026 ./s3-backup/dental-bids-phi-2026/ --region us-east-2

# Download all 3 buckets
aws s3 ls | awk '{print $3}' | while read bucket; do
  aws s3 sync s3://$bucket ./s3-backup/$bucket/
done

# List all objects first
aws s3 ls s3://dental-bids-phi-2026 --recursive
```

---

## 5. Secrets Manager

```
Secret Name:   rds!db-8767e0ef-0b8c-4c40-9879-a5aeb2a6e1e7
Secret ARN:    arn:aws:secretsmanager:us-east-2:670833622671:secret:rds!db-8767e0ef-0b8c-4c40-9879-a5aeb2a6e1e7-iDf913
Encryption:    aws/secretsmanager (default)
Type:          RDS managed secret
```

### Secret Value (Retrieved)
```json
{
  "username": "postgres",
  "password": "o9k(zG#.t7ey:Rh3chYOG0mF3*hc"
}
```

**IMPORTANT:** Store this password in a secure password manager (1Password, Bitwarden, etc.) immediately.

---

## 6. Route 53 / DNS

- **Hosted Zones:** None configured in Route53
- **Registered Domains:** None in Route53
- **DNS Note:** The app is accessed via direct EC2 IP (3.149.114.36) or Elastic Beanstalk URL
- **Action needed:** If using a custom domain registered elsewhere, document those nameserver settings separately

---

## 7. CloudFront

- **Distributions:** None configured
- S3 bucket is accessed directly (not through CloudFront)

---

## 8. Services NOT in Use

Confirmed empty/unused:
- AWS Amplify: No apps
- AWS Lambda: No functions
- ECS/ECR: No clusters or containers
- Systems Manager Parameter Store: No parameters
- CloudFront: No distributions
- Route53: No hosted zones

---

## 9. VPC Configuration

```
Region:   us-east-2
VPC Type: Default VPC
Subnets:  Default subnets in us-east-2a, us-east-2b, us-east-2c
```

### To Rebuild VPC for New Environment
```bash
# Default VPC can be recreated with:
aws ec2 create-default-vpc --region us-east-2

# Security groups to recreate:
# - Allow inbound 5432 from EC2 security group (for RDS)
# - Allow inbound 80/443/8080 from 0.0.0.0/0 (for API)
# - Allow inbound 22 from your IP (for SSH)
```

---

## 10. Billing Risk Assessment

```
Billing Period:     March 1-31, 2026
Current Bill:       USD $153.39 (Pending)
Bill Status:        PENDING - SUSPENSION RISK
Top Cost Driver:    RDS = $135.65/month (88% of bill)
Account ID:         670833622671
```

### Cost Breakdown (March 2026)
| Service | Cost |
|---------|------|
| Relational Database Service | $135.65 |
| CloudWatch | $3.35 |
| Elastic Compute Cloud | $1.48 |
| Virtual Private Cloud | $0.67 |
| Key Management Service | $0.36 |
| Other services | ~$12.88 |
| **Total** | **$153.39** |

### Immediate Cost-Saving Actions (If Needed)
1. **Stop RDS instance** (saves ~$135/mo) - data preserved on storage
2. **Stop EC2 instance** (saves ~$1.48/mo) - can restart when needed
3. **Keep S3** (~$0.02/mo) - minimal cost, stores important files

---

## 11. Infrastructure Rebuild Checklist

If AWS account is suspended, to rebuild on a new account:

### Phase 1: Database (Most Critical)
- [ ] Create new PostgreSQL RDS or use Railway/Supabase (free tier)
- [ ] Restore from pg_dump file
- [ ] Update connection string in app

### Phase 2: Application Server
- [ ] Launch new EC2 t3.micro or use Railway/Render (free tier)
- [ ] Clone code from GitHub: `git clone https://github.com/Pac12lives808/dental-bids-mvp`
- [ ] Install Node.js dependencies: `npm install`
- [ ] Set environment variables (see section 3)
- [ ] Start app: `npm start` or `pm2 start`

### Phase 3: File Storage
- [ ] Create new S3 bucket or use Cloudinary/Backblaze B2 (free tier)
- [ ] Upload files from local backup
- [ ] Update file upload URLs in app config

### Free Alternative Platforms
| Service | Free Alternative | Notes |
|---------|-----------------|-------|
| RDS PostgreSQL | Supabase, Railway, Neon | Free PostgreSQL |
| EC2/Elastic Beanstalk | Railway, Render, Fly.io | Free Node.js hosting |
| S3 | Cloudinary, Backblaze B2 | Free file storage |
| Route53 | Cloudflare (free DNS) | Free DNS management |

---

## 12. Emergency Contact & Access

```
AWS Account:    670833622671
AWS Username:   ryan
Region:         us-east-2 (US East Ohio)
Console URL:    https://670833622671.signin.aws.amazon.com/console
GitHub Repo:    https://github.com/Pac12lives808/dental-bids-mvp
Demo Repo:      https://github.com/Pac12lives808/dental-marketplace-demo
```

---

## 13. Immediate Action Items (Do These NOW)

1. **[ ] Export database:** Run pg_dump command from section 1
2. **[ ] Download S3 files:** Run aws s3 sync command from section 4  
3. **[ ] Save password to password manager:** Copy from section 5
4. **[ ] Download EC2 key pair:** Check EC2 > Key Pairs and download .pem file
5. **[ ] Screenshot Elastic Beanstalk config:** Go to EB > Configuration and screenshot all settings
6. **[ ] Create RDS snapshot manually:** Go to RDS > dental-bids-db > Actions > Take Snapshot

---

*Last updated: March 6, 2026 | Generated by automated AWS audit*
