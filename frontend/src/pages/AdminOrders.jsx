import { useEffect, useState } from "react";

const API = "http://localhost:5050";

function money(n) {
  return Number(n || 0).toFixed(2);
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`${API}/api/admin/orders`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    // Optimistic update
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));

    const res = await fetch(`${API}/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      alert("Failed to update status");
      load();
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin — Orders</h1>

      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => (
            <div
              key={o._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>Order #{o._id}</div>
                  <div style={{ color: "#666" }}>
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label style={{ marginRight: 8, fontWeight: "bold" }}>Status:</label>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    <option value="received">Received</option>
                    <option value="delivered">Delivered</option>
                    <option value="returned">Returned</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>

              <hr style={{ margin: "12px 0" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>Customer</div>
                  <div>{o.customer?.firstName} {o.customer?.lastName}</div>
                  <div>{o.customer?.email}</div>
                  <div>{o.customer?.phone}</div>
                  <div>{o.customer?.address}</div>
                </div>

                <div>
                  <div style={{ fontWeight: "bold" }}>Summary</div>
                  <div>Subtotal: ${money(o.pricing?.subtotal)}</div>
                  <div>Shipping: ${money(o.pricing?.shipping)}</div>
                  <div>Tax: ${money(o.pricing?.tax)}</div>
                  <div style={{ fontWeight: "bold", marginTop: 6 }}>
                    Total: ${money(o.pricing?.total)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: "bold" }}>Items</div>
                <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
                  {o.items?.map((it, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{it.name} × {it.qty}</span>
                      <span>${money((it.finalPrice ?? it.price) * it.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}