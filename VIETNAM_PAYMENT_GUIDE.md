# 💳 Hướng dẫn tích hợp thanh toán cho thị trường Việt Nam

Hướng dẫn chi tiết cách setup payment gateway cho blog subscription hướng đến audience Việt Nam.

---

## 🎯 Tổng quan

Thị trường VN khác với quốc tế:
- ❌ Nhiều người **không có thẻ quốc tế** (Visa/Mastercard)
- ✅ Phổ biến: **Thẻ ATM nội địa**, **Ví điện tử** (Momo, ZaloPay)
- ✅ **QR Code** payment rất phổ biến
- ✅ Chuyển khoản ngân hàng nội địa

→ **Stripe alone sẽ mất rất nhiều customers tiềm năng!**

---

## 🏆 Top 3 Payment Solutions cho VN

### 1️⃣ PayOS (Recommended cho indie/startups) ⭐⭐⭐

**Tại sao chọn PayOS:**
- ✅ **Đăng ký dễ**: Chỉ cần CMND/CCCD, không cần giấy phép kinh doanh
- ✅ **Setup nhanh**: < 1 ngày
- ✅ **Phí hợp lý**: 2.9% per transaction
- ✅ **Hỗ trợ subscription**: Có recurring billing
- ✅ **Multi payment**: Thẻ ATM, Momo, ZaloPay, chuyển khoản
- ✅ **Rút tiền dễ**: Về tài khoản VN bất kỳ

**Phí:**
```
- Giao dịch: 2.9%
- Phí tháng: 0đ
- Rút tiền: Miễn phí
- Minimum: Không có
```

**Tech Stack:**
```bash
npm install @payos/node
```

**Setup time:** 1 ngày (đăng ký) + 1 ngày (tích hợp)

---

### 2️⃣ VNPay (Best cho scale-up) ⭐⭐

**Tại sao chọn VNPay:**
- ✅ **Uy tín cao nhất** VN
- ✅ **Coverage tốt**: Liên kết 50+ ngân hàng
- ✅ **Enterprise features**: Fraud detection, chargeback handling
- ✅ **QR Code nationwide**: Mọi nơi đều accept

**Phí:**
```
- Giao dịch: 2.5-3%
- Phí tích hợp: 10-20 triệu VNđ (one-time)
- Phí duy trì: 2-5 triệu/tháng
- Minimum transaction: 1,000đ
```

**Tech Stack:**
```bash
npm install vnpay
```

**Yêu cầu:**
- ✅ Giấy phép kinh doanh
- ✅ Tài khoản doanh nghiệp
- ✅ Hợp đồng ký kết

**Setup time:** 2-4 tuần (giấy tờ + duyệt)

---

### 3️⃣ Combo: PayOS + Stripe (Best flexibility) ⭐⭐⭐

**Strategy:**
```
PayOS: Cho người VN (80% users)
  → Thẻ ATM nội địa
  → Momo, ZaloPay
  → QR Code

Stripe: Cho quốc tế (20% users)
  → Visa/Mastercard
  → International users
```

**Lợi ích:**
- ✅ Cover 100% market
- ✅ Mỗi user chọn payment phù hợp
- ✅ Maximize conversion rate

---

## 🚀 Implementation: PayOS

### Step 1: Đăng ký PayOS

