"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "./components/Header"
import ModelList from "./components/ModelList"
import ModelViewer from "./components/ModelViewer"
import Loader from "./components/Loader"
import ErrorMessage from "./components/ErrorMessage"
import QRScanner from "./components/QRScanner"
import ARModelViewer from "./components/ARModelViewer"
import { fetch3dModels, getFeaturedModels } from "./services/api"
import "./styles/app.css"

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageFromUrl = Number.parseInt(searchParams.get("page")) || 1

  const [models, setModels] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [featuredModels, setFeaturedModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(pageFromUrl)
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showARViewer, setShowARViewer] = useState(false)
  const [scannedModelUrl, setScannedModelUrl] = useState(null)

  useEffect(() => {
    setFeaturedModels(getFeaturedModels())
  }, [])

  useEffect(() => {
    loadModels(pageFromUrl)
  }, [pageFromUrl])

  useEffect(() => {
    if (searchQuery.trim()) {
      const allModels = [...featuredModels, ...models]
      const filtered = allModels.filter((model) =>
        model.modelName.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      )
      setFilteredModels(filtered)
    } else {
      setFilteredModels(models)
    }
  }, [searchQuery, models, featuredModels])

  const loadModels = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch3dModels(page)

      if (response.models && response.models.length > 0) {
        setModels(response.models)
        setFilteredModels(response.models)
        setCurrentPage(page)
        setTotalCount(response.totalCount)
      } else {
        setModels([])
        setFilteredModels([])
        setError(response.error || "No models available at the moment.")
      }

      setLoading(false)
    } catch (err) {
      console.error("Error loading models:", err)
      setError("Failed to load 3D models. Please try again later.")
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}`)
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
    setScannedModelUrl(url)
    setShowQRScanner(false)
    setShowARViewer(true)
  }

  const handleCloseQRScanner = () => {
    setShowQRScanner(false)
  }

  const handleCloseARViewer = () => {
    setShowARViewer(false)
    setScannedModelUrl(null)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <div className="app">
      <Header onQRScanClick={handleQRScanClick} onSearch={handleSearch} searchQuery={searchQuery} />

      <main className="main-content">
        {loading && models.length === 0 ? (
          <Loader message="Loading 3D Models..." />
        ) : error && models.length === 0 ? (
          <ErrorMessage message={error} onRetry={() => loadModels(currentPage)} />
        ) : selectedModel ? (
          <ModelViewer
            model={selectedModel}
            onBack={handleBackToList}
            allModels={filteredModels}
            onSelectModel={handleModelSelect}
          />
        ) : (
          <>
            {/* {!searchQuery && featuredModels.length > 0 && (
              <ModelList
                models={featuredModels}
                onSelectModel={handleModelSelect}
                sectionTitle="Frequently Viewed"
                showPagination={false}
              />
            )} */}

            <ModelList
              models={filteredModels}
              onSelectModel={handleModelSelect}
              currentPage={currentPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              loading={loading}
              searchQuery={searchQuery}
              sectionTitle={searchQuery ? "Search Results" : "All AR Models"}
              showPagination={!searchQuery}
            />
          </>
        )}
      </main>

      {showQRScanner && <QRScanner onScanSuccess={handleQRScanSuccess} onClose={handleCloseQRScanner} />}

      {showARViewer && scannedModelUrl && <ARModelViewer modelUrl={scannedModelUrl} onClose={handleCloseARViewer} />}
    </div>
  )
}
