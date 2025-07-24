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
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating product", error }), { status: 500 });
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



