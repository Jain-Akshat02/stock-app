// src/components/AddStock.tsx
"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Calendar as CalendarIcon,
  PackagePlus,
  Trash2,
} from "lucide-react";

// --- MOCK DATA (to be replaced by API calls) ---
// Using 'any' to simplify, as requested. In a larger app, you'd define a strict 'Product' type.
const initialProducts: any[] = [
  {
    id: "prod-001",
    sku: "SKU-8345",
    name: "Satin Dreams Bra",
    category: "Bras",
    variants: [
      { size: "34B", color: "Black" },
      { size: "36C", color: "White" },
    ],
  },
  {
    id: "prod-002",
    sku: "SKU-1923",
    name: "Lace Comfort Panty",
    category: "Panties",
    variants: [
      { size: "M", color: "Red" },
      { size: "L", color: "Red" },
    ],
  },
  {
    id: "prod-003",
    sku: "SKU-5678",
    name: "Silk Night Gown",
    category: "Nightwear",
    variants: [{ size: "S", color: "Champagne" }],
  },
];

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
  if (!isOpen) return null;

  const [newProductName, setNewProductName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [newVariants, setNewVariants] = useState([{ size: "", color: "" }]);

  const handleAddVariant = () => {
    setNewVariants([...newVariants, { size: "", color: "" }]);
  };

  const handleVariantChange = (
    index: number,
    field: "size" | "color",
    value: string
  ) => {
    const updated = [...newVariants];
    updated[index][field] = value;
    setNewVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setNewVariants(newVariants.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newProduct = {
      id: `prod-${Date.now()}`, // Simple unique ID
      name: newProductName,
      sku: newSku,
      category: newCategory,
      variants: newVariants.filter((v) => v.size && v.color), // Only add valid variants
    };
    onAddProduct(newProduct);
    onClose();
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
              className="form-input text-gray-700"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
            <input
              type="text"
              placeholder="SKU (e.g., 'SR-001')"
              className="form-input text-gray-700"
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
            />
          </div>
          <select
            className="form-input text-gray-700"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option>Bras</option>
            <option>Panties</option>
            <option>Nightwear</option>
            <option>Shapewear</option>
            <option>Other</option>
          </select>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2 text-gray-800">
              Product Variants (Size & Color)
            </h3>
            {newVariants.map((variant, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Size (e.g., 'M')"
                  className="form-input"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Color (e.g., 'Red')"
                  className="form-input"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                />
                <button
                  onClick={() => handleRemoveVariant(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddVariant}
              className="text-sm font-semibold text-pink-600 hover:text-pink-800 mt-2"
            >
              + Add another variant
            </button>
          </div>
        </div>
        <div className="flex justify-end items-center p-5 border-t border-gray-200 gap-3">
          <button onClick={onClose} className="form-button-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="form-button-primary">
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const AddStock = () => {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [sizeStock, setSizeStock] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const variants = selectedProduct?.variants || [];

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find((p) => p.id === productId);
    // Reset the stock inputs for the new product's variants
    setSizeStock(
      product ? product.variants.map(() => ({ quantity: "", cost: "" })) : []
    );
  };

  const handleSizeStockChange = (
    index: number,
    field: "quantity" | "cost",
    value: string
  ) => {
    const updatedStock = [...sizeStock];
    updatedStock[index] = { ...updatedStock[index], [field]: value };
    setSizeStock(updatedStock);
  };

  const handleAddNewProduct = (newProduct: any) => {
    setProducts((prev) => [...prev, newProduct]);
    handleProductChange(newProduct.id); // Auto-select the new product
  };

  return (
    <>
      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddNewProduct}
      />

      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Stock</h1>
          <p className="text-gray-600 mt-1">
            Log new inventory received from suppliers.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              1. Select Product
            </label>
            <div className="flex items-center gap-2 mt-2">
              <select
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 flex-grow"
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                <option value="" className="text-gray-700">
                  Select a product...
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center text-gray-700 bg-gray-100 border border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all font-semibold flex-shrink-0"
              >
                <Plus size={18} className="mr-1" /> New
              </button>
            </div>
          </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                2. Enter Stock Details
              </label>
              <div className="mt-2 overflow-x-auto border rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Cost Per Dozen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variants.map((v: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {v.size}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {v.color}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          <input
                            type="number"
                            min="0"
                            className="block w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                            placeholder="e.g., 50"
                            value={sizeStock[idx]?.quantity || ""}
                            onChange={(e) =>
                              handleSizeStockChange(
                                idx,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          <input
                            type="number"
                            min="0"
                            className="block w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                            placeholder="e.g., 15.50"
                            value={sizeStock[idx]?.cost || ""}
                            onChange={(e) =>
                              handleSizeStockChange(idx, "cost", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="received-date"
                className="block text-sm font-semibold text-gray-700"
              >
                3. Date Received
              </label>
              <div className="relative mt-2">
                <input
                  type="date"
                  id="received-date"
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-semibold text-gray-700"
              >
                4. Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={1}
                className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 mt-2"
                placeholder="Add reference notes..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button className="flex items-center justify-center text-gray-700 bg-gray-100 border border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all font-semibold">
              Cancel
            </button>
            <button className="flex items-center justify-center gap-2 text-white bg-pink-600 px-5 py-2.5 rounded-lg hover:bg-pink-700 transition-all font-semibold shadow-sm">
              <Plus size={20} />
              Add to Stock
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStock;
