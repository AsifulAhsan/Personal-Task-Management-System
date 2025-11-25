import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

export async function GET() {
  console.log('🔍 DEBUG ROUTE CALLED');
  
  try {
    // Actually connect to database
    await connectDB();
    
    const debugInfo = {
      environment: {
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'Not set',
      },
      mongoose: {
        readyState: mongoose.connection.readyState,
        readyStateName: getReadyStateName(mongoose.connection.readyState),
        models: Object.keys(mongoose.models),
        database: mongoose.connection.db?.databaseName,
        host: mongoose.connection.host,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('📊 DEBUG INFO:', debugInfo);

    return NextResponse.json(debugInfo);
  } catch (error: any) {
    console.error('❌ Debug route error:', error.message);
    
    return NextResponse.json({
      error: 'Failed to connect: ' + error.message,
      readyState: mongoose.connection.readyState,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

function getReadyStateName(state: number): string {
  switch (state) {
    case 0: return 'disconnected';
    case 1: return 'connected';
    case 2: return 'connecting';
    case 3: return 'disconnecting';
    default: return 'unknown';
  }
}