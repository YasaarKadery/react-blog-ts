import React from "react";
import MarkdownReader from "../MarkdownReader";
import Nav from "../Nav";

export default function CloudResumeChallenge() {
  return (
    <>
      <Nav></Nav>
      <div className="blog-post">
        <MarkdownReader filePath="/cloudResumeChallenge.md"></MarkdownReader>
      </div>
    </>
  );
}
