// "use client"
// import "../styles/model-list.css"

// export default function ModelList({
//   models,
//   onSelectModel,
//   currentPage,
//   totalPages,
//   onPageChange,
//   loading,
//   searchQuery,
// }) {
//   return (
//     <div className="model-list-container">
//       <div className="model-list-header">
//         <div className="header-left">
//           <h2>Discover AR Models</h2>
//           <p className="model-count">
//             {searchQuery && `Search results for "${searchQuery}" - `}
//             {models.length} model{models.length !== 1 ? "s" : ""}
//           </p>
//         </div>
//       </div>

//       <div className="model-grid">
//         {models.map((model, index) => (
//           <div key={index} className="model-card" onClick={() => onSelectModel(model)}>
//             <div className="model-card-image">
//               <img
//                 src={
//                   model.posterImage ||
//                   "https://melzo-guru.s3.ap-south-1.amazonaws.com/images/image/lesson-plan/3D+Model.jpg" ||
//                   "/placeholder.svg" ||
//                   "/placeholder.svg"
//                 }
//                 alt={model.modelName}
//                 loading="lazy"
//               />
//               {(model.hasAR || model.hasAudio) && (
//                 <div className="card-badges">
//                   {model.hasAR && (
//                     <span className="card-badge">
//                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
//                         <path d="M8 21h8M12 17v4" />
//                       </svg>
//                       AR
//                     </span>
//                   )}
//                   {model.hasAudio && (
//                     <span className="card-badge">
//                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M11 5L6 9H2v6h4l5 4V5z" />
//                         <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
//                       </svg>
//                       Audio
//                     </span>
//                   )}
//                 </div>
//               )}
//               <div className="model-card-overlay">
//                 <span className="view-model-text">View Model</span>
//               </div>
//             </div>
//             <div className="model-card-content">
//               <h3 className="model-card-title">{model.modelName}</h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       {totalPages > 1 && (
//         <div className="pagination-container">
//           <button
//             className="pagination-btn"
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1 || loading}
//           >
//             Previous
//           </button>

//           <div className="pagination-numbers">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 className={`pagination-number ${page === currentPage ? "active" : ""}`}
//                 onClick={() => onPageChange(page)}
//                 disabled={loading}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>

//           <button
//             className="pagination-btn"
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages || loading}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }


// "use client"
// import "../styles/model-list.css"

// export default function ModelList({
//   models,
//   onSelectModel,
//   currentPage,
//   totalCount,
//   onPageChange,
//   loading,
//   searchQuery,
// }) {
//   const itemsPerPage = 10
//   const totalPages = Math.ceil(totalCount / itemsPerPage)

//   return (
//     <div className="model-list-container">
//       <div className="model-list-header">
//         <div className="header-left">
//           <h2>Discover AR Models</h2>
//           <p className="model-count">
//             {searchQuery && `Search results for "${searchQuery}" - `}
//             {models.length} model{models.length !== 1 ? "s" : ""} {!searchQuery && totalCount > 0 && `of ${totalCount}`}
//           </p>
//         </div>
//       </div>

