// app/api/telegram/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("=== TELEGRAM DEBUG ===");
    console.log("BOT_TOKEN exists:", !!BOT_TOKEN);
    console.log("CHAT_ID exists:", !!CHAT_ID);
    console.log("CHAT_ID value:", CHAT_ID);

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Missing credentials!");
      return NextResponse.json(
        { error: "Telegram credentials not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: body.message,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await response.json();
    console.log("Telegram response:", data);

    if (!data.ok) {
      console.error("Telegram API error:", data);
      return NextResponse.json(
        { error: data.description || "Telegram API error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telegram API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}