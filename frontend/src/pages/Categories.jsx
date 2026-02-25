import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const API = "http://localhost:5050";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [products, setProducts] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [age, setAge] = useState("");

  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");

  const { add } = useCart();

  useEffect(() => {
    fetch(`${API}/api/categories`).then(r => r.json()).then(setCategories);
  }, []);

  async function loadProducts(categoryId) {
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (age) params.set("age", age);
    if (categoryIdFromUrl) {
        params.set("categoryId", categoryIdFromUrl);
      }

    const res = await fetch(`${API}/api/products?${params.toString()}`);
    setProducts(await res.json());
  }

  useEffect(() => {
    if (selected) loadProducts(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Categories</h1>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ minWidth: 200 }}>
          <h3>Pick a category</h3>
          {categories.map(c => (
            <button
              key={c._id}
              onClick={() => setSelected(c._id)}
              style={{ display: "block", width: "100%", marginBottom: 8 }}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <h3>Filters</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <button onClick={() => loadProducts(selected)} disabled={!selected}>Apply</button>
          </div>

          <h3>Products</h3>
          {!selected && <div>Select a category to view products.</div>}

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {products.map(p => (
              <div key={p._id} style={{ border: "1px solid #ddd", padding: 12, width: 200 }}>
                {p.image && <img src={`${API}${p.image}`} alt={p.name} width={180} />}
                <div><b>{p.name}</b></div>
                <div>${p.price}</div>
                <button onClick={() => add(p)} style={{ marginTop: 8 }}>
  Add to cart
</button>
                <div style={{ fontSize: 12 }}>Age {p.ageMin}-{p.ageMax}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}