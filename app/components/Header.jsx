"use client"

import { useState } from "react"
import "../styles/header.css"

export default function Header({ onQRScanClick, onSearch, searchQuery }) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(localSearchQuery)
    }
  }

  const handleClearSearch = () => {
    setLocalSearchQuery("")
    if (onSearch) {
      onSearch("")
    }
    setIsSearchOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <img
            src="/Anubhav_logo_1.png"
            alt="Anubhav Logo"
            className="logo-img"
            style={{ height: "40px", width: "auto" }}
          />
        </div>

        <div className="header-divider"></div>

        <div className="header-title-section">
          <h1 className="header-title">AR Lab</h1>
          <p className="header-subtitle">Augmented Reality Experience</p>
        </div>

        <div className="header-actions">
          {/* Search Form - Desktop */}
          <form className="search-form desktop-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search models..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {localSearchQuery && (
              <button type="button" onClick={handleClearSearch} className="clear-search-btn" aria-label="Clear search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button type="submit" className="search-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          {/* Mobile Search Toggle */}
          <button className="icon-btn mobile-search-toggle" onClick={toggleSearch} aria-label="Toggle search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {onQRScanClick && (
            <button className="icon-btn qr-scan-button" onClick={onQRScanClick} aria-label="Scan QR Code">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="btn-text">Scan QR</span>
            </button>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div className="mobile-search-dropdown">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search models..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="search-input"
              autoFocus
            />
            {localSearchQuery && (
              <button type="button" onClick={handleClearSearch} className="clear-search-btn" aria-label="Clear search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button type="submit" className="search-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
