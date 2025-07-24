// src/components/RecordSale.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Minus,
  ShoppingCart,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";

interface ProductVariant {
  _id: string;
  size: string;
  mrp: number;
  current_stock: number;
}

interface Product {
  _id: string;
  sku: string;
  name: string;
  category: string;
  variants: ProductVariant[];
}


// --- MAIN COMPONENT ---
const RecordSale = () => {
  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [saleEntries, setSaleEntries] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState(""); // For customer name, invoice #, etc.
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Computed State
  const selectedProduct = products.find((product) => product._id === selectedProductId);
  const variants = selectedProduct?.variants || [];

  // --- DATA FETCHING ---
  // Fetch all products from the backend when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products
        const response = await axios.get("/api/stock/inventory");
        // For each product, aggregate current stock for each variant
        const productsWithStock = response.data.map((product: any) => {
          // Aggregate stock for each variant
          const variantsWithStock = product.variants.map((variant: any) => {
            // Find all stock entries for this product/variant
            const stockEntries = product.stockEntries?.filter((entry: any) =>
              entry.variants?.[0]?.size === variant.size &&
              entry.variants?.[0]?.mrp === variant.mrp
            ) || [];
            const current_stock = stockEntries.reduce((sum: number, entry: any) => sum + entry.quantity, 0);
            return { ...variant, current_stock };
          });
          return { ...product, variants: variantsWithStock };
        });
        setProducts(productsWithStock);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Could not load product list.");
      }
    };
    fetchProducts();
  }, []);

  // --- HANDLERS ---
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find((p) => p._id === productId);
    // Reset sale inputs when a new product is selected
    setSaleEntries(
      product ? product.variants.map(() => ({ quantity: "" })) : []
    );
  };

  const handleSaleQuantityChange = (
    index: number,
    value: string,
    maxQuantity: number
  ) => {
    const quantity = Number(value);
    // Prevent selling more than is in stock
    if (quantity > maxQuantity) {
      toast.error(`Cannot sell more than the available stock of ${maxQuantity}.`);
      return;
    }
    const updatedEntries = [...saleEntries];
    updatedEntries[index] = { ...updatedEntries[index], quantity: value };
    setSaleEntries(updatedEntries);
  };

  // Handles submitting the final sale information
  const handleSubmitSale = async () => {
    if (!selectedProductId || !date) {
      return toast.error("Please select a product and a sale date.");
    }

    const validSaleEntries = variants
      .map((variant: any, index: any) => ({
        size: variant.size,
        mrp: variant.mrp,
        quantity: parseInt(saleEntries[index]?.quantity || "0", 10),
      }))
      .filter((entry: { quantity: number }) => entry.quantity > 0);

    if (validSaleEntries.length === 0) {
      return toast.error("Please enter a quantity for at least one variant.");
    }

    setIsLoading(true);
    try {
      // For each sale entry, call the backend to record the sale
      for (const sale of validSaleEntries) {
        const payload = {
          productId: selectedProductId,
          receivedDate: date,
          notes: notes,
          sale: {
            size: sale.size,
            mrp: sale.mrp,
            quantity: sale.quantity,
          },
        };
        await axios.post("/api/stock/entry", payload);
      }
      toast.success("Sale recorded successfully!");
      // Reset form on successful submission
      setSelectedProductId("");
      setSaleEntries([]);
      setDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    } catch (error: any) {
      console.error("Sale submission failed:", error);
      const message = error.response?.data?.message || "Failed to record sale.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans">
        <button
          className="absolute top-35 right-70 text-gray-400 hover:text-pink-600 transition"
          onClick={() => router.back()}
          aria-label="Close"
        >
          <X size={28} />
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Record a Sale</h1>
          <p className="text-gray-600 mt-1">
            Log a new sale to update inventory levels.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-8 border border-gray-100">
          {/* --- Step 1: Product Selection --- */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              1. Select Product to Sell
            </label>
            <div className="flex items-center gap-2">
              <select
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                <option value="" disabled>
                  Select a product...
                </option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- Step 2: Sale Details (only shows if a product is selected) --- */}
          {selectedProductId && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                2. Enter Sale Quantities
              </label>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Price (MRP)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        In Stock
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Quantity to Sell
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variants.map((v: ProductVariant, idx: number) => (
                      <tr key={v._id || idx}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">
                          {v.size}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          ₹{v.mrp.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-500">
                          {v.current_stock}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max={v.current_stock}
                            className="block w-full px-3 py-1.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-gray-800"
                            placeholder="e.g., 5"
                            value={saleEntries[idx]?.quantity || ""}
                            onChange={(e) =>
                              handleSaleQuantityChange(
                                idx,
                                e.target.value,
                                v.current_stock
                              )
                            }
                            disabled={v.current_stock === 0}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- Steps 3 & 4: Date and Notes --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="sale-date"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                3. Date of Sale
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="sale-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                4. Notes (e.g., Customer Name)
              </label>
              <textarea
                id="notes"
                rows={1}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Add reference notes..."
              ></textarea>
            </div>
          </div>

          {/* --- Final Actions --- */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition-all">
              Cancel
            </button>
            <button
              onClick={handleSubmitSale}
              disabled={isLoading || !selectedProductId}
              className="flex items-center justify-center gap-2 text-white bg-pink-600 px-5 py-2.5 rounded-lg hover:bg-pink-700 transition-all font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                "Recording..."
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Record Sale
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordSale;
