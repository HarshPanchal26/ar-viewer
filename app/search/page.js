"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "../components/Header"
import ModelList from "../components/ModelList"
import ModelViewer from "../components/ModelViewer"
import Loader from "../components/Loader"
import ErrorMessage from "../components/ErrorMessage"
import QRScanner from "../components/QRScanner"
import ARModelViewer from "../components/ARModelViewer"
import { fetch3dModels, fetchSearchModels } from "../services/api"
import "../styles/app.css"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageFromUrl = Number.parseInt(searchParams.get("page")) || 1
  const queryFromUrl = searchParams.get("query") || ""

  const [models, setModels] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(pageFromUrl)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState(queryFromUrl)

  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showARViewer, setShowARViewer] = useState(false)
  const [scannedModelUrl, setScannedModelUrl] = useState(null)

  useEffect(() => {
    if (searchQuery.trim()) {
      loadSearchModels(searchQuery, currentPage)
    }
  }, [searchQuery, currentPage])

  const loadSearchModels = async (query, page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchSearchModels(query, page)
      if (response.models && response.models.length > 0) {
        setModels(response.models)
        setFilteredModels(response.models)
        setCurrentPage(page)
        setTotalCount(response.totalCount)
      } else {
        setModels([])
        setFilteredModels([])
        setError(response.error || "No models found for this search.")
      }
      setLoading(false)
    } catch (err) {
      console.error("Error loading search models:", err)
      setError("Failed to load search results. Please try again later.")
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    router.push(`/search?page=${newPage}&query=${encodeURIComponent(searchQuery)}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleModelSelect = (model) => {
    setSelectedModel(model)
  }

  const handleBackToList = () => {
    setSelectedModel(null)
  }

  const handleQRScanClick = () => {
    setShowQRScanner(true)
  }

  const handleQRScanSuccess = (url) => {
    if (showARViewer || scannedModelUrl === url) return;
    setScannedModelUrl(url);
    setShowQRScanner(false);
    setShowARViewer(true);
  }

  const handleCloseQRScanner = () => {
    setShowQRScanner(false);
    setScannedModelUrl(null);
  }

  const handleCloseARViewer = () => {
    setShowARViewer(false);
    setTimeout(() => setScannedModelUrl(null), 300);
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    router.push(`/search?page=1&query=${encodeURIComponent(query)}`)
  }

  const handleBackToDashboard = () => {
    router.back();
  };

  return (
    <div className="app">
      <Header onQRScanClick={handleQRScanClick} onSearch={handleSearch} searchQuery={searchQuery} />
      <main className="main-content">
        {/* Back button for all screens */}
        <div className="search-header-actions" style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <button
            type="button"
            onClick={handleBackToDashboard}
            className="back-to-dashboard-btn"
            style={{ padding: "8px 16px", fontSize: "1rem", borderRadius: "6px", background: "#eee", border: "none", cursor: "pointer" }}
          >
            ← Back to Dashboard
          </button>
        </div>
        {loading && models.length === 0 ? (
          <Loader message="Loading 3D Models..." />
        ) : error && models.length === 0 ? (
          <ErrorMessage message={error} onRetry={() => loadSearchModels(searchQuery, currentPage)} />
        ) : selectedModel ? (
          <ModelViewer
            model={selectedModel}
            onBack={handleBackToList}
            allModels={filteredModels}
            onSelectModel={handleModelSelect}
          />
        ) : (
          <ModelList
            models={filteredModels}
            onSelectModel={handleModelSelect}
            currentPage={currentPage}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            loading={loading}
            searchQuery={searchQuery}
            sectionTitle={searchQuery ? "Search Results" : "All AR Models"}
            showPagination={true}
          />
        )}
      </main>
      {showQRScanner && (
        <QRScanner
          key={showQRScanner ? 'open' : 'closed'}
          onScanSuccess={handleQRScanSuccess}
          onClose={handleCloseQRScanner}
        />
      )}
      {showARViewer && scannedModelUrl && (
        <ARModelViewer
          key={scannedModelUrl}
          modelUrl={scannedModelUrl}
          onClose={handleCloseARViewer}
        />
      )}
    </div>
  )
}
