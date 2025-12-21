// "use client"

// import { useState, useEffect } from "react"
// import "../styles/ar-model-viewer.css"

// export default function ARModelViewer({ modelUrl, onClose }) {
//   const [error, setError] = useState(null)
//   const [isValidating, setIsValidating] = useState(true)

//   useEffect(() => {
//     try {
//       const urlObj = new URL(modelUrl)
//       const validExtensions = [".glb", ".gltf"]
//       const hasValidExtension = validExtensions.some((ext) => modelUrl.toLowerCase().includes(ext))

//       if (!hasValidExtension) {
//         setError("Invalid model format. Only GLB and GLTF models are supported.")
//       }
//     } catch (err) {
//       setError("Invalid model URL. Please scan a valid QR code with a 3D model URL.")
//     } finally {
//       setIsValidating(false)
//     }
//   }, []) // Empty dependency - only run once

//   useEffect(() => {
//     if (!customElements.get("model-viewer")) {
//       const script = document.createElement("script")
//       script.type = "module"
//       script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
//       document.head.appendChild(script)
//     }
//   }, [])

//   const handleModelError = (e) => {
//     console.error("Model loading error:", e)
//     setError("Failed to load the 3D model. The URL may be invalid or the model file may be corrupted.")
//   }

//   return (
//     <div className="ar-model-viewer-overlay">
//       <div className="ar-model-viewer-container">
//         <div className="ar-viewer-header">
//           <h2>AR Model Preview</h2>
//           <button className="ar-close-button" onClick={onClose} aria-label="Close Viewer">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M18 6L6 18M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="ar-viewer-content">
//           {isValidating ? (
//             <div className="ar-loader">
//               <div className="spinner"></div>
//               <p>Validating model URL...</p>
//             </div>
//           ) : error ? (
//             <div className="ar-error-state">
//               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M15 9l-6 6m0-6l6 6" />
//               </svg>
//               <p className="ar-error-message">{error}</p>
//               <div className="ar-error-actions">
//                 <button className="ar-back-button" onClick={onClose}>
//                   Back
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="ar-model-wrapper">
//                 <model-viewer
//                   src={modelUrl}
//                   ar
//                   ar-modes="webxr scene-viewer quick-look"
//                   camera-controls
//                   auto-rotate
//                   shadow-intensity="1"
//                   style={{ width: "100%", height: "500px" }}
//                   onError={handleModelError}
//                 ></model-viewer>
//               </div>

//               <div className="ar-instructions">
//                 <div className="ar-info-card">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
//                     <path d="M8 21h8M12 17v4" />
//                   </svg>
//                   <div>
//                     <h3>View in AR</h3>
//                     <p>Click the AR button in the viewer to place this model in your real environment</p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useEffect, useRef } from "react"
import "../styles/ar-model-viewer.css"

export default function ARModelViewer({ modelUrl, onClose }) {
  const [error, setError] = useState(null)
  const [isValidating, setIsValidating] = useState(true)
  const [contentType, setContentType] = useState(null) // '3d-model' or '360-video'
  const [resolvedUrl, setResolvedUrl] = useState(null)
  const videoRef = useRef(null)
  const aframeSceneRef = useRef(null)

  const resolveUrlAndDetectType = async (url) => {
    try {
      console.log("[v0] Resolving URL:", url)

      // First, try to detect file type from URL
      const urlLower = url.toLowerCase()

      if (urlLower.includes(".mp4")) {
        return { type: "360-video", url: url }
      }

      if (urlLower.includes(".glb") || urlLower.includes(".gltf")) {
        return { type: "3d-model", url: url }
      }

      // URL doesn't have extension - follow redirect to get actual URL
      console.log("[v0] No extension detected, following redirects...")
      const response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
      })

      const finalUrl = response.url
      console.log("[v0] Final URL after redirect:", finalUrl)

      const finalUrlLower = finalUrl.toLowerCase()

      if (finalUrlLower.includes(".mp4")) {
        return { type: "360-video", url: finalUrl }
      }

      if (finalUrlLower.includes(".glb") || finalUrlLower.includes(".gltf")) {
        return { type: "3d-model", url: finalUrl }
      }

      // Check content-type header
      const contentType = response.headers.get("content-type")
      console.log("[v0] Content-Type:", contentType)

      if (contentType?.includes("video")) {
        return { type: "360-video", url: finalUrl }
      }

      if (contentType?.includes("model") || contentType?.includes("octet-stream")) {
        return { type: "3d-model", url: finalUrl }
      }

      throw new Error("Unable to determine file type")
    } catch (err) {
      console.error("[v0] Error resolving URL:", err)
      throw err
    }
  }

  useEffect(() => {
    const validateAndResolve = async () => {
      try {
        const urlObj = new URL(modelUrl)
        const result = await resolveUrlAndDetectType(modelUrl)

        console.log("[v0] Resolved content type:", result.type, "URL:", result.url)
        setContentType(result.type)
        setResolvedUrl(result.url)
      } catch (err) {
        console.error("[v0] Validation error:", err)
        setError(
          "Invalid URL or unsupported file format. Please scan a QR code with a 3D model (.glb/.gltf) or 360 video (.mp4).",
        )
      } finally {
        setIsValidating(false)
      }
    }

    validateAndResolve()
  }, [modelUrl])

  useEffect(() => {
    if (contentType === "360-video") {
      if (!window.AFRAME) {
        const script = document.createElement("script")
        script.src = "https://aframe.io/releases/1.6.0/aframe.min.js"
        script.onload = () => {
          console.log("[v0] A-Frame loaded")
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

  const initializeVideo = async () => {
    if (videoRef.current && resolvedUrl) {
      console.log("[v0] Initializing video:", resolvedUrl)
      videoRef.current.src = resolvedUrl
      videoRef.current.load()

      try {
        await videoRef.current.play()
        console.log("[v0] Video playing")
      } catch (err) {
        console.log("[v0] Autoplay blocked, waiting for user interaction")
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
        console.log("[v0] Gyro permission:", res)
        if (res === "granted" && videoRef.current) {
          await videoRef.current.play()
        }
      } catch (err) {
        console.error("[v0] Gyro permission error:", err)
      }
    } else {
      console.log("[v0] Gyro permission not required")
      if (videoRef.current) {
        await videoRef.current.play()
      }
    }
  }

  const handleModelError = (e) => {
    console.error("[v0] Model loading error:", e)
    setError("Failed to load the 3D model. The URL may be invalid or the model file may be corrupted.")
  }

  const handleVideoError = (e) => {
    console.error("[v0] Video loading error:", e)
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
          ) : null}
        </div>
      </div>
    </div>
  )
}
