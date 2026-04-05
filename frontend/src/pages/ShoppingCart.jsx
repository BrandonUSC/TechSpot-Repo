import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Shopping cart page - shows all items the user has added to their cart
const ShoppingCart = () => {
  // State variables for cart items, found in backend, loading status, and error messages
  const [cart, setCart] = useState([]);         
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     
  const navigate = useNavigate();

  // Get the logged in user's ID from local storage
  const userID = localStorage.getItem('userID');

  // fetch the user's cart when the page loads
  useEffect(() => {
    // if no user is logged in, show an error
    if (!userID) {
      setError("Please log in to view your cart");
      setLoading(false);
      return;
    }

    // fetch cart data from backend
    fetch(`${import.meta.env.VITE_API_URL}/api/cart/${userID}`)
      .then((res) => res.json())
      .then((data) => {
        setCart(data.products || []); 
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load cart");
        setLoading(false);
      });
  }, []);

  // increase quantity of a cart item by 1
  const increaseQuantity = (productID) => {
    setCart(cart.map(item =>
      item.productID._id === productID
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // Decrease quantity of a cart item by 1 (minimum 1)
  const decreaseQuantity = (productID) => {
    setCart(cart.map(item =>
      item.productID._id === productID && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  // Remove an item from the cart
  const removeItem = (productID) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cart/${userID}/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productID })
    })
      .then(() => setCart(cart.filter(item => item.productID._id !== productID))) // Remove from local state
      .catch((err) => console.error(err));
  };

  // Calculate total price of all items in cart
  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.quantity * item.productID.productCost;
  }, 0);

  // return shopping cart page content
  return (
    <div className="container mt-4">

      {/* Back to home link */}
      <div className="mb-2">
        <Link to="/" className="text-decoration-none text-dark fw-semibold">
          <i className="bi bi-arrow-left"></i> Go Back
        </Link>
      </div>

      {/* Page title */}
      <h1 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>
        Cart <i className="bi bi-cart3"></i>
      </h1>

      {/* Loading state */}
      {loading && <p className="text-muted">Loading cart...</p>}

      {/* Error state: shown when user is not logged in or fetch fails */}
      {error && (
        <div className="text-center mt-5">
          <p className="text-danger fs-5">{error}</p>
          <button
            className="btn btn-danger mt-2"
            onClick={() => navigate('/profile')}
          >
            <i className="bi bi-person"></i> Sign In
          </button>
        </div>
      )}

      {/* Empty cart message */}
      {!loading && !error && cart.length === 0 && (
        <div className="text-center mt-5">
          <p className="text-muted fs-5">Your cart is empty.</p>
          <Link to="/" className="btn btn-danger mt-2">
            <i className="bi bi-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      )}

      {/* Cart items list */}
      {!loading && !error && cart.length > 0 && (
        <div className="card shadow-sm border-0 p-3">

          {/* Table header row */}
          <div className="row fw-bold border-bottom pb-2 mb-2">
            <div className="col-md-6">Cart List</div>
            <div className="col-md-3 text-center">Quantity</div>
            <div className="col-md-3 text-end">Price</div>
          </div>

          {/* Loop through each cart item */}
          {cart.map((item, index) => (
            <div key={index}>
              <div className="row align-items-center py-3">

                {/* Product image and name */}
                <div className="col-md-6 d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: '70px', height: '70px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}
                  >
                    {/* Show product image or fallback emoji */}
                    {item.productID.productImage ? (
                      <img
                        src={item.productID.productImage}
                        alt={item.productID.productName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="fs-4">🖥️</span>
                    )}
                  </div>
                  <div>
                    <p className="fw-bold mb-0">{item.productID.productName}</p>
                    <p className="text-muted small mb-0">{item.productID.productDescription}</p>
                  </div>
                </div>

                {/* Quantity increase/decrease controls */}
                <div className="col-md-3 d-flex align-items-center justify-content-center gap-2">
                  {/* Decrease button */}
                  <button
                    className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => decreaseQuantity(item.productID._id)}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  {/* Current quantity */}
                  <span className="fw-bold">{item.quantity}</span>
                  {/* Increase button */}
                  <button
                    className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => increaseQuantity(item.productID._id)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                {/* Item total price and remove button */}
                <div className="col-md-3 d-flex align-items-center justify-content-end gap-3">
                  <span className="fw-bold">$ {(item.quantity * item.productID.productCost).toFixed(2)}</span>
                  {/* Remove item from cart */}
                  <button
                    className="btn btn-link text-danger p-0"
                    onClick={() => removeItem(item.productID._id)}
                    title="Remove item"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

              </div>
              {/* Divider between items */}
              {index < cart.length - 1 && <hr className="my-0" />}
            </div>
          ))}

          {/* Cart total row */}
          <div className="row align-items-center border-top pt-3 mt-2">
            <div className="col-md-6">
              <span className="fw-bold">Total Items: {cart.length}</span>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              {/* Total price displayed in green */}
              <span
                className="fw-bold px-4 py-2 rounded"
                style={{ backgroundColor: '#90ee90', color: '#000' }}
              >
                $ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Checkout button: only shown when cart has items */}
      {!loading && !error && cart.length > 0 && (
        <div className="d-flex justify-content-end mt-3 mb-5">
          <Link to="/checkout" className="btn btn-danger px-4 py-2 fw-bold">
            <i className="bi bi-cart-check"></i> Checkout
          </Link>
        </div>
      )}

    </div>
  );
};

export default ShoppingCart;