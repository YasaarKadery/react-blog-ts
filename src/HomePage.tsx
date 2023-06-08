import "./styles/HomePage.css";
import "./icons/icon.png";

import Nav from "./Nav";
import About from "./About";
import Footer from "./Footer";
import ContactButton from "./ContactButton";

// the home page
export default function HomePage() {
  return (
    <>
      <Nav />
      <div className="main-page">
        <div className="home-page-image">
          <div>
            <h2 className="text">hi,</h2>
            <h1 className="text2">i'm yasaar</h1>
            <p className="text3">i write code and sometimes make music</p>
          </div>
          <div className="contact">
            <ContactButton />
          </div>
        </div>
        <About
          name=""
          description="Hi, I'm Yasaar! I'm a software developer who loves to build fullstack applications. I'm also quite
          fond of the cloud and have a few AWS certifications under my belt. I graduated from Florida International University with a degree
          in Computer Science in 2023.One of the things that really keeps me fired up in this field is the rapid pace of change. 
          There's always something new to learn, a fresh perspective to explore, or a groundbreaking tool to master. 
          When I'm not hunched over my desk debugging code, I like to read fantasy novels and make music.
            
                        "
        />
        <Footer />
      </div>
    </>
  );
}
