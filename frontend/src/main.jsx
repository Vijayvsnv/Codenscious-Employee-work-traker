import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "./context/ThemeContext"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!bg-card !text-foreground !border-border",
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
