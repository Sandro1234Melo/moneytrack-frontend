import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const storedUser = sessionStorage.getItem("user");
  let hasSession = false;

  try {
    hasSession = Boolean(storedUser && JSON.parse(storedUser)?.token);
  } catch {
    hasSession = false;
  }

  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
