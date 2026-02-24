import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5050";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ REQUIRED for cookies
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setErr(json?.message || `Login failed (${res.status})`);
        return;
      }

      // ✅ Confirm session right away
      const meRes = await fetch(`${API}/api/auth/me`, {
        credentials: "include",
      });
      const meJson = await meRes.json();

      if (!meJson.ok) {
        setErr("Logged in but session cookie not working (CORS/credentials problem).");
        return;
      }

      // ✅ Redirect based on role
      if (meJson.user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (e2) {
      console.error(e2);
      setErr("Network error. Is the backend running?");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Sign In</h1>

      <form onSubmit={handleLogin} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit">Sign in</button>

        {err && <div style={{ color: "crimson" }}>{err}</div>}
      </form>
    </div>
  );
}