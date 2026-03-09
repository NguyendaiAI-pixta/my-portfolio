# 💰 Premium Subscription Implementation Guide

Hướng dẫn chi tiết để biến blog thành nền tảng subscription, bắt người đọc phải trả tiền để đọc hết nội dung.

---

## 🎯 Chiến lược Premium Subscription

### Mô hình Freemium
- **30% đầu bài viết**: Miễn phí cho mọi người (hook readers)
- **70% còn lại**: Chỉ premium members mới đọc được

### Lợi ích:
✅ Thu nhập ổn định, dự đoán được (recurring revenue)  
✅ Không phụ thuộc vào traffic như AdSense  
✅ 100 subscribers × $9.99 = $999/tháng  
✅ Giá trị cao hơn AdSense (1000 pageviews ≈ $2-5 với ads)

---

## 🛠️ Tech Stack Cần Thiết

### 1. Authentication (Bắt buộc)
Cần biết ai đã login và ai đã trả tiền.

**Lựa chọn tốt nhất cho Astro:**

#### Option A: Supabase (Recommended ⭐)
```bash
npm install @supabase/supabase-js
```

**Ưu điểm:**
- ✅ Auth + Database + Storage tất cả trong 1
- ✅ Free tier: 50,000 monthly active users
- ✅ Dễ tích hợp với Astro
- ✅ Có sẵn Row Level Security (bảo mật tốt)
- ✅ Realtime subscriptions

