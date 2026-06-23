"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function TopProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/admin/analytics/top-products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  return (
    <div className="py-8">
      <div className="mb-10 pb-6 border-b-2 border-gray-200">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent mb-3">
          📊 Top Products
        </h1>
        <p className="text-lg text-gray-600 font-semibold">Performance analytics of your best-selling items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((p, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl border-2 border-gray-100 p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
            <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-gray-200">
              <h2 className="font-bold text-xl text-secondary line-clamp-1 flex-1">{p.name}</h2>
              <span className="ml-3 px-4 py-2 bg-gradient-to-r from-primary to-teal-500 text-white font-bold rounded-lg text-sm whitespace-nowrap">
                #{i + 1}
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Units Sold</span>
                <span className="text-2xl font-black text-primary">{p.sold || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Revenue</span>
                <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Rs {p.revenue || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}