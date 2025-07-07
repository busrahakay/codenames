import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WordGrid from "../components/WordGrid";
import CluePanel from "../components/CluePanel";
import GameStatus from "../components/GameStatus";
import PlayerList from "../components/PlayerList";
import "../theme.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

function GameBoardPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  // Demo amaçlı roller ve takım
  const [role, setRole] = useState("spymaster"); // "spymaster" veya "operative"
  const [team, setTeam] = useState("red"); // "red" veya "blue"
  const [username] = useState("DemoKullanici"); // Demo kullanıcı adı
  const [menuOpen, setMenuOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  // Demo amaçlı kelimeler (başlangıç dizisi)
  const initialWords = [
    { word: "ELMA", role: "red", revealed: false },
    { word: "DENİZ", role: "blue", revealed: false },
    { word: "KİTAP", role: "neutral", revealed: false },
    { word: "KÖPRÜ", role: "red", revealed: false },
    { word: "UZAY", role: "assassin", revealed: false },
    { word: "KAPI", role: "neutral", revealed: false },
    { word: "BULUT", role: "blue", revealed: false },
    { word: "TAŞ", role: "red", revealed: false },
    { word: "YILDIZ", role: "blue", revealed: false },
    { word: "KUM", role: "neutral", revealed: false },
    { word: "KÖPEK", role: "red", revealed: false },
    { word: "KEDİ", role: "blue", revealed: false },
    { word: "ARABA", role: "neutral", revealed: false },
    { word: "UÇAK", role: "red", revealed: false },
    { word: "BALIK", role: "blue", revealed: false },
    { word: "AĞAÇ", role: "neutral", revealed: false },
    { word: "ÇİÇEK", role: "red", revealed: false },
    { word: "GÖL", role: "blue", revealed: false },
    { word: "DAĞ", role: "neutral", revealed: false },
    { word: "KUMRU", role: "red", revealed: false },
    { word: "KARTAL", role: "blue", revealed: false },
    { word: "KİRAZ", role: "neutral", revealed: false },
    { word: "KİLİT", role: "red", revealed: false },
    { word: "KÖY", role: "blue", revealed: false },
    { word: "KİRALIK", role: "neutral", revealed: false },
  ];
  const [words, setWords] = useState(initialWords);
  const [clue, setClue] = useState({ word: "", count: 0 });
  const [turn, setTurn] = useState("red");
  const [gameOver, setGameOver] = useState(false);
  const [loserTeam, setLoserTeam] = useState(null);

  // Oyuncuları backend'den çek
  useEffect(() => {
    fetch(`${API}/roomplayers/?room=${roomId}`)
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(() => setPlayers([]));
  }, [roomId]);

  // Takım oyuncularını ayır
  const redPlayers = players.filter(p => p.team === "RED");
  const bluePlayers = players.filter(p => p.team === "BLUE");

  // Demo: Rol ve takım değiştirme (geliştirici için)
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleTeamChange = (e) => {
    setTeam(e.target.value);
    setTurn(e.target.value); // Takım değişince sıra da değişsin
  };

  // Takım puanları (kalan kelime sayısı)
  const redScore = words.filter(w => w.role === "red" && !w.revealed).length;
  const blueScore = words.filter(w => w.role === "blue" && !w.revealed).length;

  // Takımlardan biri tüm kelimelerini bulursa oyun biter
  if (!gameOver && (redScore === 0 || blueScore === 0)) {
    setGameOver(true);
    setLoserTeam(redScore === 0 ? "blue" : "red"); // Kazananı belirlemek için kaybedeni ters ata
  }

  // Takım değiştirme fonksiyonu (menüden)
  const handleSwitchTeam = () => {
    const newTeam = team === "red" ? "blue" : "red";
    setTeam(newTeam);
    setTurn(newTeam);
    setMenuOpen(false);
  };

  // Oyunu sıfırla (demo: ana sayfaya yönlendir)
  const handleReset = () => {
    setWords(initialWords.map(w => ({ ...w }))); // kelimeleri başa al
    setClue({ word: "", count: 0 });
    setTurn("red");
    setGameOver(false);
    setLoserTeam(null);
  };

  // Odadan ayrıl fonksiyonu (demo: ana sayfaya yönlendir)
  const handleLeaveRoom = () => {
    window.location.href = "/";
  };

  // Katil kelime açılırsa oyunu bitir
  const handleWordReveal = (idx) => {
    const selected = words[idx];
    if (role === "operative" && turn === team && !selected.revealed) {
      if (selected.role === "assassin") {
        setGameOver(true);
        setLoserTeam(team);
      }
      setWords(prev => prev.map((w, i) => i === idx ? { ...w, revealed: true } : w));
    }
  };

  // Oyun bitti ekranı
  if (gameOver) {
    const winner = loserTeam === 'red' ? 'Mavi' : 'Kırmızı';
    const reason = (redScore === 0 || blueScore === 0)
      ? `${winner} Takım tüm kelimelerini buldu!`
      : 'Katil kelime seçildiği için oyun sona erdi.';
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{minHeight: '70vh'}}>
        <div className={`result-anim ${loserTeam === 'red' ? 'confetti' : (redScore === 0 || blueScore === 0 ? 'confetti' : 'shake')}`}></div>
        <h2 className="mb-4 text-danger">Oyun Bitti!</h2>
        <div className={`winner-label ${loserTeam === 'red' ? 'blue' : 'red'}`}>{winner} Takım Kazandı!</div>
        <div className="mb-3">{reason}</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>Tekrar Oyna</button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 position-relative homepage-container">
      {/* Sağ üst köşe navbar */}
      <nav className="navbar navbar-expand navbar-light bg-light position-absolute top-0 end-0 me-3 mt-2" style={{zIndex: 10, borderRadius: '12px', boxShadow: '0 2px 8px #0002', minWidth: 220, maxWidth: 300}}>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-danger btn-sm" onClick={handleReset}>
            Oyunu Sıfırla
          </button>
          <div className="dropdown">
            <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="menuDropdown" data-bs-toggle="dropdown" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
              Menü
            </button>
            <ul className={`dropdown-menu dropdown-menu-end${menuOpen ? ' show' : ''}`} aria-labelledby="menuDropdown" style={{right: 0, left: 'auto', minWidth: '220px', maxWidth: '260px', boxShadow: '0 2px 12px #0002', borderRadius: '10px', padding: '0.5rem 0'}}>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <button className="dropdown-item" onClick={handleSwitchTeam}>
                  {team === "red" ? "Mavi Takıma Geç" : "Kırmızı Takıma Geç"}
                </button>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLeaveRoom}>
                  Odadan Ayrıl
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Ana içerik */}
      <div className="game-layout">
        <div className="side-panel red">
          <h3>Kırmızı Takım</h3>
          <div className="team-score">Kalan: <b>{redScore}</b></div>
          <PlayerList players={redPlayers.map(p => ({ id: p.id, name: p.user.username, team: 'red' }))} />
        </div>
        <div className="center-panel">
          <GameStatus turn={turn} />
          <div className="dev-controls mb-3">
            <label className="me-2">Rol: </label>
            <select value={role} onChange={handleRoleChange} className="form-select d-inline w-auto me-3">
              <option value="spymaster">Anlatıcı</option>
              <option value="operative">Bilen</option>
            </select>
            <label className="me-2">Takım: </label>
            <select value={team} onChange={handleTeamChange} className="form-select d-inline w-auto">
              <option value="red">Kırmızı</option>
              <option value="blue">Mavi</option>
            </select>
          </div>
          <CluePanel clue={clue} setClue={setClue} turn={turn} role={role} team={team} />
          <WordGrid words={words} setWords={setWords} turn={turn} role={role} team={team} onWordReveal={handleWordReveal} />
        </div>
        <div className="side-panel blue">
          <h3>Mavi Takım</h3>
          <div className="team-score">Kalan: <b>{blueScore}</b></div>
          <PlayerList players={bluePlayers.map(p => ({ id: p.id, name: p.user.username, team: 'blue' }))} />
        </div>
      </div>
    </div>
  );
}

export default GameBoardPage; 