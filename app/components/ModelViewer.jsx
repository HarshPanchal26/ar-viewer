// // "use client"

// // import { useState, useEffect } from "react"
// // import ModelViewerComponent from "./ModelViewerComponent"
// // import "../styles/model-viewer.css"

// // export default function ModelViewer({ model, onBack, allModels, onSelectModel }) {
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //     setLoading(true)
// //     const timer = setTimeout(() => setLoading(false), 1000)
// //     return () => clearTimeout(timer)
// //   }, [model])

// //   const modelUrl = model.dracoURL || model.URL

// //   return (
// //     <div className="model-viewer-container">
// //       <div className="viewer-header">
// //         <button className="back-button" onClick={onBack}>
// //           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //             <path d="M19 12H5M12 19l-7-7 7-7" />
// //           </svg>
// //           Go Back
// //         </button>
// //       </div>

// //       <div className="viewer-content">
// //         <div className="viewer-main">
// //           <div className="model-viewer-wrapper">
// //             {loading && (
// //               <div className="viewer-loader">
// //                 <div className="spinner"></div>
// //                 <p>Loading 3D Model...</p>
// //               </div>
// //             )}
// //             <ModelViewerComponent posterImage={model.posterImage} modelUrl={modelUrl} modelName={model.modelName} />
// //           </div>
// //           <div className="model-info">
// //             <h2 className="model-title">{model.modelName}</h2>
// //           </div>
// //         </div>

// //         <div className="viewer-sidebar">
// //           <h3 className="sidebar-title">3D Models</h3>
// //           <div className="model-list-sidebar">
// //             {allModels.map((m, index) => (
// //               <div
// //                 key={index}
// //                 className={`sidebar-model-item ${m.modelName === model.modelName ? "active" : ""}`}
// //                 onClick={() => onSelectModel(m)}
// //               >
// //                 <div className="sidebar-model-image">
// //                   <img
// //                     src={
// //                       m.posterImage ||
// //                       "https://melzo-guru.s3.ap-south-1.amazonaws.com/images/image/lesson-plan/3D+Model.jpg" ||
// //                       "/placeholder.svg"
// //                     }
// //                     alt={m.modelName}
// //                   />
// //                 </div>
// //                 <div className="sidebar-model-name">
// //                   <p>{m.modelName}</p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }


// "use client"

// import { useState, useEffect } from "react"
// import ModelViewerComponent from "./ModelViewerComponent"
// import "../styles/model-viewer.css"

// export default function ModelViewer({ model, onBack, allModels, onSelectModel }) {
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     setLoading(true)
//     const timer = setTimeout(() => setLoading(false), 1000)
//     return () => clearTimeout(timer)
//   }, [model])

//   const modelUrl = model.dracoURL || model.URL

