// src/app/api/stock/route.ts
import { NextResponse, NextRequest } from 'next/server';
import connect from '@/config/dbConfig';
import Stock from '@/models/stockModel';
import Product from '@/models/productModel';
import { cors, handleCors } from '@/lib/cors';


await connect();

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    const products = await Product.find({}, { variants: 1 }).lean();

    const { totalStock, lowStockCount, totalSizeItems } = products.reduce(
      (acc, product) => {
        const variants = Array.isArray(product.variants) ? product.variants : [];

        for (const variant of variants) {
          const quantity = Number(variant?.quantity ?? 0);

          // Size-wise stock total (all quantities summed by variants)
          acc.totalStock += quantity;

          // Count low-stock sizes, but skip empty sizes
          if (quantity > 0 && quantity <= 5) {
            acc.lowStockCount += 1;
          }

          // Size-wise item count (count variant rows that have stock)
          if (quantity > 0) {
            acc.totalSizeItems += 1;
          }
        }

        return acc;
      },
      { totalStock: 0, lowStockCount: 0, totalSizeItems: 0 }
    );

    const totalProducts = await Product.countDocuments();
    const totalStockValue = 0;

    const response = NextResponse.json(
      { totalProducts, totalStock, lowStockCount, totalStockValue, totalSizeItems },
      { status: 200 }
    );
    
    // Add CORS headers
    Object.entries(cors(request)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error: any) {
    const response = NextResponse.json({ message: error.message, error }, { status: 500 });
    
    // Add CORS headers
    Object.entries(cors(request)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
}

export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    const body = await request.json();
    // In a real application, you would:

    const response = NextResponse.json({ message: "Stock added successfully"}, { status: 201 });
    
    // Add CORS headers
    Object.entries(cors(request)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error: any) {
    const response = NextResponse.json({ message: error.message, error }, { status: 500 });
    
    // Add CORS headers
    Object.entries(cors(request)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
}
