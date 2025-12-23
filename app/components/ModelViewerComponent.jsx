// // "use client"

// // import { useEffect } from "react"

// // export default function ModelViewerComponent({ posterImage, modelUrl, modelName }) {
// //   useEffect(() => {
// //     // Dynamically load model-viewer script if not already loaded
// //     if (!window.customElements.get("model-viewer")) {
// //       const script = document.createElement("script")
// //       script.type = "module"
// //       script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
// //       document.head.appendChild(script)
// //     }
// //   }, [])

// //   return (
// //     <model-viewer
// //       poster={posterImage}
// //       src={modelUrl}
// //       alt={modelName}
// //       ar
// //       ar-modes="webxr scene-viewer quick-look"
// //       camera-controls
// //       autoplay
// //       enable-pan
// //       style={{
// //         width: "100%",
// //         height: "100%",
// //         display: "block",
// //         background: "#1c1c1c",
// //       }}
// //     />
// //   )
// // }


// "use client"

// import { useEffect, useRef, useState } from "react"

// export default function ModelViewerComponent({ posterImage, modelUrl, modelName, audioUrl, iosModelUrl }) {
//   const modelViewerRef = useRef(null)
//   const audioRef = useRef(null)
//   const [isARActive, setIsARActive] = useState(false)
//   const [arSupported, setArSupported] = useState(false)

//   useEffect(() => {
//     // Dynamically load model-viewer script if not already loaded
//     if (!window.customElements.get("model-viewer")) {
//       const script = document.createElement("script")
//       script.type = "module"
//       script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
//       document.head.appendChild(script)
//     }

//     if (modelViewerRef.current) {
//       const checkARSupport = async () => {
//         if (navigator.xr) {
//           const supported = await navigator.xr.isSessionSupported("immersive-ar")
//           setArSupported(supported)
//         } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
//           // iOS devices support AR Quick Look
//           setArSupported(true)
//         } else if (/Android/.test(navigator.userAgent)) {
//           // Android devices support Scene Viewer
//           setArSupported(true)
//         }
//       }
//       checkARSupport()
//     }
//   }, [])

//   useEffect(() => {
//     const modelViewer = modelViewerRef.current

//     if (!modelViewer) return

//     const handleARStatus = (event) => {
//       console.log(" AR Status:", event.type)
//       if (event.type === "ar-status") {
//         setIsARActive(event.detail.status === "session-started")
//       }
//     }

//     const handleQuickLookButtonTapped = () => {
//       console.log(" Quick Look AR activated")
//       setIsARActive(true)
//       if (audioRef.current && audioUrl) {
//         audioRef.current.play().catch((err) => console.error(" Audio play failed:", err))
//       }
//     }

//     modelViewer.addEventListener("ar-status", handleARStatus)
//     modelViewer.addEventListener("quick-look-button-tapped", handleQuickLookButtonTapped)

//     return () => {
//       modelViewer.removeEventListener("ar-status", handleARStatus)
//       modelViewer.removeEventListener("quick-look-button-tapped", handleQuickLookButtonTapped)
//     }
//   }, [audioUrl])

//   useEffect(() => {
//     if (isARActive && audioRef.current && audioUrl) {
//       console.log(" Playing audio in AR mode")
//       audioRef.current.play().catch((err) => console.error(" Audio play failed:", err))
//     } else if (!isARActive && audioRef.current) {
//       audioRef.current.pause()
//       audioRef.current.currentTime = 0
//     }
//   }, [isARActive, audioUrl])

//   return (
//     <>
//       <model-viewer
//         ref={modelViewerRef}
//         poster={posterImage}
//         src={modelUrl}
//         ios-src={iosModelUrl || modelUrl}
//         alt={modelName}
//         ar
//         ar-modes="webxr scene-viewer quick-look"
//         camera-controls
//         autoplay
//         enable-pan
//         shadow-intensity="1"
//         environment-image="neutral"
//         exposure="1"
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "block",
//           background: "#1c1c1c",
//         }}
//       />
//       {audioUrl && <audio ref={audioRef} src={audioUrl} loop preload="auto" style={{ display: "none" }} />}
//       {arSupported && (
//         <div
//           style={{
//             position: "absolute",
//             bottom: "20px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "rgba(0, 0, 0, 0.7)",
//             color: "white",
//             padding: "8px 16px",
//             borderRadius: "20px",
//             fontSize: "14px",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             zIndex: 10,
//           }}
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
//             <path d="M8 21h8M12 17v4" />
//           </svg>
//           AR Available - Tap the AR button
//         </div>
//       )}
//     </>
//   )
// }



"use client"

import { useEffect, useRef, useState } from "react"

export default function ModelViewerComponent({ posterImage, modelUrl, modelName, audioUrl, iosModelUrl, dracoUrl }) {
  const modelViewerRef = useRef(null)
  const audioRef = useRef(null)
  const [isARActive, setIsARActive] = useState(false)
  const [arSupported, setArSupported] = useState(false)

  useEffect(() => {
    // Dynamically load model-viewer script if not already loaded
    if (!window.customElements.get("model-viewer")) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
      document.head.appendChild(script)
    }

    if (modelViewerRef.current) {
      const checkARSupport = async () => {
        if (navigator.xr) {
          const supported = await navigator.xr.isSessionSupported("immersive-ar")
          setArSupported(supported)
        } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          setArSupported(true)
        } else if (/Android/.test(navigator.userAgent)) {
          setArSupported(true)
        }
      }
      checkARSupport()
    }
  }, [])

  useEffect(() => {
    const modelViewer = modelViewerRef.current

    if (!modelViewer) return

    const handleARStatus = (event) => {
      if (event.type === "ar-status") {
        setIsARActive(event.detail.status === "session-started")
      }
    }

    const handleQuickLookButtonTapped = () => {
      setIsARActive(true)
      if (audioRef.current && audioUrl) {
        audioRef.current.play().catch((err) => console.error("Audio play failed:", err))
      }
    }

    modelViewer.addEventListener("ar-status", handleARStatus)
    modelViewer.addEventListener("quick-look-button-tapped", handleQuickLookButtonTapped)

    return () => {
      modelViewer.removeEventListener("ar-status", handleARStatus)
      modelViewer.removeEventListener("quick-look-button-tapped", handleQuickLookButtonTapped)
    }
  }, [audioUrl])

  useEffect(() => {
    if (isARActive && audioRef.current && audioUrl) {
      audioRef.current.play().catch((err) => console.error("Audio play failed:", err))
    } else if (!isARActive && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isARActive, audioUrl])

  const finalModelUrl = dracoUrl || modelUrl

  return (
    <>
      <model-viewer
        ref={modelViewerRef}
        poster={posterImage}
        src={finalModelUrl}
        ios-src={iosModelUrl || finalModelUrl}
        alt={modelName}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        autoplay
        enable-pan
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "#1c1c1c",
        }}
      />
      {audioUrl && <audio ref={audioRef} src={audioUrl} loop preload="auto" style={{ display: "none" }} />}
      {arSupported && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          AR Available - Tap the AR button
        </div>
      )}
    </>
  )
}
