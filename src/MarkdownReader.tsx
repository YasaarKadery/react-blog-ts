// MarkdownReader.tsx
import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import { CodeBlock, dracula } from "react-code-blocks";

interface MarkdownReaderProps {
  filePath: string;
}
const MarkdownReader: React.FC<MarkdownReaderProps> = ({ filePath }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Markdown file: ${response.status} ${response.statusText}`
          );
        }

        const markdownText = await response.text();
        setMarkdownContent(markdownText);
      } catch (error) {
        console.error("Error fetching Markdown:", error);
      }
    };

    fetchMarkdown();
  }, [filePath]);

  return (
    <div>
      <Markdown
        options={{
          overrides: {
            h1: {
              component: ({ children }) => (
                <div className="blog-post-subsection">
                  <h1>{children}</h1>
                  <hr className="banner-page-break"></hr>
                </div>
              ),
            },
            h2: {
              component: ({ children }) => (
                <div className="blog-post-subsection">
                  <h2>{children}</h2>
                  <hr className="banner-page-break"></hr>
                </div>
              ),
            },
            p: {
              component: ({ children, ...props }) => (
                <div {...props}>{children}</div>
              ),
              props: {
                className: "blog-post-paragraph",
              },
            },
            code: {
              component: ({ children }) => (
                <code className="inline-code">{children}</code>
              ),
            },
            pre: {
              component: ({ children }) => (
                <div className="blog-post-code-block">
                  <CodeBlock
                    text={children.props.children}
                    theme={dracula}
                    language={children.props.className.substring(5)}
                  ></CodeBlock>
                </div>
              ),
            },
          },
        }}
      >
        {markdownContent || ""}
      </Markdown>
    </div>
  );
};

export default MarkdownReader;
