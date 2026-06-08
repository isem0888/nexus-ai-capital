// app/api/deposit/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet, asset, amount, plan, txHash } = body;

    console.log("=== DEPOSIT DEBUG ===");
    console.log("New deposit:", { wallet, asset, amount, plan, txHash });

    // Здесь можно добавить сохранение в БД
    // Пока просто возвращаем успех

    return NextResponse.json({
      success: true,
      message: "Deposit recorded successfully",
    });
  } catch (error: any) {
    console.error("Deposit API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}