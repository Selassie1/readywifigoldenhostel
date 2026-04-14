# ReadyWifi - Internet Voucher System

A complete USSD + Website + Admin Dashboard system for selling WiFi vouchers with Paystack payments and Hubtel SMS delivery.

## Features

### 🎯 Core Functionality
- **USSD System**: Dial `*123#` to buy vouchers directly from your phone
- **Web Portal**: Modern website for voucher purchase
- **Admin Dashboard**: Complete management interface
- **Payment Processing**: Paystack integration for web and mobile money
- **SMS Delivery**: Hubtel integration for instant voucher delivery
- **CSV Upload**: Bulk voucher import from CSV files

### 📱 USSD Flow
1. User dials `*123#`
2. Selects "Buy Internet"
3. Chooses from available plans
4. Confirms purchase
5. Receives mobile money prompt
6. Gets SMS with voucher code after payment

### 🌐 Web Flow
1. User visits website
2. Selects plan and enters details
3. Redirected to Paystack checkout
4. Completes payment
5. Receives SMS with voucher code

### 👨‍💼 Admin Features
- Upload vouchers via CSV
- Monitor inventory and sales
- Resend SMS to customers
- View detailed analytics
- Manage voucher batches

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Express
- **Database**: MongoDB with Mongoose
- **Payments**: Paystack
- **SMS**: Hubtel
- **USSD**: Hubtel USSD Gateway

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd wifi-voucher-system
npm install
```

### 2. Environment Setup

Copy `env.example` to `.env.local` and fill in your credentials:

```bash
cp env.example .env.local
```

Required environment variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/wifi-vouchers

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
WEBHOOK_SECRET=your_webhook_secret_here

# Hubtel
HUBTEL_CLIENT_ID=your_hubtel_client_id
HUBTEL_CLIENT_SECRET=your_hubtel_client_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# SMS Settings
SMS_SENDER_NAME=ReadyWifi
SUPPORT_PHONE=+233XXXXXXXXX
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the website.

## Configuration

### Paystack Setup

1. Create account at [Paystack](https://paystack.com)
2. Get your API keys from the dashboard
3. Set up webhook endpoint: `https://yourdomain.com/api/webhook/paystack`
4. Configure webhook events: `charge.success`

### Hubtel Setup

1. Create account at [Hubtel](https://hubtel.com)
2. Get your client credentials
3. Configure USSD short code: `*123#`
4. Set USSD callback URL: `https://yourdomain.com/api/ussd`

### MongoDB Setup

1. Create MongoDB database
2. Update `MONGODB_URI` in environment variables
3. The app will automatically create collections

## Usage

### Admin Dashboard

1. Visit `/admin` to access the dashboard
2. Upload voucher CSV files
3. Monitor sales and inventory
4. Resend SMS to customers

### CSV Upload Format

Your CSV file should have a `code` column:

```csv
code
ABC12345
DEF67890
GHI11111
```

### USSD Configuration

Configure your USSD short code with Hubtel to point to:
```
https://yourdomain.com/api/ussd
```

## API Endpoints

### Public Endpoints

- `GET /api/plans` - Get available plans
- `POST /api/buy` - Create web purchase
- `POST /api/ussd` - USSD callback
- `POST /api/webhook/paystack` - Payment webhook

### Admin Endpoints

- `POST /api/admin/vouchers/upload` - Upload vouchers
- `GET /api/admin/vouchers/list` - List vouchers
- `GET /api/admin/sales/list` - List sales
- `POST /api/admin/sms/resend` - Resend SMS

## Database Schema

### Vouchers Collection
```javascript
{
  code: String,           // Unique voucher code
  plan: String,           // basic, pro, vip
  status: String,         // unused, sold, expired
  batchId: String,        // Upload batch identifier
  soldToPhone: String,    // Customer phone
  soldChannel: String,    // web, ussd
  soldAt: Date,          // Sale timestamp
  createdAt: Date,
  updatedAt: Date
}
```

### Sales Collection
```javascript
{
  saleId: String,         // Unique sale identifier
  phone: String,          // Customer phone
  plan: String,           // Selected plan
  amount: Number,         // Sale amount
  currency: String,       // GHS
  channel: String,        // web, ussd
  paymentRef: String,     // Paystack reference
  status: String,         // pending, paid, failed
  voucherCode: String,    // Allocated voucher
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure environment variables
4. Set up MongoDB connection
5. Configure webhook URLs

## Security Considerations

- Store sensitive keys in environment variables
- Use HTTPS in production
- Validate webhook signatures
- Implement rate limiting
- Regular security updates

## Monitoring

- Check webhook delivery in Paystack dashboard
- Monitor SMS delivery in Hubtel dashboard
- Review application logs
- Set up error tracking (Sentry, etc.)

## Support

For issues and questions:
- Check the logs in your hosting platform
- Verify environment variables
- Test webhook endpoints
- Contact support: [your-email]

## License

This project is licensed under the MIT License.

---

**Ready to launch your WiFi voucher business!** 🚀
