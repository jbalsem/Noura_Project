import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const API = "http://localhost:5050";

function money(n) {
  return Number(n || 0).toFixed(2);
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
      return sum + unit * Number(it.qty || 1);
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

      clear();
      navigate("/checkout-success", { state: { orderId: data.orderId } });

    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  }

  // 💜 Lavender Theme
  const C = {
    bg: "#F3F0FF",
    card: "#FFFFFF",
    border: "#D9D2FF",
    text: "#5B4DBA",
    sub: "#7B6FE0",
    soft: "#F8F6FF",
    primary: "#8E7BFF",
    primary2: "#A695FF",
    highlightBg: "#EEE9FF",
    highlightBorder: "#CFC6FF",
    errorBg: "#F6EFFF",
    errorBorder: "#D8CCFF",
  };

  const page = { minHeight: "100vh", background: C.bg, padding: 24 };
  const wrap = { maxWidth: 1000, margin: "0 auto" };

  const card = {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    boxShadow: "0 12px 28px rgba(140,130,255,0.18)",
  };

  const inputStyle = {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    background: C.soft,
    color: C.text,
    fontWeight: 600,
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: C.sub,
    marginBottom: 6,
  };

  const btnPrimary = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 16,
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 16,
    color: "#ffffff",
    background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
    boxShadow: "0 10px 20px rgba(140,130,255,0.25)",
  };

  const btnSoft = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    cursor: "pointer",
    fontWeight: 700,
    background: C.soft,
    color: C.text,
  };

  return (
    <div style={page}>
      <div style={wrap}>

        {/* Header */}
        <div style={{ ...card, padding: 16, marginBottom: 16, background: `linear-gradient(180deg, #FFFFFF, ${C.soft})` }}>
          <h1 style={{ margin: 0, color: C.text, fontSize: 34 }}>
            ✨ Checkout
          </h1>

          <div style={{ marginTop: 6, color: C.sub, fontWeight: 600 }}>
            You're one step away from happiness 🎁
          </div>

          <div
            style={{
              marginTop: 12,
              background: C.highlightBg,
              border: `1px solid ${C.highlightBorder}`,
              borderRadius: 14,
              padding: 12,
              color: C.text,
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            🚚 Payment is upon delivery <br />
            🇱🇧 We ship all over Lebanon
          </div>

          {err && (
            <div
              style={{
                marginTop: 12,
                background: C.errorBg,
                border: `1px solid ${C.errorBorder}`,
                padding: 12,
                borderRadius: 14,
                color: C.text,
                fontWeight: 700,
              }}
            >
              {err}
            </div>
          )}
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 18,
          }}
        >

          {/* Form */}
          <form onSubmit={submit} style={{ ...card, padding: 16 }}>
            <h2 style={{ marginTop: 0, color: C.text }}>Delivery Details</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>First name</label>
                <input name="firstName" value={form.firstName} onChange={onChange} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Last name</label>
                <input name="lastName" value={form.lastName} onChange={onChange} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" value={form.email} onChange={onChange} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Phone</label>
                <input name="phone" value={form.phone} onChange={onChange} style={inputStyle} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Home address</label>
                <input name="address" value={form.address} onChange={onChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
              <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Placing order..." : "Place Order"}
              </button>

              <button type="button" onClick={() => navigate("/cart")} style={btnSoft}>
                Back to Cart
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div style={{ ...card, padding: 16 }}>
            <h2 style={{ marginTop: 0, color: C.text }}>Your Order</h2>

            {items.map((it) => {
              const unit = Number(it.finalPrice ?? it.price ?? 0);
              return (
                <div
                  key={it.productId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 10,
                    borderRadius: 14,
                    background: C.soft,
                    border: `1px solid ${C.border}`,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: C.text }}>
                    {it.name} × {it.qty}
                  </span>
                  <span style={{ color: C.text, fontWeight: 700 }}>
                    ${money(unit * it.qty)}
                  </span>
                </div>
              );
            })}

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 800,
                color: C.text,
              }}
            >
              <span>Subtotal</span>
              <span>${money(subtotal)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}