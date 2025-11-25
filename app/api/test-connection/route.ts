import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  console.log('🧪 Testing MongoDB connection...');
  
  try {
    const MONGODB_URI = process.env.MONGODB_URI!;
    console.log('Connection string:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://USER:PASSWORD@'));
    
    // Test connection directly
    console.log('🔄 Attempting direct connection...');
    await mongoose.connect(MONGODB_URI);
    
    const connectionState = mongoose.connection.readyState;
    const dbName = mongoose.connection.db?.databaseName;
    
    console.log('✅ Connection successful!');
    console.log('📊 Database:', dbName);
    console.log('🔌 State:', connectionState);
    
    // Close connection
    await mongoose.disconnect();
    
    return NextResponse.json({
      success: true,
      database: dbName,
      connectionState,
      message: 'MongoDB connection successful!'
    });
    
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      connectionState: mongoose.connection.readyState
    }, { status: 500 });
  }
}