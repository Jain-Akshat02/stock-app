// src/components/Header.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Plus, Minus, Bell, ChevronDown } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="relative w-64">
        {/* You can add a search bar or logo here if needed */}
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={() => router.push('/add-stock')}  className="flex items-center bg-pink-500 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-pink-600 transition-colors">
          <Plus size={20} className="mr-2" />
          Add Stock
        </button>
        <button className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer" onClick={() => router.push('/record-sale')}
        >
          <Minus size={20} className="mr-2" />
          Record Sale
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://placehold.co/40x40/FFC0CB/333333?text=U"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <ChevronDown size={20} className="text-gray-500 cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Header;
