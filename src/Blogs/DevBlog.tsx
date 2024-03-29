import React from "react";
import "../styles/BlogPost.css";
import MarkdownReader from "../MarkdownReader";
import Nav from "../Nav";
export default function DevBlog() {
  return (
    <>
      <Nav></Nav>
      <div className="blog-post">
        <MarkdownReader filePath="/dev-blog.md" />
      </div>
    </>
  );
}
