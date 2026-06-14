import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { jwtVerify, SignJWT } from "jose";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { code } = await req.json();
  if (!code || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Invalid code format" }, { status: 400 });
  }

  const token = req.cookies.get("nx_otp_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Verification session expired. Please request a new code." },
      { status: 400 }
    );
  }

  const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

  try {
    const { payload } = await jwtVerify(token, secret);

    if (payload.email !== session.user.email) {
      return NextResponse.json({ error: "Email mismatch" }, { status: 400 });
    }

    if (payload.otp !== code) {
      return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
    }

    // Видаємо "verified" токен (7 днів)
    const verifiedToken = await new SignJWT({
      email: payload.email,
      verified: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({ success: true });

    response.cookies.set("nx_otp_verified", verifiedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Видаляємо одноразовий OTP токен
    response.cookies.delete("nx_otp_token");

    return response;
  } catch {
    return NextResponse.json(
      { error: "Code expired. Please request a new one." },
      { status: 400 }
    );
  }
}