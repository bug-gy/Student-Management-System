import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        {user?.name} <span className="text-gray-400">({user?.role})</span>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
};
