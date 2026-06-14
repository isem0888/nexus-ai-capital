import { NextResponse } from "next/server";

// Кастомний logout — видаляє OTP cookie при виході
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("nx_otp_verified");
  response.cookies.delete("nx_otp_token");
  return response;
}