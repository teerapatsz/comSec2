import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from 'bcryptjs'

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {},
            async authorize(credentials, req) {
                
                const { user, pass } = credentials

                try {

                    await connectMongoDB()
                    const userInfo = await User.findOne({ user })

                    if(!userInfo){
                        console.log("Login failed!")
                        console.log("Username Wrong")
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(pass, userInfo.pass)

                    if(!passwordMatch){
                        console.log("Login failed!")
                        console.log("Username: ", userInfo.user)
                        console.log("Password: ", pass)
                        console.log("Password Wrong!")
                        return null;
                    }

                    const loginTime = new Date();
                    console.log(`Username: ${userInfo.user} logged in at: ${loginTime}`);
                    return userInfo;
                    
                }
                catch(error){
                    console.log("Error: ",error)
                }
                
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/"
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }