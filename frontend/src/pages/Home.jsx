import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Hero Image
import heroImage from "../assets/hero_i.png"; 

// List of product categories for the filter dropdown
const CATEGORIES = ["Laptops", "SmartPhones", "Accessories", "Desktops", "Speakers", "Hardware"];

// Returns the correct badge color and label based on product stock status
const getStockBadge = (product) => {
  if (product.availableQuantity > 0 && product.productStatus === 'Available')
    return { cls: 'bg-success', label: 'Available' };
  if (product.productStatus === 'Discontinued')
    return { cls: 'bg-secondary', label: 'Discontinued' };
  return { cls: 'bg-danger', label: 'Out of Stock' };
};

// Modal that shows full product details when user clicks "More Details"
const ProductModal = ({ product, onClose, onAddToCart }) => {
  const { cls, label } = getStockBadge(product);
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={onClose} 
    >
      {/* Modal card */}
      <div
        className="card shadow border-0 p-4"
        style={{ width: '100%', maxWidth: '700px', borderRadius: '16px' }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Modal header with back and close buttons */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-link text-dark text-decoration-none fw-semibold p-0" onClick={onClose}>
            <i className="bi bi-arrow-left me-1"></i> Go Back
          </button>
          <button className="btn btn-link text-dark p-0" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="row g-4 align-items-center">
          {/* Product image section */}
          <div className="col-md-5">
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{ height: '220px', backgroundColor: '#f0f0f0' }}
            >
              {/* Show image if available, otherwise show placeholder */}
              {product.productImage ? (
                <img src={product.productImage} alt={product.productName} style={{ maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '100%' }}>
                  <i className="bi bi-image" style={{ fontSize: '48px' }}></i>
                  <span className="small mt-2">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Product details section */}
          <div className="col-md-7">
            <h4 className="fw-bold">{product.productName}</h4>
            <p className="mt-2">
              <span className="fw-bold">Description: </span>
              {product.productDescription || 'No description available.'}
            </p>
            {/* Stock badge */}
            <span className={`badge mb-2 ${cls}`}>{label}</span>
            {/* Available quantity */}
            <p className="text-muted small mb-2">
              <i className="bi bi-box me-1"></i>
              {product.availableQuantity > 0 ? `${product.availableQuantity} units available` : 'Out of stock'}
            </p>
            {/* Price and add to cart button */}
            <div className="d-flex align-items-center justify-content-between mt-3">
              <h4 className="fw-bold mb-0">$ {product.productCost}</h4>
              <button
                className="btn btn-danger rounded-pill px-4"
                disabled={product.productStatus !== 'Available' || product.availableQuantity === 0}
                onClick={() => { onAddToCart(product._id); onClose(); }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual product card shown in the product grid
const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const isAvailable = product.productStatus === 'Available' && product.availableQuantity > 0;
  const { cls, label } = getStockBadge(product);

  return (
    // Each product card is a column in the grid
    <div className="col-md-4 mb-4 d-flex justify-content-center">
      {/* Product card*/}
      <div
        className="card h-100 product-card"
        style={{ width: '18rem', cursor: 'pointer' }}
      >
        {/* Product image area */}
        <div
          className="card-img-top d-flex align-items-center justify-content-center"
          style={{ height: '180px', backgroundColor: '#f0f0f0' }}
        >
          {/* Show image if available, otherwise show placeholder icon */}
          {product.productImage ? (
            <img src={product.productImage} alt={product.productName} style={{ maxHeight: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center text-muted w-100 h-100">
              <i className="bi bi-image" style={{ fontSize: '40px' }}></i>
              <span className="small mt-1">No Image</span>
            </div>
          )}
        </div>

        {/* Card body with product info and action buttons */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.productName}</h5>
          <p className="card-text text-muted small flex-grow-1">{product.productDescription}</p>
          {/* Stock status badge */}
          <span className={`badge mb-2 ${cls}`}>{label}</span>
          {/* Available quantity */}
          <p className="text-muted small mb-1">
            <i className="bi bi-box me-1"></i>
            {product.availableQuantity > 0 ? `${product.availableQuantity} available` : 'Out of stock'}
          </p>
          <p className="fw-bold mt-1">$ {product.productCost}</p>
          {/* Action buttons */}
          <div className="d-flex gap-2">
            {/* Disabled if product is unavailable or out of stock */}
            <button
              className="btn btn-danger btn-sm"
              disabled={!isAvailable}
              onClick={() => onAddToCart(product._id)}
            >
              Add to Cart
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => onViewDetails(product)}>
              More Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Home page component
// Contains all relevant components and logic for displaying the hero banner, product grid, category filtering etc.
const Home = () => {
  const [products, setProducts] = useState([]);       
  const [loading, setLoading] = useState(true);       
  const [error, setError] = useState(null);           
  const [cartMessage, setCartMessage] = useState(null); 
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null);  
  const [activeCategory, setActiveCategory] = useState(null);    
  const [showCategoryMenu, setShowCategoryMenu] = useState(false); 
  const categoryRef = useRef(null); 
  const navigate = useNavigate();

  // Close category dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setShowCategoryMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // get all products and their available quantities from the backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();

      // For each product, fetch real-time availability accounting for items in carts
      const productsWithAvailability = await Promise.all(
        data.map(async (product) => {
          try {
            const availRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product._id}/available`);
            const availData = await availRes.json();
            return { ...product, availableQuantity: availData.available, totalInCarts: availData.inCarts };
          } catch {
            // Fallback to product quantity if availability check fails
            return { ...product, availableQuantity: product.productQuantity };
          }
        })
      );

      setProducts(productsWithAvailability);
      setLoading(false);
    } catch {
      setError("Failed to load products");
      setLoading(false);
    }
  };

  // Load products when the page first renders
  useEffect(() => { fetchProducts(); }, []);

  // Handle adding a product to the cart
  const handleAddToCart = async (productID) => {
    const userID = localStorage.getItem('userID');

    // Show login prompt if user is not logged in
    if (!userID) { setShowLoginPrompt(true); return; }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${userID}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productID, quantity: 1 })
      });
      const data = await res.json();

      // Show success or error message
      setCartMessage(res.ok
        ? { type: 'success', text: 'Product added to cart!' }
        : { type: 'danger', text: data.message }
      );

      // Refresh products to update availability
      if (res.ok) fetchProducts();

      // Auto-hide message after 3 seconds
      setTimeout(() => setCartMessage(null), 3000);
    } catch {
      setCartMessage({ type: 'danger', text: 'Failed to add to cart' });
    }
  };

  // Filter products by active category or show all if none selected
  const displayedProducts = activeCategory
    ? products.filter(p => p.productCategory === activeCategory)
    : products;

    // returns the main page section
  return (
    <div>
      {/* Hero Banner Section */}
      <div style={{
        position: 'relative',
        height: '400px',
        backgroundColor: '#e8453c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 50px',
        overflow: 'hidden',
      }}>
        {/* Hero text */}
        <div style={{ color: 'white', zIndex: 2 }}>
          <h1 className="fw-bold" style={{ fontSize: '2.5rem' }}>TECHSPOT</h1>
          <p style={{ fontSize: '1.25rem', marginTop: '10px' }}> Lorem ipsum dolor sit amet</p>
          <p style={{ fontSize: '1rem', marginTop: '8px', maxWidth: '450px', color: 'rgba(255,255,255,0.95)' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
          </p>
        </div>
        {/* Hero image */}
        <div style={{ zIndex: 2 }}>
          <img
            src={heroImage}
            alt="Tech products"
            style={{ maxHeight: '350px', opacity: 0.9, border: '2px solid rgba(232, 72, 60, 0.7)', borderRadius: '8px' }}
          />
        </div>
      </div>

      {/* Login Required Modal */}
      {showLoginPrompt && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="card shadow border-0 p-4 text-center"
            style={{ width: '100%', maxWidth: '400px', borderRadius: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* User icon */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mb-3 mx-auto"
              style={{ width: '70px', height: '70px', backgroundColor: '#e8453c' }}
            >
              <i className="bi bi-person-fill text-white" style={{ fontSize: '35px' }}></i>
            </div>
            <h5 className="fw-bold">Login Required</h5>
            <p className="text-muted">You need to be logged in to add items to your cart.</p>
            {/* Sign in or cancel */}
            <div className="d-flex gap-2 justify-content-center mt-2">
              <button className="btn btn-danger" onClick={() => { setShowLoginPrompt(false); navigate('/profile'); }}>Sign In</button>
              <button className="btn btn-outline-secondary" onClick={() => setShowLoginPrompt(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Products Section */}
      <div className="container mt-5">
        {/* Section header with category filter */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">{activeCategory ?? 'Featured Products'}</h4>

          {/* Category dropdown */}
          <div className="position-relative" ref={categoryRef}>
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              onClick={() => setShowCategoryMenu(prev => !prev)}
            >
              <span className="fw-bold">Categories</span>
              <i className={`bi bi-chevron-${showCategoryMenu ? 'up' : 'down'}`}></i>
            </button>

            {/* Dropdown menu */}
            {showCategoryMenu && (
              <div className="position-absolute end-0 mt-1 bg-white border rounded shadow" style={{ minWidth: '180px', zIndex: 999 }}>
                {/* Show all products option */}
                <button
                  className={`dropdown-item py-2 px-3 w-100 text-start ${activeCategory === null ? 'fw-bold text-danger' : ''}`}
                  onClick={() => { setActiveCategory(null); setShowCategoryMenu(false); }}
                >
                  <i className="bi bi-grid me-2"></i>All Products
                </button>
                <hr className="my-1" />
                {/* Individual category options */}
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`dropdown-item py-2 px-3 w-100 text-start ${activeCategory === cat ? 'fw-bold text-danger' : ''}`}
                    onClick={() => { setActiveCategory(cat); setShowCategoryMenu(false); }}
                  >
                    {activeCategory === cat && <i className="bi bi-check me-1"></i>}
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart feedback message */}
        {cartMessage && <div className={`alert alert-${cartMessage.type}`}>{cartMessage.text}</div>}

        {/* Loading and error states */}
        {loading && <p className="text-center text-muted mt-3">Loading products...</p>}
        {error && <p className="text-center text-danger mt-3">{error}</p>}

        {/* Empty state message */}
        {!loading && !error && displayedProducts.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-box-seam text-muted" style={{ fontSize: '48px' }}></i>
            <p className="text-muted mt-3">
              {activeCategory ? `No products found in "${activeCategory}".` : 'No products found.'}
            </p>
            {activeCategory && (
              <button className="btn btn-outline-danger btn-sm" onClick={() => setActiveCategory(null)}>
                View All Products
              </button>
            )}
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && displayedProducts.length > 0 && (
          <div className="row">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;