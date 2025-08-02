// src/components/Header.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Plus, Minus, Bell, ChevronDown,User } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center w-full">
      <div className="relative w-64">
        {/* You can add a search bar or logo here if needed */}
      </div>
      <div className="flex items-center space-x-4">
        
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center space-x-1">
          
          <User size={20} className="text-gray-500 cursor-pointer" />
          <ChevronDown size={20} className="text-gray-500 cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Header;
