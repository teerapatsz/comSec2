import nodemailer from 'nodemailer';
import User from "../../../../models/user";
import { connectMongoDB } from "../../../../lib/mongodb";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectMongoDB();
    console.log('MongoDB connection established');

    const { email } = await req.json();
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }
    console.log('User found:', JSON.stringify(user, null, 2));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    console.log('OTP generated:', otp);

    try {
      const savedUser = await user.save();
      console.log('User saved with OTP:', JSON.stringify(savedUser, null, 2));
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      return NextResponse.json({ message: 'Error saving OTP' }, { status: 500 });
    }

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ใช้ Gmail เป็นบริการ
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
    };

    // ส่งอีเมล
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');

    return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
