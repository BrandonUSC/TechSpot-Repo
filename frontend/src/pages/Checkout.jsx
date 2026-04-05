import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Page for Checkout processes only
const Checkout = () => {
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID') || "placeholder_user_id";

  // State variables for checkout process
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fields for checkout form
  const [form, setForm] = useState({
    customerFirstName: '',
    customerSurname: '',
    customerEmail: '',
    phoneNumber: '',
    customerAddress: '',
    customerZipCode: '',
    paymentMethod: '',
    deliveryFee: 5
  });

  // Get cart summary
  useEffect(() => {
    if (!userID) {
      setError("Please log in to checkout");
      setLoading(false);
      return;
    }

    // Get summary of cart items and cost to then be displayed on the checkout page
    fetch(`http://localhost:4000/api/checkout/${userID}/summary`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load cart summary");
        setLoading(false);
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle order submission. Note: All fields must be required!
  const handleOrder = async () => {
    if (!form.customerFirstName || !form.customerSurname || !form.customerEmail ||
        !form.customerAddress || !form.paymentMethod) {
      alert("Please fill in all required fields and select a payment method.");
      return;
    }

    // try and catch block to handle errors pertaining to order process
    try {
      const res = await fetch(`http://localhost:4000/api/checkout/${userID}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        setOrderSuccess(true);
      }

    } catch (error) {
      alert("Server error. Please try again.");
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      // Confirmation page with options to return home or view orders
      <div className="container mt-5 text-center">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle mb-4 mx-auto"
          style={{ width: '100px', height: '100px', backgroundColor: '#e8453c' }}
        >
          <i className="bi bi-check-lg text-white" style={{ fontSize: '3rem' }}></i>
        </div>
        <h2 className="fw-bold">Order Placed Successfully!</h2>
        <p className="text-muted">Thank you for your purchase. Your order is being processed.</p>
        <div className="d-flex gap-2 justify-content-center mt-3">
          <Link to="/" className="btn btn-danger">
            <i className="bi bi-house me-1"></i> Back to Home
          </Link>
          // Button below to view orders based on users profile
          <Link to="/profile" className="btn btn-outline-danger">
            <i className="bi bi-clock-history me-1"></i> View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    // Main Checkout Form that prompts users to enter thier personal information to purchase their items in the cart.
    <div className="container mt-4 mb-5">

      {/* Back Button */}
      <div className="mb-2">
        <Link to="/cart" className="text-decoration-none text-dark fw-semibold">
          <i className="bi bi-arrow-left me-1"></i> Back To Cart
        </Link>
      </div>

      {/* Title */}
      <h1 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>
        Checkout <i className="bi bi-credit-card"></i>
      </h1>

      {loading && <p className="text-muted">Loading...</p>}
      {error && (
        <div className="text-center mt-5">
          <p className="text-danger">{error}</p>
          <Link to="/profile" className="btn btn-danger mt-2">Sign In</Link>
        </div>
      )}

      {!loading && !error && summary && (
        <div className="row g-4">

          {/* Left — Checkout Form */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 p-4">

              {/* Name Row */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control bg-light fw-semibold"
                    placeholder="First Name"
                    name="customerFirstName"
                    value={form.customerFirstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control bg-light fw-semibold"
                    placeholder="Last Name"
                    name="customerSurname"
                    value={form.customerSurname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control bg-light fw-semibold"
                  placeholder="Email Address"
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-light fw-semibold"
                  placeholder="Mailing Address"
                  name="customerAddress"
                  value={form.customerAddress}
                  onChange={handleChange}
                />
              </div>

              {/* ZipCode and PhoneNumber */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control bg-light fw-semibold"
                    placeholder="ZipCode"
                    name="customerZipCode"
                    value={form.customerZipCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control bg-light fw-semibold"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Delivery Fee */}
              <div className="mb-3">
                <p className="fw-bold mb-0">
                  Delivery Fee: <span className="text-muted">${form.deliveryFee}.00</span>
                </p>
              </div>

            </div>
          </div>

          {/* Right: Payment + Summary */}
          <div className="col-md-4">

            {/* Payment Method */}
            <div className="card shadow-sm border-0 p-4 mb-3">
              <h6 className="fw-bold mb-3">Payment Method</h6>
              {['Credit Card', 'Debit Card'].map((method) => (
                <div className="form-check mb-2" key={method}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">{method}</label>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card shadow-sm border-0 p-4 mb-3">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-bag me-1"></i> Items Ordered
              </h6>
              {summary.items.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">
                    {item.productID?.productName || 'Product'} x{item.quantity}
                  </span>
                  <span className="fw-semibold small">$ {item.cost.toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Delivery Fee</span>
                <span className="fw-semibold small">$ {form.deliveryFee}.00</span>
              </div>
            </div>

          </div>

          {/* Bottom: Final Cost and Order Button */}
          <div className="col-12">
            <div className="card shadow-sm border-0 p-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <p className="fw-bold mb-0">
                  Final Cost:
                </p>
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="fw-bold px-4 py-2 rounded"
                    style={{ backgroundColor: '#e8453c', color: '#fff', fontSize: '18px' }}
                  >
                    $ {(summary.totalAmount + form.deliveryFee).toFixed(2)}
                  </span>
                  <button
                    className="btn fw-bold px-4 py-2 rounded-pill"
                    style={{ backgroundColor: '#90ee90', color: '#000' }}
                    onClick={handleOrder}
                  >
                    <i className="bi bi-credit-card me-1"></i> Order
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Checkout;