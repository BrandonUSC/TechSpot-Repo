import React from 'react'
// Page for About Us information and contact details for the business
const AboutUs = () => {
  return (
    <div>
      {/* the About Us Hero Section */}
      <div
        className="d-flex flex-column align-items-center justify-content-center text-white text-center"
        style={{ backgroundColor: '#e8453c', height: '300px' }}
      >
        <h1 className="fw-bold" style={{ fontSize: '2.5rem' }}>About Us</h1>
        <p className="mt-2" style={{ maxWidth: '600px' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        </p>
      </div>

      {/* About Section */}
      <div className="container mt-5 mb-5">
        <div className="row g-4">

          {/* Who We Are Information */}
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="fw-bold">Who We Are</h5>
              <p className="text-muted mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Curabitur commodo ipsum sit amet ex vehicula pulvinar. 
                Sed lobortis eu felis at sagittis. Fusce condimentum quis lacus quis eleifend. 
                Donec purus sapien, bibendum in euismod tincidunt, sodales at enim. Donec elementum.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="fw-bold mb-3">Contact Information</h5>

              <div className="row g-3">
                <div className="col-md-4">
                  <h6 className="fw-semibold">Address</h6>
                  <p className="text-muted mb-0">
                    123 Tech Street<br />
                    Trinidad & Tobago
                  </p>
                </div>

                <div className="col-md-4">
                  <h6 className="fw-semibold">Phone</h6>
                  <p className="text-muted mb-0">
                    (868) 123-4567
                  </p>
                </div>

                <div className="col-md-4">
                  <h6 className="fw-semibold">Email</h6>
                  <p className="text-muted mb-0">
                    support@techspot.com
                  </p>
                </div>
              </div>

              {/* Social Media Dummy Sites */}
              <hr className="my-4" />

              <h6 className="fw-semibold mb-3">Follow Us</h6>

              <div className="d-flex gap-3">
                <a href="https://www.facebook.com/" target="_blank" className="btn btn-outline-dark btn-sm">
                  <i className="bi bi-facebook me-1"></i> Facebook
                </a>

                <a href="https://www.instagram.com/" target="_blank" className="btn btn-outline-dark btn-sm">
                  <i className="bi bi-instagram me-1"></i> Instagram
                </a>

                <a href="https://x.com/" target="_blank" className="btn btn-outline-dark btn-sm">
                  <i className="bi bi-twitter-x me-1"></i> Twitter
                </a>
              </div>

              {/* Text Only: Call to Action block */}
              <div className="mt-4 text-center">
                <p className="text-muted mb-0">
                  Stay updated with our latest products and deals!
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AboutUs;