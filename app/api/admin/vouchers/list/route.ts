// app/api/admin/vouchers/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const plan = searchParams.get('plan');
    const status = searchParams.get('status');
    const batchId = searchParams.get('batchId');
    
    // Build filter
    const filter: any = {};
    if (plan) filter.plan = plan;
    if (status) filter.status = status;
    if (batchId) filter.batchId = batchId;
    
    // Get vouchers with pagination
    const skip = (page - 1) * limit;
    const vouchers = await Voucher.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count
    const total = await Voucher.countDocuments(filter);
    
    // Get status counts
    const statusCounts = await Voucher.aggregate([
      { $match: plan ? { plan } : {} },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const statusMap = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      vouchers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statusCounts: statusMap,
    });
    
  } catch (error) {
    console.error('Vouchers list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    );
  }
}
