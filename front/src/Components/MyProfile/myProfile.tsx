import React, { useEffect, useState } from 'react';

// CSS
import './myProfile.css';

// React MUI
import Slider from '@mui/material/Slider';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

// Hooks
import useLogout from '../../Hooks/useLogout';

function MyProfile() {
    // States
    const [ageRange, setAgeRange] = useState<number[]>([18, 21]);
    const [distance, setDistance] = useState<number>((25));

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    console.log(userData, 'damn')

    // Get logout function from the hook
    const logout = useLogout()

    // Handle change for distance slider
    const handleDistanceChange = (event: Event, newValue: number | number[]) => {
        setDistance(newValue as number);
    };

    // Handle change for age range slider
    const handleAgeChange = (event: Event, newValue: number | number[]) => {
        const newValueArray = newValue as number[];

        // Ensure the range is at least 3 years
        if (newValueArray[1] - newValueArray[0] >= 3) {
            setAgeRange(newValueArray);
        }
    };

    return (
        <div className='myProfile-wrapper'>
            <span className='myProfile-discovery-title'> DISCOVERY SETTINGS </span>

            <div className='myProfile-underline-separator'/> {/* underline separator */}

            {/* Location Update */}
            <div className='myProfile-divs-wrapper'>
                <div className='myProfile-organize-row'>
                    <span style={{ color: 'white', fontSize: '110%' }}>
                        Location
                    </span>

                    <span style={{ color: 'white' }}>
                        api here
                    </span>
                </div>

            </div>

            <div className='myProfile-underline-separator'/> {/* underline separator */}

            {/* Distance Slider */}
            <div className='myProfile-divs-wrapper'>
                <div className='myProfile-organize-row'>
                    {/* Distance Preference Title */}
                    <span style={{ color: 'white', fontSize: '110%' }}>
                        Distance Preference
                    </span>

                    {/* Distance Display */}
                    <span style={{ color: 'white' }}>
                        {distance} km
                    </span>
                </div>

                <Slider
                    value={distance}
                    onChange={handleDistanceChange}
                    aria-label="Distance"
                    min={1}
                    max={161}
                    valueLabelDisplay="auto"  // This will show the value in km
                    sx={{
                        color: '#FF3D00',  // Adjust the slider color (similar to Tinder's primary color)
                        '& .MuiSlider-thumb': {
                            borderRadius: '50%',
                            backgroundColor: '#FF3D00',
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.5,
                            backgroundColor: '#bfbfbf',
                        },
                    }}
                />
            </div>

            <div className='myProfile-underline-separator'/> {/* underline separator */}

            {/* Interested_in Update */}
            <div className='myProfile-divs-wrapper'>
                <div className='myProfile-organize-row'>
                    <span style={{ color: 'white', fontSize: '110%' }}>
                        Looking for
                    </span>

                    <span style={{ color: 'white' }}>
                        options here
                    </span>
                </div>
            </div>

            <div className='myProfile-underline-separator'/> {/* underline separator */}

            {/* Age Slider */}
            <div className='myProfile-divs-wrapper'>
                <div className='myProfile-organize-row'>
                    {/* Age Preference Title */}
                    <span style={{ color: 'white', fontSize: '110%' }}>
                        Age Preference
                    </span>

                    {/* Age Range Display */}
                    <span style={{ color: 'white' }}>
                        {ageRange[1]} - {ageRange[0]}
                    </span>
                </div>

                <Slider
                    getAriaLabel={() => 'Temperature range'}
                    value={ageRange}
                    onChange={handleAgeChange}
                    valueLabelDisplay="auto"
                    min={18}
                    sx={{
                        color: '#FF3D00',  // Adjust the slider color (similar to Tinder's primary color)
                        '& .MuiSlider-thumb': {
                            borderRadius: '50%',
                            backgroundColor: '#FF3D00',
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.5,
                            backgroundColor: '#bfbfbf',
                        },
                    }}
                />
            </div>

            <div className='myProfile-underline-separator'/> {/* underline separator */}

            {/* Logout */}
            <div className='myProfile-divs-wrapper' style={{cursor: 'pointer'}} onClick={logout}>
                <div className='myProfile-organize-row'>
                    <span style={{ color: 'white', fontSize: '110%', margin: 'auto' }}>
                        Logout
                    </span>
                </div>
            </div>

            <div className='myProfile-underline-separator'/> {/* underline separator */}

        </div>
    );
}

export default MyProfile;
