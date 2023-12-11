type HomePageLinkProps = {
  link: String;
  description: String;
};
export default function HomePageLink({ link, description }: HomePageLinkProps) {
  return (
    <div className="home-page-li-div">
      <li className="home-page-li">
        <a href="/" className="home-page-blog-link">
          {link}
        </a>
        <p>{description}</p>
      </li>
    </div>
  );
}
