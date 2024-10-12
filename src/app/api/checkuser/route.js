import { NextResponse } from "next/server";
import User from "../../../../models/user";
import { connectMongoDB } from "../../../../lib/mongodb";
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email, user } = await req.json(); 

        const existingUser = await User.findOne({
            $or: [{ email }, { user }],
        });

        if (existingUser) {
            if (existingUser.email === email && existingUser.user === user) {
                return NextResponse.json({ error: 'Email and username already exist' }, { status: 409 });
            } else if (existingUser.email === email) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
            } else if (existingUser.user === user) {
                return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'An error occurred while checking user' }, { status: 500 });
    }
}
