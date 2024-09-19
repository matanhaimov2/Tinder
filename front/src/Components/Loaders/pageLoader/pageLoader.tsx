import React, { useEffect, useState } from 'react';

// CSS
import './pageLoader.css';

// Images
import tinder_icon from '../../../Assets/Images/tinder_fire_logo.png'

// React MUI

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';

function PageLoader() {
    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);

    return (
        <div className='pageLoader-wrapper'>
            <img className='pageLoader-img' src={tinder_icon}></img>
        </div>
    );
}

export default PageLoader;