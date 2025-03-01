import { useEffect, useRef } from "react";

const JitsiCall = ({ roomName, user }) => {
  const jitsiContainer = useRef(null);
  let jitsi = null;

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
        jitsi = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: roomName,
          parentNode: jitsiContainer.current,
          userInfo: { displayName: user },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: true, // Audio call only
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: ["microphone", "hangup"], // Keep only necessary buttons
          },
        });
      }
    };

    loadJitsiScript();

    return () => {
      if (jitsi) {
        jitsi.dispose();
      }
    };
  }, [roomName, user]);

  return <div ref={jitsiContainer} style={{ height: "500px", width: "100%" }} />;
};

export default JitsiCall;
