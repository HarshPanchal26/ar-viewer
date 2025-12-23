"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import "../styles/qr-scanner.css"

export default function QRScanner({ onScanSuccess, onClose }) {
  const isActiveRef = useRef(true)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const [cameraPermission, setCameraPermission] = useState(null)
  const [cameraLoading, setCameraLoading] = useState(false);
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
      setCameraLoading(true);
      // Clean up any previous scanner DOM content
      const qrReaderElem = document.getElementById("qr-reader");
      if (qrReaderElem) {
        qrReaderElem.innerHTML = "";
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      // Timeout for camera startup
      let cameraStarted = false;
      const timeout = setTimeout(() => {
        if (!cameraStarted) {
          setCameraLoading(false);
          setError("Camera failed to open. Please check permissions and try again.");
        }
      }, 5000); // 5 seconds

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (!isActiveRef.current) return;
          clearTimeout(timeout);
          setCameraLoading(false);
          stopScanning();
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Silent error for scanning process
        },
      );
      cameraStarted = true;
      clearTimeout(timeout);
      setCameraLoading(false);
      setScanning(true);
      setError(null);
    } catch (err) {
      setCameraLoading(false);
      console.error("Error starting scanner:", err);
      setError("Failed to start camera. Please try again.");
      setScanning(false);
    }
  }

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (scanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear(); // Properly clear the scanner and release camera
        html5QrCodeRef.current = null;
        setScanning(false);
      } catch (err) {
        console.error("Error stopping/clearing scanner:", err);
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
              {cameraLoading && (
                <div className="qr-loading">Opening camera...</div>
              )}
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

