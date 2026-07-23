import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RoadmapApp from './features/roadmap/pages/RoadmapApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoadmapApp />
  </StrictMode>,
)
