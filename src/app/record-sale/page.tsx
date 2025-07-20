// src/app/add-stock/page.tsx
import ClientLayout from "@/components/ClientLayout";
import AddStock from "@/components/AddStock";
import type { NextPage } from 'next';

const AddStockPage: NextPage = () => {
  return (
    <ClientLayout>
      <AddStock />
    </ClientLayout>
  );
}

export default AddStockPage;
