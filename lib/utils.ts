// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSaleId(): string {
  return `SALE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateBatchId(): string {
  return `BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

export function formatCurrency(amount: number, currency: string = 'GHS'): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle Ghana phone numbers
  if (cleaned.startsWith('233')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+233${cleaned.substring(1)}`;
  } else if (cleaned.length === 9) {
    return `+233${cleaned}`;
  }
  
  return phone; // Return original if can't format
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9 && cleaned.length <= 15;
}

export function generateVoucherCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
