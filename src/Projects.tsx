import Nav from "./Nav"
import Post from "./Post"
import './styles/Projects.css';

export default function Projects () {

    return(
        <div>
            <Nav/>
            <div className="projects">
            <Post 
          title='The Cloud Resume Challenge' 
          date={new Date()} 
          img='https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'
          projectId={1}/>
        <Post 
        title='Dev Blog w/ React & Go' 
        date={new Date()} 
        img='https://res.cloudinary.com/practicaldev/image/fetch/s--HOXpPNDw--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1xofa8chbq27ozlle2jw.png'
        projectId={2}/>
        </div>
            </div>
       
        
    )
}