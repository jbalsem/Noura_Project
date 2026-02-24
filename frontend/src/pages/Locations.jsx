import { useEffect, useState } from "react";

const API = "http://localhost:5050";

export default function Locations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/locations`)
      .then((r) => r.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Our Locations</h1>
      {locations.length === 0 && <div>No locations yet.</div>}

      {locations.map((l) => (
        <div key={l._id} style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{l.name}</h3>
          <div>{l.address1}{l.address2 ? `, ${l.address2}` : ""}</div>
          <div>{l.city}{l.state ? `, ${l.state}` : ""} {l.zip}</div>
          {l.phone && <div>📞 {l.phone}</div>}
          {l.hours && <div>🕒 {l.hours}</div>}
          {l.mapUrl && (
            <div style={{ marginTop: 8 }}>
              <a href={l.mapUrl} target="_blank" rel="noreferrer">
                View on Google Maps
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}