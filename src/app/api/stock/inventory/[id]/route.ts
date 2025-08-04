import connect from "@/config/dbConfig";
import Product from "@/models/productModel";
import Stock from "@/models/stockModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Delete all stock entries for this product
    await Stock.deleteMany({ product: id });

    // Delete the product itself
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: "Product deleted permanently",
      productId: id 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ 
      message: "Error deleting product", 
      error: error.message 
    }, { status: 500 });
  }
}; 