// src/components/Inventory.tsx
"use client";

import { useState } from 'react';
import { Plus, Search, Upload, Edit, Trash2, X } from 'lucide-react';
import Pagination from './Pagination';

// Type Definitions for Inventory
interface ProductVariant {
  size: string;
  color: string;
  quantity: number;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Bras' | 'Panties' | 'Nightwear' | 'Shapewear';
  price: number;
  variants: ProductVariant[];
  imageUrl: string;
}

// Mock Data for Inventory
const mockProducts: Product[] = [
  { id: 'prod-001', sku: 'SKU-8345', name: 'Satin Dreams Bra', category: 'Bras', price: 59.99, imageUrl: 'https://placehold.co/80x80/FFC0CB/333?text=Bra', variants: [{ size: '34B', color: 'Black', quantity: 15 }, { size: '36C', color: 'White', quantity: 20 }] },
  { id: 'prod-002', sku: 'SKU-1923', name: 'Lace Comfort Panty', category: 'Panties', price: 24.99, imageUrl: 'https://placehold.co/80x80/FFD166/333?text=Panty', variants: [{ size: 'M', color: 'Red', quantity: 5 }, { size: 'L', color: 'Red', quantity: 0 }] },
  { id: 'prod-003', sku: 'SKU-5678', name: 'Silk Night Gown', category: 'Nightwear', price: 89.99, imageUrl: 'https://placehold.co/80x80/06D6A0/333?text=Gown', variants: [{ size: 'S', color: 'Champagne', quantity: 8 }] },
  { id: 'prod-004', sku: 'SKU-9012', name: 'Everyday Shaping Brief', category: 'Shapewear', price: 35.00, imageUrl: 'https://placehold.co/80x80/118AB2/333?text=Brief', variants: [{ size: 'L', color: 'Nude', quantity: 30 }] },
  { id: 'prod-005', sku: 'SKU-1122', name: 'Push-up Wonder', category: 'Bras', price: 65.00, imageUrl: 'https://placehold.co/80x80/FF6B6B/333?text=Bra', variants: [{ size: '32A', color: 'Pink', quantity: 2 }] },
];

const getTotalStock = (variants: ProductVariant[]) => variants.reduce((acc, v) => acc + v.quantity, 0);

const getStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  if (stock < 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
  return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
};


const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search products..." className="bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <button className="flex items-center gap-2 text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Upload size={18} />
            Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-white bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-center gap-4">
        <span className="font-semibold text-gray-700">Filter by:</span>
        <select className="filter-select text-gray-500">
          <option>All Categories</option>
          <option>Bras</option>
          <option>Panties</option>
        </select>
        <select className="filter-select text-gray-500">
          <option>All Sizes</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
        </select>
        <select className="filter-select text-gray-500">
          <option>All Colors</option>
          <option>Black</option>
          <option>White</option>
          <option>Red</option>
        </select>
        <select className="filter-select text-gray-500">
          <option>Current Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Product</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3 text-center">Total Stock</th>
              <th scope="col" className="px-6 py-3 text-center">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = getTotalStock(product.variants);
              const status = getStockStatus(totalStock);
              return (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                      <div>
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800">{totalStock}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"><Edit size={18} /></button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination />

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Form fields would go here */}
                <p className="text-gray-600">Product creation form with fields for name, SKU, category, price, description, and variant management will be here.</p>
                <p className="text-gray-600">For example, a section to add multiple sizes, colors, and their respective quantities.</p>
            </div>
            <div className="flex justify-end items-center p-4 border-t gap-2">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              <button className="text-white bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600">Save Product</button>
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
