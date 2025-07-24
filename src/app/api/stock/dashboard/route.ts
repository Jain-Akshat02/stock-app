// src/app/api/stock/route.ts
import { NextResponse } from 'next/server';

// This is an example GET handler.
// In a real application, you would fetch this data from a database.
export async function GET(request: Request) {
  const stockData = {
    totalValue: 125430,
    totalProducts: 1287,
    lowStockItems: 23,
    salesThisMonth: 12890,
  };

  return NextResponse.json(stockData);
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, quantity } = body;

    // In a real application, you would:
    // 1. Validate the input (e.g., check if SKU exists, quantity is a number).
    // 2. Update the stock count for the given SKU in your database.
    console.log(`Received stock update: Add ${quantity} to SKU ${sku}`);

    return NextResponse.json({ message: "Stock added successfully", sku, quantity }, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ message: error.message, error }, { status: 500 });
  }
}
