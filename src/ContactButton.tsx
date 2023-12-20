import React from "react";
import "./styles/ContactButton.css"; // Import the CSS file

export default function ContactButton() {
  const handleClick = () => {
    window.open(
      "https://docs.google.com/document/d/e/2PACX-1vSRTYGQqDMLlALqpGeALS-Y8KxfVk38UHONkpQCSBw1SZ2c9h9FlGcXQZ_h7gb5Wg/pub",
      "_blank"
    );
  };

  return (
    <button className="contact-button" onClick={handleClick}>
      <span>Resume</span>
    </button>
  );
}
