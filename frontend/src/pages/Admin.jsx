import { useEffect, useState } from "react";

const API = "http://localhost:5050";

export default function Admin() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
const [editProduct, setEditProduct] = useState({
  name: "",
  price: "",
  description: "",
  categoryId: "",
  ageMin: "0",
  ageMax: "99",
  isBestSeller: false,
  isNewArrival: false,
  discountPercent: "0",
});




  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [ageMin, setAgeMin] = useState("0");
  const [ageMax, setAgeMax] = useState("99");
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [image, setImage] = useState(null);

  const [locations, setLocations] = useState([]);

  const [locName, setLocName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
const [editLoc, setEditLoc] = useState({
  name: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  hours: "",
  mapUrl: "",
});

const [discountPercent, setDiscountPercent] = useState("0");

const [shippingFee, setShippingFee] = useState("5");
const [taxPercent, setTaxPercent] = useState("8");

const [orders, setOrders] = useState([]);
const [stats, setStats] = useState(null);


  async function loadCategories() {
    const res = await fetch(`${API}/api/categories`, {
      credentials: "include",
    });
    setCategories(await res.json());
  }
  
  async function loadProducts() {
    const res = await fetch(`${API}/api/products`, {
      credentials: "include",
    });
    setProducts(await res.json());
  }

  

  async function addProduct() {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", price);
    fd.append("discountPercent", discountPercent);
    fd.append("description", description);
    fd.append("categoryId", categoryId);
    fd.append("ageMin", ageMin);
    fd.append("ageMax", ageMax);
    fd.append("isBestSeller", String(isBestSeller));
    fd.append("isNewArrival", String(isNewArrival));
    if (image) fd.append("image", image);

    const res = await fetch(`${API}/api/products`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
    
      const text = await res.text();
      if (!res.ok) {
        alert(`Add product failed (${res.status}): ${text}`);
        return;
      }
    

    // reset
    setName("");
    setPrice("");

    setDiscountPercent("0");

    setDescription("");
    setCategoryId("");
    setAgeMin("0");
    setAgeMax("99");
    setIsBestSeller(false);
    setIsNewArrival(false);
    setImage(null);

    loadProducts();
  }
  function startEditProduct(p) {
    setEditingProductId(p._id);
    setEditProduct({
      name: p.name || "",
      price: String(p.price ?? ""),
      description: p.description || "",
      categoryId: p.categoryId || "",
      ageMin: String(p.ageMin ?? "0"),
      ageMax: String(p.ageMax ?? "99"),
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNewArrival,
      discountPercent: String(p.discountPercent ?? "0"),
    });
  }
  
  function cancelEditProduct() {
    setEditingProductId(null);
  }
  
  async function saveEditProduct(id) {
    const res = await fetch(`${API}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...editProduct,
        price: Number(editProduct.price),
        ageMin: Number(editProduct.ageMin),
        ageMax: Number(editProduct.ageMax),
        discountPercent: Number(editProduct.discountPercent || 0),
      }),
    });
  
    const text = await res.text();
    if (!res.ok) {
      alert(`Update product failed (${res.status}): ${text}`);
      return;
    }
  
    setEditingProductId(null);
    loadProducts();
  }
  
  async function deleteProduct(id) {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
  
    const res = await fetch(`${API}/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  
    const text = await res.text();
    if (!res.ok) {
      alert(`Delete product failed (${res.status}): ${text}`);
      return;
    }
  
    loadProducts();
  }

  async function loadSettings() {
    const res = await fetch(`${API}/api/settings`);
    const s = await res.json();
    setShippingFee(String(s.shippingFee ?? 0));
    setTaxPercent(String(s.taxPercent ?? 0));
  }
  
  async function saveSettings() {
    const res = await fetch(`${API}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        shippingFee: Number(shippingFee),
        taxPercent: Number(taxPercent),
      }),
    });
  
    const text = await res.text();
    if (!res.ok) {
      alert(`Save settings failed (${res.status}): ${text}`);
      return;
    }
  
    alert("Settings saved!");
  }


  async function loadLocations() {
    const res = await fetch(`${API}/api/locations`, {
      credentials: "include",
    });
    setLocations(await res.json());
  }
  
  async function addLocation() {
    const res = await fetch(`${API}/api/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: locName,
        address1,
        address2,
        city,
        state: stateProv,
        zip,
        phone,
        hours,
        mapUrl,
      }),
    });
  
    const text = await res.text();
    if (!res.ok) {
      alert(`Add location failed (${res.status}): ${text}`);
      return;
    }
    
  
    // reset
    setLocName("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setStateProv("");
    setZip("");
    setPhone("");
    setHours("");
    setMapUrl("");
  
    loadLocations();
  }
  function startEdit(l) {
    setEditingId(l._id);
    setEditLoc({
      name: l.name || "",
      address1: l.address1 || "",
      address2: l.address2 || "",
      city: l.city || "",
      state: l.state || "",
      zip: l.zip || "",
      phone: l.phone || "",
      hours: l.hours || "",
      mapUrl: l.mapUrl || "",
    });
  }
  
  function cancelEdit() {
    setEditingId(null);
  }
  
  async function saveEdit(id) {
    const res = await fetch(`${API}/api/locations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(editLoc),
    });
  
    const text = await res.text();
    if (!res.ok) {
      alert(`Update failed (${res.status}): ${text}`);
      return;
    }
  
    setEditingId(null);
    loadLocations();
  }
  
  async function deleteLocation(id) {
    const ok = window.confirm("Delete this location?");
    if (!ok) return;
  
    const res = await fetch(`${API}/api/locations/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  
    const text = await res.text();
    if (!res.ok) {
      alert(`Delete failed (${res.status}): ${text}`);
      return;
    }
  
    loadLocations();
  }

  function money(n) {
    return Number(n || 0).toFixed(2);
  }
  
  async function loadOrders() {
    const res = await fetch(`${API}/api/admin/orders`, {
      credentials: "include",
    });
    setOrders(await res.json());
  }
  
  async function loadStats() {
    const res = await fetch(`${API}/api/admin/stats`, {
      credentials: "include",
    });
    setStats(await res.json());
  }
  
  async function updateOrderStatus(orderId, status) {
    // optimistic update
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    );
  
    const res = await fetch(`${API}/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
  
    const text = await res.text();
    if (!res.ok) {
      alert(`Update status failed (${res.status}): ${text}`);
      loadOrders();
      return;
    }
  
    // refresh stats too
    loadStats();
  }
  useEffect(() => {
    loadCategories();
    loadProducts();
    loadLocations();
    loadSettings();

    loadOrders();
  loadStats();
  }, []);
 

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin — Products</h1>
      <div style={{ marginBottom: 16 }}>
  <a href="/admin/categories">Manage Categories</a>
</div>

      <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="number" min="0" max="90"placeholder="Discount % (optional)" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 10 }}>
          <input type="number" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder="Age min" />
          <input type="number" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder="Age max" />
        </div>

        <label>
          <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
          Best Seller
        </label>

        <label>
          <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />
          New Arrival
        </label>

        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <button onClick={addProduct} disabled={!name || !price || !categoryId}>
          Add Product
        </button>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2>All Products</h2>

{products.map((p) => {
  const isEditing = editingProductId === p._id;

  return (
    <div key={p._id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
      {!isEditing ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {p.image && <img src={`${API}${p.image}`} alt={p.name} width={60} />}

          <div style={{ flex: 1 }}>
            <div>
              <b>{p.name}</b> — ${p.price}{" "}
              {Number(p.discountPercent || 0) > 0 && (
                <span style={{ marginLeft: 8, color: "crimson", fontWeight: "bold" }}>
                  -{p.discountPercent}%
                </span>
              )}
            </div>

            <div style={{ fontSize: 12 }}>
              Age {p.ageMin}-{p.ageMax} | BestSeller: {String(p.isBestSeller)} | NewArrival:{" "}
              {String(p.isNewArrival)} | Discount: {p.discountPercent || 0}%
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => startEditProduct(p)}>Edit</button>
              <button onClick={() => deleteProduct(p._id)} style={{ color: "crimson" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
            <input
              placeholder="Name"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            />

            <input
              placeholder="Price"
              value={editProduct.price}
              onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={editProduct.description}
              onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
            />

            <select
              value={editProduct.categoryId}
              onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="number"
                placeholder="Age min"
                value={editProduct.ageMin}
                onChange={(e) => setEditProduct({ ...editProduct, ageMin: e.target.value })}
              />
              <input
                type="number"
                placeholder="Age max"
                value={editProduct.ageMax}
                onChange={(e) => setEditProduct({ ...editProduct, ageMax: e.target.value })}
              />
            </div>

            <label>
              <input
                type="checkbox"
                checked={editProduct.isBestSeller}
                onChange={(e) => setEditProduct({ ...editProduct, isBestSeller: e.target.checked })}
              />
              Best Seller
            </label>

            <label>
              <input
                type="checkbox"
                checked={editProduct.isNewArrival}
                onChange={(e) => setEditProduct({ ...editProduct, isNewArrival: e.target.checked })}
              />
              New Arrival
            </label>

            <input
              type="number"
              min="0"
              max="90"
              placeholder="Discount %"
              value={editProduct.discountPercent}
              onChange={(e) => setEditProduct({ ...editProduct, discountPercent: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => saveEditProduct(p._id)}>Save</button>
            <button onClick={cancelEditProduct}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
})}
<hr style={{ margin: "24px 0" }} />
<h1>Admin — Sales Dashboard</h1>

{!stats ? (
  <div>Loading stats...</div>
) : (
  <>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      <div style={cardStyle}>
        <div style={cardLabel}>Revenue (Delivered)</div>
        <div style={cardValue}>${money(stats.revenue)}</div>
      </div>

      <div style={cardStyle}>
        <div style={cardLabel}>Orders Sold (Delivered)</div>
        <div style={cardValue}>{stats.ordersSold}</div>
      </div>

      <div style={cardStyle}>
        <div style={cardLabel}>Total Orders</div>
        <div style={cardValue}>{stats.totalOrders}</div>
      </div>

      <div style={cardStyle}>
        <div style={cardLabel}>Received</div>
        <div style={cardValue}>{stats.statusCounts?.received || 0}</div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
      <div style={panelStyle}>
        <h3 style={{ marginTop: 0 }}>Status Breakdown</h3>
        <div>Received: {stats.statusCounts?.received || 0}</div>
        <div>Delivered: {stats.statusCounts?.delivered || 0}</div>
        <div>Returned: {stats.statusCounts?.returned || 0}</div>
        <div>Canceled: {stats.statusCounts?.canceled || 0}</div>
      </div>

      <div style={panelStyle}>
        <h3 style={{ marginTop: 0 }}>Popular Products (Delivered)</h3>
        {stats.popularProducts?.length ? (
          <div style={{ display: "grid", gap: 8 }}>
            {stats.popularProducts.map((p) => (
              <div key={p._id} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{p.name}</span>
                <span>
                  {p.qty} sold — ${money(p.revenue)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>No delivered sales yet.</div>
        )}
      </div>
    </div>
  </>
)}

<hr style={{ margin: "24px 0" }} />
<h1>Admin — Orders</h1>

{orders.length === 0 ? (
  <div>No orders yet.</div>
) : (
  <div style={{ display: "grid", gap: 12 }}>
    {orders.map((o) => (
      <div key={o._id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontWeight: "bold" }}>Order #{o._id}</div>
            <div style={{ color: "#666", fontSize: 12 }}>
              {new Date(o.createdAt).toLocaleString()}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: "bold", marginRight: 8 }}>Status:</label>
            <select value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)}>
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
            <div style={{ fontWeight: "bold" }}>Order Summary</div>
            <div>Subtotal: ${money(o.pricing?.subtotal)}</div>
            <div>Shipping: ${money(o.pricing?.shipping)}</div>
            <div>Tax: ${money(o.pricing?.tax)}</div>
            <div style={{ marginTop: 6, fontWeight: "bold" }}>
              Total: ${money(o.pricing?.total)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: "bold" }}>Items</div>
          <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
            {o.items?.map((it, idx) => {
              const unit = Number(it.finalPrice ?? it.price ?? 0);
              return (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{it.name} × {it.qty}</span>
                  <span>${money(unit * it.qty)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
    
  

    </div>
   
    
  );
 
  

  
  
}
const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
};

const cardLabel = { color: "#666", fontSize: 13 };
const cardValue = { fontSize: 22, fontWeight: "bold", marginTop: 6 };

const panelStyle = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 16,
  background: "#fff",
};