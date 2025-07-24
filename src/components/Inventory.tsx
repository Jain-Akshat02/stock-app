"use client";
import React from "react";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

// Type Definitions for Inventory
interface ProductVariant {
  size: string;
  color: string;
  quantity: number;
}

const getTotalStock = (variants: ProductVariant[]) =>
  variants.reduce((acc, v) => acc + v.quantity, 0);

const getStockStatus = (stock: number) => {
  if (stock === 0)
    return { text: "Out of Stock", color: "bg-red-100 text-red-800" };
  if (stock < 5)
    return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
  return { text: "In Stock", color: "bg-green-100 text-green-800" };
};

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [stockStatus, setStockStatus] = useState('Current Status');
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();
  function aggregateStock(entries:any){
    const map = new Map();
    for(const entry of entries){
      const key = `${entry.product?._id}-${entry.variants?.[0].size}-${entry.variants?.[0].mrp}`;
      if(!map.has(key)){
        map.set(key, {
          ...entry,
          quantity:0,
        });
      }
      map.get(key).quantity += entry.quantity;
    }
    return Array.from(map.values());
  }
  const aggregatedProducts = aggregateStock(products);
  const filteredProducts = aggregatedProducts.filter((entry:any) => {

    const matchesCategory = selectedCategory === 'All Categories' || entry.product?.category === selectedCategory;
    const matchesSize = selectedSize === 'All Sizes' || entry.variants?.some((v:any) => v.size === selectedSize);
    const matchesStatus = stockStatus === 'Current Status' || getStockStatus(getTotalStock(entry.variants)).text === stockStatus;
    const matchSearch = searchQuery === '' || entry.product?.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSize && matchesStatus && matchSearch;

  });
  
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
          
          <button
            onClick={() => router.push("/add-stock")}
            className="flex items-center gap-2 text-white bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            <Plus size={20} />
            Add Stock
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-lg flex flex-wrap items-center gap-4 border border-gray-100">
        <span className="font-semibold text-gray-800">Filter by:</span>
        <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All Categories</option>
          <option>Bras</option>
          <option>Panties</option>
        </select>
        <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option>All Sizes</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
        </select>
        <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2"
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
        >
          <option>Current Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-100 mt-4">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-bold text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Product</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Size</th>
              <th scope="col" className="px-6 py-3">MRP</th>
              <th scope="col" className="px-6 py-3 text-center">Quantity</th>
              <th scope="col" className="px-6 py-3 text-center">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredProducts.map((entry: any) => (
              <tr key={entry._id} className="bg-white border-b hover:bg-pink-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">{entry.product?.name}</td>
                <td className="px-6 py-4">{entry.product?.category}</td>
                <td className="px-6 py-4">{entry.variants?.[0]?.size}</td>
                <td className="px-6 py-4">₹{entry.variants?.[0]?.mrp}</td>
                <td className="px-6 py-4 text-center font-bold text-gray-800">{entry.quantity}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStockStatus(entry.quantity).color}`}>
                    {getStockStatus(entry.quantity).text}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"><Edit size={18} /></button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Add New Product
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Form fields would go here */}
              <p className="text-gray-600">
                Product creation form with fields for name, SKU, category,
                price, description, and variant management will be here.
              </p>
              <p className="text-gray-600">
                For example, a section to add multiple sizes, colors, and their
                respective quantities.
              </p>
            </div>
            <div className="flex justify-end items-center p-4 border-t gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="text-white bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .filter-select {
          @apply bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2;
        }
      `}</style>
    </div>
  );
};

export default Inventory;
