import React, { useEffect, useState } from 'react';

// CSS
import './home.css';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

// Components
import MyProfile from '../../Components/MyProfile/myProfile';

export default function Home() {
    // States
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State to manage visibility

    const userData = useSelector((state: RootState) => state.auth.userData);
    console.log(userData,'damn')
    
    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen); // Toggle profile visibility
    };

    return (
        <div className='home-wrapper'>
            <div className='home-main-wrapper'>
                <div className='home-main-card-wrapper'>
                    <div className='home-main-card'>

                    </div>

                    <div style={{ height: '1px', backgroundColor: 'grey'}} />

                    <div className='home-main-nav-card'>

                    </div>
                </div>
            </div>

            <div className='home-side-wrapper'>
                <div className='home-side-nav-wrapper'>
                    <div className='home-side-nav-inner' onClick={handleProfileClick}>
                        <div>
                            {userData?.first_name}
                        </div>

                        <img className='home-side-nav-img' src={userData?.images[0]}></img>
                    </div>
                </div>


                <div className='home-side-content-wrapper'>
                    {!isProfileOpen ? (
                        <>
                            <div className='home-side-content-title-wrapper'>
                                <div>
                                    Messages
                                </div>

                                <div>
                                    Matches
                                </div>
                            </div>

                            <div className='home-side-content-matches-wrapper'>

                            </div>
                        </>
                    ) : (
                        <MyProfile />
                    )}

        

                </div>
            </div>



        </div>
    );
}
