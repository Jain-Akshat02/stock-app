import connect from "@/config/dbConfig";
import Stock from "@/models/stockModel";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (req: NextRequest) => {
   const reqBody = await req.json();
   const { productId, receivedDate, notes, stockEntries } = reqBody;

   if(!productId || !receivedDate || !stockEntries || stockEntries.length === 0){
       return NextResponse.json({message:"Missing required fields"},{status:400});
   }
   try {
    for(const entry of stockEntries){
        // 1. Create a Stock document (history)
        await Stock.create({
            product: productId,
            variant: { size: entry.size, mrp: entry.mrp },
            quantity: entry.quantity,
            date: receivedDate,
            notes,
            status: "stock in"
        });
        // 2. Update the Product's variant quantity
        await Product.updateOne(
            { _id: productId, "variants.size": entry.size, "variants.mrp": entry.mrp },
            { $inc: { "variants.$.quantity": entry.quantity } }
        );
    }
   } catch (error:any) {
    return NextResponse.json({message:"Error adding stock",error:error.message},{status:500});
   }
   return NextResponse.json({message:"Success"},{status:201});
}