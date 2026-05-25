import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Dataset } from '@/lib/db/models/dataset.model';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const dataset = await Dataset.findOne({ slug: params.slug }).lean();
    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database connection not ready' }, { status: 503 });
    }

    const collection = db.collection(dataset.collectionName);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      collection.find({}).skip(skip).limit(limit).toArray(),
      collection.countDocuments(),
    ]);

    return NextResponse.json({
      data: records.map((r) => ({ ...r, _id: r._id.toString() })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Dataset records fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}