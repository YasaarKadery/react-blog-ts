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
            <Link to="/">kadery.dev </Link>
          </h1>
        </div>
        <div className="item">
          <Link to="/">home</Link>
        </div>
        <div className="item">
          <Link to="/projects">projects</Link>
        </div>
        <div className="item">
          <Link
            to="https://github.com/YasaarKadery"
            target="_blank"
            rel="noreferrer"
          >
            github
          </Link>
        </div>
        <div className="item">
          <Link
            to="https://www.linkedin.com/in/yasaar-kadery/"
            target="_blank"
            rel="noreferrer"
          >
            linkedin
          </Link>
        </div>
      </nav>
    </div>
  );
}
