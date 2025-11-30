import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
// En main.tsx o index.tsx
import '@mantine/core/styles.css';
import App from './App.tsx'
import './index.css'
createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </MantineProvider>,
)
