import React from 'react';

// CSS
import './matchPopUp.css';

// Images
import logo from '../../../../Assets/Images/popupmatch.png';

// Components
import { useTheme } from '../../../Theme/ThemeContext';

// Props Interfaces
interface MatchDetails {
    first_name: string;
    user_img: string;
}

interface MatchPopUpProps {
    user_details: MatchDetails;
    setIsMatchPop: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MatchPopUp({ user_details, setIsMatchPop }: MatchPopUpProps) {
    const { theme } = useTheme();
    const { first_name, user_img } = user_details;

    const handleClose = () => {
        setIsMatchPop(false);
    };

    return (
        <div className='matchPopUp-overlay' onClick={handleClose}>
            <div className='matchPopUp-wrapper' style={{ backgroundColor: theme === 'dark' ? '#111418' : '#f0f2f4' }} onClick={(e) => e.stopPropagation()}>
                <div className='matchPopUp-img-wrapper'>
                    <img className='matchPopUp-img' src={logo} alt="Match Logo" />
                </div>

                <div className='matchPopUp-content-wrapper'>
                    <h2>Congratulations!</h2>
                    <p>You have a new match with <strong>{first_name}</strong>!</p>
                    {user_img && <img className='matchPopUp-user-img' src={user_img} alt={`${first_name}'s profile`} />}
                    
                    <button className='matchPopUp-close-button' onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
