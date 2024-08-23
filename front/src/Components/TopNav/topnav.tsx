import React, { useState } from 'react';

// CSS
import './topnav.css';

// Images
import tinder_logo from '../../Assets/Images/tinder_main_logo.png';

// Components
import Login from '../Login/login';

function TopNav () {

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <div className='topnav-wrapper'>
            <div className='topnav-logo-wrapper'>
                <img src={tinder_logo} alt="Tinder Logo" className='topnav-logo' />
            </div>

            <div className='topnav-login-button-wrapper'>
                <button className='topnav-login-button' onClick={() => setIsLoginOpen(true)}> Log in </button>
            </div>

            {isLoginOpen && (
                <>
                    <div className="overlay"></div>
                    <Login isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
                </>
            )}
        </div>
    );
}

export default TopNav;