**Setup:**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
```

#### Option B: Auth0
```bash
npm install @auth0/auth0-spa-js
```

**Ưu điểm:**
- ✅ Enterprise-grade security
- ✅ Social login (Google, GitHub, Facebook)
- ✅ Free tier: 7,000 active users

#### Option C: Clerk
```bash
npm install @clerk/clerk-js
```

**Ưu điểm:**
- ✅ Đẹp nhất về UI/UX
- ✅ Developer-friendly
- ✅ Free tier: 10,000 monthly active users

---

### 2. Payment Processing (Bắt buộc)

#### 🇻🇳 QUAN TRỌNG: Cho thị trường Việt Nam

Vì audience chủ yếu là người Việt, nên ưu tiên payment methods phổ biến tại VN:

#### Option A: VNPay (Recommended cho VN ⭐⭐⭐)
```bash
npm install vnpay
```

**Ưu điểm:**
- ✅ Phổ biến nhất tại Việt Nam
- ✅ Hỗ trợ thẻ ATM nội địa (không cần Visa/Mastercard)
- ✅ QR Code payment
- ✅ Ví điện tử (Momo, ZaloPay integration)
- ✅ Thanh toán qua ngân hàng trực tuyến

**Nhược điểm:**
- ❌ Phí giao dịch: 2.5-3% (cần đăng ký doanh nghiệp)
- ❌ Cần giấy phép kinh doanh
- ❌ Setup phức tạp hơn Stripe

**Phí:**
- 2.5% - 3% per transaction
- Phí tích hợp: 10-20 triệu VND one-time (tùy package)

**Website:** [vnpay.vn](https://vnpay.vn)

---

#### Option B: PayOS by PayPal (Recommended cho startups VN ⭐⭐)
```bash
npm install @payos/node
```

**Ưu điểm:**
- ✅ Dễ đăng ký (chỉ cần CMND/CCCD)
- ✅ Không cần giấy phép kinh doanh
- ✅ Hỗ trợ thẻ nội địa + Momo + ZaloPay
- ✅ API đơn giản, document tiếng Việt
- ✅ Thanh toán QR code

**Phí:**
- 2.9% per transaction
- Không có phí tháng
- Rút về tài khoản VN miễn phí

**Website:** [payos.vn](https://payos.vn)

**⚡ BEST CHOICE cho indie developers/startups VN**

---

#### Option C: Momo Business
```bash
# REST API integration
```

**Ưu điểm:**
- ✅ 30+ triệu users tại VN
- ✅ UX quen thuộc với người Việt
- ✅ Thanh toán nhanh (scan QR)

**Nhược điểm:**
- ❌ Cần đăng ký doanh nghiệp
- ❌ Không hỗ trợ recurring billing tốt
- ❌ Phải tích hợp thủ công cho subscription

**Phí:**
- 2% - 2.5% per transaction

---

#### Option D: Stripe (Cho international audience)
```bash
npm install stripe @stripe/stripe-js
```

**Ưu điểm:**
- ✅ Best in class cho subscriptions
- ✅ Automatic recurring billing
- ✅ Customer portal

**Nhược điểm cho VN:**
- ❌ Cần thẻ quốc tế (Visa/Mastercard)
- ❌ Nhiều người VN không có thẻ quốc tế
- ❌ Phí cao hơn cho VN (currency conversion)

**Pricing:**
- 3.4% + $0.30 per VN card
- No monthly fees

---

### 🎯 Recommendation cho blog VN:

**Giai đoạn đầu (0-100 subscribers):**
- Dùng **PayOS** - dễ setup, không cần giấy phép
- Accept: Thẻ ATM nội địa, Momo, ZaloPay
- Rút tiền về tài khoản VN dễ dàng

**Giai đoạn phát triển (100+ subscribers):**
- Upgrade lên **VNPay** - professional hơn
- Hoặc dùng **combo PayOS + Stripe** cho cả VN và quốc tế

**Cách tốt nhất:**
```typescript
// Hỗ trợ nhiều payment methods
export const PAYMENT_METHODS = {
  payos: true,    // Cho người VN (thẻ nội địa, Momo, ZaloPay)
  vnpay: false,   // Upgrade sau khi có nhiều users
  stripe: true,   // Cho quốc tế (Visa/Mastercard)
};
```

---

### 3. Database (Bắt buộc)
Lưu trữ user data, subscription status.

#### Option A: Supabase Postgres (Recommended)
- Đi kèm với Supabase Auth
- Free tier: 500MB database

#### Option B: PlanetScale (MySQL)
```bash
npm install @planetscale/database
```

#### Option C: MongoDB Atlas
```bash
npm install mongodb
```

---

## 📋 Database Schema

```sql
-- Users table (nếu dùng Supabase thì có sẵn auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL, -- 'monthly' or 'yearly'
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_user_subscriptions ON subscriptions(user_id);
CREATE INDEX idx_stripe_customer ON subscriptions(stripe_customer_id);
```

---

## 🚀 Implementation Steps

### Step 1: Setup Supabase

1. Tạo project tại [supabase.com](https://supabase.com)
2. Get API credentials
3. Add to `.env`:
```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Install packages:
```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-sveltekit # for SSR
```

---

### Step 2: Setup Stripe

1. Tạo account tại [stripe.com](https://stripe.com)
2. Create Products:
   - Monthly Plan: $9.99/month
   - Yearly Plan: $79.99/year
3. Get API keys
4. Add to `.env`:
```bash
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. Install packages:
```bash
npm install stripe @stripe/stripe-js
```

---

### Step 3: Create Auth Pages

**Login Page** (`src/pages/login.astro`):
```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<!doctype html>
<html lang="en">
  <head>
    <BaseHead title="Login - AI Knowledge Hub" description="Login to access premium content" />
  </head>
  <body>
    <Header />
    <main>
      <div class="auth-container">
        <h1>🔐 Login to Your Account</h1>
        <div id="login-form"></div>
      </div>
    </main>
    <Footer />
  </body>
</html>

<script>
  import { supabase } from '../lib/supabase';

  // Login with email/password
  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      window.location.href = '/blog';
    }
  }

  // Login with Google
  async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }
</script>
```

**Signup Page** (`src/pages/signup.astro`):
Similar to login, but use `supabase.auth.signUp()`.

---

### Step 4: Create Subscription Flow

**Subscribe Page** (`src/pages/subscribe.astro`):
```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { PREMIUM_CONFIG } from '../consts';
---

