import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/investments?address=0x...
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("investments")
    .select("*")
    .eq("address", address.toLowerCase())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map snake_case DB fields → camelCase frontend format
  const investments = (data || []).map((inv: any) => ({
    id:           inv.id,
    asset:        inv.asset,
    plan:         inv.plan,
    apr:          Number(inv.apr),
    amount:       Number(inv.amount),
    lockDays:     inv.lock_days,
    investedAt:   inv.invested_at,
    settlementAt: inv.settlement_at,
    profit:       inv.profit != null ? Number(inv.profit) : null,
    total:        inv.total  != null ? Number(inv.total)  : null,
    txHash:       inv.tx_hash,
  }));

  return NextResponse.json(investments);
}

// POST /api/investments  { id, address, asset, plan, apr, amount, lockDays, investedAt, settlementAt, profit, total, txHash }
export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, address, asset, plan, apr, amount, lockDays, investedAt, settlementAt, profit, total, txHash } = body;

  if (!address || !asset || !plan || !apr || !amount || !investedAt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await supabase.from("investments").upsert({
    id:            id || Date.now().toString(),
    address:       address.toLowerCase(),
    asset,
    plan,
    apr,
    amount,
    lock_days:     lockDays ?? null,
    invested_at:   investedAt,
    settlement_at: settlementAt ?? null,
    profit:        profit ?? null,
    total:         total  ?? null,
    tx_hash:       txHash ?? null,
  });

  if (error) {
    console.error("Supabase POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/investments?id=...&address=...
export async function DELETE(req: NextRequest) {
  const id      = req.nextUrl.searchParams.get("id");
  const address = req.nextUrl.searchParams.get("address");
  if (!id || !address) return NextResponse.json({ error: "Missing id or address" }, { status: 400 });

  const { error } = await supabase
    .from("investments")
    .delete()
    .eq("id", id)
    .eq("address", address.toLowerCase());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}