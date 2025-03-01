import { useEffect, useRef, useState } from "react";

const JitsiCall = () => {
  const jitsiContainer = useRef(null);
  const [jitsi, setJitsi] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

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
      if (window.JitsiMeetExternalAPI) {
        const roomName = "AutoJoinRoom123"; // Set a fixed room name or use a random one
        const userName = `User-${Math.floor(Math.random() * 1000)}`; // Generate a random username

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
            TOOLBAR_BUTTONS: [], // Hides the toolbar
          },
        });

        setJitsi(api);

        // Hide the Jitsi iframe after joining
        setTimeout(() => {
          setCallStarted(true);
        }, 3000);
      }
    };

    loadJitsiScript();

    return () => {
      if (jitsi) {
        jitsi.dispose();
      }
    };
  }, []);

  // Custom function to toggle mute
  const toggleMute = () => {
    if (jitsi) {
      jitsi.executeCommand("toggleAudio");
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <div>
      {/* Jitsi Meeting Container (Hidden after joining) */}
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

      {/* Custom Full-Width Mute Button */}
      <button
        onClick={toggleMute}
        style={{
          width: "10vw",
          height: "7vh",
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
    </div>
  );
};

export default JitsiCall;