//   return (
//     <div className="model-viewer-container">
//       <div className="viewer-header">
//         <button className="back-button" onClick={onBack}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M19 12H5M12 19l-7-7 7-7" />
//           </svg>
//           Go Back
//         </button>
//         <div className="model-badges">
//           {model.hasAR && (
//             <span className="badge ar-badge">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
//                 <path d="M8 21h8M12 17v4" />
//               </svg>
//               AR Enabled
//             </span>
//           )}
//           {model.hasAudio && (
//             <span className="badge audio-badge">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M11 5L6 9H2v6h4l5 4V5z" />
//                 <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
//               </svg>
//               Audio
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="viewer-content">
//         <div className="viewer-main">
//           <div className="model-viewer-wrapper">
//             {loading && (
//               <div className="viewer-loader">
//                 <div className="spinner"></div>
//                 <p>Loading 3D Model...</p>
//               </div>
//             )}
//             <ModelViewerComponent
//               posterImage={model.posterImage}
//               modelUrl={modelUrl}
//               modelName={model.modelName}
//               audioUrl={model.audioUrl}
//               iosModelUrl={model.iosModelUrl}
//             />
//           </div>
//           <div className="model-info">
//             <h2 className="model-title">{model.modelName}</h2>
//             {model.hasAR && (
//               <p className="model-description">
//                 Click the AR icon in the viewer to experience this model in your real environment. Audio will play
//                 automatically in AR mode.
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="viewer-sidebar">
//           <h3 className="sidebar-title">3D Models</h3>
//           <div className="model-list-sidebar">
//             {allModels.map((m, index) => (
//               <div
//                 key={index}
//                 className={`sidebar-model-item ${m.modelName === model.modelName ? "active" : ""}`}
//                 onClick={() => onSelectModel(m)}
//               >
//                 <div className="sidebar-model-image">
//                   <img
//                     src={
//                       m.posterImage ||
//                       "https://melzo-guru.s3.ap-south-1.amazonaws.com/images/image/lesson-plan/3D+Model.jpg" ||
//                       "/placeholder.svg" ||
//                       "/placeholder.svg"
//                     }
//                     alt={m.modelName}
//                   />
//                   {(m.hasAR || m.hasAudio) && (
//                     <div className="sidebar-badges">
//                       {m.hasAR && <span className="mini-badge">AR</span>}
//                       {m.hasAudio && <span className="mini-badge">🔊</span>}
//                     </div>
//                   )}
//                 </div>
//                 <div className="sidebar-model-name">
//                   <p>{m.modelName}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import ModelViewerComponent from "./ModelViewerComponent"
import "../styles/model-viewer.css"

export default function ModelViewer({ model, onBack, allModels, onSelectModel }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [model])

  const modelUrl = model.dracoURL || model.URL

  return (
    <div className="model-viewer-container">
      <div className="viewer-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Go Back
        </button>
        <div className="model-badges">
          {model.hasAR && (
            <span className="badge ar-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              AR Enabled
            </span>
          )}
          {model.hasAudio && (
            <span className="badge audio-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              Audio
            </span>
          )}
        </div>
      </div>

      <div className="viewer-content">
        <div className="viewer-main">
          <div className="model-viewer-wrapper">
            {loading && (
              <div className="viewer-loader">
                <div className="spinner"></div>
                <p>Loading 3D Model...</p>
              </div>
            )}
            <ModelViewerComponent
              posterImage={model.posterImage}
              modelUrl={model.URL}
              modelName={model.modelName}
              audioUrl={model.audioLink}
              iosModelUrl={model.iosModelUrl}
              dracoUrl={model.dracoURL}
            />
          </div>
          <div className="model-info">
            <h2 className="model-title">{model.modelName}</h2>
            {(model.subjectName || model.className || model.chapterName) && (
              <div className="model-metadata">
                {model.subjectName && <span className="metadata-tag">{model.subjectName}</span>}
                {model.className && <span className="metadata-tag">{model.className}</span>}
                {model.chapterName && <span className="metadata-tag">{model.chapterName}</span>}
              </div>
            )}
            {model.hasAR && (
              <p className="model-description">
                Click the AR icon in the viewer to experience this model in your real environment.
                {model.hasAudio && " Audio will play automatically in AR mode."}
              </p>
            )}
          </div>
        </div>

        <div className="viewer-sidebar">
          <h3 className="sidebar-title">3D Models</h3>
          <div className="model-list-sidebar">
            {allModels.map((m, index) => (
              <div
                key={m.modelId || index}
                className={`sidebar-model-item ${m.modelName === model.modelName ? "active" : ""}`}
                onClick={() => onSelectModel(m)}
              >
                <div className="sidebar-model-image">
                  <img
                    src={
                      m.posterImage ||
                      "https://melzo-guru.s3.ap-south-1.amazonaws.com/images/image/lesson-plan/3D+Model.jpg" ||
                      "/placeholder.svg"
                    }
                    alt={m.modelName}
                  />
                  {(m.hasAR || m.hasAudio) && (
                    <div className="sidebar-badges">
                      {m.hasAR && <span className="mini-badge">AR</span>}
                      {m.hasAudio && <span className="mini-badge">🔊</span>}
                    </div>
                  )}
                </div>
                <div className="sidebar-model-name">
                  <p>{m.modelName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
