import { useEffect, useState } from "react";

const API = "http://localhost:5050";

export default function Admin() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

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
    setDescription("");
    setCategoryId("");
    setAgeMin("0");
    setAgeMax("99");
    setIsBestSeller(false);
    setIsNewArrival(false);
    setImage(null);

    loadProducts();
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
  useEffect(() => {
    loadCategories();
    loadProducts();
    loadLocations();
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
      {products.map((p) => (
        <div key={p._id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
          {p.image && <img src={`${API}${p.image}`} alt={p.name} width={60} />}
          <div>
            <div><b>{p.name}</b> — ${p.price}</div>
            <div style={{ fontSize: 12 }}>
              Age {p.ageMin}-{p.ageMax} | BestSeller: {String(p.isBestSeller)} | NewArrival: {String(p.isNewArrival)}
            </div>
          </div>
        </div>
      ))}
      <hr style={{ margin: "24px 0" }} />

<h1>Admin — Locations</h1>

<div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
  <input placeholder="Store name" value={locName} onChange={(e) => setLocName(e.target.value)} />
  <input placeholder="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
  <input placeholder="Address line 2 (optional)" value={address2} onChange={(e) => setAddress2(e.target.value)} />
  <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
  <input placeholder="State" value={stateProv} onChange={(e) => setStateProv(e.target.value)} />
  <input placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
  <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
  <input placeholder="Hours (ex: Mon–Fri 9-5)" value={hours} onChange={(e) => setHours(e.target.value)} />
  <input placeholder="Google Maps link (optional)" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} />

  <button onClick={addLocation} disabled={!locName || !address1 || !city}>
    Add Location
  </button>
</div>

<h2 style={{ marginTop: 24 }}>Current Locations</h2>

{locations.map((l) => (
  <div key={l._id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
    <b>{l.name}</b>
    <div>{l.address1}{l.address2 ? `, ${l.address2}` : ""}</div>
    <div>{l.city}{l.state ? `, ${l.state}` : ""} {l.zip}</div>
    {l.phone && <div>📞 {l.phone}</div>}
    {l.hours && <div>🕒 {l.hours}</div>}
    {l.mapUrl && (
      <a href={l.mapUrl} target="_blank" rel="noreferrer">
        Open in Maps
      </a>
    )}
  </div>
))}
    </div>
  );
}