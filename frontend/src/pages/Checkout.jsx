import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const API = "http://localhost:5050";

function money(n) {
  return Number(n).toFixed(2);
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clear } = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const unit = Number(it.finalPrice ?? it.price ?? 0);
      return sum + unit * it.qty;
    }, 0);
  }, [items]);

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (items.length === 0) {
      setErr("Your cart is empty.");
      return;
    }

    // basic validation
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.phone) {
      setErr("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ customer: form, items }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");

      // clear cart + go to success page
      clear();

      // Optional: if backend returns a whatsappLink fallback, open it in new tab
      if (data.whatsappLink) window.open(data.whatsappLink, "_blank");

      navigate("/checkout-success", { state: { orderId: data.orderId } });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Checkout</h1>

      {err && (
        <div style={{ background: "#ffe5e5", padding: 10, borderRadius: 8, marginBottom: 12 }}>
          {err}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <form onSubmit={submit} style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label>First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                style={{ width: "100%", padding: 10 }}
              />
            </div>

            <div>
              <label>Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                style={{ width: "100%", padding: 10 }}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                style={{ width: "100%", padding: 10 }}
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="+1 555 555 5555"
                style={{ width: "100%", padding: 10 }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label>Home address</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                style={{ width: "100%", padding: 10 }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 10,
            }}
          >
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            {items.map((it) => {
              const unit = Number(it.finalPrice ?? it.price ?? 0);
              return (
                <div key={it.productId} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span>${money(unit * it.qty)}</span>
                </div>
              );
            })}

            <hr />

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <span>Subtotal</span>
              <span>${money(subtotal)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 12, width: "100%", padding: 12 }}
            >
              {loading ? "Placing order..." : "Place order"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              style={{ marginTop: 8, width: "100%", padding: 12 }}
            >
              Back to cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}