1. Truy cập [payos.vn](https://payos.vn)
2. Đăng ký với:
   - CMND/CCCD
   - Số điện thoại
   - Tài khoản ngân hàng để nhận tiền
3. Xác minh danh tính (< 24h)
4. Lấy API credentials

### Step 2: Install Package

```bash
npm install @payos/node
```

### Step 3: Setup PayOS Client

**File:** `src/lib/payos.ts`
```typescript
import PayOS from '@payos/node';

const payOS = new PayOS(
  import.meta.env.PAYOS_CLIENT_ID,
  import.meta.env.PAYOS_API_KEY,
  import.meta.env.PAYOS_CHECKSUM_KEY
);

export default payOS;
```

**Environment variables (.env):**
```bash
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key
```

### Step 4: Create Payment Link

**File:** `src/pages/api/create-payment.ts`
```typescript
import type { APIRoute } from 'astro';
import payOS from '../../lib/payos';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { plan, userId } = await request.json();
    
    // Get user info
    const { data: user } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    // Pricing
    const amounts = {
      monthly: 199000, // 199k VNĐ/tháng
      yearly: 1990000, // 1.99 triệu/năm (save 17%)
    };

    const amount = amounts[plan];
    const orderCode = Date.now(); // Unique order code

    // Create payment link
    const paymentLink = await payOS.createPaymentLink({
      orderCode: orderCode,
      amount: amount,
      description: `AI Knowledge Hub - ${plan} subscription`,
      returnUrl: `${request.headers.get('origin')}/payment/success`,
      cancelUrl: `${request.headers.get('origin')}/payment/cancel`,
      buyerName: user.full_name,
      buyerEmail: user.email,
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    // Save order to database
    await supabase.from('payment_orders').insert({
      order_code: orderCode,
      user_id: userId,
      plan_type: plan,
      amount: amount,
      status: 'pending',
    });

    return new Response(JSON.stringify({ 
      checkoutUrl: paymentLink.checkoutUrl 
    }), {
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

### Step 5: Handle Webhook

**File:** `src/pages/api/payos-webhook.ts`
```typescript
import type { APIRoute } from 'astro';
import payOS from '../../lib/payos';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Verify webhook signature
    const webhookData = payOS.verifyPaymentWebhookData(body);
    
    if (!webhookData) {
      return new Response('Invalid signature', { status: 400 });
    }

    const { orderCode, amount, description, metadata } = webhookData;

    // Update order status
    await supabase
      .from('payment_orders')
      .update({ status: 'completed' })
      .eq('order_code', orderCode);

    // Create subscription
    const { userId, plan } = metadata;
    const now = new Date();
    const periodEnd = new Date();
    
    if (plan === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    await supabase.from('subscriptions').insert({
      user_id: userId,
      payos_order_code: orderCode,
      plan_type: plan,
      status: 'active',
      current_period_start: now,
      current_period_end: periodEnd,
    });

    // Send confirmation email
    // TODO: Implement email sending

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
```

### Step 6: Subscribe Page UI

**File:** `src/pages/subscribe.astro`
```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<!doctype html>
<html lang="vi">
  <head>
    <BaseHead title="Đăng ký Premium - AI Knowledge Hub" />
  </head>
  <body>
    <Header />
    <main class="subscribe-container">
      <h1>🚀 Nâng cấp lên Premium</h1>
      <p>Mở khóa toàn bộ nội dung AI chuyên sâu</p>

      <div class="pricing-cards">
        <!-- Monthly Plan -->
        <div class="price-card">
          <h3>Gói Tháng</h3>
          <div class="price">
            <span class="amount">199.000₫</span>
            <span class="period">/tháng</span>
          </div>
          <ul class="features">
            <li>✅ Không giới hạn bài viết</li>
            <li>✅ Nội dung mới mỗi tuần</li>
            <li>✅ Download PDF</li>
            <li>✅ Hủy bất cứ lúc nào</li>
          </ul>
          <button class="subscribe-btn" data-plan="monthly">
            Đăng ký ngay
          </button>
          <p class="payment-methods">
            💳 Thẻ ATM • 📱 Momo • 🏦 Chuyển khoản
          </p>
        </div>

        <!-- Yearly Plan -->
        <div class="price-card featured">
          <div class="badge">⚡ Tiết kiệm 17%</div>
          <h3>Gói Năm</h3>
          <div class="price">
            <span class="amount">1.990.000₫</span>
            <span class="period">/năm</span>
          </div>
          <div class="savings">
            <del>2.388.000₫</del>
            <span>Tiết kiệm 398.000₫</span>
          </div>
          <ul class="features">
            <li>✅ Tất cả trong gói tháng</li>
            <li>✅ Hỗ trợ ưu tiên</li>
            <li>✅ Nội dung độc quyền</li>
            <li>✅ Cộng đồng private</li>
          </ul>
          <button class="subscribe-btn primary" data-plan="yearly">
            Đăng ký ngay - Tốt nhất 🔥
          </button>
          <p class="payment-methods">
            💳 Thẻ ATM • 📱 Momo • 🏦 Chuyển khoản
          </p>
        </div>
      </div>

      <div class="guarantee">
        <h3>💯 Cam kết hoàn tiền 100%</h3>
        <p>Không hài lòng trong 7 ngày đầu? Hoàn lại toàn bộ tiền, không hỏi lý do.</p>
      </div>
    </main>
    <Footer />
  </body>
</html>

<script>
  import { supabase } from '../lib/supabase';

  document.querySelectorAll('.subscribe-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const plan = e.target.dataset.plan;
      
      // Check login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login?redirect=/subscribe';
        return;
      }

      // Show loading
      e.target.textContent = 'Đang xử lý...';
      e.target.disabled = true;

      try {
        // Create PayOS payment link
        const response = await fetch('/api/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, userId: user.id }),
        });

        const { checkoutUrl } = await response.json();
        
        // Redirect to PayOS checkout
        window.location.href = checkoutUrl;

      } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
        e.target.textContent = 'Đăng ký ngay';
        e.target.disabled = false;
      }
    });
  });
</script>

