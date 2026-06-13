import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const session_id = formData.get("session_id") as string | null;
  const page_url = (formData.get("page_url") as string) || "";

  if (!file || !session_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 413 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split(".").pop() || "bin";
  const storagePath = `${session_id}/${Date.now()}.${ext}`;

  // ── 1. Upload to Supabase Storage ────────────────────────────────────────
  // Create bucket if it doesn't exist yet (silently ignore if already exists)
  await supabase.storage.createBucket("chat-files", { public: true }).catch(() => {});

  let fileUrl: string | null = null;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("chat-files")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (!uploadError && uploadData) {
    const { data: urlData } = supabase.storage
      .from("chat-files")
      .getPublicUrl(storagePath);
    fileUrl = urlData.publicUrl;
  }

  // ── 2. Forward file to Telegram ──────────────────────────────────────────
  const tgForm = new FormData();
  tgForm.append("chat_id", CHAT_ID);
  tgForm.append("document", new Blob([buffer], { type: file.type }), file.name);
  tgForm.append(
    "caption",
    `📎 Nexus Support — file\n\nSession: ${session_id}\n${page_url ? `Page: ${page_url}\n` : ""}File: ${file.name}`
  );

  const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
    method: "POST",
    body: tgForm,
  });
  const tgData = await tgRes.json();

  // Save message_id mapping so admin can reply to file messages too
  if (tgData.ok && tgData.result?.message_id) {
    await supabase.from("tg_message_sessions").insert({
      tg_message_id: tgData.result.message_id,
      session_id,
    });
  }

  // ── 3. Save to chat_messages ─────────────────────────────────────────────
  // Format: "📎 filename|||url" — parsed by ChatWidget for link rendering
  const msgText = fileUrl
    ? `📎 ${file.name}|||${fileUrl}`
    : `📎 ${file.name}`;

  await supabase.from("chat_messages").insert({
    id: `file_${Date.now()}`,
    session_id,
    sender: "user",
    message: msgText,
  });

  return NextResponse.json({ success: true, fileUrl });
}