<!doctype html>
<html lang="en">
  <head>
    <BaseHead title="Subscribe - AI Knowledge Hub" description="Get premium access" />
    <script src="https://js.stripe.com/v3/"></script>
  </head>
  <body>
    <Header />
    <main>
      <div class="pricing-container">
        <h1>🚀 Get Premium Access</h1>
        
        <div class="pricing-cards">
          <div class="price-card">
            <h3>Monthly</h3>
            <div class="price">${PREMIUM_CONFIG.pricing.monthly.price}/mo</div>
            <button data-plan="monthly" class="subscribe-btn">Subscribe</button>
          </div>
          
          <div class="price-card featured">
            <div class="badge">Best Value</div>
            <h3>Yearly</h3>
            <div class="price">${PREMIUM_CONFIG.pricing.yearly.price}/yr</div>
            <div class="savings">Save {PREMIUM_CONFIG.pricing.yearly.savings}</div>
            <button data-plan="yearly" class="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </body>
</html>

<script>
  import { loadStripe } from '@stripe/stripe-js';
  import { supabase } from '../lib/supabase';

  const stripe = await loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

  document.querySelectorAll('.subscribe-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const plan = e.target.dataset.plan;
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login?redirect=/subscribe';
        return;
      }

      // Create Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: user.id }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId });
    });
  });
</script>
```

---

### Step 5: Create API Endpoints

Astro supports API routes. Create these in `src/pages/api/`:

**Create Checkout Session** (`src/pages/api/create-checkout-session.ts`):
```typescript
import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { plan, userId } = await request.json();
    
    // Price IDs from Stripe Dashboard
    const priceId = plan === 'monthly' 
      ? 'price_monthly_id_from_stripe'
      : 'price_yearly_id_from_stripe';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/subscribe`,
      client_reference_id: userId, // Track user
      metadata: {
        userId: userId,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
```

**Stripe Webhook** (`src/pages/api/stripe-webhook.ts`):
```typescript
import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle different events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Create subscription record in database
      await createSubscription(session);
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await updateSubscription(subscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object;
      await cancelSubscription(deletedSub);
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};

async function createSubscription(session: Stripe.Checkout.Session) {
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: session.metadata.userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      status: 'active',
      plan_type: session.metadata.plan,
    });
  
  if (error) console.error('Error creating subscription:', error);
}

async function updateSubscription(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function cancelSubscription(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);
}
```

**Check Subscription Status** (`src/pages/api/check-subscription.ts`):
```typescript
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies }) => {
  const authToken = cookies.get('sb-access-token');
  
  if (!authToken) {
    return new Response(JSON.stringify({ premium: false }), { status: 200 });
  }

  // Get user from Supabase
  const { data: { user } } = await supabase.auth.getUser(authToken.value);
  
  if (!user) {
    return new Response(JSON.stringify({ premium: false }), { status: 200 });
  }

  // Check subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  return new Response(JSON.stringify({ 
    premium: !!subscription,
    plan: subscription?.plan_type,
    expiresAt: subscription?.current_period_end,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

---

### Step 6: Protect Premium Content

**Update PremiumContent component** (`src/components/PremiumContent.astro`):
```astro
---
interface Props {
  isPremium?: boolean;
}

const { isPremium = false } = Astro.props;

// Server-side check for premium status
let userIsPremium = false;

