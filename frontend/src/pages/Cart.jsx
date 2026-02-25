import { useEffect, useMemo, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5050";

function money(n) {
  return Number(n).toFixed(2);
}

export default function Cart() {
  const { items, setQty, remove, clear } = useCart();
  const [settings, setSettings] = useState({ shippingFee: 0, taxPercent: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  const subtotal = useMemo(() => {
    // use finalPrice if discount exists, else price
    return items.reduce((sum, it) => {
      const unit = Number(it.finalPrice ?? it.price ?? 0);
      return sum + unit * it.qty;
    }, 0);
  }, [items]);

  const shipping = Number(settings.shippingFee || 0);
  const tax = (subtotal * Number(settings.taxPercent || 0)) / 100;
  const total = subtotal + shipping + tax;

  return (
    <div style={{ padding: 24 }}>
      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <>
          {items.map((it) => {
            const unit = Number(it.finalPrice ?? it.price ?? 0);
            const hasDiscount = Number(it.discountPercent || 0) > 0;

            return (
              <div
                key={it.productId}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  padding: "12px 0",
                }}
              >
                {it.image && <img src={`${API}${it.image}`} alt={it.name} width={60} />}

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>{it.name}</div>

                  {!hasDiscount ? (
                    <div>${money(it.price)}</div>
                  ) : (
                    <div>
                      <span style={{ textDecoration: "line-through", color: "#777" }}>
                        ${money(it.price)}
                      </span>
                      <span style={{ marginLeft: 8, color: "crimson", fontWeight: "bold" }}>
                        -{it.discountPercent}%
                      </span>
                      <div style={{ fontWeight: "bold" }}>${money(unit)}</div>
                    </div>
                  )}
                </div>

                <input
                  type="number"
                  min="1"
                  value={it.qty}
                  onChange={(e) => setQty(it.productId, Number(e.target.value))}
                  style={{ width: 60 }}
                />

                <div style={{ width: 100, textAlign: "right" }}>
                  ${money(unit * it.qty)}
                </div>

                <button onClick={() => remove(it.productId)} style={{ color: "crimson" }}>
                  Remove
                </button>
              </div>
            );
          })}

          <div
            style={{
              marginTop: 20,
              maxWidth: 380,
              marginLeft: "auto",
              border: "1px solid #ddd",
              padding: 16,
            }}
          >
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>${money(subtotal)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Shipping</span>
              <span>${money(shipping)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tax ({settings.taxPercent || 0}%)</span>
              <span>${money(tax)}</span>
            </div>

            <hr />

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 18 }}>
              <span>Total</span>
              <span>${money(total)}</span>
            </div>

            <button
  style={{ marginTop: 12, width: "100%" }}
  onClick={() => navigate("/checkout")}
>
  Checkout
</button>

            <button style={{ marginTop: 8, width: "100%" }} onClick={clear}>
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}