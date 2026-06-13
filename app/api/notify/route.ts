import { NextRequest, NextResponse } from "next/server";

const TOKEN   = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

async function sendTelegram(text: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
  });
}

function now() {
  return new Date().toLocaleString("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;
    let text = "";

    if (type === "google_signin") {
      // Викликається з auth.ts events.signIn
      const { email, name, isNewUser } = body;
      const label = isNewUser ? "🆕 Нова реєстрація" : "🔑 Вхід через Google";
      text = `${label}\n\n👤 <b>${name || "—"}</b>\n📧 ${email}\n🕐 ${now()}`;
    }

    else if (type === "wallet_connect") {
      // Викликається з dashboard useEffect
      const { address } = body;
      text = `🔗 Підключено кошелек\n\n<code>${address}</code>\n🕐 ${now()}`;
    }

    else if (type === "investment") {
      // Викликається з invest page при інвестиції
      const { asset, plan, apr, amount } = body;
      text =
        `💰 Нова інвестиція!\n\n` +
        `📦 Актив: <b>${asset}</b>\n` +
        `📋 План: <b>${plan}</b>\n` +
        `📈 APR: <b>${apr}%</b>\n` +
        `💵 Сума: <b>$${Number(amount).toLocaleString("uk-UA")}</b>\n` +
        `🕐 ${now()}`;
    }

    else {
      return NextResponse.json({ ok: false, error: "Unknown type" }, { status: 400 });
    }

    await sendTelegram(text);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("notify error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}