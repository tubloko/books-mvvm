import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { createDependencies } from './core/createDependencies'
import { DependenciesContext } from './core/Dependencies'
import { getRootElement } from './core/getRootElement'
import './styles.css'

const dependencies = createDependencies()

createRoot(getRootElement()).render(
  <StrictMode>
    <DependenciesContext value={dependencies}>
      <App />
    </DependenciesContext>
  </StrictMode>,
)
