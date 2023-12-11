import "./styles/style.css";
import React from "react";
import { Link } from "react-router-dom";
//  nav bar
export default function Nav() {
  return (
    <div className="nav-bar-container">
      <nav className="nav">
        <div className="kadery-dev">
          <h1>
            <Link to="/" className="nav-link">
              <i className="fa-solid fa-code"></i>
            </Link>
          </h1>
        </div>
        <div className="item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </div>
        <div className="item">
          <Link
            to="https://github.com/YasaarKadery"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Github
          </Link>
        </div>
        <div className="item">
          <Link
            to="https://www.linkedin.com/in/yasaar-kadery/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            LinkedIn
          </Link>
        </div>
      </nav>
    </div>
  );
}
