// src/components/Pagination.tsx
"use client";

import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
    return (
        <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-gray-700">
                Showing <span className="font-semibold text-gray-900">1</span> to <span className="font-semibold text-gray-900">5</span> of <span className="font-semibold text-gray-900">100</span> Entries
            </span>
            <div className="inline-flex items-center -space-x-px">
                <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
                    <ChevronsLeft size={16} />
                </button>
                <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border-y border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                    <ChevronLeft size={16} />
                </button>
                <button className="flex items-center justify-center px-4 h-8 text-sm font-medium text-pink-600 border border-pink-300 bg-pink-50 hover:bg-pink-100 hover:text-pink-700 z-10">1</button>
                <button className="flex items-center justify-center px-4 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</button>
                <button className="flex items-center justify-center px-4 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">...</button>
                <button className="flex items-center justify-center px-4 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">10</button>
                <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border-y border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                    <ChevronRight size={16} />
                </button>
                <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
}

export default Pagination;
