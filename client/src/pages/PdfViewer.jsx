import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

export default function PdfViewer() {
  const { url } = useParams(); // Keeps existing route structure
  const decodedUrl = decodeURIComponent(url);
  
  // We need pathId and resourceId. 
  // Recommended: Pass them via State from the Link: <Link to="..." state={{ pathId, resourceId }}>
  const location = useLocation();
  const { pathId, resourceId } = location.state || {};
  const { backendUrl } = useAppContext();

  const [isActive, setIsActive] = useState(true);
  const activityTimeout = useRef(null);

  // 1. Activity Detector (Mouse/Keyboard)
  useEffect(() => {
    const handleActivity = () => {
      setIsActive(true);
      clearTimeout(activityTimeout.current);
      // User is idle after 60 seconds of no movement
      activityTimeout.current = setTimeout(() => setIsActive(false), 60000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearTimeout(activityTimeout.current);
    };
  }, []);

  // 2. The Heartbeat Loop
  useEffect(() => {
    if (!pathId || !resourceId) return; // Don't track if missing context

    const interval = setInterval(async () => {
      if (isActive && document.hasFocus()) {
        try {
          await axios.post(
            `${backendUrl}/api/learner/heartbeat`,
            {
              pathId,
              resourceId,
              duration: 30, // 30 Seconds
            },
            { withCredentials: true }
          );
          console.log("💗 Activity logged");
        } catch (err) {
          console.error("Tracking failed", err);
        }
      }
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(interval);
  }, [isActive, pathId, resourceId, backendUrl]);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Activity Indicator (Optional Debugging UI) */}
      <div className={`h-1 w-full transition-colors duration-500 ${isActive ? "bg-green-500" : "bg-gray-300"}`} />
      
      <iframe
        src={decodedUrl}
        title="PDF Viewer"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
}