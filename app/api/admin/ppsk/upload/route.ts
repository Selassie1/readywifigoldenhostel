// app/api/admin/ppsk/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PpskPassword from '@/models/PpskPassword';
import AuditLog from '@/models/AuditLog';
import { generateBatchId } from '@/lib/utils';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const batchId = generateBatchId();

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are accepted' },
        { status: 400 }
      );
    }

    // Parse CSV — look for 'password' or 'Password' column
    const csvData: string[] = [];
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer.toString());

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          const password = row.password || row.Password || row.PPSK || row.ppsk;
          if (password && password.trim()) {
            csvData.push(password.trim());
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (csvData.length === 0) {
      return NextResponse.json(
        { error: 'No valid passwords found. CSV must have a "password" column.' },
        { status: 400 }
      );
    }

    // Filter out duplicates that already exist in the DB
    const existingPasswords = await PpskPassword.find({
      password: { $in: csvData },
    });
    const existingSet = new Set(existingPasswords.map((p) => p.password));
    const newPasswords = csvData.filter((p) => !existingSet.has(p));

    if (newPasswords.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All passwords already exist in the database',
        stats: {
          total: csvData.length,
          duplicates: csvData.length,
          imported: 0,
        },
      });
    }

    // Bulk insert
    const docs = newPasswords.map((password) => ({
      password,
      status: 'unused',
      batchId,
    }));
    await PpskPassword.insertMany(docs);

    // Audit log
    await AuditLog.create({
      actor: 'admin',
      action: 'ppsk_uploaded',
      entityType: 'ppsk_batch',
      entityId: batchId,
      meta: {
        totalPasswords: csvData.length,
        duplicates: csvData.length - newPasswords.length,
        imported: newPasswords.length,
        fileName: file.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'PPSK passwords uploaded successfully',
      stats: {
        total: csvData.length,
        duplicates: csvData.length - newPasswords.length,
        imported: newPasswords.length,
      },
      batchId,
    });
  } catch (error) {
    console.error('PPSK upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload PPSK passwords' },
      { status: 500 }
    );
  }
}
