// src/app/api/stock/route.ts
import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import connect from '@/config/dbConfig';
import Stock from '@/models/stockModel';


connect();

export async function GET(request: Request) {
  const stockEntries = await Stock.find({});
  const totalStock = stockEntries.reduce((sum:any, entry:any) => sum + (entry.quantity > 0 ? entry.quantity : 0), 0);
  const totalSalesValue = stockEntries.reduce((sum:any, entry:any) =>  {
    if(entry.quantity <0 && entry.variants && entry.variants[0]?.mrp){
      return sum + (-entry.quantity)* entry.variants[0].mrp;
    }
    return sum;
  }, 0
  );
  const lowStockCount = stockEntries.filter((entry:any) => entry.quantity <= 5).length;
  const totalStockValue = stockEntries.reduce((sum:any, entry:any) => {
    if(entry.quantity>0 && entry.variants && entry.variants[0]?.mrp){
      return sum + entry.quantity * entry.variants[0].mrp;
    }
    return sum;
  }, 0);
  return NextResponse.json({
    totalStock,
    totalSalesValue,
    lowStockCount,
    totalStockValue
  }, {
    status: 200
  });
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
