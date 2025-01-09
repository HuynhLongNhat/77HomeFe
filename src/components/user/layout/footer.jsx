import React from 'react';
import '../../../styles/Footer.scss'; // Import CSS cho footer
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li>Inure in mollit</li>
              <li>Officia sit laborum</li>
              <li>Lorem ea quis labore</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Community</h3>
            <ul>
              <li>Nisi velit ut</li>
              <li>Pariatur elit esse</li>
              <li>Laborum aliquip do</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>About</h3>
            <ul>
              <li>Aute com</li>
              <li>Volupta</li>
              <li>Nulla min</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Subscribe to our newsletter</h3>
            <p>For announcements and exclusive deals</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Input your email" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; Phát triển phần mềm chuyên nghiệp • Nhóm 4 • 2024</p>
        <div className="social-icons">
          <a href="https://www.facebook.com/pmq05"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
