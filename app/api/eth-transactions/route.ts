import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) return NextResponse.json({ error: "No address" }, { status: 400 });

  const apiKey = process.env.ETHERSCAN_API_KEY || "";
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&page=1&offset=50${apiKey ? `&apikey=${apiKey}` : ""}`;

  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: "0", result: [] });
  }
}