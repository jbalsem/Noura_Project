import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";

const API = "http://localhost:5050";



function money(n) {
  return Number(n).toFixed(2);
}

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    fetch(`${API}/api/products/deals`)
      .then((r) => r.json())
      .then(setDeals)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Deals</h1>

      {deals.length === 0 && <div>No deals right now.</div>}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {deals.map((p) => {
          const discount = Number(p.discountPercent || 0);
          const original = Number(p.price);
          const newPrice = original * (1 - discount / 100);

        
         

          return (
            <div key={p._id} style={{ border: "1px solid #ddd", padding: 12, width: 240 }}>
              {p.image && <img src={`${API}${p.image}`} alt={p.name} width={220} />}
              <div style={{ marginTop: 8, fontWeight: "bold" }}>{p.name}</div>

              <div style={{ marginTop: 6 }}>
                <span style={{ textDecoration: "line-through", color: "#777" }}>
                  ${money(original)}
                </span>
                <span style={{ marginLeft: 8, color: "crimson", fontWeight: "bold" }}>
                  -{discount}%
                </span>
              </div>

              <div style={{ fontSize: 20, fontWeight: "bold", marginTop: 4 }}>
                ${money(newPrice)}
              </div>
              <button onClick={() => add(p)} style={{ marginTop: 8 }}>
  Add to cart
</button>
              
            </div>
          );
          
        })}
      </div>
    </div>
  );
}