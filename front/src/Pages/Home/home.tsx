import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive'

// CSS
import './home.css';

// Images
import logo from '../../Assets/Images/tinder-main-logo2.png'

// React Icons
import { FaUserCircle } from "react-icons/fa";
import { LuArrowLeftSquare } from "react-icons/lu";
import { LuArrowRightSquare } from "react-icons/lu";
import { PiUserFill } from "react-icons/pi";
import { PiChatsCircleFill } from "react-icons/pi";
import { SiTinder } from "react-icons/si";

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
import MaterialUISwitch from '../../Components/MaterialUISwitch';
import { useTheme } from '../../Components/ThemeContext';

// Sub Components
import Matches from './subComponents/Matches/matches';
import Messages from './subComponents/Messages/messages';
import PhoneMatches from './subComponents/PhoneMatches/phoneMatches';
import PhoneMyProfile from './subComponents/PhoneMyProfile/phoneMyProfile';

// Hooks
import useAxiosPrivate from '../../Hooks/usePrivate';

// Interfaces
interface UserMatch {
    user_id: number;
    image: string;
    first_name: string;
    room_id: string;
    latest_message: string | null;
    latest_message_timestamp: string | null;
}

export default function Home() {
    // States
    const [matches, setMatches] = useState<UserMatch[]>();
    const [messages, setMessages] = useState<UserMatch[]>();
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State to manage visibility
    const [navValue, setNavValue] = useState(2); // Index for nav (Matches/Messages)
    const [activeTabPhone, setActiveTabPhone] = useState<'home' | 'chats' | 'profile'>('home'); // Set default active tab

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    const didMatchOccuer = useSelector((state: RootState) => state.auth.didMatchOccuer);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    const { theme, toggleTheme } = useTheme();

    // Handle responsive
    const isTabletOrPhone = useMediaQuery({ query: '(max-width: 760px)' })

    // Fetch matches from backend
    useEffect(() => {
        const checkForMatches = async () => {
            // Check if there any matches for logged_in user
            const response = await axiosPrivateInstance.get('interactions/getAvailableMatches/');

            // Filter out matches with null latest_message
            const filteredMatches = response.data.usersMatchesData.filter((match: UserMatch) => match.latest_message !== null);

            setMatches(response.data.usersMatchesData)
            setMessages(filteredMatches)
        }

        checkForMatches();

    }, [didMatchOccuer])

    // Toggle profile visibility
    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    // Navigating between messages and matches
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setNavValue(parseInt(newValue, 10));
    };

    const handleTabClick = (tab: 'home' | 'chats' | 'profile') => {
        setActiveTabPhone(tab);
    };

    return (
        <div className={`home-wrapper ${theme}alt`}>

            {isTabletOrPhone && (
                <div style={{ backgroundColor: theme === 'dark' ? '#111418' : '#f0f2f4' }}>
                    <img className='home-img-phone-wrapper' src={logo} alt="Match Logo" />
                </div>
            )}

            <div className='home-main-wrapper'>
                {!isProfileOpen ? (
                    <div className='home-cardProfile-wrapper'>
                        <CardProfile isInEditProfile={false} />

                        {!isTabletOrPhone && (
                            <div className='home-cardProfile-icons-wrapper'>
                                <div className='home-cardProfile-icons'>
                                    <span> Like </span>
                                    <LuArrowRightSquare />
                                </div>

                                <div className='home-cardProfile-icons'>
                                    <span> Nope </span>
                                    <LuArrowLeftSquare />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {!isTabletOrPhone && (
                            <EditProfile />
                        )}
                    </>
                )}
            </div>

            {!isTabletOrPhone ? (
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

                        {isProfileOpen && (
                            <div>
                                <MaterialUISwitch checked={theme === 'dark'} onClick={toggleTheme} />
                            </div>
                        )}
                    </div>

                    <div className={`home-side-content-wrapper ${theme}`}>
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
                                                        fontFamily: 'Montserrat, sans-serif',
                                                        fontWeight: '600',
                                                        color: theme === 'dark' ? 'white' : 'black', // Default color for inactive tabs
                                                        textTransform: 'none', // Disable uppercase transformation
                                                        '&.Mui-selected': {
                                                            color: theme === 'dark' ? 'white' : 'black', // Set white color for the active tab
                                                        },
                                                    }}
                                                    />
                                                    <Tab label="Matches" value="2" sx={{
                                                        fontFamily: 'Montserrat, sans-serif',
                                                        fontWeight: '600',
                                                        color: theme === 'dark' ? 'white' : 'black', // Default color for inactive tabs
                                                        textTransform: 'none', // Disable uppercase transformation
                                                        '&.Mui-selected': {
                                                            color: theme === 'dark' ? 'white' : 'black', // Set white color for the active tab
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
                                        <Messages messages={messages} />
                                    ) : (
                                        <Matches matches={matches} withFilteredConv={messages} />
                                    )}
                                </div>
                            </>
                        ) : (
                            <MyProfile />
                        )}
                    </div>
                </div>
            ) : (
                <div className={`home-bottom-nav-phone-wrapper ${theme}alt`}>
                    <div className='home-bottom-icons-phone-wrapper' onClick={() => handleTabClick('home')}>
                        <SiTinder style={{ color: activeTabPhone === 'home' ? '#ff4458' : '#7c8591' }} />
                    </div>

                    <div className='home-bottom-icons-phone-wrapper' onClick={() => handleTabClick('chats')}>
                        <PiChatsCircleFill style={{ color: activeTabPhone === 'chats' ? '#ff4458' : '#7c8591' }} />
                    </div>

                    <div className='home-bottom-icons-phone-wrapper' onClick={() => handleTabClick('profile')}>
                        <PiUserFill style={{ color: activeTabPhone === 'profile' ? '#ff4458' : '#7c8591' }} />
                    </div>
                </div>
            )}

            {isTabletOrPhone && (
                <>
                    {activeTabPhone === 'chats' && (
                        <PhoneMatches messages={messages} matches={matches} withFilteredConv={messages} />
                    )}

                    {activeTabPhone === 'profile' && (
                        <PhoneMyProfile />
                    )}
                </>
            )}
        </div>
    );
}
