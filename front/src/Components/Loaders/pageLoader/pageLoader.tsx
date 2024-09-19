import React from 'react';

// CSS
import './pageLoader.css';

// Images
import tinder_icon from '../../../Assets/Images/tinder_fire_white_logo.png'

function PageLoader() {

    return (
        <div className='pageLoader-wrapper'>
            <img className='pageLoader-img' src={tinder_icon}></img>
        </div>
    );
}

export default PageLoader;