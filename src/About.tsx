import React from 'react';
import './styles/About.css'; // Import the CSS file

interface AboutProps {
  name: string;
  description: string;
  
}

const About: React.FC<AboutProps> = ({ name, description }) => {
  return (
    <section className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>About Me</h2>
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;
