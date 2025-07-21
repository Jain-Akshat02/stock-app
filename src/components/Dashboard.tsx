// src/components/Dashboard.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import InfoCard from '@/components/InfoCard';

// Type Definitions
interface StockFlow {
  name: string;
  stockIn: number;
  stockOut: number;
}
interface CategoryDistribution {
  name: string;
  value: number;
}
interface Activity {
  id: string;
  name: string;
  type: string;
  qty: number;
  date: string;
  status: 'Stock In' | 'Sale' | 'Return';
}

// Mock Data
const stockData: StockFlow[] = [
  { name: 'Jan', stockIn: 400, stockOut: 240 }, { name: 'Feb', stockIn: 300, stockOut: 139 },
  { name: 'Mar', stockIn: 200, stockOut: 980 }, { name: 'Apr', stockIn: 278, stockOut: 390 },
  { name: 'May', stockIn: 189, stockOut: 480 }, { name: 'Jun', stockIn: 239, stockOut: 380 },
];
const categoryData: CategoryDistribution[] = [
  { name: 'Bras', value: 400 }, { name: 'Panties', value: 300 },
  { name: 'Nightwear', value: 300 }, { name: 'Shapewear', value: 200 },
];
const COLORS = ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2'];
const recentActivity: Activity[] = [
  { id: 'SKU-8345', name: 'Satin Dreams Bra', type: 'Bra', qty: 50, date: '2024-07-20', status: 'Stock In' },
  { id: 'SKU-1923', name: 'Lace Comfort Panty', type: 'Panty', qty: -2, date: '2024-07-20', status: 'Sale' },
  { id: 'SKU-5678', name: 'Silk Night Gown', type: 'Nightwear', qty: 25, date: '2024-07-19', status: 'Stock In' },
  { id: 'SKU-9012', name: 'Everyday Shaping Brief', type: 'Shapewear', qty: -5, date: '2024-07-19', status: 'Sale' },
  { id: 'SKU-3456', name: 'Satin Dreams Bra', type: 'Bra', qty: -1, date: '2024-07-18', status: 'Return' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard title="Total Stock Value" value="$125,430" change="+5.2%" changeType="increase" />
        <InfoCard title="Total Products" value="1,287" change="+15" changeType="increase" />
        <InfoCard title="Items Low in Stock" value="23" change="-2" changeType="decrease" />
        <InfoCard title="Sales This Month" value="$12,890" change="+18.7%" changeType="increase" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Stock Flow (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
              <Legend iconType="circle" />
              <Bar dataKey="stockIn" fill="#4ade80" name="Stock In" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stockOut" fill="#f87171" name="Stock Out" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Stock by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">SKU</th>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3 text-center">Quantity</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td className={`px-6 py-4 text-center font-bold ${item.qty > 0 ? 'text-green-500' : 'text-red-500'}`}>{item.qty > 0 ? `+${item.qty}` : item.qty}</td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Stock In' ? 'bg-green-100 text-green-800' : item.status === 'Sale' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
