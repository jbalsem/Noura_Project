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

  const [heroSlides, setHeroSlides] = useState([]);
const [slideIndex, setSlideIndex] = useState(0);

useEffect(() => {
  fetch(`${API}/api/hero-slides`)
    .then((r) => r.json())
    .then(setHeroSlides)
    .catch(console.error);
}, []);

useEffect(() => {
  if (!heroSlides.length) return;
  const t = setInterval(() => {
    setSlideIndex((i) => (i + 1) % heroSlides.length);
  }, 4000);
  return () => clearInterval(t);
}, [heroSlides]);

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
      <section className="k-hero">
  {/* slideshow bg */}
  <div className="k-hero-slides">
    {heroSlides.map((s, i) => (
      <div
        key={s._id}
        className={`k-hero-slide ${i === slideIndex ? "is-active" : ""}`}
        style={{
          backgroundImage: `url(${API}${s.image})`,
        }}
      />
    ))}
  </div>

  {/* overlay content (bottom-right like screenshot) */}
  <div className="k-hero-overlay">
  <div className="k-hero-panel">
    {/* ✅ LOGO moved to top */}
    <div className="k-hero-badge">🎁 Fun toys • Happy kids</div>
    <div className="k-hero-logoTop" style={{ display: "flex", justifyContent: "flex-end" }}>
      <img
        src={logo}
        alt="Kidooze logo"
        style={{
          width: 400,
          maxWidth: "45vw",
          filter: "drop-shadow(0 14px 26px rgba(0,0,0,.25))",
          marginBottom: 10,
        }}
      />
    </div>

   

    <h1 className="rainbowTitle" style={{ marginTop: 10 }}>
      <span className="c1">PLAY.</span>{" "}
      <span className="c2">DISCOVER.</span>
      <br />
      <span className="c4">IMAGINE.</span>
    </h1>

    <p className="k-hero-text">
      Discover best sellers, new arrivals, and colorful categories. Add to cart in one tap and
      we’ll confirm your order on WhatsApp.
    </p>

    <div className="k-hero-actions">
      <Link to="/categories" className="k-hero-btn primary">Shop Categories</Link>
      <Link to="/deals" className="k-hero-btn ghost">See Deals</Link>
      <Link to="/locations" className="k-hero-btn ghost">Find Stores</Link>
    </div>

    <div style={{ marginTop: 10, fontWeight: 900, color: "rgba(255,255,255,.95)" }}>
      Safe • Colorful • Kid-friendly
    </div>
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
          <h2 className="title-best" style={{ fontSize: 40, margin: 0 }}>
  Best Sellers ⭐
</h2>
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