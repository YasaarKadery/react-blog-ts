import React from 'react';
import './styles/Contact.css'; // Import the CSS file

const Contact: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Yasaar Kadery</p>
          <div className="social-icons">
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter" aria-label="Twitter"></i>
            </a>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github" aria-label="GitHub"></i>
            </a>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin" aria-label="LinkedIn"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
