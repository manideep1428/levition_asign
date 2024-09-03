import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>  
      <Toaster /> 
   </BrowserRouter>
  </StrictMode>,
)
