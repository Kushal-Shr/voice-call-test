import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const JitsiCall = () => {
  const jitsiContainer = useRef(null);
  const [jitsi, setJitsi] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [participants, setParticipants] = useState([]);

  // Extract name and room from URL parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userName = queryParams.get("name");
  const roomName = queryParams.get("room");

  useEffect(() => {
    const loadJitsiScript = () => {
      if (!document.getElementById("jitsi-script")) {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.id = "jitsi-script";
        script.async = true;
        script.onload = initializeJitsi;
        document.body.appendChild(script);
      } else {
        initializeJitsi();
      }
    };

    const initializeJitsi = () => {
      if (window.JitsiMeetExternalAPI && roomName && userName) {
        const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: roomName,
          parentNode: jitsiContainer.current,
          userInfo: { displayName: userName },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: true, // Audio-only call
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            TOOLBAR_BUTTONS: [], // Hide all buttons
          },
        });

        setJitsi(api);

        // Track participants
        api.addEventListener("participantJoined", () => updateParticipants(api));
        api.addEventListener("participantLeft", () => updateParticipants(api));

        // Hide iframe after joining
        setTimeout(() => {
          setCallStarted(true);
          updateParticipants(api);
        }, 3000);
      }
    };

    loadJitsiScript();

    return () => {
      if (jitsi) {
        jitsi.dispose();
      }
    };
  }, [roomName, userName]);

  // ✅ Fetch participant names
  const updateParticipants = (apiInstance) => {
    if (apiInstance) {
      apiInstance.getParticipantsInfo().then((participantList) => {
        setParticipants(participantList.map((p) => p.displayName || "Unknown"));
      });
    }
  };

  // ✅ Mute/Unmute Self
  const toggleMute = () => {
    if (jitsi) {
      jitsi.executeCommand("toggleAudio");
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <div>
      {/* Hidden Jitsi Container */}
      <div
        ref={jitsiContainer}
        style={{
          width: "1px",
          height: "1px",
          overflow: "hidden",
          position: "absolute",
          top: "-1000px",
          left: "-1000px",
          display: callStarted ? "none" : "block",
        }}
      />

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        style={{
          width: "100vw",
          height: "80vh",
          backgroundColor: isMuted ? "red" : "green",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>

      {/* Display Participants */}
      <div style={{ textAlign: "center", fontSize: "18px", padding: "10px", backgroundColor: "#f8f8f8" }}>
        <strong>Participants:</strong>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {participants.length > 0 ? (
            participants.map((name, index) => (
              <li key={index} style={{ padding: "5px" }}>
                {name}
              </li>
            ))
          ) : (
            <li>No participants yet</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default JitsiCall;
