import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// This page shows the user's profile info and order history all in one. 
// They can also login, register, and logout from this page.
// Order history and cancellation of orders is also possible here.

// If the user is logged in, show their profile info and order history. Else, show login/register forms.
const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loginForm, setLoginForm] = useState({ userEmail: '', userPassword: '' });
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', userName: '', userEmail: '', userPassword: '' });

  // gets correct user id to display profile information if logged in
  const userID = localStorage.getItem('userID');
  const userName = localStorage.getItem('userName');

  // Fetch user's orders on component mount if logged in
  useEffect(() => {
    if (!userID) return;
    setOrdersLoading(true);
    fetch(`http://localhost:4000/api/orders/user/${userID}`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [userID]);

  // Login and registration API calls 
  const handleLogin = async () => {
    setLoginError(null);
    try {
      const res = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!res.ok) return setLoginError(data.message);
      localStorage.setItem('userID', data.user._id);
      localStorage.setItem('userName', data.user.userName);
      localStorage.setItem('userFirstName', data.user.firstName);
      localStorage.setItem('userLastName', data.user.lastName);
      localStorage.setItem('userEmail', data.user.userEmail);
      window.location.reload();
    } catch { setLoginError("Server error. Please try again."); }
  };

  const handleRegister = async () => {
    setRegisterError(null);
    try {
      const res = await fetch('http://localhost:4000/api/users/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (!res.ok) return setRegisterError(data.message);
      setRegisterSuccess(true);
      setShowSignUp(false);
    } catch { setRegisterError("Server error. Please try again."); }
  };

  // Cancel order API call
  const handleCancelOrder = async (orderID) => {
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${orderID}/cancel`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) return setOrderMessage({ type: 'danger', text: data.message || 'Failed to cancel.' });
      setOrders(prev => prev.map(o => o._id === orderID ? { ...o, orderStatus: 'Cancelled' } : o));
      setOrderMessage({ type: 'success', text: 'Order cancelled successfully.' });
      setTimeout(() => setOrderMessage(null), 3000);
    } catch { setOrderMessage({ type: 'danger', text: 'Failed to cancel order.' }); }
  };

  // If user is logged in, show profile and order history. Else, show login/register forms.
  if (userID) return (
    <div>
      <div className="text-white text-center d-flex align-items-center justify-content-center" style={{ backgroundColor: '#e8453c', height: '300px' }}>
        <div>
          <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
          <h1 className="fw-bold mt-2" style={{ fontSize: '2.5rem' }}>My Profile</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row g-4">

          {/* Account Info */}
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Account Information</h5>
                <button className="btn btn-danger btn-sm" onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</button>
              </div>
              <div className="row g-3">
                {[['First Name', 'userFirstName'], ['Last Name', 'userLastName'], ['Username', 'userName'], ['Email', 'userEmail']].map(([label, key]) => (
                  <div className="col-md-6" key={key}>
                    <label className="form-label text-muted">{label}</label>
                    <input className="form-control" value={localStorage.getItem(key) || ''} readOnly />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="fw-bold mb-3">Order History</h5>

              {orderMessage && <div className={`alert alert-${orderMessage.type} py-2`}>{orderMessage.text}</div>}
              {ordersLoading && <p className="text-muted">Loading orders...</p>}

                {/* No orders message*/}
              {!ordersLoading && orders.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">No orders found.</p>
                  <Link to="/" className="btn btn-danger btn-sm">Start Shopping</Link>
                </div>
              )}

             {/* Order Table */}
              {!ordersLoading && orders.length > 0 && (
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="small text-muted fw-semibold">Order ID</th>
                      <th className="small text-muted fw-semibold">Date</th>
                      <th className="small text-muted fw-semibold">Total</th>
                      <th className="small text-muted fw-semibold">Status</th>
                      <th className="small text-muted fw-semibold">Action</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const checkout = order.checkoutID;
                      const total = checkout?.totalAmount ?? null;
                      const deliveryFee = checkout?.deliveryFee ?? 0;
                      const itemsTotal = total != null ? total - deliveryFee : null;
                      const isExpanded = expandedOrder === order._id;

                      // Order row with expandable details
                      return (
                        <React.Fragment key={order._id}>
                          <tr>
                            <td className="small fw-semibold">#{order._id.slice(-6).toUpperCase()}</td>
                            <td className="small">{new Date(order.timeOrdered).toLocaleDateString()}</td>
                            <td className="small fw-semibold">{total != null ? `$${total.toFixed(2)}` : '—'}</td>
                            <td className="small">{order.orderStatus}</td>
                            <td>
                              {order.orderStatus === 'Placed'
                                ? <button className="btn btn-outline-danger btn-sm py-0" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                                : <span className="text-muted small">—</span>}
                            </td>
                            <td>
                              <button className="btn btn-link btn-sm text-dark p-0" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                                <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                              </button>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr>
                              <td colSpan={6} className="p-0">
                                <div className="bg-light px-4 py-3">
                                  {!order.items || order.items.length === 0 ? (
                                    <p className="text-muted small mb-0">No item details available.</p>
                                  ) : (
                                    <>
                                      <table className="table table-sm mb-2">
                                        <thead>
                                          <tr>
                                            <th className="small">Product</th>
                                            <th className="small">Qty</th>
                                            <th className="small">Price</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {order.items.map((item, i) => (
                                            <tr key={i}>
                                              <td className="small">{item.productName}</td>
                                              <td className="small">{item.quantity}</td>
                                              <td className="small">${(item.productCost * item.quantity).toFixed(2)}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                      <div className="text-end small">
                                        {itemsTotal != null && <div>Items: <strong>${itemsTotal.toFixed(2)}</strong></div>}
                                        <div>Delivery: <strong>${deliveryFee.toFixed(2)}</strong></div>
                                        {total != null && <div className="fw-bold" style={{ color: '#e8453c' }}>Total: ${total.toFixed(2)}</div>}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Not logged in
  return (
    <div>
      <div className="text-white text-center d-flex align-items-center justify-content-center" style={{ backgroundColor: '#e8453c', height: '300px' }}>
        <div>
          <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
          <h1 className="fw-bold mt-2" style={{ fontSize: '2.5rem' }}>My Profile</h1>
        </div>
      </div>

      <div className="container mt-5 mb-5" style={{ maxWidth: '480px' }}>
        {registerSuccess && <div className="alert alert-success text-center">Account created! You can now log in.</div>}

        <div className="card shadow-sm border-0 p-4">
          {!showSignUp ? (
            <>
              <h5 className="fw-bold mb-4 text-center">Sign In</h5>
              {loginError && <div className="alert alert-danger">{loginError}</div>}
              <div className="mb-3">
                <label className="form-label text-muted">Email</label>
                <input type="email" className="form-control" placeholder="Enter your email"
                  value={loginForm.userEmail} onChange={e => setLoginForm({ ...loginForm, userEmail: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">Password</label>
                <div className="input-group">
                  <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Enter your password"
                    value={loginForm.userPassword} onChange={e => setLoginForm({ ...loginForm, userPassword: e.target.value })} />
                  <button className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
              <button className="btn btn-danger w-100 mb-3" onClick={handleLogin}>Sign In</button>
              <p className="text-center text-muted small mb-0">
                Don't have an account?{' '}
                <span className="text-danger fw-semibold" style={{ cursor: 'pointer' }} onClick={() => setShowSignUp(true)}>Sign Up</span>
              </p>
            </>
          ) : (
            <>
              <h5 className="fw-bold mb-4 text-center">Create Account</h5>
              {registerError && <div className="alert alert-danger">{registerError}</div>}
              <div className="row g-3">
                {[['First Name', 'firstName', 'col-6'], ['Last Name', 'lastName', 'col-6'], ['Username', 'userName', 'col-12'], ['Email', 'userEmail', 'col-12']].map(([label, key, col]) => (
                  <div className={col} key={key}>
                    <label className="form-label text-muted">{label}</label>
                    <input type={key === 'userEmail' ? 'email' : 'text'} className="form-control" placeholder={label}
                      value={registerForm[key]} onChange={e => setRegisterForm({ ...registerForm, [key]: e.target.value })} />
                  </div>
                ))}
                <div className="col-12">
                  <label className="form-label text-muted">Password</label>
                  <div className="input-group">
                    <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Create a password"
                      value={registerForm.userPassword} onChange={e => setRegisterForm({ ...registerForm, userPassword: e.target.value })} />
                    <button className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
              <button className="btn btn-danger w-100 mt-4 mb-3" onClick={handleRegister}>Create Account</button>
              <p className="text-center text-muted small mb-0">
                Already have an account?{' '}
                <span className="text-danger fw-semibold" style={{ cursor: 'pointer' }} onClick={() => setShowSignUp(false)}>Sign In</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;