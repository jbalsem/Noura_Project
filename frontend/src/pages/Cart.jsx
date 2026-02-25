import { useEffect, useMemo, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5050";

function money(n) {
  return Number(n || 0).toFixed(2);
}

function ConfettiOverlay({ show }) {
  const pieces = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 90; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        dur: 0.9 + Math.random() * 0.9,
        size: 6 + Math.random() * 10,
        rotate: Math.random() * 360,
        drift: (Math.random() * 80 - 40).toFixed(1),
        color: ["#7BC7FF", "#A7E1FF", "#FFD36B", "#FF9EDB", "#B8F2E6", "#9DB7FF"][
          Math.floor(Math.random() * 6)
        ],
      });
    }
    return arr;
  }, [show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes confettiFall {
            0%   { transform: translate3d(0,-20px,0) rotate(0deg); opacity: 0; }
            10%  { opacity: 1; }
            100% { transform: translate3d(var(--drift), 110vh, 0) rotate(720deg); opacity: 0.95; }
          }
        `}
      </style>

      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 4,
            opacity: 0,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.dur}s ease-out ${p.delay}s forwards`,
            ["--drift"]: `${p.drift}px`,
            boxShadow: "0 6px 14px rgba(120,180,255,0.25)",
          }}
        />
      ))}
    </div>
  );
}

