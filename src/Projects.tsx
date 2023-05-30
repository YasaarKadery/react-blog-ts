import { useEffect, useState } from "react";
import Nav from "./Nav"
import Post from "./Post"
import './styles/Projects.css';

interface Project {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    image_src: string;
}
// component that displays the list of projects in the 'projects' page.
export default function Projects () {
    const [posts, setPosts] = useState<Project[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchPosts();
  }, []);
    console.log(posts)
    return(
        <div>
            <Nav/>
            <div className="projects">
        {posts.map((post) => (
            
                <div key={post.id}>
                    <Post
                    title={post.title}
                    img={post.image_src}
                    date={post.created_at.substring(0,10)}
                    update={post.updated_at.substring(0,10)}
                    projectId={post.id}
                    />
                </div>
        ))}
        </div>
      </div>

       
        
    )
}