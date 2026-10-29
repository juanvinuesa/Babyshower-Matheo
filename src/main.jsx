import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Lista from './Lista.jsx'

const isLista = window.location.pathname.replace(/\/+$/, '') === '/lista'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isLista ? <Lista /> : <App />}
  </StrictMode>,
)
