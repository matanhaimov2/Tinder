// CSS
import './notFound.css';

export default function NotFound() {

    return (
        <div className='notFound-wrapper'>
            <div className='notFound-inner-wrapper'>
                <span className='notFound-title'> 404 </span>
                <span className='notFound-sub-title'> Oops! </span>
                <span className='notFound-description'> Sorry, the page you're looking for doesn't exist. </span>
            </div>
        </div>
    );
}