import React from 'react';
import './styles/Contact.css'; // Import the CSS file
type FooterProps = {
  children?: React.ReactNode
}
const Footer = ({children}: FooterProps) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Yasaar Kadery</p>
          <div className="social-icons">
            <a href="https://github.com/YasaarKadery" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github" aria-label="GitHub"></i>
            </a>
            <a href="https://www.linkedin.com/in/yasaar-kadery/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin" aria-label="LinkedIn"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
