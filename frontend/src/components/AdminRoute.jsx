import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API = "http://localhost:5050";

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | ok | nope

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        if (j.ok && j.user.role === "admin") setStatus("ok");
        else setStatus("nope");
      })
      .catch(() => setStatus("nope"));
  }, []);

  if (status === "loading") return <div style={{ padding: 24 }}>Loading…</div>;
  if (status === "nope") return <Navigate to="/signin" replace />;
  return children;
}