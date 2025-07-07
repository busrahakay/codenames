import React from "react";
import "../theme.css";

function TeamAssignment({ players }) {
  // Demo amaçlı, gerçek atama fonksiyonu yok
  return (
    <div className="team-assignment">
      <div className="team-box red">
        <h4>Kırmızı Takım</h4>
        <ul>
          {players.filter(p => p.team === "red").map(p => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
      <div className="team-box blue">
        <h4>Mavi Takım</h4>
        <ul>
          {players.filter(p => p.team === "blue").map(p => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TeamAssignment; 