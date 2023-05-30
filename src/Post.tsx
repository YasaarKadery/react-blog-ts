import './styles/Post.css';
import { useNavigate } from 'react-router-dom';

// component that renders the 'card' for each project in the project page.
function Post(props: {title: string, date: string, img: string, projectId: number}) {

let navigate = useNavigate();
const routeChange = () => {
    let path = `/projects/${props.projectId}`;
    navigate(path);
}
return (
    <div className="card" onClick={routeChange}>
    <div className="card__header">
      <img src={props.img} alt="card__image" className="card__image" width="600"/>
    </div>
    <div className="card__body">
      <h4>{props.title}</h4>
      <h5>{props.date}</h5>
    </div>
  </div>
)
}


export default Post;