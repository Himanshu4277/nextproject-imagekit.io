import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { connToDb } from "./db";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing Email or Password")
                }
                try {
                    await connToDb()
                    const user = await User.findOne({ email: credentials?.email })
                    if (!user) {
                        throw new Error("User not Found")
                    }
                    const isValid = await bcrypt.compare(credentials?.password, user.password)
                    if (!isValid) {
                        throw new Error("Password is not Correct")
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    console.error(error)
                    throw error

                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/logIn",
        error: "/logIn"
    },
    secret: process.env.NEXTAUTH_SECRET

}

export default NextAuth(authOptions)