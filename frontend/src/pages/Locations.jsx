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
    <div className="page theme-kidteal">
      <div className="k-locs">
        <div className="k-locs-title">
          <span className="balloon">🎈</span>
          Our Fun Locations
          <span className="balloon">🎈</span>
        </div>

        <div className="k-locs-sub">
          Come visit us! Find the closest Kidooze store and let the fun begin 🧸✨
        </div>

        {locations.length === 0 && <div className="k-empty">No locations yet.</div>}

        <div className="k-locs-grid">
        {locations.map((l, idx) => (
  <div
    key={l._id}
    className={`locCard locCard--${idx % 5}`}
  >
    <div className="locTitleRow">
      <h3 className="locName">{l.name}</h3>
      <span className="locBadge">📍 Store</span>
    </div>

    <div className="locLine">🏠 {l.address1}{l.address2 ? `, ${l.address2}` : ""}</div>
    <div className="locLine">🗺️ {l.city}{l.state ? `, ${l.state}` : ""} {l.zip}</div>
    {l.phone && <div className="locLine">📞 {l.phone}</div>}
    {l.hours && <div className="locLine">🕒 {l.hours}</div>}

    {l.mapUrl && (
      <a className="locMapBtn" href={l.mapUrl} target="_blank" rel="noreferrer">
        Open Map ✨
      </a>
    )}
  </div>
))}
        </div>
      </div>
    </div>
  );
}