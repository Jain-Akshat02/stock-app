import connect from "@/config/dbConfig";
import Stock from "@/models/stockModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async () => {
  try {

    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    console.log(`Calculating sales from ${startDate} to ${endDate}`);

    const salesEntries = await Stock.find({
      quantity: { $lt: 0 },
      createdAt: { $gte: startDate, $lte: endDate },
    });

    let totalSales = 0;
    for(const entry of salesEntries){
        const quantity = Math.abs(entry.quantity);
        const mrp = entry.variants?.[0]?.mrp || 0;
        totalSales += quantity*mrp;
    }
    return NextResponse.json({totalSales},{status: 200});
    
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
