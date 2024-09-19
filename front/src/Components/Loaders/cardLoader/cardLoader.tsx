import React from 'react';

// CSS
import './cardLoader.css';

// React Icons
import { FaUserCircle } from "react-icons/fa";

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';

function CardLoader() {
    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);


    return (
        <div className='cardLoader-wrapper'>
            {userData && userData.images.length > 0 ? (
                <img className='cardLoader-img' src={userData.images[0]}></img>
            ) : (
                <FaUserCircle className='cardLoader-img' />
            )}
        </div>
    );
}

export default CardLoader;