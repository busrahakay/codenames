import React from "react";
import "../theme.css";

function CluePanel({ clue, setClue, turn, role, team }) {
  const isSpymaster = role === "spymaster" && turn === team;
  return (
    <div className="clue-panel">
      <div className="clue-info">
        <span className={`turn-label ${turn}`}>{turn === "red" ? "Kırmızı" : "Mavi"} Takım Sırası</span>
        <span className="clue-show">İpucu: <b>{clue.word}</b> ({clue.count})</span>
      </div>
      {isSpymaster && (
        <div className="clue-inputs">
          <input
            type="text"
            placeholder="İpucu"
            value={clue.word}
            onChange={e => setClue(c => ({ ...c, word: e.target.value }))}
            className="input"
          />
          <input
            type="number"
            min={1}
            max={9}
            placeholder="Sayı"
            value={clue.count}
            onChange={e => setClue(c => ({ ...c, count: e.target.value }))}
            className="input"
          />
          <button className="btn secondary">İpucu Ver</button>
        </div>
      )}
    </div>
  );
}

export default CluePanel; 