import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import logo from "../assets/logo.png";

const API = "http://localhost:5050";

function money(n) {
  return Number(n || 0).toFixed(2);
}

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    fetch(`${API}/api/products?section=bestSeller`)
      .then((r) => r.json())
      .then(setBestSellers)
      .catch(console.error);

    fetch(`${API}/api/products?section=newArrival`)
      .then((r) => r.json())
      .then(setNewArrivals)
      .catch(console.error);

    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <div className="page theme-teal" style={{ width: "100%" }}>
      {/* FULL WIDTH HERO */}
      <section
        style={{
          width: "100%",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          padding: "40px 6vw",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(84,176,167,.95) 0%, rgba(240,180,75,.95) 40%, rgba(235,109,61,.95) 75%)",
        }}
      >
        {/* subtle shapes */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 15% 25%, rgba(255,255,255,.20), transparent 45%)," +
              "radial-gradient(circle at 85% 20%, rgba(177,61,196,.18), transparent 45%)," +
              "radial-gradient(circle at 60% 85%, rgba(255,255,255,.18), transparent 55%)",
          }}
        />

        <div style={{ position: "relative", maxWidth: 720 }}>
          <div
            style={{
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,.85)",
              fontWeight: 900,
              color: "#2B3A55",
            }}
          >
            🎁 Fun toys • Happy kids
          </div>

          <h1 className="rainbowTitle">
  <span className="c1">PLAY.</span>{" "}
  <span className="c2">DISCOVER.</span>
  <br />
  <span className="c4">IMAGINE.</span>
</h1>

          <p
            style={{
              margin: 0,
              fontSize: "clamp(18px, 1.6vw, 24px)",
              color: "rgba(255,255,255,.92)",
              maxWidth: 620,
              fontWeight: 700,
            }}
          >
            Discover best sellers, new arrivals, and colorful categories. Add to cart in one tap and
            we’ll confirm your order on WhatsApp.
          </p>

          <div style={{ display: "flex", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
            <Link
              to="/categories"
              className="btn btn-teal"
              style={{
                textDecoration: "none",
                padding: "16px 22px",
                fontSize: 18,
                borderRadius: 999,
                background: "white",
                color: "#2B3A55",
                fontWeight: 900,
              }}
            >
              Shop Categories
            </Link>

            <Link
              to="/deals"
              style={{
                textDecoration: "none",
                padding: "16px 22px",
                fontSize: 18,
                borderRadius: 999,
                background: "rgba(255,255,255,.18)",
                color: "white",
                fontWeight: 900,
                border: "2px solid rgba(255,255,255,.45)",
              }}
            >
              See Deals
            </Link>

            <Link
              to="/locations"
              style={{
                textDecoration: "none",
                padding: "16px 22px",
                fontSize: 18,
                borderRadius: 999,
                background: "rgba(255,255,255,.18)",
                color: "white",
                fontWeight: 900,
                border: "2px solid rgba(255,255,255,.45)",
              }}
            >
              Find Stores
            </Link>
          </div>
        </div>

        <div style={{ position: "relative", textAlign: "center", minWidth: 280 }}>
          <img
            src={logo}
            alt="Kidooze logo"
            style={{
              width: "min(520px, 36vw)",
              maxWidth: "90vw",
              filter: "drop-shadow(0 22px 40px rgba(0,0,0,.25))",
            }}
          />
          <div style={{ marginTop: 12, fontWeight: 900, color: "rgba(255,255,255,.95)" }}>
            Safe • Colorful • Kid-friendly
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        {/* BEST SELLERS */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 10,
          }}
        >
          <h2 style={{ fontSize: 40, margin: 0 }}>Best Sellers ⭐</h2>
          <Link
            to="/categories"
            style={{
              fontWeight: 900,
              color: " --k-purple",
              textDecoration: "none",
              fontSize: 18,
            }}
          >
            View all →
          </Link>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 22,
          }}
        >
          {bestSellers.map((p) => (
            <div key={p._id} className="card" style={{ padding: 18 }}>
              {p.image && (
                <img
                  src={`${API}${p.image}`}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: 210,
                    objectFit: "cover",
                    borderRadius: 16,
                    border: "2px solid rgba(43,58,85,.08)",
                    background: "#fff",
                  }}
                />
              )}

<div style={{ color: "var(--muted)", fontWeight: 900, fontSize: 18 }}>
  ${money(p.price)}
</div>

{p.description && (
  <div style={{ marginTop: 6, color: "var(--muted)", fontWeight: 700, fontSize: 14 }}>
    {p.description}
  </div>
)}

              <button
                className="btn btn-teal"
                style={{ width: "100%", marginTop: 12, padding: "14px 14px", fontSize: 16 }}
                onClick={() => add(p)}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>

        {/* NEW ARRIVALS */}
        <h2 className="title-new" style={{ fontSize: 40, marginTop: 70, marginBottom: 0 }}>
  New Arrivals ✨
</h2>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 22,
          }}
        >
          {newArrivals.map((p) => (
            <div key={p._id} className="card" style={{ padding: 18 }}>
              {p.image && (
                <img
                  src={`${API}${p.image}`}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: 210,
                    objectFit: "cover",
                    borderRadius: 16,
                    border: "2px solid rgba(43,58,85,.08)",
                    background: "#fff",
                  }}
                />
              )}

              <div style={{ marginTop: 12, fontWeight: 900, fontSize: 18 }}>{p.name}</div>
              <div style={{ color: "var(--muted)", fontWeight: 900, fontSize: 18 }}>
                ${money(p.price)}
              </div>
              {p.description && (
  <div style={{ marginTop: 6, color: "var(--muted)", fontWeight: 700, fontSize: 14 }}>
    {p.description}
  </div>
)}

              <button
                className="btn btn-orange"
                style={{ width: "100%", marginTop: 12, padding: "14px 14px", fontSize: 16 }}
                onClick={() => add(p)}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>

        {/* CATEGORIES */}
        <h2 className="title-category" style={{ fontSize: 40, marginTop: 70, marginBottom: 0 }}>
  Shop by Category 🧩
</h2>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 22,
          }}
        >
          {categories.map((c) => (
  <Link
    key={c._id}
    to={`/categories?categoryId=${c._id}`}
    style={{
      textDecoration: "none",
      color: "inherit",
      textAlign: "center",
    }}
  >
    <div className="categoryCircleImage">
      {c.image && (
        <img
          src={`${API}${c.image}`}
          alt={c.name}
        />
      )}
    </div>

    <div className="categoryLabel">
      {c.name}
    </div>
  </Link>
))}
        </div>
      </div>
    </div>
  );
}