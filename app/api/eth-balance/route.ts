import { NextRequest, NextResponse } from "next/server";

// Проксі для отримання ETH балансу з серверної сторони (без CORS)
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");

  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const rpcs = [
    "https://eth.llamarpc.com",
    "https://cloudflare-eth.com",
    "https://rpc.ankr.com/eth",
  ];

  for (const rpc of rpcs) {
    try {
      const res = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [address, "latest"],
          id: 1,
        }),
        // Серверний fetch — немає CORS обмежень
        next: { revalidate: 0 },
      });

      const data = await res.json();
      if (data.result) {
        const balanceEth = Number(BigInt(data.result)) / 1e18;
        return NextResponse.json({ balance: balanceEth }, {
          headers: { "Cache-Control": "no-store" },
        });
      }
    } catch {}
  }

  return NextResponse.json({ balance: 0 });
}