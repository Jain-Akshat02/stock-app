"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  Calendar as CalendarIcon,
  PackagePlus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

// --- MODAL COMPONENT for adding a new product ---
// This component now handles its own API call to create a product.
const NewProductModal = ({
  isOpen,
  onClose,
  onAddProduct,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: any) => void;
}) => {
  // State for the new product form
  const [newProductName, setNewProductName] = useState("");
  const [newCategory, setNewCategory] = useState("Bras"); // Default to a valid category
  const [isSaving, setIsSaving] = useState(false);
  const inputRefs = useRef<{ [size: string]: HTMLInputElement | null }>({});

  if (!isOpen) return null;
  // Handles submitting the new product to the backend
  const handleSubmit = async () => {
    // 1. Frontend Validation
    if (!newProductName) {
      return toast.error("Product Name is required.");
    }
    // 2. Assemble payload for the API (without a frontend ID)
    const payload = {
      name: newProductName,
      category: newCategory,
    };

    setIsSaving(true);
    try {
      // 3. API Call to the backend to create the product
      // The backend will create the ID and return the full product object
      const response = await axios.post("/api/stock/inventory", payload);

      // 4. Pass the newly created product (with its DB-generated ID) to the parent
      onAddProduct(response.data);
      toast.success("Product created successfully! 🎉");
      onClose(); // Close modal on success
    } catch (error: any) {
      console.log("Failed to create product:", error);
      const message =
        error.response?.data?.message || "Could not save the product.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-lg">
              <PackagePlus className="h-6 w-6 text-pink-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Create a New Product
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name (e.g., 'Silk Robe')"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
          </div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option>Bras</option>
            <option>Panties</option>
            <option>Other</option>
          </select>

          <div className="border-t pt-4">
          </div>
        </div>
        <div className="flex justify-end items-center p-5 border-t border-gray-200 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 rounded-md text-white bg-pink-600 hover:bg-pink-700 font-semibold disabled:opacity-50 disabled:cursor-wait"
          >
            {isSaving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const AddStock = () => {
  const router = useRouter();
  // State Management
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Bras");
  const [sizeQuantities, setSizeQuantities] = useState<{
    [size: string]: string;
  }>({});
  const inputRefs = useRef<{ [size: string]: HTMLInputElement | null }>({});
  const SIZE_SETS: Record<string, string[]> = {
    Bras: ["28", "30", "32", "34", "36", "38", "40", "42", "44"],
    Panties: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
  };

  // Reset size quantities when category changes
  useEffect(() => {
    const newQuantities: { [size: string]: string } = {};
    (SIZE_SETS[selectedCategory] || []).forEach((size) => {
      newQuantities[size] = "";
    });
    setSizeQuantities(newQuantities);
  }, [selectedCategory]);

  // --- DATA FETCHING ---
  // Fetch all products from the backend when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/stock/inventory",{ params: { category: selectedCategory
        }});
        console.log(response.data);
        
        setProducts(response.data.products);
      } catch (error: any) {
        console.error("Failed to fetch products:", error.message);
        toast.error(error.message);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // --- HANDLERS ---
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
  };

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
      }
    }
  };

  // Callback for when a new product is successfully created in the modal
  const handleAddNewProduct = (newProduct: any) => {
    setProducts((prev) => prev.concat(newProduct));
    // Automatically select the new product in the dropdown
    handleProductChange(newProduct.id);
  };

  // Handles submitting the final stock information
  const handleSubmitStock = async () => {
    if (!selectedProductId || !date) {
      return toast.error("Please select a product.");
    }

    const stockEntries = Object.entries(sizeQuantities)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([size, qty]) => ({
        size,
        quantity: Number(qty),
      }));

    if (stockEntries.length === 0) {
      return toast.error("Please enter a quantity for at least one size.");
    }

    const payload = {
      productId: selectedProductId,
      category: selectedCategory,
      stockEntries,
    };

    setIsLoading(true);
    try {
      await axios.post("/api/stock/entry", payload);
      toast.success("Stock added successfully!");
      router.refresh();
      // Reset form on successful submission
      setSelectedProductId("");
      // Reset size quantities
      const newQuantities: { [size: string]: string } = {};
      (SIZE_SETS[selectedCategory] || []).forEach((size) => {
        newQuantities[size] = "";
      });
      setSizeQuantities(newQuantities);
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
      const message = error.response?.data?.message || "Failed to add stock.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddNewProduct}
      />

      <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Stock</h1>
          <p className="text-gray-600 mt-1">
            Log new inventory received from suppliers.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-8 border border-gray-100">
          {/* --- Step 1: Product Selection --- */}
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

            <label className="mt-4 block text-sm font-semibold text-gray-700 mb-2">
              2. Select Quality
            </label>
            <div className="flex items-center gap-2">
              <select
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-pink-400 flex-grow"
                value={selectedProductId}
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

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center text-gray-700 bg-gray-100 border border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all font-semibold flex-shrink-0"
              >
                <Plus size={18} className="mr-1.5" /> New
              </button>
            </div>
          </div>

          {/* --- Step 2: Stock Details (only shows if a product is selected) --- */}
          {selectedProductId && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                3. Enter Stock Details
              </label>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Size
                      </th>
                    </tr>
                  </thead>
                  <tbody className="flex gap-4 m-3">
                    {(SIZE_SETS[selectedCategory] || []).map((size) => (
                      <tr key={size} className="flex flex-col items-center">
                        <td className="mb-1 font-semibold text-gray-800">
                          {size}
                        </td>
                        <td>
                          <input
                          ref={(el) => {
                            inputRefs.current[size] = el;
                          }}
                          type="number"
                          min="0"
                          className="w-20 px-2 py-1 border rounded text-center text-gray-800"
                          placeholder="Qty"
                          value={sizeQuantities[size] || ""}
                          onChange={(e) =>
                            setSizeQuantities((q) => ({
                              ...q,
                              [size]: e.target.value,
                            }))
                          }
                          onKeyPress={(e) => handleKeyPress(e, size)}
                        />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* --- Final Actions --- */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition-all">
              Cancel
            </button>
            <button
              onClick={handleSubmitStock}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 text-white bg-pink-600 px-5 py-2.5 rounded-lg hover:bg-pink-700 transition-all font-semibold shadow-sm disabled:opacity-60 disabled:cursor-wait"
            >
              {isLoading ? (
                "Adding..."
              ) : (
                <>
                  <Plus size={20} />
                  Add to Stock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStock;
