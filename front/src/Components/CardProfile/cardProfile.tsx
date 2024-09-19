import React, { useEffect, useState, useRef } from 'react';

// CSS
import './cardProfile.css';

// React MUI
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

// React Icons
import { TiDelete, TiHeart } from "react-icons/ti";
import { IoLocationOutline } from "react-icons/io5";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../Redux/store';
import { setDidMatchOccuer } from "../../Redux/features/authSlice";

// Hooks
import useAxiosPrivate from '../../Hooks/usePrivate';

// Components
import CardLoader from '../Loaders/cardLoader/cardLoader';

// Interfaces
interface UserProfile {
    user_id: number;
    images: string[];
    firstname: string;
    lastname: string
    age: number;
    gender: string;
    bio: string;
    location: string;
    distance: number;
}

// Props Interfaces
interface EditProfile {
    isInEditProfile: boolean;
}

function CardProfile({ isInEditProfile }: EditProfile) {
    const dispatch = useDispatch<AppDispatch>();

    // States
    const [usersProfilesData, setUsersProfilesData] = useState<UserProfile[]>([]); // All proper users 
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null); // Current user displayed
    const [currentUserImages, setCurrentUserImages] = useState<string[]>([]); // Current user displayed
    const [usersIndex, setUsersIndex] = useState(0); // Index for swiping users
    const [userImagesIndex, setUserImagesIndex] = useState(0); // Index for swiping through current user's images
    const [errorMessage, setErrorMessage] = useState<string>(); // error message
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [dislikeSum, setDislikeSum] = useState<number[]>([]); // Stores dislikes

    // Refs
    const updatedDislikeListRef = useRef(dislikeSum); // Initialize with state value

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    const didMatchOccuer = useSelector((state: RootState) => state.auth.didMatchOccuer);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    // Configuration
    var SaveDislikesEveryX = 3;


    // Fetch profiles from backend
    useEffect(() => {
        const fetchProfiles = async () => {
            const data = {
                ageRange: userData?.ageRange,
                distance: userData?.distance,
                interest: userData?.interested_in,
                longitude: userData?.longitude,
                latitude: userData?.latitude
            }

            try {
                setLoading(true);
                const response = await axiosPrivateInstance.post('profiles/fetchProfiles/', data)
                setUsersProfilesData(response.data.usersProfilesData);
                setLoading(false);

            } catch (error) {
                setLoading(false);
                console.log('Failed to fetch profiles:', error)
            }
        }

        const fetchOwnProfile = async () => {
            try {
                setLoading(true);
                const response = await axiosPrivateInstance.get('profiles/fetchOwnProfile/')
                setUsersProfilesData(response.data.usersProfileData);
                setLoading(false);

            } catch (error) {
                setLoading(false);
                console.log('Failed to fetch profile:', error)
            }
        }

        // If user in home route - display all users
        if (!isInEditProfile) {
            fetchProfiles();
        }
        // If user in editProfile in preview mode - display only his
        else {
            fetchOwnProfile();
        }

    }, [userData])

    // Set currentUser according to index
    useEffect(() => {
        if (usersProfilesData.length > 0 && usersProfilesData[usersIndex]) {
            setCurrentUser(usersProfilesData[usersIndex]);
            setCurrentUserImages(usersProfilesData[usersIndex].images);
        } else {
            setCurrentUser(null);
            setErrorMessage('No More Potential Matches, try to adjust your preferences');
        }

        console.log(usersProfilesData)

    }, [usersProfilesData, usersIndex])

    // Handle tab change (image swiping)
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setUserImagesIndex(parseInt(newValue, 10)); // parseInt(newValue, 10) will convert it to the number, e.g: '1' => 1.
    };

    const handleUserAction = async (action: 'like' | 'dislike') => {
        try {
            // Move to the next user in the list
            setUsersIndex(prevIndex => prevIndex + 1);

            if (action === 'like') {
                // Send like action to the backend
                const response = await axiosPrivateInstance.post(`interactions/userAction/${action}/`, {
                    target_user_id: currentUser?.user_id
                });
            }
            else {
                if (currentUser?.user_id) {
                    setDislikeSum([...dislikeSum, currentUser?.user_id])
                }
            }

            if (currentUser?.user_id) {
                if (userData?.likes.includes(currentUser?.user_id)) {

                    const response = await axiosPrivateInstance.post(`interactions/verifyMatch/`, {
                        target_user_id: currentUser?.user_id
                    });

                    dispatch(setDidMatchOccuer(!didMatchOccuer))
                    console.log('MATCH')
                }
            }
        } catch (error) {
            console.error("Error handling user action:", error);
        }
    };

    // dislikeRequest funciton for blacklisting users
    const dislikeRequest = async (ListOfDislikes : number[]) => {
        // Send dislike action to the backend
        const response = await axiosPrivateInstance.post('interactions/userAction/dislike/', {
            target_user_id: ListOfDislikes
        });

        setDislikeSum([])
    }
    
    // Unload request to backend
    useEffect(() => {
        const handleUnload = () => {
            // Perform actions before the component unloads

            const currentDislikeList = updatedDislikeListRef.current; // Latest value in ref
           
            if (currentDislikeList.length > 0) {
                dislikeRequest(currentDislikeList);
            }

        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    // if dislikeSum is X send to backend to user_id blacklist
    useEffect(() => {
        if (dislikeSum.length===SaveDislikesEveryX) {
            dislikeRequest(dislikeSum)
        }

        updatedDislikeListRef.current = dislikeSum;

    }, [dislikeSum])


    return (
        <div className={`cardProfile-wrapper ${isInEditProfile ? 'cardProfile-wrapper-ifEdit' : ''}`}>
            <div className={`cardProfile-card ${isInEditProfile ? 'cardProfile-card-ifEdit' : ''}`}>

                {/* basically, if !loading && currentUser => display content, elif, !loading && !currentUser => display errorMessage */}
                {loading ? (
                    <div style={{ width:'100%', height: '100%', color: 'white' }}><CardLoader /></div> // loading ui here!
                ) : currentUser ? (
                    <div className='cardProfile-user-wrapper' style={{ backgroundImage: currentUserImages ? `url(${currentUserImages[userImagesIndex]})` : 'none' }}>
                        <div className='cardProfile-user-images-nav-wrapper'>
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={userImagesIndex.toString()}>
                                    <Box sx={{ borderColor: 'divider' }}>
                                        <TabList onChange={handleChange} aria-label="user image tabs"
                                            TabIndicatorProps={{
                                                style: {
                                                    backgroundColor: 'white', // The active tab (white)
                                                    display: 'none', // Remove the indicator line
                                                },
                                            }}
                                        >
                                            {currentUserImages.map((_, index) => (
                                                <Tab key={index} value={index.toString()}
                                                    sx={{
                                                        minWidth: '10%', // Making the width smaller
                                                        height: 2, // Reduce the height for a thinner tab
                                                        backgroundColor: userImagesIndex === index ? 'white' : 'grey', // White for active, grey for others
                                                        margin: '0 2px', // Slightly reduce the space between tabs
                                                        borderRadius: '4px', // Add a bit of rounding to the tabs
                                                        transition: 'background-color 0.3s ease', // Smooth transition
                                                        minHeight: '3px',
                                                        padding: 'unset',
                                                        flexGrow: 1, // Each tab grows equally
                                                        flexBasis: `${100 / currentUserImages.length}%`,
                                                    }}
                                                />
                                            ))}
                                        </TabList>
                                    </Box>
                                </TabContext>
                            </Box>

                            {/* Images Navigator On Click Screen */}
                            <div style={{ height: '100%', width: '100%' }}>
                                {/* Left side: Previous image */}
                                <div className='cardProfile-img-navigator-left'
                                    onClick={() => {
                                        // Go to the previous image
                                        setUserImagesIndex(prevIndex =>
                                            prevIndex === 0 ? currentUserImages.length - 1 : prevIndex - 1
                                        );
                                    }}
                                />

                                {/* Right side: Next image */}
                                <div className='cardProfile-img-navigator-right'
                                    onClick={() => {
                                        // Go to the next image
                                        setUserImagesIndex(prevIndex =>
                                            prevIndex === currentUserImages.length - 1 ? 0 : prevIndex + 1
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className='cardProfile-user-details-wrapper'>
                            <div className='cardProfile-details-inner'>
                                <div className='cardProfile-ageFirst-wrapper'>
                                    <span> {currentUser.age} </span>
                                    <span> {currentUser.firstname} </span>
                                </div>

                                {currentUser.distance && (
                                    <span style={{ display: 'flex', alignItems: 'center' }}> {Math.floor(currentUser.distance)} kilometers away</span>
                                )}

                            </div>

                            <div className='cardProfile-details-inner'>
                                <div className='cardProfile-details-location'>
                                    <IoLocationOutline />
                                    <span> {currentUser.location} </span>
                                </div>
                                <span className='cardProfile-details-bio'> {currentUser.bio} </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <span style={{ color: 'white' }}> {errorMessage} </span>
                )}
            </div>

            {!isInEditProfile && (
                <>
                    <div style={{ height: '1px', backgroundColor: 'grey' }} /> {/* underline separator */}

                    <div className='cardProfile-nav-card'>
                        <div className="tinder-button heart-button">
                            <TiHeart className="icon" onClick={() => handleUserAction('like')} />
                        </div>
                        <div className="tinder-button dislike-button">
                            <TiDelete className="icon" onClick={() => handleUserAction('dislike')} />
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}

export default CardProfile;
