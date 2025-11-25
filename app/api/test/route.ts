import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      message: 'MongoDB connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { error: 'MongoDB connection failed: ' + error.message },
      { status: 500 }
    );
  }
}