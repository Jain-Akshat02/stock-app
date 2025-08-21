// src/app/api/stock/route.ts
import { NextResponse } from 'next/server';
import connect from '@/config/dbConfig';
import Stock from '@/models/stockModel';
import Product from '@/models/productModel';


connect();

export async function GET() {
  try {
    
  } catch (error: any) {
    return NextResponse.json({ message: error.message, error }, { status: 500 });
    
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In a real application, you would:

    return NextResponse.json({ message: "Stock added successfully"}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, error }, { status: 500 });
  }
}
