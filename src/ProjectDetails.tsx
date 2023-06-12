import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";

import MarkdownComponent from "./MarkdownComponent";
import ErrorPage from "./ErrorPage";

import Loader from "./Loader";
import Footer from "./Footer";

type BlogPost = {
  markdown: string;
};

export default function ProjectDetails() {
  const [posts, setPosts] = useState<BlogPost>();
  const [isLoading, setIsLoading] = useState(false);
  let { projectId } = useParams();
  console.log(projectId);
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://qhsr08ti1l.execute-api.us-east-1.amazonaws.com/posts/${projectId}`
        );
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [projectId]);
  if (isLoading) {
    return <Loader />;
  }
  // validate  if api returned anything
  if (posts) {
    return (
      <div>
        <Nav />
        <MarkdownComponent link={posts.markdown} />
        <Footer />
      </div>
    );
  } else {
    return <ErrorPage />;
  }
}
