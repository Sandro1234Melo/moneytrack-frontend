import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { getLoggedUser } from "../utils/auth";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = getLoggedUser();

  if (!user?.token) {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
}
