
import NextAuth from "next-auth";
import {authOptions} from "@/app/lib/authOptions"; // wherever you define your auth config

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
