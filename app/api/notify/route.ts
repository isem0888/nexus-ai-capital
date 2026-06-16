import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/verifySignature";

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
  // Rate limit: 10 notify calls per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { type } = body;
    let text = "";

    if (type === "google_signin") {
      const { email, name, isNewUser } = body;
      const label = isNewUser ? "🆕 Нова реєстрація" : "🔑 Вхід через Google";
      text = `${label}\n\n👤 <b>${name || "—"}</b>\n📧 ${email}\n🕐 ${now()}`;
    }

    else if (type === "wallet_connect") {
      const { address } = body;
      text = `🔗 Підключено кошелек\n\n<code>${address}</code>\n🕐 ${now()}`;
    }

    else if (type === "investment") {
      const { asset, plan, apr, amount } = body;
      text =
        `💰 Нова інвестиція!\n\n` +
        `📦 Актив: <b>${asset}</b>\n` +
        `📋 План: <b>${plan}</b>\n` +
        `📈 APR: <b>${apr}%</b>\n` +
        `💵 Сума: <b>$${Number(amount).toLocaleString("uk-UA")}</b>\n` +
        `🕐 ${now()}`;
    }

    else if (type === "withdrawal") {
      const { address, asset, amount, destination_address } = body;
      text =
        `🏧 ЗАПИТ НА ВИВЕДЕННЯ\n\n` +
        `👛 Гаманець: <code>${address}</code>\n` +
        `📦 Актив: <b>${asset}</b>\n` +
        `💸 Сума: <b>${amount} ${asset}</b>\n` +
        `📬 Адреса: <code>${destination_address}</code>\n` +
        `🕐 ${now()}\n\n` +
        `⚡️ Відправте кошти вручну на вказану адресу.`;
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