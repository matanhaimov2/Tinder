import React, { useEffect, useState } from 'react';

// CSS
import './editCard.css';

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

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../Redux/store';
import { setUpdatedUserData, setUserData } from '../../../../Redux/features/authSlice';

// Hooks
import useAxiosPrivate from '../../../../Hooks/usePrivate';

// Services
import { sendImagesToImgbb } from '../../../../Services/profileService';

type SaveData = {
    isSaveUpdates: boolean;
    setIsSaveUpdates: React.Dispatch<React.SetStateAction<boolean>>;
}

type Image = string | File;

function EditCard({isSaveUpdates, setIsSaveUpdates}: SaveData) {
    const dispatch = useDispatch<AppDispatch>();

    // States
    const [images, setImages] = useState<Image[]>([]); // Updated type
    const [bio, setBio] = useState<string | ''>('');
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<string | ''>('');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    const updatedUserData = useSelector((state: RootState) => state.auth.updatedUserData);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    // Check if user has data already
    useEffect(() => {
        if (userData) {
            setImages(userData.images || []);
            setBio(userData.bio || '');
            setAge(userData.age || '');
            setGender(userData.gender || '');
        }
    }, [userData]);

    const handleBioChange = (event: SelectChangeEvent<string>) => {
        setBio(event.target.value);
    };

    const handleAgeChange = (event: SelectChangeEvent<number>) => {
        setAge(event.target.value as number);
    };

    const handleGenderChange = (event: SelectChangeEvent<string>) => {
        setGender(event.target.value);
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

    // Handle save updatedData
    const handleSaveUpdates = async () => {
        const uploadedImages: string[] = [];
    
        for (const image of images) {
            if (image instanceof File) {
                const formData = new FormData();
                formData.append('image', image);
    
                try {
                    const response = await sendImagesToImgbb(formData);
                    if (response && response.data && response.data.url) {
                        uploadedImages.push(response.data.url);
                    } else {
                        // add an alert
                        setErrorMessage('Failed to upload some images.');
                    }
                } catch (error) {
                    // add an alert
                    setErrorMessage('Failed to upload some images.');
                }
            } else if (typeof image === 'string') {
                uploadedImages.push(image);
            }
        }
    
        if (userData) {
            const data = {
                ...userData,
                ...updatedUserData, // i dont understand if needed because for some reason it works without it but i cant see how!?
                images: uploadedImages,
                bio: bio || userData.bio,
                age: age || userData.age,
                gender: gender || userData.gender
            };
    
            dispatch(setUpdatedUserData(data)); // Update Redux state with new data
    
            try {
                const response = await axiosPrivateInstance.post('profiles/modifyProfile/', data);
    
                if (response) {
                    const userData = await axiosPrivateInstance.get('profiles/getUserData/');
    
                    if (userData) {
                        dispatch(setUserData(userData.data.userData));
                        // add a success alert
                        // navigate('/home')
                    }
                }
            } catch (error) {
                console.error(error);
                setErrorMessage('An error occurred. Please try again.');
            }
    
            // Reset save state
            setIsSaveUpdates(false);
        }
    };
    
    // Enabling save updated data 
    useEffect(() => {
        // if 'save' is pressed - handle save
        if (isSaveUpdates) {
            handleSaveUpdates();
        }
    }, [isSaveUpdates]);


    const ages = Array.from({ length: 82 }, (_, i) => i + 18); // Creates an array from 18 to 99

    return (
        <div className='editCard-wrapper'>

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
                                    <IconButton onClick={() => handleRemoveImage(index)} className="setprofile-upload-remove-image-button">
                                        <Delete />
                                    </IconButton>
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
                                    <IconButton onClick={() => handleRemoveImage(index + 3)} className="setprofile-upload-remove-image-button">
                                        <Delete />
                                    </IconButton>
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

            {/* Bio Input */}
            <FormControl sx={{ width: '100%' }}>
                <InputLabel id="bio-input" sx={{ color: 'white' }}>Bio</InputLabel>
                <input
                    id="bio-input"
                    type="text"
                    placeholder="Tell us about yourself"
                    style={{ padding: '6% 2%', borderRadius: '4px' }}
                    value={bio}
                    onChange={handleBioChange}
                    required
                />
            </FormControl>

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
        </div>
    );
}

export default EditCard;
