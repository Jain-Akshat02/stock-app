"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  PackagePlus,
  Trash2,
  ArrowLeft,
  Package,
  TrendingUp,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- MODAL COMPONENT for adding a new product ---
const NewProductModal = ({
  isOpen,
  onClose,
  onAddProduct,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: any) => void;
}) => {
  const [newProductName, setNewProductName] = useState("");
  const [newCategory, setNewCategory] = useState("Bras");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!newProductName) {
      return toast.error("Product Name is required.");
    }

    const payload = {
      name: newProductName,
      category: newCategory,
    };

    setIsSaving(true);
    try {
      const response = await axios.post("/api/stock/inventory", payload);
      onAddProduct(response.data);
      toast.success("Product created successfully! 🎉");
      onClose();
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 position-relative">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <PackagePlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Product</h2>
              <p className="text-sm text-gray-600">Add a new product to your inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name (e.g., 'Silk Robe')"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="Bras">Bras</option>
                <option value="Panties">Panties</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center p-6 border-t border-gray-200 gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const AddStock = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const sortedProducts = products.sort((a, b) => 
  a.name.localeCompare(b.name)
);

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/stock/inventory", { 
          params: { category: selectedCategory }
        });
        // console.log(response.data);
        setProducts(response.data.products);
      } catch (error: any) {
        console.error("Failed to fetch products:", error.message);
        toast.error(error.message);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

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

  const handleAddNewProduct = (newProduct: any) => {
    setProducts((prev) => prev.concat(newProduct.product));
    handleProductChange(newProduct.product._id);
  };

  const handleSubmitStock = async () => {
    if (!selectedProductId) {
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
      setSelectedProductId("");
      const newQuantities: { [size: string]: string } = {};
      (SIZE_SETS[selectedCategory] || []).forEach((size) => {
        newQuantities[size] = "";
      });
      setSizeQuantities(newQuantities);
    } catch (error: any) {
      console.error(error.message);
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 position-relative">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Add Stock</h1>
                  <p className="text-sm text-gray-500">Log new inventory received</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <TrendingUp size={16} className="mr-1" />
                  Stock In
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Product Selection Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Product Selection</h2>
                  <p className="text-blue-100">Choose category and product to add stock</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Category and Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Quality</option>
                    <option value="Bras">Bras</option>
                    <option value="Panties">Panties</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Quality
                  </label>
                  <div className="flex space-x-3">
                    <select
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={selectedProductId}
                      onChange={(e) => handleProductChange(e.target.value)}
                    >
                      <option value="" >
                        Select Quality
                      </option>
                      {sortedProducts.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
                    >
                      <Plus size={18} />
                      <span>New</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Product Display */}
              {selectedProduct && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Package size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Category: {selectedProduct.category}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Quantities Section */}
              {selectedProduct && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Enter Stock Quantities
                      </h3>
                      <p className="text-sm text-gray-600">
                        Add quantities for each available size
                      </p>
                    </div>
                  </div>

                  {/* Sizes Container with Horizontal Scroll */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide max-w-full">
                      {(SIZE_SETS[selectedCategory] || []).map((size) => (
                        <div key={size} className="flex-shrink-0 min-w-0">
                          <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow w-20">
                            <div className="text-center space-y-2">
                              <div>
                                <span className="text-base font-bold text-gray-900">{size}</span>
                              </div>
                              <input
                                ref={createInputRef(size)}
                                type="number"
                                min="0"
                                className="w-full px-1 py-1 border border-gray-300 rounded-lg text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                                placeholder="0"
                                value={sizeQuantities[size] || ""}
                                onChange={(e) =>
                                  setSizeQuantities((q) => ({
                                    ...q,
                                    [size]: e.target.value,
                                  }))
                                }
                                onKeyPress={(e) => handleKeyPress(e, size)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all"
                  onClick={() => {
                    setSelectedCategory("Bras");
                    setSizeQuantities({});
                    setSelectedProductId("");
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmitStock}
                  disabled={isLoading || !selectedProduct}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      <span>Add to Stock</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </>
  );
};

export default AddStock;
