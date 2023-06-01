import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia as Style } from "react-syntax-highlighter/dist/esm/styles/prism";
import Nav from "./Nav";
import "./styles/Markdown.css";

const MarkdownComponent: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    fetch(
      "https://dev-blog-markdown-files1341513.s3.amazonaws.com/cloudResumeChallenge.md"
    )
      .then((response) => response.text())
      .then((data) => {
        setMarkdown(data);
      })
      .catch((error: Error) => console.error(error));
  }, []);

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={Style}
          language={match[1]}
          PreTag="div"
          children={String(children).replace(/\n$/, "")}
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div>
      <Nav />
      <div className="post">
        <ReactMarkdown
          components={components}
          children={markdown}
          remarkPlugins={[gfm]}
        />
      </div>
    </div>
  );
};

export default MarkdownComponent;
