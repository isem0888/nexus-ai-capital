import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { wallet, asset, amount, destination_address } = body;

  if (!wallet || !asset || !amount || !destination_address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const address = wallet.toLowerCase();
  const withdrawAmount = Number(amount);

  // 1. Зберігаємо запит на виведення
  const { error: insertError } = await supabase.from("withdrawals").insert({
    address,
    asset,
    amount: withdrawAmount,
    destination_address,
    status: "pending",
  });

  if (insertError) {
    console.error("Supabase withdraw insert error:", insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // 2. Списуємо з інвестицій — зменшуємо total і amount по активу
  const { data: investments } = await supabase
    .from("investments")
    .select("*")
    .eq("address", address)
    .eq("asset", asset)
    .order("created_at", { ascending: true });

  if (investments && investments.length > 0) {
    let remaining = withdrawAmount;

    for (const inv of investments) {
      if (remaining <= 0) break;

      const invTotal = Number(inv.total) || Number(inv.amount) || 0;

      if (remaining >= invTotal) {
        // Списуємо всю інвестицію
        await supabase.from("investments").delete().eq("id", inv.id);
        remaining -= invTotal;
      } else {
        // Зменшуємо частково
        const newTotal  = invTotal - remaining;
        const newAmount = Math.max(0, Number(inv.amount) - remaining);
        const newProfit = Math.max(0, newTotal - newAmount);
        await supabase.from("investments").update({
          total:  newTotal,
          amount: newAmount,
          profit: newProfit,
        }).eq("id", inv.id);
        remaining = 0;
      }
    }
  }

  // 3. Відправляємо сповіщення напряму в Telegram
  try {
    const TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (TOKEN && CHAT_ID) {
      const now = new Date().toLocaleString("uk-UA", {
        timeZone: "Europe/Kyiv",
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
      const text =
        `🏧 ЗАПИТ НА ВИВЕДЕННЯ\n\n` +
        `👛 Гаманець: <code>${address}</code>\n` +
        `📦 Актив: <b>${asset}</b>\n` +
        `💸 Сума: <b>${withdrawAmount} ${asset}</b>\n` +
        `📬 Адреса: <code>${destination_address}</code>\n` +
        `🕐 ${now}\n\n` +
        `⚡️ Відправте кошти вручну на вказану адресу.`;
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
      });
    }
  } catch {}

  return NextResponse.json({ success: true });
}

// GET — отримати список виведень по адресі
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("address", address.toLowerCase())
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}