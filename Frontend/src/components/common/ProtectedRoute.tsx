import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children, sellerOnly = false }: { children: ReactNode; sellerOnly?: boolean }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (sellerOnly && user.role !== "seller") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
