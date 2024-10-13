import React, { useEffect, useState, ChangeEvent } from 'react';
import Swal from 'sweetalert2'

// React MUI
import FormControl from '@mui/joy/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IconButton, Box } from '@mui/material';
import { AddAPhoto, Delete } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../Redux/store';
import { setUpdatedUserData, setUserData } from '../../../Redux/features/authSlice';

// Hooks
import useAxiosPrivate from '../../../Hooks/usePrivate';

// Services
import { sendImagesToImgbb } from '../../../Services/profileService';

type SaveData = {
    isSaveUpdates: boolean;
    setIsSaveUpdates: React.Dispatch<React.SetStateAction<boolean>>;
}

type Image = string | File;

function EditCard({ isSaveUpdates, setIsSaveUpdates }: SaveData) {
    const dispatch = useDispatch<AppDispatch>();

    // States
    const [images, setImages] = useState<Image[]>([]); // Updated type
    const [bio, setBio] = useState<string | ''>('');
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<string | ''>('');

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

    const handleBioChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                        // Raise an error alert
                        await Swal.fire({
                            title: 'Error!',
                            text: 'Failed to upload some images. Please try again.',
                            icon: 'error',
                            // background: '#000000',
                            // color: '#ffffff'
                            // adjusment for light/dark mode is missing
                        })

                        setIsSaveUpdates(false)
                        return;
                    }
                } catch (error) {
                    console.error(error);

                    // Raise an error alert
                    await Swal.fire({
                        title: 'Error!',
                        text: 'Failed to upload some images. Please try again.',
                        icon: 'error',
                        // background: '#000000',
                        // color: '#ffffff'
                        // adjusment for light/dark mode is missing
                    })

                    setIsSaveUpdates(false)
                    return;
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

                        // Raise a success alert
                        await Swal.fire({
                            title: "Profile Updated!",
                            text: "Your profile has been successfully updated.",
                            icon: "success",
                            confirmButtonText: "Great!",
                            // background: '#000000',
                            // color: '#ffffff'
                            // adjusment for light/dark mode is missing
                        });
                    }
                }
            } catch (error) {
                console.error(error);

                // Raise an error alert
                await Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred. Please try again.',
                    icon: 'error',
                    // background: '#000000',
                    // color: '#ffffff'
                    // adjusment for light/dark mode is missing
                })
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

            {/* Images Input */}
            <div className='setprofile-upload-images-wrapper'>
                <span id="age-select-label">Images</span>

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

            {/* Bio Input */}
            <FormControl sx={{ width: '100%', gap: '5px' }}>
                <span id="bio-input">Bio</span>
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

            {/* Age & Gender Input */}
            <div className='setprofile-content-wrapper'>
                {/* Age Input */}
                <FormControl required sx={{ width: '50%', gap: '5px' }}>
                    <span id="age-select-label">Age</span>
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
                        }} labelId="age-select-label"
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

                {/* Gender Input */}
                <FormControl required sx={{ width: '50%', gap: '5px' }}>
                    <span id="gender-select-label">Gender</span>
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

            <div className='editProfile-save-wrapper'>

                {!isSaveUpdates ? (
                    <button className='editProfile-save-button' onClick={() => setIsSaveUpdates(true)}> Save </button>
                ) : (
                    <div>
                        <CircularProgress sx={{ color: '#d43e73 ' }} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditCard;
