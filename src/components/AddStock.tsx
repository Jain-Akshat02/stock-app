// src/components/AddStock.tsx
"use client";

import { useState } from 'react';
import { Plus, Search, ChevronsUpDown, Check, Calendar as CalendarIcon } from 'lucide-react';

// Mock Data - In a real app, this would come from your API
const mockProducts = [
    { id: 'prod-001', sku: 'SKU-8345', name: 'Satin Dreams Bra', variants: [{ size: '34B', color: 'Black' }, { size: '36C', color: 'White' }] },
    { id: 'prod-002', sku: 'SKU-1923', name: 'Lace Comfort Panty', variants: [{ size: 'M', color: 'Red' }, { size: 'L', color: 'Red' }] },
    { id: 'prod-003', sku: 'SKU-5678', name: 'Silk Night Gown', variants: [{ size: 'S', color: 'Champagne' }] },
];

const AddStock = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Add Stock</h1>
                <p className="text-gray-500 mt-1">Log new inventory received from suppliers.</p>
            </div>

            {/* Form Card */}
            <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                
                <div>
                    <label htmlFor="product-search" className="form-label text-gray-700">1. Select Product</label>
                    {/* This would be a searchable dropdown component in a real app */}
                    <p className="text-sm text-gray-600">A searchable dropdown would allow you to find products by name or SKU.</p>
                     <select id="product-search" className="form-input mt-2 text-gray-700">
                        <option>Select a product...</option>
                        {mockProducts.map(p => <option key={p.id}>{p.name} ({p.sku})</option>)}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="variant-select" className="form-label text-gray-700">2. Select Variant</label>
                     <select id="variant-select" className="form-input mt-2 text-gray-700">
                        <option>Select a variant...</option>
                        {/* Assuming a product is selected, its variants would be listed here */}
                        <option>Size: 34B, Color: Black</option>
                        <option>Size: 36C, Color: White</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="quantity" className="form-label text-gray-700">3. Quantity</label>
                        <input type="number" id="quantity" placeholder="e.g., 50" className="form-input mt-2" />
                    </div>
                    <div>
                        <label htmlFor="cost-price" className="form-label text-gray-700">4. Cost Per Item ($)</label>
                        <input type="number" id="cost-price" placeholder="e.g., 15.50" className="form-input mt-2" />
                    </div>
                </div>

                <div>
                    <label htmlFor="supplier" className="form-label text-gray-700">5. Supplier (Optional)</label>
                    <input type="text" id="supplier" placeholder="e.g., Lingerie Lux Co." className="form-input mt-2" />
                </div>

                <div>
                    <label htmlFor="received-date" className="form-label text-gray-700">6. Date Received</label>
                    <div className="relative mt-2">
                        <input type="date" id="received-date" className="form-input" />
                         <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <div>
                    <label htmlFor="notes" className="form-label text-gray-700">7. Notes (Optional)</label>
                    <textarea id="notes" rows={3} className="form-input mt-2" placeholder="Add any notes about this stock..."></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                    <button className="text-gray-600 bg-white border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 text-white bg-pink-500 px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors ">
                        <Plus size={20} />
                        Add to Stock
                    </button>
                </div>
            </div>
            <style jsx>{`
                .form-label {
                    @apply block text-sm font-medium text-gray-700;
                }
                .form-input {
                    @apply block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm;
                }
            `}</style>
        </div>
    );
};

export default AddStock;
