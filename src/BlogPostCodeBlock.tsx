import React from "react";
import { CodeBlock, dracula } from "react-code-blocks";
import "./styles/BlogPost.css";
type BlogPostCodeBlockProps = {
  code: string;
  language: string;
  showLineNumbers: boolean;
};
export default function BlogPostCodeBlock({
  code,
  language,
  showLineNumbers,
}: BlogPostCodeBlockProps) {
  return (
    <div className="blog-post-code-block">
      <CodeBlock
        text={code}
        language={language}
        showLineNumbers={showLineNumbers}
        theme={dracula}
      ></CodeBlock>
    </div>
  );
}