//       <div className="model-grid">
//         {models.map((model, index) => (
//           <div key={model.modelId || index} className="model-card" onClick={() => onSelectModel(model)}>
//             <div className="model-card-image">
//               <img
//                 src={
//                   model.posterImage ||
//                   "https://melzo-guru.s3.ap-south-1.amazonaws.com/images/image/lesson-plan/3D+Model.jpg" ||
//                   "/placeholder.svg"
//                 }
//                 alt={model.modelName}
//                 loading="lazy"
//               />
//               {(model.hasAR || model.hasAudio) && (
//                 <div className="card-badges">
//                   {model.hasAR && (
//                     <span className="card-badge">
//                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
//                         <path d="M8 21h8M12 17v4" />
//                       </svg>
//                       AR
//                     </span>
//                   )}
//                   {model.hasAudio && (
//                     <span className="card-badge">
//                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M11 5L6 9H2v6h4l5 4V5z" />
//                         <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
//                       </svg>
//                       Audio
//                     </span>
//                   )}
//                 </div>
//               )}
//               <div className="model-card-overlay">
//                 <span className="view-model-text">View Model</span>
//               </div>
//             </div>
//             <div className="model-card-content">
//               <h3 className="model-card-title">{model.modelName}</h3>
//               {model.subjectName && model.className && (
//                 <p className="model-card-meta">
//                   {model.subjectName} • {model.className}
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {totalPages > 1 && !searchQuery && (
//         <div className="pagination-container">
//           <button
//             className="pagination-btn"
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1 || loading}
//           >
//             Previous
//           </button>

//           <div className="pagination-numbers">
//             {(() => {
//               const maxVisible = 7
//               let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
//               const endPage = Math.min(totalPages, startPage + maxVisible - 1)

//               if (endPage - startPage + 1 < maxVisible) {
//                 startPage = Math.max(1, endPage - maxVisible + 1)
//               }

//               const pages = []
//               for (let i = startPage; i <= endPage; i++) {
//                 pages.push(i)
//               }

//               return pages.map((page) => (
//                 <button
//                   key={page}
//                   className={`pagination-number ${page === currentPage ? "active" : ""}`}
//                   onClick={() => onPageChange(page)}
//                   disabled={loading}
//                 >
//                   {page}
//                 </button>
//               ))
//             })()}
//           </div>

//           <button
//             className="pagination-btn"
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages || loading}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }



"use client"
import "../styles/model-list.css"

export default function ModelList({
  models,
  onSelectModel,
  currentPage = 1,
  totalCount = 0,
  onPageChange,
  loading,
  searchQuery,
  sectionTitle = "Discover AR Models",
  showPagination = true,
}) {
  const itemsPerPage = 10
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="model-list-container">
      <div className="model-list-header">
        <div className="header-left">
          <h2>{sectionTitle}</h2>
          <p className="model-count">
            {searchQuery && `Search results for "${searchQuery}" - `}
            {/* {models.length} model{models.length !== 1 ? "s" : ""} {!searchQuery && totalCount > 0 && `of ${totalCount}`} */}
          </p>
        </div>
      </div>

      <div className="model-grid">
        {models.map((model, index) => (
          <div key={model.modelId || index} className="model-card" onClick={() => onSelectModel(model)}>
            <div className="model-card-image">
              <img
                src={
                  model.posterImage ||
                  "https://melzo-guru.s3.ap-south-1.amazonaws.com/images/image/lesson-plan/3D+Model.jpg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={model.modelName}
                loading="lazy"
              />
              {(model.hasAR || model.hasAudio) && (
                <div className="card-badges">
                  {model.hasAR && (
                    <span className="card-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <path d="M8 21h8M12 17v4" />
                      </svg>
                      AR
                    </span>
                  )}
                  {model.hasAudio && (
                    <span className="card-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                      Audio
                    </span>
                  )}
                </div>
              )}
              <div className="model-card-overlay">
                <span className="view-model-text">View Model</span>
              </div>
            </div>
            <div className="model-card-content">
              <h3 className="model-card-title">{model.modelName}</h3>
              {model.subjectName && model.className && (
                <p className="model-card-meta">
                  {model.subjectName} • {model.className}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>

          <div className="pagination-numbers">
            {(() => {
              const maxVisible = 7;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              const endPage = Math.min(totalPages, startPage + maxVisible - 1);
              if (endPage - startPage + 1 < maxVisible) {
                startPage = Math.max(1, endPage - maxVisible + 1);
              }
              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
              }
              return pages.map((page) => (
                <button
                  key={page}
                  className={`pagination-number ${page === currentPage ? "active" : ""}`}
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                >
                  {page}
                </button>
              ));
            })()}
          </div>

          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
  