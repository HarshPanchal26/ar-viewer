"use client"

import { useState, useEffect, useRef } from "react"
import "../styles/ar-model-viewer.css"

export default function ARModelViewer({ modelUrl, onClose, isWebcamMode = false }) {
  const [error, setError] = useState(null)
  const [isValidating, setIsValidating] = useState(true)
  const [contentType, setContentType] = useState(null) // '3d-model' or '360-video'
  const [resolvedUrl, setResolvedUrl] = useState(null)

  // Webcam AR State
  const [cameraStream, setCameraStream] = useState(null)
  const [videoDevices, setVideoDevices] = useState([])
  const [facingMode, setFacingMode] = useState("environment") // 'environment' (back) or 'user' (front)
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false)
  const [deviceCount, setDeviceCount] = useState(0);


  const videoRef = useRef(null)
  const webcamVideoRef = useRef(null)
  const aframeSceneRef = useRef(null)

  const resolveUrlAndDetectType = async (url) => {
    try {
      console.log(" Resolving URL:", url)

      // First, try to detect file type from URL
      const urlLower = url.toLowerCase()

      if (urlLower.includes(".mp4")) {
        return { type: "360-video", url: url }
      }

      if (urlLower.includes(".glb") || urlLower.includes(".gltf")) {
        return { type: "3d-model", url: url }
      }

      // URL doesn't have extension - follow redirect to get actual URL
      console.log(" No extension detected, following redirects...")
      const response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
      })

      const finalUrl = response.url
      console.log(" Final URL after redirect:", finalUrl)

      const finalUrlLower = finalUrl.toLowerCase()

      if (finalUrlLower.includes(".mp4")) {
        return { type: "360-video", url: finalUrl }
      }

      if (finalUrlLower.includes(".glb") || finalUrlLower.includes(".gltf")) {
        return { type: "3d-model", url: finalUrl }
      }

      // Check content-type header
      const contentType = response.headers.get("content-type")
      console.log(" Content-Type:", contentType)

      if (contentType?.includes("video")) {
        return { type: "360-video", url: finalUrl }
      }

      if (contentType?.includes("model") || contentType?.includes("octet-stream")) {
        return { type: "3d-model", url: finalUrl }
      }

      throw new Error("Unable to determine file type")
    } catch (err) {
      console.error(" Error resolving URL:", err)
      throw err
    }
  }

  useEffect(() => {
    const validateAndResolve = async () => {
      try {
        // Safe URL creation for validation (handles relative paths)
        try {
          new URL(modelUrl, window.location.href);
        } catch (e) {
          // If it fails even with base, it's truly invalid
          throw new Error("Invalid URL format");
        }

        const result = await resolveUrlAndDetectType(modelUrl)

        console.log(" Resolved content type:", result.type, "URL:", result.url)
        setContentType(result.type)
        setResolvedUrl(result.url)
      } catch (err) {
        console.error(" Validation error:", err)
        // Fallback: If validation fails but it looks like a model, try anyway
        if (modelUrl.toLowerCase().includes(".glb") || modelUrl.toLowerCase().includes(".gltf")) {
          console.log("Validation failed but extension looks valid, attempting fallback.");
          setContentType("3d-model");
          setResolvedUrl(modelUrl);
        } else {
          setError(
            "Invalid URL or unsupported file format. Please scan a QR code with a 3D model (.glb/.gltf) or 360 video (.mp4).",
          )
        }
      } finally {
        setIsValidating(false)
      }
    }

    if (modelUrl) {
      validateAndResolve()
    }
  }, [modelUrl])

  useEffect(() => {
    if (contentType === "360-video") {
      if (!window.AFRAME) {
        const script = document.createElement("script")
        script.src = "https://aframe.io/releases/1.6.0/aframe.min.js"
        script.onload = () => {
          console.log(" A-Frame loaded")
          initializeVideo()
        }
        document.head.appendChild(script)
      } else {
        initializeVideo()
      }
    } else if (contentType === "3d-model") {
      if (!customElements.get("model-viewer")) {
        const script = document.createElement("script")
        script.type = "module"
        script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        document.head.appendChild(script)
      }
    }
  }, [contentType])

  // Handle Webcam AR Mode
  useEffect(() => {
    let activeStream = null;

    if (isWebcamMode && contentType === "3d-model") {
      const initCamera = async () => {
        try {
          console.log("Initializing camera with facingMode:", facingMode);

          // Stop any existing stream before creating a new one
          if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
          }

          // Check for video devices first
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputDevices = devices.filter((d) => d.kind === "videoinput");
          setDeviceCount(videoInputDevices.length);

          // If 0 devices found, it might be because permission isn't granted yet.
          // We still try to get user media to trigger the permission prompt.
          // Constraints: precise if we have devices, loose if we don't know yet.
          const constraints = {
            video: videoInputDevices.length <= 1
              ? true // Default camera if 0 or 1 device known
              : { facingMode: { ideal: facingMode } },
            audio: false
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          activeStream = stream;
          setCameraStream(stream);

          if (webcamVideoRef.current) {
            webcamVideoRef.current.srcObject = stream;
            webcamVideoRef.current.play().catch(e => console.error("Video play failed", e));
          }

          // Enumerate devices just for logging
          setVideoDevices(videoInputDevices);
          console.log("Cameras found:", videoInputDevices.length);

        } catch (err) {
          console.error("Error accessing camera:", err);
          // Retry with loose constraints if specific ones fail AND it's not a "No camera" error
          if (err.message !== "No camera devices found.") {
            try {
              console.log("Retrying with loose constraints...");
              const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
              activeStream = stream;
              setCameraStream(stream);
              if (webcamVideoRef.current) {
                webcamVideoRef.current.srcObject = stream;
                webcamVideoRef.current.play().catch(e => console.error("Fallback video play failed", e));
              }
            } catch (retryErr) {
              setError("Failed to access camera. Please allow camera permissions or check if another app is using it.");
            }
          } else {
            setError("No camera detected on this device.");
          }
        }
      };

      initCamera();
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isWebcamMode, contentType, facingMode]); // Re-run when facingMode changes



  const handleSwitchCamera = () => {
    setIsSwitchingCamera(true);
    setFacingMode(prev => prev === "environment" ? "user" : "environment");

    // Small delay to prevent rapid clicking issues
    setTimeout(() => setIsSwitchingCamera(false), 500);
  }

  const initializeVideo = async () => {
    if (videoRef.current && resolvedUrl) {
      console.log(" Initializing video:", resolvedUrl)
      videoRef.current.src = resolvedUrl
      videoRef.current.load()

      try {
        await videoRef.current.play()
        console.log(" Video playing")
      } catch (err) {
        console.log(" Autoplay blocked, waiting for user interaction")
        // Video will play on user tap
      }
    }
  }

  const requestGyroPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const res = await DeviceOrientationEvent.requestPermission()
        console.log(" Gyro permission:", res)
        if (res === "granted" && videoRef.current) {
          await videoRef.current.play()
        }
      } catch (err) {
        console.error(" Gyro permission error:", err)
      }
    } else {
      console.log(" Gyro permission not required")
      if (videoRef.current) {
        await videoRef.current.play()
      }
    }
  }

  const handleModelError = (e) => {
    console.error(" Model loading error:", e)
    setError("Failed to load the 3D model. The URL may be invalid or the model file may be corrupted.")
  }

  const handleVideoError = (e) => {
    console.error(" Video loading error:", e)
    setError("Failed to load the 360 video. The URL may be invalid or the video file may be corrupted.")
  }

  return (
    <div className="ar-model-viewer-overlay">
      <div className="ar-model-viewer-container">
        <div className="ar-viewer-header">
          <h2>{contentType === "360-video" ? "360° Video Viewer" : "AR Model Preview"}</h2>
          <button className="ar-close-button" onClick={onClose} aria-label="Close Viewer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="ar-viewer-content">
          {isValidating ? (
            <div className="ar-loader">
              <div className="spinner"></div>
              <p>Resolving URL and detecting content type...</p>
            </div>
          ) : error ? (
            <div className="ar-error-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6m0-6l6 6" />
              </svg>
              <p className="ar-error-message">{error}</p>
              <div className="ar-error-actions">
                <button className="ar-back-button" onClick={onClose}>
                  Back
                </button>
              </div>
            </div>
          ) : contentType === "360-video" ? (
            <>
              <div className="video-360-wrapper">
                <a-scene
                  ref={aframeSceneRef}
                  embedded
                  vr-mode-ui="enabled:false"
                  style={{ width: "100%", height: "500px", borderRadius: "12px", overflow: "hidden" }}
                >
                  <a-assets>
                    <video
                      ref={videoRef}
                      id="video-360"
                      crossOrigin="anonymous"
                      playsInline
                      webkit-playsinline="true"
                      loop
                      onError={handleVideoError}
                    ></video>
                  </a-assets>

                  <a-sky src="#video-360" rotation="0 -90 0"></a-sky>
                  <a-entity camera look-controls="enabled:true"></a-entity>
                </a-scene>
              </div>

              <div className="ar-instructions">
                <div className="ar-info-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" />
                  </svg>
                  <div>
                    <h3>360° Video</h3>
                    <p>Move your phone to look around the 360° video. Tap the button below to enable gyro controls.</p>
                  </div>
                </div>

                <button className="gyro-button" onClick={requestGyroPermission}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20" />
                    <circle cx="12" cy="12" r="7" />
                  </svg>
                  Enable Gyro Controls
                </button>
              </div>
            </>
          ) : contentType === "3d-model" ? (
            isWebcamMode ? (
              /* Webcam AR Render */
              <div className="webcam-ar-wrapper">
                {/* Camera Feed Background */}
                <video
                  ref={webcamVideoRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1
                  }}
                  onLoadedMetadata={() => {
                    if (webcamVideoRef.current) {
                      webcamVideoRef.current.play().catch(e => console.error("Video play failed on metadata load", e));
                    }
                  }}
                  playsInline
                  autoPlay
                  muted
                />

                {/* 3D Model Overlay */}
                <model-viewer
                  src={resolvedUrl}
                  camera-controls
                  auto-rotate
                  shadow-intensity="1"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    '--poster-color': 'transparent',
                    '--progress-bar-height': '0px'
                  }}
                  onError={handleModelError}
                ></model-viewer>

                {/* Camera Controls - Always show switch button on mobile/webcam mode */}
                <button
                  className="ar-switch-camera"
                  onClick={handleSwitchCamera}
                  disabled={isSwitchingCamera}
                  aria-label="Switch Camera"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8H2l5 5 5-5H9C9 6.686 11.686 4 15 4c3.3137 0 6 2.6863 6 6 0 1.2599-.3879 2.433-1.0505 3.4005" />
                    <path d="M4 14c0 4.418 3.582 8 8 8s8-3.582 8-8h2l-5-5-5 h3c0 3.3137-2.6863 6-6 6-3.3137 0-6-2.6863-6-6 0-1.2599.3879-2.433 1.0505-3.4005" />
                  </svg>
                </button>

                <div className="ar-instructions-overlay" style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '14px',
                  zIndex: 1000,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap'
                }}>
                  Drag to rotate • Pinch to zoom
                </div>
              </div>
            ) : (
              /* Standard AR Render */
              <>
                <div className="ar-model-wrapper">
                  <model-viewer
                    src={resolvedUrl}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    style={{ width: "100%", height: "500px" }}
                    onError={handleModelError}
                  ></model-viewer>
                </div>

                <div className="ar-instructions">
                  <div className="ar-info-card">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                    <div>
                      <h3>View in AR</h3>
                      <p>Click the AR button in the viewer to place this model in your real environment</p>
                    </div>
                  </div>
                </div>
              </>
            )
          ) : null}
        </div>
      </div>
    </div >
  )
}
