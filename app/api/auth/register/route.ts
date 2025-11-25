import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log('🔵 REGISTER API CALLED - SIMPLIFIED');
  
  try {
    const MONGODB_URI = process.env.MONGODB_URI!;
    
    // Direct connection (same as test-connection)
    if (mongoose.connection.readyState !== 1) {
      console.log('🟡 Connecting to MongoDB...');
      await mongoose.connect(MONGODB_URI);
      console.log('✅ MongoDB connected!');
    }

    // Parse request
    const { email, password, name } = await request.json();
    console.log('📥 Registration data:', { email, name });

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check for existing user
    console.log('🔍 Checking for existing user...');
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password manually (no middleware)
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with pre-hashed password
    console.log('👤 Creating user...');
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword, // Already hashed
      name: name.trim(),
    });
    console.log('✅ User created:', user._id);

    // Generate token
    console.log('🔑 Generating JWT...');
    const jwt = await import('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('🎉 REGISTRATION COMPLETE!');

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email, name: user.name },
    }, { status: 201 });

  } catch (error: any) {
    console.error('💥 REGISTRATION ERROR:');
    console.error('Message:', error.message);
    console.error('Name:', error.name);
    console.error('Code:', error.code);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}