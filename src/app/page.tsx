// src/app/page.tsx
import ClientLayout from "@/components/ClientLayout";
import Dashboard from "@/components/Dashboard";
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <ClientLayout>
      <Dashboard />
    </ClientLayout>
  );
}

export default Home;
