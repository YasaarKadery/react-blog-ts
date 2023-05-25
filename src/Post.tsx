import './styles/Post.css';
import { useNavigate } from 'react-router-dom';


function Post(props: {title: string, date: Date, img: string, projectId: number}) {

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
      <h5>{props.date.toLocaleDateString()}</h5>
    </div>
  </div>
)
}


export default Post;