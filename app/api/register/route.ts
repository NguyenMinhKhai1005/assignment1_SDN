import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import * as z from "zod";
import { Prisma } from "@prisma/client"; // Thêm dòng này

const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ."),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const { email, password } = validatedData;

    console.log("Register attempt with email:", email);

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email đã được sử dụng." }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: { id: true, email: true },
    });

    return NextResponse.json(
      { message: "Đăng ký thành công.", user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    console.error("Lỗi đăng ký:", error);

    // ✅ Check lỗi Prisma đúng cách
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: "Email đã được sử dụng." }, { status: 400 });
      }
      if (error.code === "P2025" || error.code === "P1017") {
        return NextResponse.json({ message: "Lỗi kết nối cơ sở dữ liệu." }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." }, { status: 500 });
  }
}
