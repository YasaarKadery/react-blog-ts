type HomePageLinkProps = {
  linkName: string;
  description: string;
  href: string;
};
export default function HomePageLink({
  linkName,
  description,
  href,
}: HomePageLinkProps) {
  return (
    <div className="home-page-li-div">
      <li className="home-page-li">
        <a href={href} className="home-page-blog-link">
          {linkName}
        </a>
        <p>{description}</p>
      </li>
    </div>
  );
}
