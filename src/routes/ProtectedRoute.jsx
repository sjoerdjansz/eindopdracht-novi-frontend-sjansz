import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/signup" replace />;
  }
  return children ? children : <Outlet />;
}
