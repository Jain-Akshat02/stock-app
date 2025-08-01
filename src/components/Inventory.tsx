"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Minus, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Filter,
  BarChart3,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const getStockStatus = (stock: number) => {
  if (stock === 0)
    return { text: "Out of Stock", color: "bg-red-100 text-red-800", icon: AlertTriangle };
  if (stock < 5)
    return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle };
  return { text: "In Stock", color: "bg-green-100 text-green-800", icon: CheckCircle };
};

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSize, setSelectedSize] = useState("All Sizes");
  const [stockStatus, setStockStatus] = useState("Current Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("All Products");
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Bras",
    variants: DEFAULT_SIZES.map((size) => ({ size, mrp: "", quantity: "" })),
  });

  const handleVariantChange = (idx: number, field: string, value: string) => {
    setNewProduct((prev) => {
      const variants = [...prev.variants];
      variants[idx] = { ...variants[idx], [field]: value };
      return { ...prev, variants };
    });
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.category) {
      toast.error("Name and category are required");
      return;
    }
    try {
      await axios.post("/api/stock/inventory", {
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        variants: newProduct.variants
          .filter((v) => v.quantity !== "" && !isNaN(Number(v.quantity)))
          .map((v) => ({
            size: v.size,
            mrp: Number(v.mrp),
            quantity: Number(v.quantity),
          })),
      });
      toast.success("Product added!");
      setIsModalOpen(false);
      setNewProduct({
        name: "",
        sku: "",
        category: "Bras",
        variants: DEFAULT_SIZES.map((size) => ({
          size,
          mrp: "",
          quantity: "",
        })),
      });
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const router = useRouter();
  
  function aggregateStock(entries: any) {
    const map = new Map();
    for (const entry of entries) {
      const key = `${entry.product?._id}`;
      if (!map.has(key)) {
        map.set(key, {
          ...entry,
          quantity: 0,
        });
      }
      map.get(key).quantity += entry.quantity;
    }
    return Array.from(map.values());
  }
  
  const aggregatedProducts = aggregateStock(products);
  const filteredProducts = aggregatedProducts.filter((entry: any) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      entry.product?.category === selectedCategory;

    const matchesSize =
      selectedSize === "All Sizes" ||
      entry.variants?.[0]?.size === selectedSize;

    const matchesStatus =
      stockStatus === "Current Status" ||
      getStockStatus(entry.quantity).text === stockStatus;

    const matchSearch =
      searchQuery === "" ||
      entry.product?.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSize && matchesStatus && matchSearch;
  });

  // Calculate summary statistics
  const totalProducts = filteredProducts.length;
  const totalStock = filteredProducts.reduce((sum: number, entry: any) => sum + entry.quantity, 0);
  const lowStockItems = filteredProducts.filter((entry: any) => entry.quantity < 5).length;
  const outOfStockItems = filteredProducts.filter((entry: any) => entry.quantity === 0).length;

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("/api/stock/entry");
        setProducts(response.data);
        console.log("Fetched stock data:", response.data);
      } catch (error: any) {
        console.error("Error fetching stock data:", error.message);
        toast.error(`Failed to fetch stock data: ${error.message}`, {
          position: "top-right",
        });
        return [];
      }
    };
    fetchStockData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Inventory Management</h1>
                <p className="text-sm text-gray-500">Track and manage your stock levels</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/add-stock")}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
              >
                <Plus size={18} />
                <span>Add Stock</span>
              </button>
              <button
                onClick={() => router.push("/record-sale")}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-xl hover:from-pink-600 hover:to-red-700 transition-all font-medium"
              >
                <Minus size={18} />
                <span>Record Sale</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stock</p>
                <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-600">{lowStockItems}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <AlertTriangle size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">{outOfStockItems}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <X size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All Categories">All Categories</option>
                <option value="Bras">Bras</option>
                <option value="Panties">Panties</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="All Sizes">All Sizes</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
              >
                <option value="Current Status">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Product Inventory</h2>
            <p className="text-sm text-gray-600">Showing {filteredProducts.length} products</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((entry: any, index: number) => {
                  const status = getStockStatus(entry.quantity);
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                              <Package size={20} className="text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.product?.name || "Unknown Product"}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {entry.product?.sku || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {entry.product?.category || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs overflow-hidden text-ellipsis">
                        {entry.variants?.[0]?.size || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.quantity || 0}
                          </div>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                entry.quantity === 0 ? 'bg-red-500' :
                                entry.quantity < 5 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((entry.quantity / 20) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product Name*"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SKU (optional)"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct((p) => ({ ...p, sku: e.target.value }))
                  }
                />
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  <option value="Bras">Bras</option>
                  <option value="Panties">Panties</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end items-center p-6 border-t border-gray-200 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
                onClick={handleSaveProduct}
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
