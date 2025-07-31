// src/components/RecordSale.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const SIZE_SETS: Record<string, string[]> = {
  Bras: ["28", "30", "32", "34", "36", "38", "40", "42", "44"],
  Panties: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
};

const RecordSale = () => {
  const [selectedCategory, setSelectedCategory] = useState("Bras");
  const [sizeQuantities, setSizeQuantities] = useState<{
    [size: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectProductId, setSelectProductId] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();
  const inputRefs = useRef<{ [size: string]: HTMLInputElement | null }>({});

  const selectedProduct = products.find((p) => p._id === selectProductId);

  const recordSaleBtnRef = useRef<HTMLButtonElement>(null);

  // Create a ref callback for input elements
  const createInputRef = (size: string) => (el: HTMLInputElement | null) => {
    if (el) {
      inputRefs.current[size] = el;
    } else {
      delete inputRefs.current[size];
    }
  };

  // Reset size quantities when category changes
  useEffect(() => {
    const newQuantities: { [size: string]: string } = {};
    (SIZE_SETS[selectedCategory] || []).forEach((size) => {
      newQuantities[size] = "";
    });
    setSizeQuantities(newQuantities);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/stock/inventory", {
          params: { category: selectedCategory
        }
        });
        console.log(response.data);
        setProducts(response.data.products);
      } catch (error) {
        console.log("Failed to fetch products:", error);
        toast.error("Failed to load products. Please try again later.");
      }
    }
    fetchProducts();
  },[selectedCategory]);
  const handleProductChange = (selectProduct: string) => {
    setSelectProductId(selectProduct);
  }

  // Handle Enter key press to move to next input
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentSize: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const sizes = SIZE_SETS[selectedCategory] || [];
      const currentIndex = sizes.indexOf(currentSize);
      const nextSize = sizes[currentIndex + 1];

      if (nextSize && inputRefs.current[nextSize]) {
        inputRefs.current[nextSize]?.focus();
        console.log("--click detected--");
        
      }
      else if(recordSaleBtnRef.current){
        console.log("click detected");
        
        recordSaleBtnRef.current?.focus();

      }

    }
  };
  
  // Handles submitting the final sale information
  const handleSubmitSale = async () => {
    const saleEntries = Object.entries(sizeQuantities)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([size, qty]) => ({
        size,
        quantity: Number(qty),
      }));

    if (saleEntries.length === 0) {
      toast.error("Please enter a quantity for at least one size.");
      return;
    }

    setIsLoading(true);
    try {
      // Send all sale entries in one payload
      const payload = {
        productId: selectProductId,
        category: selectedCategory,
        sale:saleEntries
      };
      await axios.post("/api/stock/entry", payload);
      toast.success("Sale recorded successfully!");
      router.refresh();
      setSelectedCategory("Bras");
    } catch (error: any) {
      console.error("Sale submission failed:", error);
      const message = error.response?.data?.message || "Failed to record sale.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        {/* --- Step 1: Category Selection --- */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1. Select Category
          </label>
          <select
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>Select Category</option>
            <option>Bras</option>
            <option>Panties</option>
          </select>
          <label className="block text-sm font-semibold text-gray-700 mb-2 mt-2">
            2. Select Quality
          </label>
          <select
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400 flex-grow"
                value={selectProductId}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                <option value="" disabled>
                 Select Quality
                </option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
        </div>
        {/* --- Step 2: Enter Sale Quantities --- */}
        <div>
          
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            2. Enter Sale Quantities
          </label>
          <div className="flex gap-4 flex-wrap">
            {selectedProduct && (
            <div className="mb-4 text-lg font-semibold text-pink-700">
              {selectedProduct.name.toUpperCase()}
            </div>
          )}
            {selectedProduct &&(SIZE_SETS[selectedCategory] || []).map((size) => (
              <div key={size} className="flex flex-col items-center">
                <span className="mb-1 font-semibold text-gray-800">{size}</span>
                <input
                  ref={createInputRef(size)}
                  type="number"
                  min="0"
                  className="w-20 px-2 py-1 border rounded text-center text-gray-800"
                  placeholder="Qty"
                  value={sizeQuantities[size] || ""}
                  onChange={ (e) =>
                    setSizeQuantities((q) => ({
                      ...q,
                      [size]: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => handleKeyPress(e, size)}
                />
              </div>
            ))}
          </div>
        </div>
        {/* --- Final Actions --- */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition-all"
            onClick={() => {
              setSelectedCategory("Bras");
              setSizeQuantities({});
            }}
          >
            Cancel
          </button>
          <button
            ref={recordSaleBtnRef}
            onClick={handleSubmitSale}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 text-white bg-pink-600 px-5 py-2.5 rounded-lg hover:bg-pink-700 transition-all font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
  );
};

export default RecordSale;
