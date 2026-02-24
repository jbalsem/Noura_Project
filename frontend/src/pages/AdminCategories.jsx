import { useEffect, useState } from "react";
const API = "http://localhost:5050";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);

  async function load() {
    const res = await fetch(`${API}/api/categories`, { credentials: "include" });
    setCategories(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function addCategory() {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("slug", slug);
    if (image) fd.append("image", image);

    const res = await fetch(`${API}/api/categories`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const text = await res.text();
    if (!res.ok) {
      alert(`Add category failed (${res.status}): ${text}`);
      return;
    }

    setName("");
    setSlug("");
    setImage(null);
    load();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin — Categories</h1>

      <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Slug (ex: plush)" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={addCategory} disabled={!name || !slug}>Add Category</button>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2>All Categories</h2>
      {categories.map((c) => (
        <div key={c._id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
          {c.image && <img src={`${API}${c.image}`} alt={c.name} width={60} />}
          <div>
            <b>{c.name}</b> <span style={{ color: "#666" }}>({c.slug})</span>
          </div>
        </div>
      ))}
    </div>
  );
}