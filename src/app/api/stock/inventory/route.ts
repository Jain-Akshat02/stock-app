import connect from "@/config/dbConfig";
import Product from "@/models/productModel";

connect();

export const GET = async () => {
  try {
    const products = await Product.find();
    return new Response(JSON.stringify(products), { status: 200 });
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
    if (!name || !category || !sku || !variants || !Array.isArray(variants) || variants.length === 0) {
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