if (isPremium && Astro.cookies.has('sb-access-token')) {
  const token = Astro.cookies.get('sb-access-token').value;
  // Call your API to check subscription
  const response = await fetch(`${Astro.url.origin}/api/check-subscription`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  userIsPremium = data.premium;
}

const showPaywall = isPremium && !userIsPremium;
---

{showPaywall ? (
  <!-- Show paywall UI -->
  <div class="paywall-container">
    <!-- Your existing paywall design -->
  </div>
) : (
  <!-- Show full content -->
  <slot />
)}
```

---

### Step 7: Use in Blog Posts

```mdx
---
title: "Advanced LLM Fine-tuning Techniques"
description: "Learn production-ready fine-tuning strategies"
pubDate: 2026-03-05
isPremium: true
---

import PremiumContent from '../../../components/PremiumContent.astro';

# Advanced LLM Fine-tuning Techniques

This is the free preview that everyone can see...

## Introduction to Fine-tuning

Basic concepts here...

<PremiumContent isPremium={true}>

## Advanced Techniques (Premium Only)

This section is only visible to paid subscribers:

- Parameter-efficient fine-tuning (LoRA, QLoRA)
- Multi-task learning strategies
- Reinforcement learning from human feedback (RLHF)
- Production deployment patterns

</PremiumContent>
```

---

## 📊 Conversion Strategy

### 1. Hook với Free Content (30%)
- Đủ giá trị để người đọc thấy hữu ích
- Đủ hấp dẫn để họ muốn đọc tiếp
- Show expertise của bạn

### 2. Paywall Timing
Đặt paywall ở điểm người đọc:
- Đã được "hook" bởi nội dung
- Muốn biết phần practical/advanced
- Sẵn sàng trả tiền để học tiếp

### 3. Social Proof
- "Join 500+ AI engineers learning advanced techniques"
- Testimonials (khi có)
- Number of premium articles

### 4. Risk Reversal
- 7-day money-back guarantee
- Cancel anytime
- "Try first month for $1" (promotional)

---

## 💡 Growth Tactics

### 1. Content Ladder
- **Free**: Basics, getting started
- **Premium**: Advanced, production-ready, case studies

### 2. Email Nurture
```
Day 1: Welcome email
Day 3: Share best free article
Day 7: Show premium value
Day 14: Limited-time discount offer
```

### 3. Retargeting
- Người đọc >3 bài free → Show popup offer
- Exit intent popup với discount
- "Unlock all articles for $7.99/month"

### 4. Referral Program
- Give 1 month free cho mỗi referral
- Referred person gets 20% off first month

---

## 📈 Expected Timeline

### Month 1-2: Setup
- [ ] Setup Supabase
- [ ] Setup Stripe
- [ ] Implement auth
- [ ] Create subscription flow
- [ ] Test payments

### Month 3-4: Content
- [ ] Create 10 premium articles
- [ ] Update existing posts to freemium
- [ ] Build email list

### Month 5-6: Launch
- [ ] Soft launch to email list
- [ ] Special pricing for early adopters
- [ ] Collect feedback
- [ ] Optimize conversion

### Month 7+: Scale
- [ ] Regular content (2-3 premium posts/month)
- [ ] A/B test pricing
- [ ] Add annual plan
- [ ] Marketing campaigns

---

## 💰 Revenue Projections

### Conservative (Year 1)
- 50 subscribers × $9.99 = **$500/month**
- Annual: **$6,000**

### Moderate (Year 2)
- 200 subscribers × $9.99 = **$2,000/month**
- Annual: **$24,000**

### Optimistic (Year 3)
- 500 subscribers × $9.99 = **$5,000/month**
- Annual: **$60,000**

---

## 🚨 Common Pitfalls to Avoid

1. ❌ **Too much paywall too soon** → People leave
2. ❌ **Free content too good** → No one converts
3. ❌ **Pricing too high** → No one buys
4. ❌ **Pricing too low** → Leave money on table
5. ❌ **No email collection** → Can't retarget
6. ❌ **Poor onboarding** → High churn

---

## ✅ Next Actions

1. **This week**:
   - [ ] Sign up for Supabase
   - [ ] Sign up for Stripe
   - [ ] Create test accounts

2. **Next 2 weeks**:
   - [ ] Implement authentication
   - [ ] Build subscription pages
   - [ ] Test payment flow

3. **Next month**:
   - [ ] Create 5 premium articles
   - [ ] Soft launch to beta users
   - [ ] Get first paying customer 🎉

---

**Need help?** Email: nguyendai53100@gmail.com
