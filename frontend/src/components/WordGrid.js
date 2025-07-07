import React from "react";
import WordCard from "./WordCard";
import "../theme.css";

function WordGrid({ words, setWords, turn, role, team, onWordReveal }) {
  // 5x5 grid için kelimeleri doldur
  const fullWords = [
    ...words,
    ...Array(25 - words.length).fill({ word: "-", role: "neutral", revealed: false })
  ];

  const handleCardClick = (idx) => {
    if (onWordReveal) {
      onWordReveal(idx);
    } else {
      // Eski fallback
      if (role === "operative" && turn === team && !fullWords[idx].revealed) {
        setWords(prev => prev.map((w, i) => i === idx ? { ...w, revealed: true } : w));
      }
    }
  };

  return (
    <div className="word-grid">
      {fullWords.map((w, i) => (
        <WordCard
          key={i}
          word={w}
          onClick={() => handleCardClick(i)}
          showRole={role === "spymaster" || w.revealed}
        />
      ))}
    </div>
  );
}

export default WordGrid; 