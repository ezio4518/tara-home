import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  //removed <React.StrictMode> to use third party libraries and avoid double rendering
  <BrowserRouter>
    <ShopContextProvider> {/* to get context api support in whole project */}
      <App />
    </ShopContextProvider>
  </BrowserRouter>,
)
