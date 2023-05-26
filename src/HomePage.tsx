
import './styles/HomePage.css';
import './icons/icon.png'

import Nav from './Nav';
import About from './About';
import Contact from './Contact';
import ContactButton from './ContactButton';

type HomePageProps = {
    children?: React.ReactNode;
}

function HomePage(props: HomePageProps) {
    return(
        <>
        <Nav/>
        <div className="main-page">
            <div className='home-page-image'>
                
                <div>
                <h2 className='text'>hi,</h2>
                <h1 className='text2'>i'm yasaar</h1>
                <p className='text3'>i write code and sometimes make music</p>
                </div> 
                <div className='contact'>
                <ContactButton/>
                </div>
                
            </div>
            <About 
            name='' 
            description="I'm Yasaar Kadery, a passionate fullstack software developer. 

            With multiple AWS certifications under my belt, I have a deep understanding of cloud computing and infrastructure. I excel in architecting scalable and efficient solutions on the AWS platform, leveraging its services to drive innovation and optimize performance.
            
            I have hands-on experience with Go, Python, JavaScript, and Java, allowing me to seamlessly navigate both frontend and backend development. 
            
            I thrive in dynamic and collaborative environments, where I can leverage my problem-solving skills and attention to detail to create impactful solutions. I enjoy taking on challenges and finding innovative ways to tackle complex problems. I am committed to continuous learning and expanding my skill set.
            
            
            
            
                        " 
            />
            <Contact/>
        </div>
        </>
        
    )
}

export default HomePage;