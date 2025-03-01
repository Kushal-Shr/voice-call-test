import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && room.trim()) {
      navigate(`/call?name=${encodeURIComponent(name)}&room=${encodeURIComponent(room)}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h2>Enter Room Details</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px", margin: "5px" }}
        />
        <br />
        <input
          type="text"
          placeholder="Enter Room Number"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px", margin: "5px" }}
        />
        <br />
        <button type="submit" style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer" }}>
          Join Room
        </button>
      </form>
    </div>
  );
};

export default Home;
