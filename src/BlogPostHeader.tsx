type BlogPostHeaderProp = {
  title: string;
  bannerImageLink: string;
  bannerImageAlt: string;
};

export default function BlogPostHeader({
  title,
  bannerImageLink,
  bannerImageAlt,
}: BlogPostHeaderProp) {
  return (
    <div>
      <h1>{title}</h1>
      <hr className="banner-page-break"></hr>
      <img
        className="banner-image"
        src={bannerImageLink}
        alt={bannerImageAlt}
      ></img>
    </div>
  );
}
