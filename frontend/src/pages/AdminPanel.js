import React, { useEffect, useState } from "react";
import "../theme.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

function AdminPanel() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [words, setWords] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [newPlayerTeam, setNewPlayerTeam] = useState("red");
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [error, setError] = useState("");

  // Oda listesini çek
  useEffect(() => {
    fetch(`${API}/rooms/`)
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []);

  // Oda seçilince sadece oyuncu listesini çek
  useEffect(() => {
    if (selectedRoom) {
      setLoadingPlayers(true);
      fetch(`${API}/roomplayers/?room=${selectedRoom.id}`)
        .then(res => res.json())
        .then(data => setPlayers(data))
        .catch(() => setPlayers([]))
        .finally(() => setLoadingPlayers(false));
    }
  }, [selectedRoom]);

  // Oyuncu ekle (API)
  const handleAddPlayer = async () => {
    if (!newPlayer.trim()) return;
    setError("");
    try {
      const username = newPlayer.trim();
      const res = await fetch(`${API}/roomplayers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { username },
          room: selectedRoom.id,
          team: newPlayerTeam.toUpperCase(),
          role: "OPERATIVE"
        })
      });
      if (res.ok) {
        fetch(`${API}/roomplayers/?room=${selectedRoom.id}`)
          .then(res => res.json())
          .then(data => setPlayers(data));
        setNewPlayer("");
      } else {
        setError("Oyuncu eklenemedi.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };
  // Oyuncu sil (API)
  const handleDeletePlayer = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API}/roomplayers/${id}/`, {
        method: "DELETE"
      });
      if (res.ok || res.status === 204) {
        setPlayers(players.filter(p => p.id !== id));
      } else {
        setError("Oyuncu silinemedi.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="admin-container homepage-container">
      <h2 className="game-title">Admin Paneli</h2>
      <div className="admin-section">
        <h3>Oda Listesi</h3>
        <ul className="list-group mb-3">
          {rooms.map(room => (
            <li key={room.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{room.name}</span>
              <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedRoom(room)}>
                Düzenle
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedRoom && (
        <div className="admin-section">
          <h4>Oda: <b>{selectedRoom.name}</b></h4>
          {error && <div className="alert alert-danger mb-2">{error}</div>}
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="text-danger">Kırmızı Takım Oyuncuları</h5>
              {loadingPlayers ? <div>Yükleniyor...</div> : (
                <ul className="list-group mb-2">
                  {players.filter(p => p.team === "RED").map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{p.user.username}</span>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeletePlayer(p.id)}>Sil</button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="d-flex gap-2 align-items-center mb-3">
                <input
                  type="text"
                  className="input flex-grow-1"
                  placeholder="Oyuncu Adı"
                  value={newPlayer}
                  onChange={e => setNewPlayer(e.target.value)}
                />
                <select className="form-select w-auto" value={newPlayerTeam} onChange={e => setNewPlayerTeam(e.target.value)}>
                  <option value="red">Kırmızı</option>
                  <option value="blue">Mavi</option>
                </select>
                <button className="btn btn-primary" onClick={handleAddPlayer}>Ekle</button>
              </div>
              <h5 className="text-primary mt-4">Mavi Takım Oyuncuları</h5>
              {loadingPlayers ? <div>Yükleniyor...</div> : (
                <ul className="list-group mb-2">
                  {players.filter(p => p.team === "BLUE").map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{p.user.username}</span>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeletePlayer(p.id)}>Sil</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel; 