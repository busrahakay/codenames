import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../theme.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

function HomePage() {
  const [roomCode, setRoomCode] = useState("");
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Oda listesini çek
  useEffect(() => {
    fetch(`${API}/rooms/`)
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(() => setRooms([]));
  }, []);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/rooms/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoomName.trim() })
      });
      if (res.ok) {
        const room = await res.json();
        setRoomCode(`${room.name} (${room.id})`);
        setNewRoomName("");
        navigate(`/lobby/${room.id}`);
      } else {
        setError("Oda oluşturulamadı. Bu isimde bir oda olabilir.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
    setLoading(false);
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/lobby/${roomId}`);
  };

  // Oda silme fonksiyonu
  const handleDeleteRoom = async (roomId) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/rooms/${roomId}/`, {
        method: "DELETE"
      });
      if (res.ok || res.status === 204) {
        setRooms(rooms.filter(r => r.id !== roomId));
      } else {
        setError("Oda silinemedi.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
    setLoading(false);
  };

  return (
    <div className="homepage-container">
      <h1 className="game-title">CennetCode</h1>
      <div className="home-actions">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Yeni Oda Adı"
            value={newRoomName}
            onChange={e => setNewRoomName(e.target.value)}
            className="input me-2"
            disabled={loading}
          />
          <button className="btn primary" onClick={handleCreateRoom} disabled={loading}>
            Oda Oluştur
          </button>
        </div>
        <div className="mb-4" style={{width: '100%', maxWidth: 400}}>
          <h4>Mevcut Odalar</h4>
          <ul className="list-group">
            {rooms.length === 0 && <li className="list-group-item">Oda yok</li>}
            {rooms.map(room => (
              <li key={room.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{room.name}</span>
                <div>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleJoinRoom(room.id)}>
                    Katıl
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteRoom(room.id)}>
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="join-room">
          <input
            type="text"
            placeholder="Oda Kodu ile Katıl"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
            className="input"
          />
          <button className="btn secondary" onClick={() => handleJoinRoom(roomCode.trim())}>
            Katıl
          </button>
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default HomePage; 