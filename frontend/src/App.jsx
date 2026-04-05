import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Bootstrap styles and icons
import 'bootstrap/dist/css/bootstrap.min.css'         
import 'bootstrap/dist/js/bootstrap.bundle.min.js'      
// Bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css'     
// Pages and other components  
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Profile from './pages/Profile'
import ShoppingCart from './pages/ShoppingCart'
import Checkout from './pages/Checkout'

// Main app component - sets up routing and page layout
function App() {
  return (
    <BrowserRouter>
      {/* Full page layout with navbar at top and footer at bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar shown on all pages */}
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Home />} />
            {/* About us page */}
            <Route path="/about" element={<AboutUs />} />
            {/* Login / register page */}
            <Route path="/profile" element={<Profile />} />
            {/* Shopping cart page */}
            <Route path="/cart" element={<ShoppingCart />} />
            {/* Checkout page */}
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
        {/* Footer shown on all pages */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;