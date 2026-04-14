// app/api/admin/ppsk/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PpskPassword from '@/models/PpskPassword';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const batchId = searchParams.get('batchId');
    const search = searchParams.get('search');

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (batchId) filter.batchId = batchId;
    if (search) filter.password = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const passwords = await PpskPassword.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await PpskPassword.countDocuments(filter);

    // Status breakdown counts
    const statusCounts = await PpskPassword.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      passwords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statusCounts: statusMap,
    });
  } catch (error) {
    console.error('PPSK list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PPSK passwords' },
      { status: 500 }
    );
  }
}
