import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const API = "http://localhost:5050";

export default function Categories() {
  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");

  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(categoryIdFromUrl || "");
  const [products, setProducts] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [age, setAge] = useState("");

  const { add } = useCart();

  useEffect(() => {
    if (categoryIdFromUrl) setSelected(categoryIdFromUrl);
  }, [categoryIdFromUrl]);

  useEffect(() => {
    fetch(`${API}/api/categories`).then((r) => r.json()).then(setCategories);
  }, []);

  async function loadProducts(categoryId) {
    const params = new URLSearchParams();

    const finalCategoryId = categoryId || categoryIdFromUrl || "";
    if (finalCategoryId) params.set("categoryId", finalCategoryId);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (age) params.set("age", age);

    const qs = params.toString();
    const url = `${API}/api/products${qs ? `?${qs}` : ""}`;

    console.log("FETCH:", url);

    const res = await fetch(url);
    setProducts(await res.json());
  }

  // ✅ load all products at start, and reload when category changes
  useEffect(() => {
    loadProducts(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const kidInput = {
    padding: "12px 12px",
    borderRadius: 16,
    border: "2px solid rgba(43,58,85,.10)",
    background: "rgba(255,255,255,.95)",
    fontWeight: 900,
    outline: "none",
    minWidth: 140,
  };

  return (
    <div className="page theme-kidpurple">
      <div style={{ padding: 24 }}>
        {/* Big fun header */}
        <h1
          style={{
            fontSize: "clamp(44px, 5vw, 72px)",
            margin: "10px 0 8px",
            color: "var(--k-purple)",
            textShadow: "0 10px 28px rgba(0,0,0,.10)",
          }}
        >
          Categories 🧩
        </h1>
  
        <div
          style={{
            fontSize: "clamp(18px, 2vw, 24px)",
            fontWeight: 800,
            color: "rgba(43,58,85,.85)",
            marginBottom: 22,
          }}
        >
          Pick a category and find your next favorite toy!
        </div>
  
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          {/* LEFT: Big fun category picker */}
          <div
            className="card"
            style={{
              minWidth: 260,
              padding: 16,
              borderRadius: 22,
              background: "rgba(255,255,255,.92)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "var(--k-purple)", fontSize: 22 }}>
  Pick a category
</h3>

<div style={{ display: "grid", gap: 10 }}>

  {/* ✅ ALL PRODUCTS BUTTON */}
  <button
    onClick={() => {
      setSelected("");      // remove category filter
      loadProducts("");     // load ALL products
    }}
    style={{
      width: "100%",
      textAlign: "left",
      padding: "14px 14px",
      borderRadius: 16,
      border: selected === ""
        ? "2px solid rgba(84,176,167,.55)"
        : "2px solid rgba(43,58,85,.08)",
      background: selected === ""
        ? "rgba(84,176,167,.16)"
        : "rgba(255,255,255,.85)",
      fontWeight: 900,
      fontSize: 16,
      cursor: "pointer",
    }}
  >
    🌈 All Products
  </button>

  {/* EXISTING CATEGORIES */}
  {categories.map(c => {
    const active = selected === c._id;

    return (
      <button
        key={c._id}
        onClick={() => {
          setSelected(c._id);
          loadProducts(c._id);
        }}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "14px 14px",
          borderRadius: 16,
          border: active
            ? "2px solid rgba(177,61,196,.55)"
            : "2px solid rgba(43,58,85,.08)",
          background: active
            ? "rgba(177,61,196,.16)"
            : "rgba(255,255,255,.85)",
          fontWeight: 900,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {c.name}
      </button>
    );
  })}
</div>
          </div>
  
          {/* RIGHT: Filters + Products */}
          <div style={{ flex: 1 }}>
            {/* Filters (big + fun) */}
            <div
              className="card"
              style={{
                padding: 16,
                borderRadius: 22,
                background: "rgba(255,255,255,.92)",
              }}
            >
              <h3 style={{ marginTop: 0, color: "var(--k-purple)", fontSize: 22 }}>
                Filters 🎛️
              </h3>
  
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={kidInput}
                />
                <input
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={kidInput}
                />
                <input
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={kidInput}
                />
  
  <button
  className="btn btn-purple"
  onClick={() => loadProducts(selected)}
  style={{
    padding: "12px 16px",
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 900,
  }}
>
  Apply
</button>
              </div>
            </div>
  
            {/* Products */}
            <div style={{ marginTop: 18 }}>
              <h3 style={{ margin: "0 0 10px", color: "var(--k-purple)", fontSize: 24 }}>
                Products 🧸
              </h3>
  
              {!selected && (
                <div style={{ fontWeight: 900, color: "rgba(43,58,85,.75)" }}>
                  Select a category to view products.
                </div>
              )}
  
              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 18,
                }}
              >
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="card"
                    style={{
                      padding: 14,
                      borderRadius: 22,
                      background: "rgba(255,255,255,.92)",
                      transition: "transform .12s ease, filter .2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {p.image && (
                      <img
                        src={`${API}${p.image}`}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 18,
                          border: "2px solid rgba(43,58,85,.08)",
                          background: "#fff",
                        }}
                      />
                    )}
  
                    <div style={{ marginTop: 10, fontWeight: 900, fontSize: 18 }}>
                      {p.name}
                    </div>
  
                    <div style={{ fontWeight: 900, fontSize: 18, color: "var(--muted)" }}>
                      ${Number(p.price || 0).toFixed(2)}
                    </div>

                    {p.description && (
  <div
    style={{
      marginTop: 6,
      color: "rgba(43,58,85,.75)",
      fontWeight: 800,
      fontSize: 13,
      lineHeight: 1.35,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }}
  >
    {p.description}
  </div>
)}
  
                    <div style={{ marginTop: 6, fontSize: 13, fontWeight: 900, color: "rgba(43,58,85,.75)" }}>
                      Age {p.ageMin}-{p.ageMax}
                    </div>
  
                    <button
                      className="btn btn-teal"
                      onClick={() => add(p)}
                      style={{ marginTop: 10, width: "100%", padding: "12px 14px", borderRadius: 16 }}
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}