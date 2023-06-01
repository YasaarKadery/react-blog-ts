import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import "./styles/ProjectDetails.css";
import MarkdownComponent from "./MarkdownComponent";
import ErrorPage from "./ErrorPage";

interface BlogPost {
  title: string;
  author: string;
  content: string;
  created_at: string;
  markdown: string;
}

export default function ProjectDetails() {
  const [posts, setPosts] = useState<BlogPost>();
  let { projectId } = useParams();
  console.log(projectId);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/posts/${projectId}`
        );
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, [projectId]);
  // validate  if api returned anything
  if (posts) {
    return (
      <div>
        <Nav />
        <MarkdownComponent link={posts.markdown} />
      </div>
    );
  } else {
    return <ErrorPage />;
  }
}
