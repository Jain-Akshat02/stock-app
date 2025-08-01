import connect from "@/config/dbConfig";
import Stock from "@/models/stockModel";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  const { productId, stockEntries,sale} = reqBody;
  console.log("---reqBody---", reqBody);
  if (sale) {
    // Sale mode: expects productId, size, mrp, quantity, notes
    console.log("---Sale mode---");
    
    for (const saleEntry of sale) {
      const { size, quantity } = saleEntry;
      if (!productId || quantity == null) {
        
        return NextResponse.json({ message: "...." }, { status: 400 });
      }
      // Aggregate current stock for this product/variant
      const stockEntries = await Stock.find({
        product: productId,
      });
      console.log("--helllo bhiya---");
      console.log(productId, stockEntries);
      const currentStock = stockEntries.reduce((sum: number, entry: any) => sum + entry.quantity, 0);
      if (currentStock < quantity) {
        return NextResponse.json({ message: "Not enough stock!" }, { status: 400 });
      }
      // Record the sale as a negative stock entry
      await Stock.create({
        product: productId,
        quantity: -quantity,
        status: "stock out",
      });
      // Also update Product's variant quantity
      await Product.updateOne(
        {
          _id: productId,
          "variants.size": size,
        },
        { $inc: { "variants.$.quantity": -quantity } }
      );
    }
    return NextResponse.json({ message: "Sale recorded successfully" }, { status: 201 });
  }

  if (
    !productId ||
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
        variants: [{ size: entry.size, quantity: entry.quantity}],
        status: "stock in",
      });
      
      // 2. Update the Product's variant quantity
      await Product.updateOne(
        {
          _id: productId,
          "variants.size": entry.size,
        },
        { $inc: { "variants.$.quantity": entry.quantity } }
      );
    }
  } catch (error: any) {
    console.log(error, error.message);
    return NextResponse.json(
      { message: error.message, error: error },
      { status: 500 }
    );
  }
  return NextResponse.json({ message: "Success" }, { status: 201 });
};

export const GET = async () => {
  try {
    const stocks = await Stock.find()
      .populate({
        path: "product",
        select:
          "name category variants"
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

export const DELETE = async (req: NextRequest) => {
  await connect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'Missing stock entry id' }, { status: 400 });
  }
  try {
    const deleted = await Stock.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Stock entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Stock entry deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting stock entry', error: error.message }, { status: 500 });
  }
};
//Stock validation failed: variants.0.size: Path `size` is required.