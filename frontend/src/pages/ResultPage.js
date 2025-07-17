import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../theme.css";

function ResultPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  // Demo amaçlı kazanan takım
  const winner = "red";
  const reason = "Demo amaçlı bir oyun sonucu";

  const handleRestart = () => {
    navigate(`/lobby/${roomId}`);
  };

  return (
    <div className="result-container homepage-container" style={{
      minHeight: '100vh',
      padding: 0,
      color: '#fff'
    }}>
      <div className={`result-anim ${winner === 'red' ? 'confetti' : (winner === 'blue' ? 'confetti' : 'shake')}`}></div>
      <h2 className="game-title">Oyun Bitti!</h2>
      <div className={`winner-label ${winner}`}>{winner === "red" ? "Kırmızı Takım Kazandı!" : "Mavi Takım Kazandı!"}</div>
      <div className="mb-3" style={{fontSize: '1.5rem'}}>{reason}</div>
      <button className="btn btn-primary" onClick={handleRestart}>Tekrar Oyna</button>
    </div>
  );
}

export default ResultPage; 