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

    // ── 1. Callback query (кнопки виплат) ──────────────────────────────────
    if (body.callback_query) {
      const { id, data, message } = body.callback_query;
      const chat_id = message.chat.id.toString();
      const message_id = message.message_id;

      if (data?.startsWith("confirm_withdrawal_")) {
        const withdrawalId = data.replace("confirm_withdrawal_", "");

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

      return NextResponse.json({ ok: true });
    }

    // ── 2. Будь-яке повідомлення від адміна ────────────────────────────────
    const incomingMsg = body.message || body.channel_post;
    if (incomingMsg) {
      const chatId = incomingMsg.chat?.id;
      const replyText: string = incomingMsg.text || "";
      const isReply = !!incomingMsg.reply_to_message;
      const replyToMsgId: number | null = incomingMsg.reply_to_message?.message_id ?? null;

      // DEBUG: записуємо в Supabase щоб підтвердити що webhook викликається
      await supabase.from("chat_messages").insert({
        id: `dbg_${Date.now()}`,
        session_id: "debug",
        sender: "debug",
        message: JSON.stringify({ isReply, replyToMsgId, text: replyText, chatId }),
      });

      if (isReply && replyToMsgId) {
        // Спосіб 1: DB lookup
        let foundSession: string | null = null;
        const { data } = await supabase
          .from("tg_message_sessions")
          .select("session_id")
          .eq("tg_message_id", replyToMsgId)
          .single();
        foundSession = data?.session_id || null;

        // Спосіб 2: парсинг тексту
        if (!foundSession) {
          const origText: string = incomingMsg.reply_to_message.text || "";
          const m = origText.match(/Session:\s*([a-zA-Z0-9_-]+)/);
          if (m) foundSession = m[1];
        }

        // DEBUG: записуємо результат пошуку сесії
        await supabase.from("chat_messages").insert({
          id: `dbg2_${Date.now()}`,
          session_id: "debug",
          sender: "debug",
          message: `session_found: ${foundSession ?? "NOT FOUND"}, tg_msg_id: ${replyToMsgId}`,
        });

        if (foundSession) {
          await supabase.from("chat_messages").insert({
            id: `msg_${Date.now()}`,
            session_id: foundSession,
            sender: "admin",
            message: replyText,
          });
        }
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}