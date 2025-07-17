import React from "react";
import "../theme.css";

function WordCard({ word, onClick, showRole }) {
  let cardClass = "word-card ";
  if (word.revealed) {
    cardClass += word.role;
  } else if (showRole) {
    cardClass += word.role + " preview";
  } else {
    cardClass += "hidden";
  }
  // Sadece açılmamışsa tıklanabilir
  const clickable = !word.revealed && showRole !== true;
  return (
    <div className={cardClass + (clickable ? " selectable" : "")}
         onClick={clickable ? onClick : undefined}>
      <span>{word.word}</span>
    </div>
  );
}

export default WordCard; 