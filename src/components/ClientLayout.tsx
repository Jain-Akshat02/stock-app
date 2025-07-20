"use client";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';
import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: LayoutProps) {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 md:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}