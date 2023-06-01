import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import "./styles/ProjectDetails.css";

interface BlogPost {
  title: string;
  author: string;
  content: string;
  created_at: string;
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

  return (
    <div>
      <Nav />
      <article className="blog-post">
        <h1 className="blog-post-title">{posts?.title}</h1>
        <p className="blog-post-meta">
          <span className="blog-post-author">{posts?.author}</span>
          <time className="blog-post-date">{posts?.created_at}</time>
        </p>
        <div className="blog-post-content">{posts?.content}</div>
      </article>
    </div>
  );
}
