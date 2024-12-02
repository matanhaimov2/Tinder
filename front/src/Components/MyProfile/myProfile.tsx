import React, { useEffect, useState } from 'react';

// CSS
import './myProfile.css';

// React MUI
import Slider from '@mui/material/Slider';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// React Icons
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../Redux/store';
import { setUpdatedUserData } from "../../Redux/features/authSlice";

// Hooks
import useLogout from '../../Hooks/auth/useLogout';

// Utils
import useLocation from '../../Utils/locationUtils';

function MyProfile() {
    const dispatch = useDispatch<AppDispatch>();

    // States
    const [ageRange, setAgeRange] = useState<number[]>([18, 21]);
    const [distance, setDistance] = useState<number>((25));
    const [interest, setInterest] = useState<string | ''>('');
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isInterestOpen, setIsInterestOpen] = useState(false);

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    const updatedUserData = useSelector((state: RootState) => state.auth.updatedUserData);

    // Use location hook
    const { location, coordinates, setLocation, inputRef } = useLocation('');

    // Get logout function from the hook
    const logout = useLogout()

    // Set default values for ageRange and distance based on userData
    useEffect(() => {
        if (userData) {
            setAgeRange(userData.ageRange || [18, 21]);
            setDistance(userData.distance || 25);
        }
    }, [userData]);

    // Handle form changes
    const handleDistanceChange = (event: Event, newValue: number | number[]) => {
        setDistance(newValue as number);
    };

    const handleAgeChange = (event: Event, newValue: number | number[]) => {
        const newValueArray = newValue as number[];

        // Ensure the range is at least 3 years
        if (newValueArray[1] - newValueArray[0] >= 3) {
            setAgeRange(newValueArray);
        }
    };

    const handleInterestChange = (event: SelectChangeEvent<string>) => {
        setInterest(event.target.value);
    };

    useEffect(() => {
        if (userData) {
            const data = {
                ...userData,
                ...updatedUserData,
                distance: distance,
                ageRange: ageRange,
                location: location || userData.location,
                interested_in: interest || userData.interested_in,
                latitude: coordinates?.lat || userData.latitude,
                longitude: coordinates?.lng || userData.longitude
            };

            dispatch(setUpdatedUserData(data));
        }
    }, [distance, ageRange, interest, location, dispatch]);

    return (
        <div className='myProfile-wrapper'>
            <span className='myProfile-discovery-title'> DISCOVERY SETTINGS </span>

            <div className='myProfile-underline-separator' /> {/* underline separator */}

            {/* Location Update */}
            <div className='myProfile-divs-wrapper'>
                <div className='myProfile-organize-row'>
                    <span style={{ fontSize: '110%' }}>
                        Location
                    </span>

                    {!isLocationOpen ? (
                        <div className='myProfile-arrow-wrapper'>
                            <IoIosArrowForward className='myProfile-arrow-icon' onClick={() => setIsLocationOpen(!isLocationOpen)} />
                            <span style={{ color: '#7c8591' }}> {userData?.location} </span>
                        </div>
                    ) : (
                        <div className='myProfile-arrow-wrapper'>
                            <IoIosArrowBack className='myProfile-arrow-icon' onClick={() => setIsLocationOpen(!isLocationOpen)} />
                            <input
                                ref={inputRef}
                                id="location-input"
                                type="text"
                                placeholder="Enter your location"
                                style={{ padding: '2%', borderRadius: '4px', width: '100%', border: 'none', outline: 'none' }}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    )}
                </div>

            </div>

            <div className='myProfile-underline-separator' /> {/* underline separator */}

            {/* Distance Slider */}
            <div className='myProfile-divs-wrapper'>
                <div className='myProfile-organize-row'>
                    {/* Distance Preference Title */}
                    <span style={{ fontSize: '110%' }}>
                        Distance Preference
                    </span>

                    {/* Distance Display */}
                    <span>
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
                        color: '#ff4458',  // Adjust the slider color (similar to Tinder's primary color)
                        '& .MuiSlider-thumb': {
                            borderRadius: '50%',
                            backgroundColor: '#ff4458',
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.5,
                            backgroundColor: '#bfbfbf',
                        },
                    }}
                />
            </div>

            <div className='myProfile-underline-separator' /> {/* underline separator */}

            {/* Interested_in Update */}
            <div className='myProfile-divs-wrapper'>
                <div className='myProfile-organize-row'>
                    <span style={{ fontSize: '110%' }}>
                        Looking for
                    </span>

                    {!isInterestOpen ? (
                        <div className='myProfile-arrow-wrapper'>
                            <IoIosArrowForward className='myProfile-arrow-icon' onClick={() => setIsInterestOpen(!isInterestOpen)} />
                            <span style={{ color: '#7c8591' }}> {userData?.interested_in} </span>
                        </div>
                    ) : (
                        <div className='myProfile-arrow-wrapper'>
                            <IoIosArrowBack className='myProfile-arrow-icon' onClick={() => setIsInterestOpen(!isInterestOpen)} />

                            <div>
                                <Select
                                    sx={{
                                        background: 'white',
                                        border: 'none',            // Removes border
                                        outline: 'none',           // Removes outline
                                        boxShadow: 'none',         // Removes box-shadow when focused
                                        '& fieldset': {            // Removes the border when focused
                                            border: 'none'
                                        },
                                        '&:focus-visible': {       // Removes default focus behavior
                                            outline: 'none',
                                            boxShadow: 'none'
                                        }
                                    }}
                                    labelId="interest-select-label"
                                    id="interest-select"
                                    label="Interested in"
                                    value={interest}
                                    onChange={handleInterestChange}
                                >
                                    <MenuItem value={'man'}>Man</MenuItem>
                                    <MenuItem value={'woman'}>Woman</MenuItem>
                                    <MenuItem value={'other'}>Other</MenuItem>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='myProfile-underline-separator' /> {/* underline separator */}

            {/* Age Slider */}
            <div className='myProfile-divs-wrapper'>
                <div className='myProfile-organize-row'>
                    {/* Age Preference Title */}
                    <span style={{ fontSize: '110%' }}>
                        Age Preference
                    </span>

                    {/* Age Range Display */}
                    <span>
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
                        color: '#ff4458',  // Adjust the slider color (similar to Tinder's primary color)
                        '& .MuiSlider-thumb': {
                            borderRadius: '50%',
                            backgroundColor: '#ff4458',
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.5,
                            backgroundColor: '#bfbfbf',
                        },
                    }}
                />
            </div>

            <div className='myProfile-underline-separator' /> {/* underline separator */}

            {/* Logout */}
            <div className='myProfile-divs-wrapper' style={{ cursor: 'pointer' }} onClick={logout}>
                <div className='myProfile-organize-row'>
                    <span style={{ fontSize: '110%', margin: 'auto' }}>
                        Logout
                    </span>
                </div>
            </div>

            <div className='myProfile-underline-separator' /> {/* underline separator */}

        </div>
    );
}

export default MyProfile;
