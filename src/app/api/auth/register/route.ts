import User from "@/app/models/user.model";
import { connToDb } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and Password required " }, { status: 400 })
        }
        await connToDb()
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ success: false, message: "User already registered " }, { status: 400 })
        }
        const user = await User.create({ email, password});
        return NextResponse.json({ success: true, message: "User register successfully" }, { status: 200 })

    } catch (error) {
        console.error(error);

        return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });

    }

}