<style>
  .subscribe-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 3rem 1rem;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .pricing-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
  }

  .price-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 2rem;
    position: relative;
    transition: transform 0.3s;
  }

  .price-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }

  .price-card.featured {
    border-color: #667eea;
    border-width: 3px;
    transform: scale(1.05);
  }

  .badge {
    position: absolute;
    top: -15px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: bold;
  }

  .price {
    margin: 1.5rem 0;
  }

  .amount {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
  }

  .period {
    font-size: 1rem;
    color: #6b7280;
  }

  .savings {
    margin: 1rem 0;
    color: #22c55e;
    font-weight: bold;
  }

  .savings del {
    color: #9ca3af;
    margin-right: 0.5rem;
  }

  .features {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
    text-align: left;
  }

  .features li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .subscribe-btn {
    width: 100%;
    padding: 1rem 2rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
  }

  .subscribe-btn:hover {
    background: #5568d3;
    transform: translateY(-2px);
  }

  .subscribe-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .payment-methods {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #6b7280;
  }

  .guarantee {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    margin-top: 3rem;
  }

  .guarantee h3 {
    margin: 0 0 0.5rem 0;
  }

  .guarantee p {
    margin: 0;
    opacity: 0.95;
  }
</style>
```

---

## 💰 Pricing Strategy cho VN

### Recommended Pricing:

```
Monthly:  199.000₫  (~$8.5 USD)
Yearly:  1.990.000₫ (~$85 USD, save 17%)
```

**Tại sao giá này:**
- ✅ Hợp lý với income VN (1-2 bữa cafe)
- ✅ Lower than Udemy course (usually 500k+)
- ✅ Affordable cho students/freshers
- ✅ Still profitable (199k × 100 subs = 19.9M/month)

### Alternative Tiers:

```
Basic:    99.000₫/tháng  - Limited articles
Pro:     199.000₫/tháng  - All articles
Premium: 299.000₫/tháng  - All + 1-on-1 support
```

---

## 📊 Database Schema for PayOS

```sql
-- Payment orders tracking
CREATE TABLE payment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code BIGINT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'completed', 'cancelled'
  payos_transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Subscriptions (same as before)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  payos_order_code BIGINT,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payment_orders_user ON payment_orders(user_id);
CREATE INDEX idx_payment_orders_code ON payment_orders(order_code);
```

---

## 🔄 Recurring Billing với PayOS

PayOS hỗ trợ recurring billing nhưng cần config:

### Option 1: Manual Renewal (Recommended ban đầu)
```
1. User mua subscription
2. Hết hạn → send email reminder
3. User click link → renew
```

### Option 2: Auto-renewal
```
1. User đăng ký auto-renew
2. Save payment method
3. Hàng tháng tự động charge
```

**Implementation:**
```typescript
// Send renewal reminder 3 days before expiry
async function sendRenewalReminder() {
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  const { data: expiringSubscriptions } = await supabase
    .from('subscriptions')
    .select('*, profiles(*)')
    .eq('status', 'active')
    .lte('current_period_end', threeDaysLater);

  for (const sub of expiringSubscriptions) {
    // Send email with renewal link
    await sendEmail({
      to: sub.profiles.email,
      subject: 'Đăng ký Premium sắp hết hạn',
      body: `Xin chào ${sub.profiles.full_name},
      
      Đăng ký Premium của bạn sẽ hết hạn vào ${sub.current_period_end}.
      
      Gia hạn ngay để tiếp tục truy cập nội dung:
      ${process.env.SITE_URL}/renew?subscription=${sub.id}
      
      Trân trọng,
      AI Knowledge Hub`
    });
  }
}
```

---

## 🎯 Next Steps

1. **This Week:**
   - [ ] Đăng ký PayOS (1 ngày)
   - [ ] Setup test environment
   - [ ] Test payment flow

2. **Next Week:**
   - [ ] Implement PayOS integration
   - [ ] Create subscribe page
   - [ ] Setup webhooks

3. **Week 3:**
   - [ ] Test với real money (nhỏ)
   - [ ] Setup email reminders
   - [ ] Launch beta

**Timeline:** 2-3 tuần để có full payment system

---

## 💡 Pro Tips

1. **Giá VNĐ dễ convert mental math:**
   - ❌ 187.500₫ → hard to remember
   - ✅ 199.000₫ → easy, memorable

2. **Payment methods hiển thị rõ:**
   - Show icons: 💳 📱 🏦
   - Người VN thích biết trước họ có thể dùng gì

3. **Trust signals:**
   - "Đã có 500+ thành viên"
   - Hiển thị số lượng subscribers
   - Testimonials bằng tiếng Việt

4. **Seasonal promotions:**
   - Tết: -20%
   - Black Friday: -30%
   - Student discount: -15%

---

**Questions?** Email: nguyendai53100@gmail.com
