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

  const { error } = await supabase.from("withdrawals").insert({
    address: wallet.toLowerCase(),
    asset,
    amount,
    destination_address,
    status: "pending",
  });

  if (error) {
    console.error("Supabase withdraw error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}