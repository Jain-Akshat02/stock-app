import connect from "@/config/dbConfig";
import Product from "@/models/productModel";
import Stock from "@/models/stockModel";

connect();

export const GET = async () => {
  try {
    const products = await Product.find();
    const stocks = await Stock.find();
    // Attach stockEntries to each product
    const productsWithStock = products.map((product: any) => {
      const stockEntries = stocks.filter((entry: any) =>
        entry.product.toString() === product._id.toString()
      );
      return {
        ...product.toObject(),
        stockEntries,
      };
    });
    return new Response(JSON.stringify(productsWithStock), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching products", error }), { status: 500 });
  }
};

export const POST = async (req: Request) => {
  await connect();
  try {
    const body = await req.json();
    const { name, category, sku, variants } = body;
    console.log(body);
    if (!name || !category || !variants || !Array.isArray(variants) || variants.length === 0) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }
    // Validate each variant
    for (const v of variants) {
      if (!v.size || typeof v.mrp !== "number") {
        return new Response(JSON.stringify({ message: "Each variant must have size and mrp (number)" }), { status: 400 });
      }
    }
    const product = await Product.create({ name, category, sku, variants });
    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error:any) {
    return new Response(JSON.stringify({ message: error.message, error }), { status: 500 });
  }
};

export const PATCH = async (req: Request) => {
  await connect();
  try {
    const body = await req.json();
    const { _id, name, category, sku, variants } = body;
    if (!_id) {
      return new Response(JSON.stringify({ message: "Missing product id" }), { status: 400 });
    }
    // Validate each variant
    for (const v of variants) {
      if (!v.size || typeof v.mrp !== "number") {
        return new Response(JSON.stringify({ message: "Each variant must have size and mrp (number)" }), { status: 400 });
      }
    }
    const updated = await Product.findByIdAndUpdate(
      _id,
      { name, category, sku, variants },
      { new: true }
    );
    if (!updated) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }
    // Attach stockEntries for consistency with GET
    const stocks = await Stock.find();
    const stockEntries = stocks.filter((entry: any) =>
      entry.product.toString() === updated._id.toString()
    );
    return new Response(JSON.stringify({ ...updated.toObject(), stockEntries }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating product", error }), { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  await connect();
  try {
    const data = await req.json();
    console.log("Delete request data:", data);
    
    const { _id, removeVariant } = data;
    
    if(!_id){
      return new Response(JSON.stringify({ message: "Missing product id" }), { status: 400 });
    }

    // If removeVariant is provided, remove only that variant
    if (removeVariant) {
      console.log("Removing variant:", removeVariant);
      
      // Remove the variant from the product
      const updated = await Product.updateOne(
        { _id },
        { $pull: { variants: { size: removeVariant.size, mrp: removeVariant.mrp } } }
      );
      
      if (updated.modifiedCount === 0) {
        return new Response(JSON.stringify({ message: "Variant not found or product not found" }), { status: 404 });
      }
      
      // Delete related stock entries for this specific variant
      await Stock.deleteMany({ 
        product: _id, 
        "variants.size": removeVariant.size, 
        "variants.mrp": removeVariant.mrp 
      });
      
      return new Response(JSON.stringify({ message: "Variant deleted successfully" }), { status: 200 });
    }
    
    // Otherwise, delete the whole product
    console.log("Deleting whole product with id:", _id);
    const deleted = await Product.findByIdAndDelete(_id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }
    // Delete all related stock entries
    await Stock.deleteMany({ product: _id });
    return new Response(JSON.stringify({ message: "Product and related stock entries deleted" }), { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ message: "Error deleting product", error }), { status: 500 });
  }
}



