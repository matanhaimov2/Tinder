// CSS
import './phoneMyProfile.css';

// Components
import EditProfile from '../../../../Components/EditProfile/editProfile';
import MyProfile from '../../../../Components/MyProfile/myProfile';
import { useTheme } from '../../../../Components/Theme/ThemeContext';
import MaterialUISwitch from '../../../../Components/Theme/MaterialUISwitch';

// Interfaces

function PhoneMyProfile() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`phoneMyProfile-wrapper ${theme}alt`}>
            <EditProfile />
            <MyProfile />
            <div className='phoneMyProfile-switch-theme-wrapper'>
                <MaterialUISwitch checked={theme === 'dark'} onClick={toggleTheme} />
            </div>
        </div>
    );
}

export default PhoneMyProfile;