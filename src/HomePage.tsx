
import './styles/HomePage.css';
import './icons/icon.png'

import Nav from './Nav';

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
                
            </div>
        </div>
        </>
        
    )
}

export default HomePage;