import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

async function answerCallback(callback_query_id: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id, text, show_alert: false }),
  });
}

async function editMessage(chat_id: string, message_id: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, message_id, text, parse_mode: "HTML" }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Обробляємо callback_query (натискання кнопки)
    if (body.callback_query) {
      const { id, data, message } = body.callback_query;
      const chat_id = message.chat.id.toString();
      const message_id = message.message_id;

      if (data?.startsWith("confirm_withdrawal_")) {
        const withdrawalId = data.replace("confirm_withdrawal_", "");

        // Оновлюємо статус в Supabase
        const { error } = await supabase
          .from("withdrawals")
          .update({ status: "completed" })
          .eq("id", withdrawalId);

        if (error) {
          await answerCallback(id, "❌ Помилка оновлення");
        } else {
          await answerCallback(id, "✅ Статус оновлено!");
          await editMessage(
            chat_id,
            message_id,
            message.text + "\n\n✅ <b>ВИПЛАЧЕНО</b>"
          );
        }
      }

      if (data?.startsWith("reject_withdrawal_")) {
        const withdrawalId = data.replace("reject_withdrawal_", "");

        const { error } = await supabase
          .from("withdrawals")
          .update({ status: "rejected" })
          .eq("id", withdrawalId);

        if (error) {
          await answerCallback(id, "❌ Помилка");
        } else {
          await answerCallback(id, "❌ Відхилено");
          await editMessage(
            chat_id,
            message_id,
            message.text + "\n\n❌ <b>ВІДХИЛЕНО</b>"
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}