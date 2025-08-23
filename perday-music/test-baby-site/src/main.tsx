import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"

// Fail loudly: show any runtime error on screen instead of a blank page.
function installGlobalErrorOverlay() {
  const show = (title: string, msg: string) => {
    const el = document.createElement("pre")
    el.style.position = "fixed"
    el.style.inset = "0"
    el.style.margin = "0"
    el.style.padding = "24px"
    el.style.background = "#1a1a1a"
    el.style.color = "#fff"
    el.style.font = "14px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    el.style.zIndex = "2147483647"
    el.textContent = `${title}\n\n${msg}`
    document.body.innerHTML = ""
    document.body.appendChild(el)
  }

  window.addEventListener("error", (e) => show("Uncaught Error", `${e.message}\n${e.error?.stack ?? ""}`))
  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    const reason = (e.reason && (e.reason.stack || e.reason.message)) || String(e.reason)
    show("Unhandled Promise Rejection", reason)
  })
}
installGlobalErrorOverlay()

const rootEl = document.getElementById("root")
if (!rootEl) throw new Error("#root not found")

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
)
