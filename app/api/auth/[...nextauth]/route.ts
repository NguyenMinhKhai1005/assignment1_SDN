import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Tạo file auth.ts trong thư mục lib

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };