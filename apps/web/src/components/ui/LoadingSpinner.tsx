import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
  </div>
);
