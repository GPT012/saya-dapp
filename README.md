# سایا | Saya Music Platform

پلتفرم موسیقی مبتنی بر Web3 برای اشتراک‌گذاری و مالکیت ترک‌های موسیقی به‌صورت NFT.

## ویژگی‌ها

- 🎵 آپلود و اشتراک‌گذاری موزیک
- 🔗 اتصال کیف پول Web3 (MetaMask)
- 💎 تبدیل موزیک به NFT
- 🎧 پخش‌کننده موزیک پیشرفته
- 📊 آمار و تحلیلات
- 🌐 ذخیره‌سازی غیرمتمرکز با IPFS

## تکنولوژی‌های استفاده شده

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Database**: Supabase
- **Storage**: IPFS (Pinata)
- **Web3**: Ethereum, MetaMask
- **Authentication**: Wallet-based auth

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- npm یا yarn
- MetaMask browser extension

### مراحل نصب

1. **کلون کردن پروژه**
\`\`\`bash
git clone https://github.com/011-karbalad/test.git
cd test
\`\`\`

2. **نصب dependencies**
\`\`\`bash
npm install
\`\`\`

3. **تنظیم environment variables**
فایل `.env.local` را ایجاد کنید:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PINATA_JWT=your_pinata_jwt
\`\`\`

4. **اجرای پروژه**
\`\`\`bash
npm run dev
\`\`\`

5. **تست اتصالات**
به آدرس `http://localhost:3000/test-connection` برید

## ساختار پروژه

\`\`\`
├── app/                    # Next.js App Router
│   ├── components/         # React Components
│   ├── api/               # API Routes
│   └── globals.css        # Global Styles
├── lib/                   # Utility Functions
├── contexts/              # React Contexts
├── scripts/               # Database Scripts
└── contracts/             # Smart Contracts
\`\`\`

## استفاده

### اتصال کیف پول
1. روی دکمه "اتصال کیف پول" کلیک کنید
2. MetaMask را انتخاب کنید
3. درخواست اتصال را تأیید کنید

### آپلود موزیک
1. به صفحه آپلود بروید
2. فایل صوتی و تصویر کاور را انتخاب کنید
3. اطلاعات ترک را وارد کنید
4. روی "آپلود به IPFS" کلیک کنید

### پخش موزیک
- روی هر ترک کلیک کنید تا پخش شود
- از پلیر پایین صفحه استفاده کنید
- حالت دمو برای تست بدون فایل واقعی

## مشارکت

1. Fork کنید
2. Branch جدید ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. Pull Request ایجاد کنید

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## تماس

- GitHub: [@011-karbalad](https://github.com/011-karbalad)
- Email: your-email@example.com

---

**سایا - هر صدا، یک هویت** 🎵
