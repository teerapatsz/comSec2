import User from "../../../../models/user";
import { connectMongoDB } from "../../../../lib/mongodb";
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    await connectMongoDB();
    console.log('MongoDB connection established');

    const { email, otp, newPassword } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }
    console.log('User found:', JSON.stringify(user, null, 2));

    console.log('Stored OTP:', user.otp);
    console.log('Received OTP:', otp);

    if (!user.otp || user.otp !== otp) {
      console.log('Invalid OTP');
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.pass = hashedPassword;
    user.otp = null; // Clear OTP after use
    const savedUser = await user.save();
    console.log('User saved after password reset:', JSON.stringify(savedUser, null, 2));

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });

  } catch (error) {
    console.error("Error in verify-otp route:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}