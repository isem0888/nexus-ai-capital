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

  // Forward to Telegram — включаємо session_id у текст щоб webhook зміг знайти сесію при відповіді
  const tgText =
    `💬 *Nexus Support — нове повідомлення*\n\n` +
    `🔑 Session: \`${session_id}\`\n` +
    (page_url ? `🌐 Page: ${page_url}\n` : "") +
    `\n${message}`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: tgText,
      parse_mode: "Markdown",
    }),
  });

  return NextResponse.json({ success: true });
}