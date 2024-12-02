import React, { useState } from 'react';
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
import { useMatches } from '../../Hooks/matches/useMatches';

type Tab = {
    id: 'home' | 'chats' | 'profile';
    icon: JSX.Element;
    label: string;
};

const PhoneView = ({ activeTabPhone, messages, matches }: any) => {
    switch (activeTabPhone) {
        case 'chats':
            return <PhoneMatches messages={messages} matches={matches} withFilteredConv={messages} />;
        case 'profile':
            return <PhoneMyProfile />;
        default:
            return null;
    }
};

export default function Home() {
    // States
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State to manage visibility
    const [navValue, setNavValue] = useState(2); // Index for nav (Matches/Messages)
    const [activeTabPhone, setActiveTabPhone] = useState<'home' | 'chats' | 'profile'>('home'); // Set default active tab

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    const didMatchOccuer = useSelector((state: RootState) => state.auth.didMatchOccuer);

    const { theme, toggleTheme } = useTheme();

    // Handle responsive
    const isTabletOrPhone = useMediaQuery({ query: '(max-width: 760px)' })

    // Fetch matches and messages from the custom hook
    const { matches, messages } = useMatches(didMatchOccuer);

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

    // nav between tabs
    const tabs = [
        { id: 'messages', label: 'Messages', value: '1' },
        { id: 'matches', label: 'Matches', value: '2' }
    ];

    // Phone bottom-nav - nav between tabs
    const phoneTabs: Tab[] = [
        { id: 'home', icon: <SiTinder />, label: 'Home' },
        { id: 'chats', icon: <PiChatsCircleFill />, label: 'Chats' },
        { id: 'profile', icon: <PiUserFill />, label: 'Profile' },
    ];

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
                                <img className='home-side-nav-img' src={userData.images[0]} alt="User Image"></img>
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
                                                    {tabs.map(tab => (
                                                        <Tab
                                                            key={tab.id}
                                                            label={tab.label}
                                                            value={tab.value}
                                                            aria-label={tab.label}
                                                            sx={{
                                                                fontFamily: 'Montserrat, sans-serif',
                                                                fontWeight: '600',
                                                                color: theme === 'dark' ? 'white' : 'black', // Default color for inactive tabs
                                                                textTransform: 'none', // Disable uppercase transformation
                                                                '&.Mui-selected': {
                                                                    color: theme === 'dark' ? 'white' : 'black', // Set white color for the active tab
                                                                },
                                                            }}
                                                        />
                                                    ))}
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
                    {phoneTabs.map((tab) => (
                        <div key={tab.id} className='home-bottom-icons-phone-wrapper' onClick={() => handleTabClick(tab.id)}>
                            <div className={activeTabPhone === tab.id ? 'active-tab' : 'inactive-tab'}>
                                {tab.icon}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isTabletOrPhone && <PhoneView activeTabPhone={activeTabPhone} messages={messages} matches={matches} />}

        </div>
    );
}
