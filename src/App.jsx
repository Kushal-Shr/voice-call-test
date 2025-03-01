import { useState } from "react";
import JitsiCall from "./JitsiCall";

function App() {
  const [room, setRoom] = useState("");
  const [user, setUser] = useState("");
  const [startCall, setStartCall] = useState(false);

  return (
    <div>
      {!startCall ? (
        <div>
          <input
            type="text"
            placeholder="Enter Room Name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Your Name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button onClick={() => setStartCall(true)}>Start Call</button>
        </div>
      ) : (
        <JitsiCall roomName={room} user={user} />
      )}
    </div>
  );
}

export default App;
