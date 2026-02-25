import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";

const API = "http://localhost:5050";

function money(n) {
  return Number(n || 0).toFixed(2);
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
    <div className="page theme-deals">
      <div className="container" style={{ paddingTop: 26, paddingBottom: 60 }}>
        {/* Fun header */}
        <div className="dealsHeader">
          <div className="dealsTitleRow">
            <div className="dealsEmoji">🧡</div>
            <h1 className="dealsTitle">Super Deals!</h1>
            <div className="dealsEmoji">💛</div>
          </div>

          <div className="dealsSub">
            Big smiles • Small prices • Limited-time fun 🎉
          </div>
        </div>

        {/* Empty state */}
        {deals.length === 0 ? (
          <div className="dealsEmpty">
            <div className="dealsEmptyIcon">🛍️</div>
            <div style={{ fontWeight: 900, fontSize: 20 }}>No deals right now.</div>
            <div style={{ opacity: 0.85, fontWeight: 800 }}>
              Check back soon for new surprises!
            </div>
          </div>
        ) : (
          <div className="dealsGrid">
            {deals.map((p) => {
              const discount = Number(p.discountPercent || 0);
              const original = Number(p.price || 0);
              const newPrice = original * (1 - discount / 100);

              return (
                <div key={p._id} className="dealsCard">
                  {/* Badge */}
                  <div className="dealBadge">
                    🔥 {discount}% OFF
                  </div>

                  {p.image && (
                    <img
                      className="dealImg"
                      src={`${API}${p.image}`}
                      alt={p.name}
                    />
                  )}

                  <div className="dealName">{p.name}</div>

                  <div className="dealPrices">
                    <span className="dealOld">${money(original)}</span>
                    <span className="dealNew">${money(newPrice)}</span>
                  </div>

                  {p.description ? (
                    <div className="dealDesc">{p.description}</div>
                  ) : (
                    <div className="dealDesc" style={{ opacity: 0.7 }}>
                      A fun toy at a fun price ✨
                    </div>
                  )}

                  <button className="btn btn-orange dealBtn" onClick={() => add(p)}>
                    Add to cart 🛒
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}