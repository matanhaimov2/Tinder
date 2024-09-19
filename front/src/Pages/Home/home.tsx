import React, { useEffect, useState } from 'react';

// CSS
import './home.css';

// React Icons
import { FaUserCircle } from "react-icons/fa";

// React MUI
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

// Components
import MyProfile from '../../Components/MyProfile/myProfile';
import EditProfile from '../../Components/EditProfile/editProfile';
import CardProfile from '../../Components/CardProfile/cardProfile';

// Sub Components
import Matches from './subComponents/Matches/matches';
import Messages from './subComponents/Messages/messages';

export default function Home() {
    // States
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State to manage visibility
    const [navValue, setNavValue] = useState(2); // Index for nav (Matches/Messages)

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);

    // Toggle profile visibility
    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    // Navigating between messages and matches
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setNavValue(parseInt(newValue, 10));
    };

    return (
        <div className='home-wrapper'>
            <div className='home-main-wrapper'>
                {!isProfileOpen ? (
                    <CardProfile isInEditProfile={false} />
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
                            <FaUserCircle className='home-side-nav-img' />
                        )}
                    </div>
                </div>


                <div className='home-side-content-wrapper'>
                    {!isProfileOpen ? (
                        <>
                            <div className='home-side-content-title-wrapper'>
                                <TabContext value={navValue.toString()}>
                                    <div className='home-side-content-title-inner'>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChange} aria-label="lab API tabs example"
                                                TabIndicatorProps={{
                                                    style: {
                                                        backgroundColor: '#ff4458', // The active tab
                                                    },
                                                }}
                                            >

                                                <Tab label="Messages" value="1" sx={{
                                                    fontWeight: '600',
                                                    color: 'white', // Default color for inactive tabs
                                                    textTransform: 'none', // Disable uppercase transformation
                                                    '&.Mui-selected': {
                                                        color: 'white', // Set white color for the active tab
                                                    },
                                                }}
                                                />
                                                <Tab label="Matches" value="2" sx={{
                                                    fontWeight: '600',
                                                    color: 'white', // Default color for inactive tabs
                                                    textTransform: 'none', // Disable uppercase transformation
                                                    '&.Mui-selected': {
                                                        color: 'white', // Set white color for the active tab
                                                    },
                                                }}
                                                />
                                            </TabList>
                                        </Box>
                                    </div>
                                </TabContext>
                            </div>

                            <div className='home-side-content-details'>
                                {navValue === 1 ? (
                                    <Messages />
                                ) : (
                                    <Matches />
                                )}
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
