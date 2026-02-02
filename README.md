# Dental Bids MVP - Deployment Guide

**HIPAA-lean dental treatment bidding marketplace** - MVP for patient-office matching with Stripe payments

## 🚀 QUICK DEPLOYMENT (Launch Tomorrow 9AM MST)

### Prerequisites Met
✅ AWS Account (us-east-2) with:
  - RDS: `dental-bids-db` (PostgreSQL)
  - S3: `dental-bids-phi-2026` bucket  
  - ECR repositories ready

✅ GitHub: Repository created at `Pac12lives808/dental-bids-mvp`

### IMMEDIATE NEXT STEPS

#### 1. Clone and Get Full Code (5 min)
```bash
git clone https://github.com/Pac12lives808/dental-bids-mvp.git
cd dental-bids-mvp
```

#### 2. Get Complete Code Files
**The complete application code from the Perplexity conversation needs to be added.**  
All code files are documented at: https://www.perplexity.ai/search/i-need-you-to-write-code-in-a-ogfUCEdOSiasLm9VlTFt5g#16

**Required file structure:**
```
dental-bids-mvp/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── auth/          # JWT authentication
│   │   ├── cases/         # Case management
│   │   ├── bids/          # Bidding system
│   │   ├── stripe/        # Payment processing
│   │   └── common/        # Guards, decorators
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json       # ✅ Already created
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   ├── next.config.js
│   └── .env.example
└── terraform/
    ├── main.tf
    ├── rds.tf
    ├── s3.tf
    └── elastic-beanstalk.tf
```

#### 3. Backend Setup (10 min)
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with:
# DATABASE_URL="postgresql://USER:PASS@dental-bids-db.xxxxx.us-east-2.rds.amazonaws.com:5432/dental_bids"
# JWT_SECRET="your-256-bit-secret"
# STRIPE_SECRET_KEY="sk_test_..."
# AWS_BUCKET="dental-bids-phi-2026"
# AWS_REGION="us-east-2"

# Run migrations
npx prisma generate
npx prisma migrate deploy

# Test locally
npm run start:dev
```

#### 4. Build & Deploy Backend to AWS (20 min)
```bash
# Build Docker image
docker build -t dental-bids-backend .

# Tag for ECR
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com

docker tag dental-bids-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/dental-bids-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/dental-bids-backend:latest

# Deploy to Elastic Beanstalk
eb init dental-bids-api --platform docker --region us-east-2
eb create dental-bids-prod --instance-type t3.small --envvars \
  DATABASE_URL=$DATABASE_URL,\
  JWT_SECRET=$JWT_SECRET,\
  STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,\
  AWS_BUCKET=dental-bids-phi-2026
```

#### 5. Configure Stripe Webhook (5 min)
```bash
# Get EB URL
EB_URL=$(eb status | grep CNAME | awk '{print $2}')

# In Stripe Dashboard:
# 1. Go to Developers → Webhooks
# 2. Add endpoint: https://$EB_URL/stripe/webhook
# 3. Select events: payment_intent.succeeded, payment_intent.payment_failed
# 4. Copy webhook secret to .env as STRIPE_WEBHOOK_SECRET
```

#### 6. Deploy Frontend to Vercel (10 min)
```bash
cd ../frontend
npm install

# Configure .env.local
echo "NEXT_PUBLIC_API_URL=https://$EB_URL" > .env.local
echo "NEXT_PUBLIC_STRIPE_KEY=pk_test_..." >> .env.local

# Deploy
npx vercel --prod
```

#### 7. Smoke Tests (5 min)
```bash
# Test health endpoint
curl https://$EB_URL/health

# Test patient registration
curl -X POST https://$EB_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@patient.com","password":"Test123!","role":"PATIENT"}'

# Test case creation (requires Stripe payment)
# Use frontend: https://your-app.vercel.app
```

## 📋 POST-LAUNCH MONITORING (Week 1)

### Daily Checks
- [ ] Check EB Health (AWS Console → Elastic Beanstalk)
- [ ] Review CloudWatch Logs for errors
- [ ] Monitor Stripe Dashboard for payment issues
- [ ] Verify S3 encryption (all objects use AES-256)

### Metrics to Track
- API response times (target: <500ms p95)
- Database connections (RDS max_connections)
- S3 upload success rate
- Stripe payment success rate

### Rollback Procedure
```bash
eb deploy --version PREVIOUS_VERSION_LABEL
```

## 🔒 HIPAA-Lean Compliance Checklist

✅ **No PHI in Stripe**: Only $1.99 charge + anonymous case_id  
✅ **Anonymized Bidding**: Offices see zipcode, not patient names  
✅ **S3 Encryption**: Server-side AES-256 (SSE-S3)  
✅ **TLS in Transit**: All API calls over HTTPS  
✅ **RBAC**: JWT-based role checks (PATIENT/OFFICE/ADMIN)  
✅ **Audit Logs**: Prisma timestamps on all DB operations  

## 📦 Code Repository

### Option 1: Download Complete Code Archive
The repository has been initialized with:
- Setup script: `SETUP.sh`
- Backend structure: `backend/package.json`  

**To get ALL remaining code files:** Extract them from the Perplexity conversation linked above and place them in the correct directories.

### Option 2: Use Git Submodules (if code is in separate repo)
```bash
git submodule add https://github.com/Pac12lives808/dental-bids-code backend-code
```

## ⚠️ Important Notes

1. **Stripe Test Mode**: Use test keys initially (sk_test_*, pk_test_*)
2. **Database Credentials**: Get from AWS RDS Console
3. **Launch Timing**: Deploy backend first, then frontend
4. **Monitoring**: Set up CloudWatch alarms for EB health
5. **Cost**: Est. $50-75/month (t3.small EB + RDS db.t3.micro + S3)

## 🔗 Links

- Original Perplexity Conversation: https://www.perplexity.ai/search/i-need-you-to-write-code-in-a-ogfUCEdOSiasLm9VlTFt5g#16
- AWS Console (us-east-2): https://us-east-2.console.aws.amazon.com/
- GitHub Repo: https://github.com/Pac12lives808/dental-bids-mvp

---

**Status**: Repository initialized, backend package.json created, deployment guide complete.  
**Next Action**: Clone repo → Add code files → Follow deployment steps 3-7 above.
