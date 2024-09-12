import React, { useEffect, useState } from 'react';

// CSS
import './home.css';

// React Icons
import { FaUserCircle } from "react-icons/fa";

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

// Components
import MyProfile from '../../Components/MyProfile/myProfile';
import EditProfile from '../../Components/EditProfile/editProfile';
import CardProfile from '../../Components/CardProfile/cardProfile';


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
                {!isProfileOpen ? (
                    <CardProfile isInEditProfile={false}/>
                ) : (
                    <EditProfile />
                )}
            </div>

            <div className='home-side-wrapper'>
                <div className='home-side-nav-wrapper'>
                    <div className='home-side-nav-inner' onClick={handleProfileClick}>
                        <div>
                            {userData?.first_name}
                        </div>
                        {userData && userData.images.length > 0 ? (
                            <img className='home-side-nav-img' src={userData.images[0]}></img>
                        ) : (
                            <FaUserCircle className='home-side-nav-img'/>
                        )}
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
