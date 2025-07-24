import connect from "@/config/dbConfig";
import Stock from "@/models/stockModel";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  const { productId, receivedDate, notes, stockEntries } = reqBody;

  if (
    !productId ||
    !receivedDate ||
    !stockEntries ||
    stockEntries.length === 0
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    for (const entry of stockEntries) {
      // 1. Create a Stock document (history)
      await Stock.create({
        product: productId,
        variants: [{ size: entry.size, mrp: entry.mrp }], // <-- wrap in array!
        quantity: entry.quantity,
        date: receivedDate,
        notes,
        status: "stock in",
      });
      // 2. Update the Product's variant quantity
      await Product.updateOne(
        {
          _id: productId,
          "variants.size": entry.size,
          "variants.mrp": entry.mrp,
        },
        { $inc: { "variants.$.quantity": entry.quantity } }
      );
    }
  } catch (error: any) {
    console.error("Error adding stock:", error.message);
    return NextResponse.json(
      { message: error.message, error: error },
      { status: 500 }
    );
  }
  return NextResponse.json({ message: "Success" }, { status: 201 });
};

export const GET = async (req: NextRequest) => {
  try {
    const stocks = await Stock.find()
      .populate({
        path: "product",
        select:
          "name category sku variants"
        ,
      })
      .sort({ date: -1 });
    console.log("Fetched stocks:", stocks);
    
    return NextResponse.json(stocks, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching stock", error: error.message },
      { status: 500 }
    );
  }
};
//Stock validation failed: variants.0.size: Path `size` is required.