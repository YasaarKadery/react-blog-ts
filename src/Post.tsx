import "./styles/Post.css";
import { useNavigate } from "react-router-dom";
type PostProps = {
  title: string;
  date: string;
  img: string;
  projectId: number;
};
// component that renders the 'card' for each project in the project page.
export default function Post({ title, date, img, projectId }: PostProps) {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/projects/${projectId}`;
    navigate(path);
  };
  return (
    <div className="card" onClick={routeChange}>
      <div className="card__header">
        <img src={img} alt="card__image" className="card__image" width="600" />
      </div>
      <div className="card__body">
        <h4>{title}</h4>
        <h5>{date}</h5>
      </div>
    </div>
  );
}
