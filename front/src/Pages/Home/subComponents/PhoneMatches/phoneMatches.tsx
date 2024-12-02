import React from 'react';

// CSS
import './phoneMatches.css';

// Images
import logo from '../../../../Assets/Images/tinder-main-logo2.png'

// Components
import Matches from '../Matches/matches';
import Messages from '../Messages/messages';
import { useTheme } from '../../../../Components/Theme/ThemeContext';

// Interfaces
interface UserMatch {
    user_id: number;
    image: string;
    first_name: string;
    room_id: string;
    latest_message: string | null;
    latest_message_timestamp: string | null;
}

interface PhoneMatchesProps {
    matches?: UserMatch[];
    withFilteredConv?: UserMatch[];
    messages?: UserMatch[];

}

function PhoneMatches({ matches, messages }: PhoneMatchesProps) {
    const { theme } = useTheme();

    return (
        <div className={`phoneMatches-wrapper ${theme}alt`} >
            <img className='home-img-phone-wrapper' src={logo} alt="Match Logo" />

            <div className='phoneMatches-content-wrapper'>
                <Matches matches={matches} withFilteredConv={messages} />
                <Messages messages={messages} />
            </div>
        </div>
    );
}

export default PhoneMatches;