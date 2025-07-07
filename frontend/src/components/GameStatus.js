import React from "react";
import "../theme.css";

function GameStatus({ turn }) {
  return (
    <div className="game-status">
      <span className={`turn-label ${turn}`}>{turn === "red" ? "Kırmızı Takımın Sırası" : "Mavi Takımın Sırası"}</span>
    </div>
  );
}

export default GameStatus; 