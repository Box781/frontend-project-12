import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { io } from 'socket.io-client'
import init from './init.jsx'

const app = async () => {
  const socket = io()
  const vdom = await init(socket)
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      {vdom}
    </StrictMode>,
  )
}

app()