export default function Cart() {
  const { items, setQty, remove, clear } = useCart();
  const [settings, setSettings] = useState({ shippingFee: 0, taxPercent: 0 });
  const [confetti, setConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const unit = Number(it.finalPrice ?? it.price ?? 0);
      return sum + unit * Number(it.qty || 1);
    }, 0);
  }, [items]);

  const shipping = Number(settings.shippingFee || 0);
  const tax = (subtotal * Number(settings.taxPercent || 0)) / 100;
  const total = subtotal + shipping + tax;

  const savings = useMemo(() => {
    return items.reduce((sum, it) => {
      const base = Number(it.price ?? 0);
      const unit = Number(it.finalPrice ?? it.price ?? 0);
      const qty = Number(it.qty || 1);
      return sum + Math.max(0, (base - unit) * qty);
    }, 0);
  }, [items]);

  // Colors (no black / no very dark)
  const C = {
    bg: "#EAF6FF",
    text: "#1C5FA8",
    sub: "#3B82C4",
    border: "#BFE2FF",
    card: "#FFFFFF",
    soft: "#F3FBFF",
    primary: "#49A8FF",
    primary2: "#6BC5FF",
    danger: "#FF5FA2",
    warn: "#FFD36B",
  };

  const page = { padding: 24, background: C.bg, minHeight: "100vh" };
  const wrap = { maxWidth: 1100, margin: "0 auto" };

  const card = {
    border: `1px solid ${C.border}`,
    borderRadius: 18,
    background: C.card,
    boxShadow: "0 10px 28px rgba(80,160,255,0.14)",
  };

  const layout = {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 16,
    alignItems: "start",
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
    boxShadow: "0 10px 20px rgba(80,160,255,0.25)",
  };

  const btnSoft = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    cursor: "pointer",
    fontWeight: 800,
    background: C.soft,
    color: C.text,
  };

  const pill = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: `1px solid ${C.border}`,
    borderRadius: 999,
    padding: "8px 12px",
    background: C.card,
    fontSize: 13,
    color: C.text,
  };

  function handleCheckout() {
    setConfetti(true);
    // Show confetti briefly then navigate
    setTimeout(() => navigate("/checkout"), 650);
  }

  return (
    <div style={page}>
      <ConfettiOverlay show={confetti} />

      <div style={wrap}>
        <div
          style={{
            ...card,
            padding: 16,
            marginBottom: 16,
            background: `linear-gradient(180deg, #FFFFFF, ${C.soft})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 34, color: C.text }}>
                🛒 Your Kidooze Cart
              </h1>
              <div style={{ marginTop: 4, color: C.sub, fontWeight: 700 }}>
                Fun stuff inside! ✨
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={pill}>
                🧸 Items:{" "}
                <b>{items.reduce((s, it) => s + Number(it.qty || 1), 0)}</b>
              </span>
              {savings > 0 ? (
                <span style={{ ...pill, borderColor: "#FFE59A" }}>
                  🎉 You saved <b>${money(savings)}</b>
                </span>
              ) : (
                <span style={pill}>💛 Deals = savings!</span>
              )}
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>
              Your cart is empty 🧺
            </div>
            <div style={{ color: C.sub, marginTop: 6, fontWeight: 700 }}>
              Let’s add something fun!
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button style={btnPrimary} onClick={() => navigate("/categories")}>
                Explore Categories
              </button>

              <Link
                to="/"
                style={{
                  ...btnSoft,
                  textAlign: "center",
                  textDecoration: "none",
                  display: "inline-block",
                  lineHeight: "20px",
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div style={layout}>
            {/* LEFT */}
            <div style={{ ...card, padding: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <h2 style={{ margin: 0, color: C.text }}>Your goodies 🎁</h2>
                <button
                  onClick={clear}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: C.danger,
                    cursor: "pointer",
                    fontWeight: 900,
                  }}
                >
                  Clear cart
                </button>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                {items.map((it) => {
                  const unit = Number(it.finalPrice ?? it.price ?? 0);
                  const base = Number(it.price ?? 0);
                  const hasDiscount = Number(it.discountPercent || 0) > 0 && unit < base;

                  return (
                    <div
                      key={it.productId}
                      style={{
                        border: `1px solid ${C.border}`,
                        borderRadius: 16,
                        background: C.card,
                        padding: 12,
                        display: "grid",
                        gridTemplateColumns: "80px 1fr auto",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      {it.image ? (
                        <img
                          src={`${API}${it.image}`}
                          alt={it.name}
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: 16,
                            objectFit: "cover",
                            border: `1px solid ${C.border}`,
                            background: C.soft,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: 16,
                            border: `1px solid ${C.border}`,
                            background: C.soft,
                            display: "grid",
                            placeItems: "center",
                            color: C.sub,
                            fontWeight: 900,
                          }}
                        >
                          🧸
                        </div>
                      )}

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 900,
                            fontSize: 16,
                            color: C.text,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {it.name}
                        </div>

                        {!hasDiscount ? (
                          <div style={{ marginTop: 4, color: C.sub, fontWeight: 800 }}>
                            ${money(base)}
                          </div>
                        ) : (
                          <div style={{ marginTop: 4 }}>
                            <span style={{ textDecoration: "line-through", color: "#7AAFE0", marginRight: 8 }}>
                              ${money(base)}
                            </span>
                            <span style={{ color: C.danger, fontWeight: 900 }}>
                              -{it.discountPercent}%
                            </span>
                            <div style={{ fontWeight: 900, color: C.text }}>
                              ${money(unit)}
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              padding: 8,
                              borderRadius: 999,
                              border: `1px solid ${C.border}`,
                              background: C.soft,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setQty(it.productId, Math.max(1, Number(it.qty || 1) - 1))}
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 999,
                                border: `1px solid ${C.border}`,
                                background: "#fff",
                                cursor: "pointer",
                                fontSize: 18,
                                color: C.text,
                                fontWeight: 900,
                              }}
                            >
                              −
                            </button>

                            <div style={{ minWidth: 26, textAlign: "center", fontWeight: 900, color: C.text }}>
                              {it.qty}
                            </div>

                            <button
                              type="button"
                              onClick={() => setQty(it.productId, Number(it.qty || 1) + 1)}
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 999,
                                border: `1px solid ${C.border}`,
                                background: "#fff",
                                cursor: "pointer",
                                fontSize: 18,
                                color: C.text,
                                fontWeight: 900,
                              }}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => remove(it.productId)}
                            style={{
                              border: "none",
                              background: "transparent",
                              color: C.danger,
                              cursor: "pointer",
                              fontWeight: 900,
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#6EA9DA", fontSize: 12, fontWeight: 800 }}>Item total</div>
                        <div style={{ fontWeight: 900, fontSize: 16, color: C.text }}>
                          ${money(unit * Number(it.qty || 1))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <button style={btnSoft} onClick={() => navigate("/categories")}>
                  ➕ Add more toys
                </button>
                <button style={btnSoft} onClick={() => navigate("/deals")}>
                  🎯 Check deals
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div
              style={{
                ...card,
                padding: 16,
                position: "sticky",
                top: 16,
                background: `linear-gradient(180deg, #FFFFFF, ${C.soft})`,
              }}
            >
              <h2 style={{ marginTop: 0, color: C.text }}>Order Summary ✨</h2>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: C.text, fontWeight: 800 }}>
                <span>Subtotal</span>
                <span>${money(subtotal)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: C.text, fontWeight: 800 }}>
                <span>Shipping</span>
                <span>${money(shipping)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: C.text, fontWeight: 800 }}>
                <span>Tax ({Number(settings.taxPercent || 0)}%)</span>
                <span>${money(tax)}</span>
              </div>

              <hr style={{ margin: "12px 0", borderColor: C.border }} />

              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18, color: C.text }}>
                <span>Total</span>
                <span>${money(total)}</span>
              </div>

              <div style={{ marginTop: 10, fontSize: 13, color: C.sub, fontWeight: 800, lineHeight: 1.4 }}>
                {savings > 0 ? (
                  <>🎉 You’re saving ${money(savings)} with discounts!</>
                ) : (
                  <>💛 Tip: check “Deals” for discounts.</>
                )}
              </div>

              <button style={{ ...btnPrimary, marginTop: 12 }} onClick={handleCheckout}>
                ✅ Checkout
              </button>

              <button style={{ ...btnSoft, marginTop: 10 }} onClick={() => navigate("/")}>
                🏠 Continue shopping
              </button>

              <div style={{ marginTop: 12, fontSize: 12, color: "#5D9BD6", fontWeight: 700, lineHeight: 1.4 }}>
                We’ll confirm your order and contact you on WhatsApp 💬
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}