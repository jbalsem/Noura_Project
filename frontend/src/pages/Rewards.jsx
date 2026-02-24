import { useEffect, useState } from "react";
import axios from "axios";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5050/api/rewards")
      .then(res => setRewards(res.data));
  }, []);

  return (
    <div>
      <h1>Rewards</h1>
      {rewards.map(r => (
        <p key={r._id}>{r.user}: {r.points} points</p>
      ))}
    </div>
  );
}