import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Entry point for the frontend react app
import App from './App.jsx'
// Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css'; 

// Run script "npm run dev" to start the frontend

// Entry point: mounts the React app into the root div in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)