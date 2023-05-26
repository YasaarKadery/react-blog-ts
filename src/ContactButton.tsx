import React from 'react';
import './styles/ContactButton.css'; // Import the CSS file

const ContactButton: React.FC = () => {
  const handleClick = () => {
    // Logic for handling the button click event
    // You can implement your desired behavior here, such as opening a contact form or redirecting to a contact page
    // Example: window.open('https://example.com/contact', '_blank');
  };

  return (
    <button className="contact-button" onClick={handleClick}>
      <span>Contact Me</span>
    </button>
  );
};

export default ContactButton;
