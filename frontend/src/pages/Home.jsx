import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";


const API = "http://localhost:5050";

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    fetch(`${API}/api/products?section=bestSeller`)
      .then(r => r.json())
      .then(setBestSellers)
      .catch(console.error);
  
    fetch(`${API}/api/products?section=newArrival`)
      .then(r => r.json())
      .then(setNewArrivals)
      .catch(console.error);
  
    fetch(`${API}/api/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Toy Store</h1>

      <h2>Best Sellers</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {bestSellers.map(p => (
          <div key={p._id} style={{ border: "1px solid #ddd", padding: 12, width: 200 }}>
            {p.image && <img src={`${API}${p.image}`} alt={p.name} width={180} />}
            <div><b>{p.name}</b></div>
            <div>${p.price}</div>
            <button onClick={() => add(p)} style={{ marginTop: 8 }}>
  Add to cart
</button>
          </div>

        ))}
      </div>

      <h2 style={{ marginTop: 24 }}>New Arrivals</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {newArrivals.map(p => (
          <div key={p._id} style={{ border: "1px solid #ddd", padding: 12, width: 200 }}>
            {p.image && <img src={`${API}${p.image}`} alt={p.name} width={180} />}
            <div><b>{p.name}</b></div>
            <div>${p.price}</div>
            <button onClick={() => add(p)} style={{ marginTop: 8 }}>
  Add to cart
</button>
          </div>
        ))}
        
      </div>
      <h2 style={{ marginTop: 40 }}>Shop by Category</h2>

<div style={{
  display: "flex",
  gap: 16,
  flexWrap: "wrap"
}}>
  {categories.map((c) => (
    <Link
      key={c._id}
      to={`/categories?categoryId=${c._id}`}
      style={{
        border: "1px solid #ddd",
        padding: 12,
        width: 200,
        textDecoration: "none",
        color: "inherit"
      }}
    >
      {c.image && (
        <img
          src={`http://localhost:5050${c.image}`}
          alt={c.name}
          width={180}
        />
      )}
      <div style={{ marginTop: 8, fontWeight: "bold" }}>
        {c.name}
      </div>
    </Link>
  ))}
</div>
    </div>
  );
}