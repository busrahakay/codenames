import React from "react";
import "../theme.css";

function PlayerList({ players }) {
  return (
    <div className="player-list">
      <h3>Oyuncular</h3>
      <ul>
        {players.map((p) => (
          <li key={p.id} className={`player-label${p.team ? ' ' + p.team : ''}`}>
            {p.name}
            {p.team && (
              <span className={`team-badge ${p.team}`}>{p.team === "red" ? "Kırmızı" : "Mavi"}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList; 