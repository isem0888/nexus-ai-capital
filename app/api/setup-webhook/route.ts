import { NextResponse } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const DOMAIN = process.env.NEXTAUTH_URL || "https://www.nexus-ai-capital.com";

export async function GET() {
  const webhookUrl = `${DOMAIN.replace(/\/$/, "")}/api/telegram-webhook`;

  // Спочатку видаляємо старий webhook
  await fetch(`https://api.telegram.org/bot${TOKEN}/deleteWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drop_pending_updates: true }),
  });

  // Реєструємо заново з правильними типами оновлень
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: [
        "message",
        "edited_message",
        "channel_post",
        "edited_channel_post",
        "callback_query",
      ],
    }),
  });

  const data = await res.json();

  // Повертаємо інфо про поточний стан webhook
  const infoRes = await fetch(`https://api.telegram.org/bot${TOKEN}/getWebhookInfo`);
  const info = await infoRes.json();

  return NextResponse.json({ setWebhook: data, webhookInfo: info });
}