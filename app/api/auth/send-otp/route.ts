import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SignJWT, jwtVerify } from "jose";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const email = session.user.email;

  // Cooldown: не частіше 1 разу на 60 секунд
  const existing = req.cookies.get("nx_otp_token")?.value;
  if (existing) {
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
      const { payload } = await jwtVerify(existing, secret);
      if (Date.now() - (payload.sentAt as number) < 60_000) {
        return NextResponse.json({ error: "Please wait before requesting a new code" }, { status: 429 });
      }
    } catch {}
  }

  // Генеруємо 6-значний OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  // Підписуємо в JWT (термін — 10 хвилин)
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
  const token = await new SignJWT({ email, otp, sentAt: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(secret);

  // Відправляємо email
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD, // Gmail App Password (16 символів)
      },
    });

    await transporter.sendMail({
      from: `"Nexus AI Capital" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `${otp} — Your Nexus AI Capital verification code`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#0f172a;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1e3a5f,#1a1040);padding:32px;text-align:center;">
            <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:1px;">NEXUS AI CAPITAL</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;">Autonomous Trading Intelligence</div>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#f8fafc;font-size:20px;margin:0 0 8px;">Verify your identity</h2>
            <p style="color:#94a3b8;font-size:14px;margin:0 0 28px;line-height:1.6;">
              Enter this 6-digit code to complete your sign-in. The code expires in <strong style="color:#e2e8f0;">10 minutes</strong>.
            </p>
            <div style="text-align:center;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:28px 24px;margin-bottom:28px;">
              <span style="font-size:44px;font-weight:900;letter-spacing:14px;color:#60a5fa;font-variant-numeric:tabular-nums;">${otp}</span>
            </div>
            <p style="color:#475569;font-size:12px;text-align:center;margin:0;">
              If you didn't request this code, you can safely ignore this email.
            </p>
          </div>
          <div style="padding:16px 32px 24px;text-align:center;border-top:1px solid #1e293b;">
            <span style="color:#334155;font-size:11px;">© 2026 Nexus AI Capital · Secured with end-to-end encryption</span>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("nx_otp_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}