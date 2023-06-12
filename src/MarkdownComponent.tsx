import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia as Style } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./styles/Markdown.css";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  link: string;
};
export default function MarkdownComponent({ link }: MarkdownProps) {
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    fetch(link)
      .then((response) => response.text())
      .then((data) => {
        setMarkdown(data);
      })
      .catch((error: Error) => console.error(error));
  }, [link]);

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
      <div className="markdown-post">
        <ReactMarkdown
          components={components}
          children={markdown}
          remarkPlugins={[remarkGfm]}
        />
      </div>
    </div>
  );
}
