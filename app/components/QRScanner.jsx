"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import "../styles/qr-scanner.css"

export default function QRScanner({ onScanSuccess, onClose }) {
  const isActiveRef = useRef(true)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const [cameraPermission, setCameraPermission] = useState(null)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)

  useEffect(() => {
    isActiveRef.current = true;
    requestCameraPermission()
    return () => {
      isActiveRef.current = false;
      stopScanning()
    }
  }, [])

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())
      setCameraPermission(true)
      startScanning()
    } catch (err) {
      console.error("Camera permission error:", err)
      setCameraPermission(false)
      setError("Camera access denied. Please allow camera permission to scan QR codes.")
    }
  }

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader")
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (!isActiveRef.current) return;
          console.log("[v0] QR Code scanned:", decodedText)
          stopScanning()
          onScanSuccess(decodedText)
        },
        (errorMessage) => {
          // Silent error for scanning process
        },
      )

      setScanning(true)
      setError(null)
    } catch (err) {
      console.error("Error starting scanner:", err)
      setError("Failed to start camera. Please try again.")
      setScanning(false)
    }
  }

  const stopScanning = async () => {
    if (html5QrCodeRef.current && scanning) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current = null
        setScanning(false)
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
    }
  }

  const handleClose = async () => {
    isActiveRef.current = false;
    await stopScanning()
    onClose()
  }

  const handleRetry = async () => {
    setError(null)
    await stopScanning()
    requestCameraPermission()
  }

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-container">
        <div className="qr-scanner-header">
          <h2>Scan QR Code</h2>
          <button className="qr-close-button" onClick={handleClose} aria-label="Close Scanner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="qr-scanner-content">
          {error ? (
            <div className="qr-error-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              <p className="qr-error-message">{error}</p>
              <div className="qr-error-actions">
                <button className="qr-retry-button" onClick={handleRetry}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                  Retry
                </button>
                <button className="qr-back-button" onClick={handleClose}>
                  Back to Models
                </button>
              </div>
            </div>
          ) : (
            <>
              <div id="qr-reader" ref={scannerRef} className="qr-reader"></div>
              <div className="qr-instructions">
                <p>Position the QR code within the frame to scan</p>
                <p className="qr-instructions-sub">The QR code should contain a URL to a 3D model</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
