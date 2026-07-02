import React from "react";
import { cn } from "../../utils/cn";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    archived: "bg-yellow-100 text-yellow-800",
    open: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    submitted: "bg-blue-100 text-blue-800",
    graded: "bg-purple-100 text-purple-800",
    present: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    late: "bg-yellow-100 text-yellow-800",
    normal: "bg-blue-100 text-blue-800",
    urgent: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={cn(
        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
        colors[status.toLowerCase()] ?? "bg-gray-100 text-gray-800",
      )}
    >
      {status}
    </span>
  );
};
