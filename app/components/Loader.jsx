import "../styles/loader.css"

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loader-message">{message}</p>
    </div>
  )
}
