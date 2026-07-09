import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
      cookieStore.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Invalid password" });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
