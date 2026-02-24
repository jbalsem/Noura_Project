import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function fetchMe() {
    try {
        const res = await fetch("http://localhost:5050/api/auth/me", {
            credentials: "include",
          });
      const json = await res.json();
      if (json.ok) setUser(json.user);
    } catch (err) {
      console.log("Not logged in");
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  async function handleLogout() {
    await fetch("http://localhost:5050/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    setUser(null);
    navigate("/");
  }

  return (
    <nav style={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/deals">Deals</Link>
      <Link to="/locations">Locations</Link>
      <Link to="/cart">Cart</Link>

      <div style={styles.right}>
        {user ? (
          <>
            <span>Hi, {user.first_name || user.email}</span>
            <button onClick={handleLogout}>Sign out</button>
            {user.role === "admin" && (<Link to="/admin">Admin</Link>
        )}
          </>
        ) : (
          <>
            <Link to="/signin">Sign in</Link>
            <span> / </span>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #ddd",
  },
  right: {
    marginLeft: "auto",
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
};