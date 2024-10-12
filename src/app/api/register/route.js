import { NextResponse } from "next/server";
import User from "../../../../models/user";
import { connectMongoDB } from "../../../../lib/mongodb";
import bcrypt from 'bcryptjs'

export async function POST(req) {
    try{
        const {email, name, user, pass } = await req.json();
        const hashedPassword = await bcrypt.hash(pass, 10);

        await connectMongoDB()
        await User.create({ email, name, user, pass:hashedPassword})
        
        console.log("Email: ", email)
        console.log("Name: ", name)
        console.log("Username: ", user)
        console.log("Password: ", pass)

        return NextResponse.json({message: "Register Complete!"}, {status:201})
    }
    catch(error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}