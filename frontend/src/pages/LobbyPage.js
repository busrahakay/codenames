import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlayerList from "../components/PlayerList";
import TeamAssignment from "../components/TeamAssignment";
import "../theme.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

function LobbyPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Oda adını backend'den çek
    fetch(`${API}/rooms/${roomId}/`)
      .then(res => res.json())
      .then(data => setRoomName(data.name))
      .catch(() => setRoomName(""));
    // Odaya ait oyuncuları backend'den çek
    fetch(`${API}/roomplayers/?room=${roomId}`)
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(() => setPlayers([]));
  }, [roomId]);

  const handleStartGame = () => {
    navigate(`/game/${roomId}`);
  };

  return (
    <div className="lobby-container homepage-container">
      <h2>
        Oda Kodu: <span className="room-code">{roomId}</span>
        {roomName && <span className="ms-3">| Oda İsmi: <b>{roomName}</b></span>}
      </h2>
      <PlayerList players={players.map(p => ({ id: p.id, name: p.user.username, team: p.team.toLowerCase() }))} />
      <TeamAssignment players={players.map(p => ({ id: p.id, name: p.user.username, team: p.team ? p.team.toLowerCase() : null }))} />
      <button className="btn primary" onClick={handleStartGame}>
        Oyunu Başlat
      </button>
    </div>
  );
}

export default LobbyPage; 