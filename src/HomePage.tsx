import "./styles/HomePage.css";
import "./icons/icon.png";

import Nav from "./Nav";
import HomePageLink from "./HomePageLink";
import SpriteAnimation from "./SpriteAnimation";

// the home page
export default function HomePage() {
  return (
    <>
      <Nav />
      <div className="main-page">
        <div className="home-page-image">
          <div className="home-text">
            <div>
              <h2 className="text">Hi,</h2>
              <h1 className="text2">I'm Yasaar</h1>
              <p className="text3">
                I write code and <i>sometimes</i> write music.
              </p>
            </div>
            <div className="sprite-animation">
              <SpriteAnimation></SpriteAnimation>
            </div>
          </div>

          <hr className="page-divider"></hr>
          <div className="home-text2">
            <h3>Here are some projects of mine:</h3>
            <ul className="home-page-blog-list">
              <HomePageLink
                link="DEVELOPER BLOG"
                description="A foray into deploying websites to the cloud"
              ></HomePageLink>
              <HomePageLink
                link="NAVIGUARDIAN"
                description="How I won a Hackathon using AI"
              ></HomePageLink>
              <HomePageLink
                link="AMAZON REVIEWS"
                description="Sentiment Analysis using Neural Networks"
              ></HomePageLink>
            </ul>
          </div>
          <hr className="page-divider"></hr>
          <div className="home-text2">
            <h3>About me:</h3>
            <p>
              Hi, I'm Yasaar and I'm a Software Engineer specialiazing in
              architecting robust cloud solutions. My skill set encompasses the
              design of scalable and efficient backend systems. I have a strong
              foundation in building and optimizing databases, crafting RESTful
              APIs, and ensuring the seamless integration of backend services to
              support complex and high-performance applications. In my leisure
              time, I indulge in reading fantasy novels, gaming, and creating
              music. Feel free to connect with me on{" "}
              <a
                href="https://linkedin.com/in/yasaar-kadery"
                className="home-page-blog-link"
              >
                LinkedIn
              </a>
              . I'm always up for a chat about job opportunities or anything
              under the sun!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
