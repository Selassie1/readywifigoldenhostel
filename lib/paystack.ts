// lib/paystack.ts
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

if (!PAYSTACK_SECRET_KEY || !PAYSTACK_PUBLIC_KEY) {
  throw new Error('Paystack keys not configured');
}

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface PaystackTransaction {
  reference: string;
  amount: number;
  currency: string;
  status: string;
  gateway_response: string;
  customer: {
    email: string;
    phone: string;
  };
  metadata: Record<string, any>;
}

export interface PaystackWebhookEvent {
  event: string;
  data: PaystackTransaction;
}

export function calculateGrossAmount(netAmountGHS: number): number {
  // Paystack Ghana local transaction fee is 1.95%
  // To receive exactly the net amount, formula: Net / (1 - 0.0195)
  const netAmountPesewas = netAmountGHS * 100;
  return Math.ceil(netAmountPesewas / 0.9805);
}

export async function initializeTransaction(data: {
  email: string;
  amount: number;
  currency?: string;
  reference: string;
  metadata?: Record<string, any>;
  callback_url?: string;
}) {
  try {
    const response = await paystack.post('/transaction/initialize', {
      email: data.email,
      amount: calculateGrossAmount(data.amount), // Include Paystack transaction fee
      currency: data.currency || 'GHS',
      reference: data.reference,
      metadata: data.metadata,
      callback_url: data.callback_url,
    });

    return response.data;
  } catch (error: any) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    throw new Error('Failed to initialize payment');
  }
}

export async function chargeMobileMoney(data: {
  phone: string;
  amount: number;
  currency?: string;
  reference: string;
  metadata?: Record<string, any>;
}) {
  try {
    const response = await paystack.post('/charge', {
      email: data.phone + '@example.com', // Paystack requires email
      amount: calculateGrossAmount(data.amount), // Include Paystack transaction fee
      currency: data.currency || 'GHS',
      reference: data.reference,
      metadata: data.metadata,
      mobile_money: {
        phone: data.phone,
        provider: 'mtn', // Default to MTN, can be made configurable
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Paystack MoMo charge error:', error.response?.data || error.message);
    throw new Error('Failed to charge mobile money');
  }
}

export async function verifyTransaction(reference: string) {
  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error: any) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    throw new Error('Failed to verify transaction');
  }
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', secret)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
}

export { PAYSTACK_PUBLIC_KEY };
