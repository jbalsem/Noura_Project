import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { count } = useCart();

  async function fetchMe() {
    try {
      const res = await fetch("http://localhost:5050/api/auth/me", {
        credentials: "include",
      });
      const json = await res.json();
      if (json.ok) setUser(json.user);
    } catch {
      // not logged in
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
    <header className="k-nav">
      <div className="k-nav-inner">
        <Link to="/" className="k-brand" aria-label="Kidooze Home">
          <img src={logo} alt="Kidooze" className="k-brand-logo" />
        </Link>

        <nav className="k-links" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => "k-link" + (isActive ? " active" : "")}>
            Home
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => "k-link" + (isActive ? " active" : "")}>
            Categories
          </NavLink>
          <NavLink to="/locations" className={({ isActive }) => "k-link" + (isActive ? " active" : "")}>
            Location
          </NavLink>
          <NavLink to="/deals" className={({ isActive }) => "k-link" + (isActive ? " active" : "")}>
            Deals
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => "k-link" + (isActive ? " active" : "")}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="k-spacer" />

        <div className="k-search">
          <span className="k-search-icon">🔍</span>
          <input placeholder="Search toys..." />
        </div>

        <div className="k-iconbar">
          <Link to="/cart" className="k-iconbtn" title="Cart" aria-label="Cart">
            🛒
            {count > 0 && <span className="k-badge">{count}</span>}
          </Link>

          <Link to={user ? "/account" : "/signin"} className="k-iconbtn" title="Account" aria-label="Account">
            👤
          </Link>
        </div>

        <div className="k-auth">
          {user ? (
            <>
              <span className="k-hi">Hi, {user.first_name || user.email}</span>
              <button className="k-pillbtn" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="k-auth-link">Sign in</Link>
              <span className="k-auth-sep">/</span>
              <Link to="/register" className="k-auth-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}