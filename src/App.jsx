import { useEffect, useRef, useState } from "react";

const JitsiCall = ({ roomName, user }) => {
  const jitsiContainer = useRef(null);
  const [jitsi, setJitsi] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

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
        const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: roomName,
          parentNode: jitsiContainer.current,
          userInfo: { displayName: user },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: true,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            TOOLBAR_BUTTONS: [], // Hides Jitsi UI toolbar
          },
        });

        setJitsi(api);
      }
    };

    loadJitsiScript();

    return () => {
      if (jitsi) {
        jitsi.dispose();
      }
    };
  }, [roomName, user]);

  // Custom function to toggle mute
  const toggleMute = () => {
    if (jitsi) {
      jitsi.executeCommand("toggleAudio");
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <div>
      {/* Jitsi Meeting Container (Hidden) */}
      <div ref={jitsiContainer} style={{ display: "none" }} />

      {/* Custom Full-Width Mute Button */}
      <button
        onClick={toggleMute}
        style={{
          width: "8vw",
          height: "5vh",
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
