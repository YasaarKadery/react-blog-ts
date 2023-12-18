import React from "react";
import "./styles/BlogPost.css";

type BlogPostSubsectionProps = {
  title: string;
};
export default function BlogPostSubsection({ title }: BlogPostSubsectionProps) {
  return (
    <div className="blog-post-subsection">
      <h2>{title}</h2>
      <hr className="banner-page-break"></hr>
    </div>
  );
}
