// ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Components/Usercontext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    // user login nahi hai → redirect home page ya 404
    return <Navigate to="/" replace />; // "/" = home page
  }

  return children; // user login hai → page render
}
