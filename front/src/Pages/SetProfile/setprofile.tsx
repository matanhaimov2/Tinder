import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";

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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Button, IconButton, Box } from '@mui/material';
import { AddAPhoto, Delete } from '@mui/icons-material';
import TextField from '@mui/material/TextField';

// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { setUserData } from "../../Redux/features/authSlice";

// Hooks
import useAxiosPrivate from "../../Hooks/usePrivate"

// Utils
import useLocation from '../../Utils/locationUtils';

// Services
import { sendImagesToImgbb } from '../../Services/profileService';

// Declare global type for Google Maps API
declare global {
    interface Window {
        google: typeof google;
    }
}

type Image = string | File;

function SetProfile() {
    const dispatch = useDispatch<AppDispatch>();

    // States
    const [loading, setLoading] = useState<boolean>(false);
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<string | ''>('');
    const [images, setImages] = useState<Image[]>([]); // Updated type
    const [interest, setInterest] = useState<string | ''>('');
    const [bio, setBio] = useState<string | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Use location hook
    const { location, coordinates, setLocation, inputRef } = useLocation('');

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    // Navigation Handle
    const navigate = useNavigate();

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

    // Function to handle the TextField change event
    const handleBioChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBio(event.target.value);
    };

    // Handle image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...images];
            newImages[index] = file; // Replace the image at the specified index
            setImages(newImages);
        }
    };

    // Handle removing image
    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index); // Filter out the image at the specified index
        setImages(newImages);
    };

    // Cleanup Object URLs when component unmounts or images change
    useEffect(() => {
        return () => {
            images.forEach(image => {
                if (image instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(image));
                }
            });
        };
    }, [images]);

    // Helper function to get object URL safely - for image preview
    const getObjectURL = (image: Image): string | undefined => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return image;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        const uploadedImages: string[] = [];

        for (const image of images) {
            if (image instanceof File) {
                const formData = new FormData();
                formData.append('image', image);

                const response = await sendImagesToImgbb(formData);
                if (response && response.data && response.data.url) {
                    uploadedImages.push(response.data.url);
                } else {
                    setErrorMessage('Failed to upload some images.');
                }
            } else if (typeof image === 'string') {
                uploadedImages.push(image);
            }
        }

        const data = {
            age: age,
            gender: gender,
            images: uploadedImages,
            location: location,
            interest: interest,
            bio: bio,
            latitude: coordinates?.lat,
            longitude: coordinates?.lng
        }

        try {
            const response = await axiosPrivateInstance.post('profiles/updateProfile/', data)

            if (response) {
                const userData = await axiosPrivateInstance.get('profiles/getUserData/')
                // console.log(userData.data.userData)

                if (userData) {
                    dispatch(setUserData(userData.data.userData))
                    navigate('/home')
                }
            }

        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred. Please try again.');

        } finally {
            setLoading(false); // End loading
        }
    };

    const ages = Array.from({ length: 82 }, (_, i) => i + 18); // Creates an array from 18 to 99


    return (
        <form className='setprofile-wrapper' onSubmit={handleSubmit}>
            <div className='setprofile-inner-wrapper'>
                <Sheet
                    sx={{
                        backgroundColor: "#111418",
                        border: 'none',
                        width: 'auto',
                        mx: 'auto', // margin left & right
                        py: 3, // padding top & bottom
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
                            <img className='login-tinder-icon' src={tinder_icon} alt='Tinder Icon'></img>
                        </div>

                        <div className='login-tinder-title-wrapper'>
                            <h1>Set Your Profile</h1>
                        </div>
                    </div>

                    {/* Images Input */}
                    <div className='setprofile-upload-images-wrapper'>
                        <InputLabel id="age-select-label" sx={{ color: 'white' }}>Images</InputLabel>

                        <div className='setprofile-upload-images-sub-wrapper'>
                            {[...Array(3)].map((_, index) => (
                                <Box className="setprofile-upload-image-box" key={index}>
                                    {images[index] ? (
                                        <>
                                            <img
                                                src={getObjectURL(images[index])}
                                                alt={`img-${index}`}
                                                className="setprofile-upload-uploaded-image"
                                            />
                                            <div onClick={() => handleRemoveImage(index)} className="setprofile-upload-remove-image-button">
                                                <Delete />
                                            </div>
                                        </>
                                    ) : (
                                        <IconButton component="label" className="setprofile-upload-add-image-button">
                                            <AddAPhoto />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleImageChange(e, index)}
                                            />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                        </div>

                        <div className='setprofile-upload-images-sub-wrapper'>
                            {[...Array(3)].map((_, index) => (
                                <Box className="setprofile-upload-image-box" key={index + 3}>
                                    {images[index + 3] ? (
                                        <>
                                            <img
                                                src={getObjectURL(images[index + 3])}
                                                alt={`img-${index + 3}`}
                                                className="setprofile-upload-uploaded-image"
                                            />
                                            <div onClick={() => handleRemoveImage(index + 3)} className="setprofile-upload-remove-image-button">
                                                <Delete />
                                            </div>
                                        </>
                                    ) : (
                                        <IconButton component="label" className="setprofile-upload-add-image-button">
                                            <AddAPhoto />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleImageChange(e, index + 3)}
                                            />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                        </div>
                    </div>

                    {/* Age & Gender Input */}
                    <div className='setprofile-content-wrapper'>
                        <FormControl required sx={{ width: '50%' }}>
                            <InputLabel id="age-select-label" sx={{ color: 'white' }}>Age</InputLabel>
                            <Select
                                sx={{ background: 'white' }}
                                labelId="age-select-label"
                                id="age-select"
                                label="Age"
                                value={age}
                                onChange={handleAgeChange}
                                required
                            >
                                {ages.map(age => (
                                    <MenuItem key={age} value={age}>
                                        {age}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl required sx={{ width: '50%' }}>
                            <InputLabel id="gender-select-label" sx={{ color: 'white' }}>Gender</InputLabel>
                            <Select
                                sx={{ background: 'white' }}
                                labelId="gender-select-label"
                                id="gender-select"
                                label="Gender"
                                value={gender}
                                onChange={handleGenderChange}
                                required
                            >
                                <MenuItem value={'man'}>Man</MenuItem>
                                <MenuItem value={'woman'}>Woman</MenuItem>
                                <MenuItem value={'other'}>Other</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Bio Input */}
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="bio-input" sx={{ color: 'white' }}>Bio</InputLabel>
                        <TextField
                            id="bio-input"
                            placeholder="Tell us about yourself"
                            variant="outlined" // Can also be 'filled' or 'standard'
                            multiline
                            rows={4} // Adjust this for the height of the TextField
                            value={bio}
                            onChange={handleBioChange}
                            sx={{
                                background: 'white', '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none', // Disable the outline
                                    },
                                },
                            }}
                            required
                        />
                    </FormControl>

                    {/* Location Input */}
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="location-input" sx={{ color: 'white' }}>Location</InputLabel>
                        <input
                            ref={inputRef}
                            id="location-input"
                            type="text"
                            placeholder="Enter your location"
                            style={{ padding: '2%', borderRadius: '4px', outline: 'none' }}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </FormControl>

                    {/* Intereset_in Input */}
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="interest-select-label" sx={{ color: 'white' }}>Interested in</InputLabel>
                        <Select
                            sx={{ background: 'white' }}
                            labelId="interest-select-label"
                            id="interest-select-0"
                            label="Interested in"
                            value={interest}
                            onChange={handleInterestChange}
                            required
                        >
                            <MenuItem value={'man'}>Men</MenuItem>
                            <MenuItem value={'woman'}>Women</MenuItem>
                            <MenuItem value={'other'}>Other</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Show CircularProgress while loading */}
                    {loading ? (
                        <Box className='login-loading-wrapper'>
                            <CircularProgress color='inherit' />
                        </Box>
                    ) : (
                        <Button type='submit' sx={{
                            padding: 2, backgroundColor: 'primary.main', color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark', // Adjust hover color if needed
                            }
                        }}
                        >
                            Proceed
                        </Button>
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