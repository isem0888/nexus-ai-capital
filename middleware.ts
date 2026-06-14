import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Сторінка verify-otp: тільки для залогінених через Google
  if (pathname.startsWith("/verify-otp")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.next();
  }

  // Dashboard: Google-юзери повинні пройти OTP
  // Wallet-юзери (без NextAuth сесії) пропускаємо — вони захищені client-side через wagmi
  if (pathname.startsWith("/dashboard")) {
    if (session) {
      // Є Google-сесія → перевіряємо OTP
      const otpToken = req.cookies.get("nx_otp_verified")?.value;
      if (!otpToken) {
        return NextResponse.redirect(new URL("/verify-otp", req.nextUrl));
      }
      try {
        const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
        const { payload } = await jwtVerify(otpToken, secret);
        // Email сесії повинен збігатись з email верифікації
        if (!payload.verified || payload.email !== session.user?.email) {
          return NextResponse.redirect(new URL("/verify-otp", req.nextUrl));
        }
      } catch {
        return NextResponse.redirect(new URL("/verify-otp", req.nextUrl));
      }
    }
    // Без сесії = wallet user, пропускаємо
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/verify-otp/:path*", "/verify-otp"],
};