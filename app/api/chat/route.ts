import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get("session_id");
  if (!session_id) return NextResponse.json([]);

  const { data } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", session_id)
    .order("created_at", { ascending: true });

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const { session_id, message, page_url } = await req.json();

  if (!session_id || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Save to DB
  const { error } = await supabase.from("chat_messages").insert({
    id: `msg_${Date.now()}`,
    session_id,
    sender: "user",
    message,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Forward to Telegram — Session: зберігаємо у plain text як fallback для парсингу
  const tgText =
    `💬 Nexus Support — нове повідомлення\n\n` +
    `Session: ${session_id}\n` +
    (page_url ? `Page: ${page_url}\n` : "") +
    `\n${message}`;

  const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: tgText }),
  });
  const tgData = await tgRes.json();

  // Зберігаємо tg_message_id → session_id, щоб webhook міг знайти сесію через Reply
  if (tgData.ok && tgData.result?.message_id) {
    await supabase.from("tg_message_sessions").insert({
      tg_message_id: tgData.result.message_id,
      session_id,
    });
  }

  return NextResponse.json({ success: true });
}