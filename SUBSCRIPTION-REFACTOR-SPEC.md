# 🔧 BILLING SYSTEM REFACTOR — AWS + STRIPE SUBSCRIPTIONS

## Goal
Replace all previous payment behavior with a dentist-only recurring subscription model.
- **Patients never pay**
- **Dentists must have an active subscription to submit estimates**

## Subscription Plans

| Tier | Price | Estimate Limit |
|------|-------|----------------|
| **Pilot** | $179/mo | 40 |
| **Production** | $449/mo | 140 |
| **Capacity** | $899/mo | Unlimited |

---

## 1️⃣ Remove Old Billing Logic (MANDATORY)

### Delete:
- PaymentIntent creation
- Case submission charges
- $1.99 references
- Patient checkout UI
- Payment verification for posting cases
- Old webhooks handling per-case payments

### Search codebase for:
```
payment_intent
case_fee
submission_fee
charge_patient
pay_to_submit
```

**⚠️ Patients must be able to post cases without any payment state.**

---

## 2️⃣ Create Stripe Products & Prices

AI must create 3 Stripe recurring products using Stripe SDK.

### Products
```javascript
pilot_program_monthly     $179
production_builder_monthly $449
capacity_engine_monthly    $899
```

### All:
- `billing_cycle_anchor`: monthly
- `usage type`: licensed
- `quantity`: 1
- `automatic_tax`: enabled (if Stripe Tax used)

### Store price IDs in environment variables:
```bash
STRIPE_PRICE_PILOT=
STRIPE_PRICE_PRODUCTION=
STRIPE_PRICE_CAPACITY=
```

---

## 3️⃣ Database Changes (AWS RDS / Dynamo Compatible)

### Create new table: `office_subscriptions`
```sql
id (pk)
office_id
stripe_customer_id
stripe_subscription_id
tier ENUM(pilot,production,capacity)
status ENUM(trialing,active,past_due,canceled,incomplete)
estimate_limit INT
estimates_used INT
current_period_start TIMESTAMP
current_period_end TIMESTAMP
created_at
updated_at
```

### Rules:
- `capacity` → `estimate_limit = -1` (means unlimited)

---

## 4️⃣ Dentist Signup Flow

When dentist creates account:
1. Create Stripe customer
2. Save `stripe_customer_id`
3. Grant **14-day free trial access** (no card required)
4. Insert subscription record:
   - `tier = pilot`
   - `status = trialing`
   - `estimate_limit = 40`
   - `estimates_used = 0`
   - `current_period_end = now + 14 days`

✅ Dentist can submit estimates during trial.

---

## 5️⃣ Subscription Checkout Endpoint

### Create backend route:
```
POST /api/billing/create-checkout-session
```

### Input:
```json
{
  "tier": "pilot | production | capacity"
}
```

### Behavior:
1. Map `tier` → Stripe price ID
2. Create Stripe Checkout Session (`mode=subscription`)
3. Attach existing customer
4. `success_url` → `/billing/success`
5. `cancel_url` → `/billing`
6. Return session URL.

---

## 6️⃣ Webhook Handler (Critical)

### Create endpoint:
```
POST /api/stripe/webhook
```

Verify signature.

### Handle events:

#### `checkout.session.completed`
- Activate subscription
- `status = active`
- `tier = selected plan`
- `estimate_limit = 40 | 140 | -1`
- `estimates_used = 0`

#### `invoice.paid`
- Reset monthly usage
- `estimates_used = 0`
- `status = active`
- update period dates

#### `invoice.payment_failed`
- Lock participation
- `status = past_due`
- Dentist can still login but:
  - ❌ cannot message patients
  - ❌ cannot submit estimates
  - ❌ hidden from rankings

#### `customer.subscription.deleted`
- Cancel access
- `status = canceled`
- hide office from marketplace

---

## 7️⃣ Estimate Submission Guard (Core Logic)

### Modify estimate creation endpoint:
```
POST /api/estimates/create
```

### Add middleware:
```javascript
subscription = getOfficeSubscription(office_id)

IF subscription.status NOT IN (active,trialing)
    RETURN 402 "Active subscription required"

IF subscription.estimate_limit != -1 AND estimates_used >= estimate_limit
    RETURN 403 "Monthly estimate limit reached"

ELSE
    allow
    increment estimates_used
```

---

## 8️⃣ Ranking Weight System

Add ranking multiplier to office profile:
- `pilot` → **1.0**
- `production` → **1.6**
- `capacity` → **2.3**

Used **ONLY** when sorting dentists for patients.

---

## 9️⃣ Feature Flags by Tier

Create permission helper:
```javascript
canUseFeature(office, feature)
```

### Mapping:

| Feature | Pilot | Production | Capacity |
|---------|-------|------------|----------|
| Messaging | ✔ | ✔ | ✔ |
| View X-rays | ✔ | ✔ | ✔ |
| Templates | ✖ | ✔ | ✔ |
| Trust badge | ✖ | ✔ | ✔ |
| Intro video | ✖ | ✔ | ✔ |
| Follow-ups | ✖ | ✔ | ✔ |
| Instant alerts | ✖ | ✖ | ✔ |
| AI matching | ✖ | ✖ | ✔ |
| Multi-location | ✖ | ✖ | ✔ |
| Team accounts | ✖ | ✖ | ✔ |
| AI coaching | ✖ | ✖ | ✔ |

---

## 🔟 Billing Page UI Requirements

### Create `/billing` page:

Show:
- Current plan
- Renewal date
- Usage meter (e.g. **12 / 40 estimates**)
- Upgrade / downgrade buttons
- Payment status banner

❌ **Remove ALL patient payment screens.**

---

## 1️⃣1️⃣ Migration Script

For all existing dentists:
```javascript
assign trialing pilot
trial_end = now + 14 days
estimates_used = 0
```

---

## 1️⃣2️⃣ Acceptance Tests (Must Pass)

- ✔ Patients post cases free
- ✔ Dentists need subscription to bid
- ✔ Limits enforced
- ✔ Limits reset monthly
- ✔ Cancel removes visibility
- ✔ Upgrade instantly increases limits
- ✔ No per-case payment code remains

---

## Implementation Notes

This spec assumes:
- ✅ Frontend + backend already deployed in AWS
- ✅ Stripe already connected (but old per-case payments exist)
- ✅ Dentists = authenticated users with role `dental_office`

**Created:** February 10, 2026  
**Status:** Ready for implementation  
**Platform:** AWS (RDS/DynamoDB) + Stripe Subscriptions
