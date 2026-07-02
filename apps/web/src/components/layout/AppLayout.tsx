import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { NAV_ITEMS } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";

export const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const items = user ? NAV_ITEMS[user.role] : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={items} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
