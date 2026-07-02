import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

interface SidebarProps {
  items: readonly { label: string; path: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-600">SMS</h1>
      </div>
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
