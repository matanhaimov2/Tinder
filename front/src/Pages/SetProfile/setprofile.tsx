import React, { useState, useEffect, useRef } from 'react';

// CSS
import './setprofile.css';

// Images
import tinder_icon from '../../Assets/Images/tinder_fire_logo.png';

// React MUI
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

// Declare global type for Google Maps API
declare global {
    interface Window {
        google: typeof google;
    }
}

function SetProfile() {
    // States
    const [loading, setLoading] = useState<boolean>(false);
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<string | ''>('');
    const [location, setLocation] = useState<string | ''>('');
    const [interest, setInterest] = useState<string | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Refs
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    // google maps place autoComplete
    // Define the options type according to Google Maps API types
    const options: google.maps.places.AutocompleteOptions = {
        componentRestrictions: { country: "IL" },
        fields: ["address_components", "geometry", "icon", "name"],
        types: ["address"]
    };

    useEffect(() => {
        if (window.google && inputRef.current) {
            autoCompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                options
            );

            autoCompleteRef.current.addListener("place_changed", async function () {
                const place = autoCompleteRef.current?.getPlace();
                if(place) {
                    const address = place.name || '';
                    setLocation(address);
                }
            });
        }
    }, []); // --- render error!

    // Handle form changes
    const handleAgeChange = (event: SelectChangeEvent<number>) => {
        setAge(event.target.value as number);
    };

    const handleGenderChange = (event: SelectChangeEvent<string>) => {
        setGender(event.target.value);
    };

    const handleInterestChange = (event: SelectChangeEvent<string>) => {
        setInterest(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            age: age,
            gender: gender,
            location: location,
            interest: interest
        }
        console.log(data)
        setLoading(true);

        try {
            // const response = await login(data);
            // console.log(response);
            

            // navigate('/home')

        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred. Please try again.');

        } finally {
            setLoading(false); // End loading
        }
    };


    const ages = Array.from({ length: 82 }, (_, i) => i + 18); // Creates an array from 18 to 99

    const userData = useSelector((state: RootState) => state.auth.userData);
    console.log(userData,'damn')
    
    return (
        <form className='setprofile-wrapper' onSubmit={handleSubmit}>
            <div className='setprofile-inner-wrapper'>
            <Sheet
                sx={{
                    backgroundColor: "#111418",
                    border: 'none',
                    width: 400,
                    height: 500,
                    mx: 'auto', // margin left & right
                    my: 12, // margin top & bottom
                    py: 6, // padding top & bottom
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                    color: 'white'
                }}
                variant="outlined"
            >
                <div className='login-tinder-content-wrapper'>
                    <div className='login-tinder-icon-wrapper'>
                        <img className='login-tinder-icon' src={tinder_icon}></img>
                    </div>

                    <div className='login-tinder-title-wrapper'>
                        <h1>Set Your Profile</h1>
                    </div>
                </div>

                <div className='setprofile-content-wrapper'>
                    <FormControl required sx={{ width: '50%' }}>
                        <InputLabel id="demo-simple-select-required-label" sx={{ color: 'white' }}>Age</InputLabel>
                        <Select
                        sx={{ background: 'white' }}
                        labelId="age-select-label"
                        id="age-select"
                        label="Age"
                        value={age}
                        onChange={handleAgeChange}
                        >
                        {ages.map(age => (
                        <MenuItem key={age} value={age}>
                            {age}
                        </MenuItem>
                        ))}
                        </Select>
                    </FormControl>

                    <FormControl required sx={{ width: '50%' }}>
                        <InputLabel id="demo-simple-select-required-label" sx={{ color: 'white' }}>Gender</InputLabel>
                        <Select
                        sx={{ background: 'white' }}
                        labelId="gender-select-label"
                        id="gender-select"
                        label="Gender"
                        value={gender}
                        onChange={handleGenderChange}
                        >
                        <MenuItem value={'man'}>Man</MenuItem>
                        <MenuItem value={'woman'}>Woman</MenuItem>
                        <MenuItem value={'other'}>Other</MenuItem>
                        </Select>
                    </FormControl>
                </div>


                <FormControl required sx={{ width: '100%' }}>
                    <InputLabel id="demo-simple-select-required-label" sx={{ color: 'white' }}>Location</InputLabel>
                    <input
                        ref={inputRef}
                        id="location-input"
                        type="text"
                        placeholder="Enter your location"
                        style={{padding: '6%', borderRadius: '4px'}}
                    />
                </FormControl>

                <FormControl required sx={{ width: '100%' }}>
                    <InputLabel id="demo-simple-select-required-label" sx={{ color: 'white' }}>Interested in</InputLabel>
                    <Select
                    sx={{ background: 'white' }}
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
                </FormControl>

                {/* Show CircularProgress while loading */}
                {loading ? (
                    <Box className='login-loading-wrapper'>
                        <CircularProgress color='inherit' />
                    </Box>
                ) : (
                    <Button type='submit' sx={{padding: 2}}>Proceed</Button>
                )}

                {/* Display message */}
                {errorMessage && (
                    <Alert severity='error'> {errorMessage} </Alert>
                )}

            </Sheet>
            </div>
        </form>
    );
}

export default SetProfile;