// src/components/Sidebar.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

type SidebarProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  activePage: string;
};

const Sidebar = ({ setActivePage, activePage }: SidebarProps) => {
  const router = useRouter();

  return (
    <div className="bg-white text-gray-800 w-64 p-4 flex-shrink-0 shadow-lg hidden md:flex md:flex-col">
      <div className="flex items-center mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-pink-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 3.5a1.5 1.5 0 011.06.44l4.244 4.243a1.5 1.5 0 010 2.12l-4.244 4.243A1.5 1.5 0 0110 16.5v-2.5a.5.5 0 00-1 0v2.5a1.5 1.5 0 01-2.56.94l-4.244-4.243a1.5 1.5 0 010-2.12l4.244-4.243A1.5 1.5 0 019 3.5v2.5a.5.5 0 001 0V3.5z" />
        </svg>
        <h1 className="text-2xl font-bold ml-2">Korvin</h1>
      </div>
      <nav className="flex-1">
        <ul>
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setActivePage("dashboard");
                router.push("/");
              }}
              className={`flex items-center py-3 px-4 my-1 rounded-lg transition-colors duration-200 ${
                activePage === "dashboard"
                  ? "bg-pink-100 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="ml-3">Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setActivePage("inventory");
                router.push("/inventory");
              }}
              className={`flex items-center py-3 px-4 my-1 rounded-lg transition-colors duration-200 ${
                activePage === "inventory"
                  ? "bg-pink-100 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span className="ml-3">Inventory</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setActivePage("settings");
                router.push("/");
              }}
              className={`flex items-center py-3 px-4 my-1 rounded-lg transition-colors duration-200 ${
                activePage === "settings"
                  ? "bg-pink-100 text-pink-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="ml-3">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="p-4 bg-pink-50 rounded-lg text-center">
        <h3 className="font-bold text-pink-800">Upgrade Plan</h3>
        <p className="text-sm text-pink-700 mt-1">
          Unlock advanced features and support.
        </p>
        <button className="bg-pink-500 text-white w-full py-2 mt-3 rounded-lg hover:bg-pink-600 transition-colors">
          Upgrade
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
