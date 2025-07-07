import React from 'react';
import './GameBoard.css';

function GameBoard({ words, onWordClick, spymaster }) {
  return (
    <div className="game-board row g-2">
      {words.map((word, idx) => (
        <div
          key={idx}
          className="col-2"
        >
          <button
            className={`word-card btn w-100 ${word.is_revealed ? 'revealed' : ''} ${word.role === 'RED' && (spymaster || word.is_revealed) ? 'btn-danger' : ''} ${word.role === 'BLUE' && (spymaster || word.is_revealed) ? 'btn-primary' : ''} ${word.role === 'NEUTRAL' && (spymaster || word.is_revealed) ? 'btn-secondary' : ''} ${word.role === 'ASSASSIN' && (spymaster || word.is_revealed) ? 'btn-dark' : ''}`}
            disabled={!onWordClick || word.is_revealed}
            onClick={() => onWordClick && onWordClick(idx)}
          >
            {(spymaster || word.is_revealed) ? word.text : '❓'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default GameBoard; 