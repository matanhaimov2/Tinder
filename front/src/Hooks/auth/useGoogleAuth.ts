import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { setAccessToken, setUserData, setIsLoggedIn } from '../../Redux/features/authSlice';

// Services
import { googleLoginService } from '../../Services/authService';
import useAxiosPrivate from '../usePrivate';

export const useGoogleAuth = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Navigation Handle
    const navigate = useNavigate();

    // States
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate();

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);

            try {
                const googleToken = tokenResponse.access_token;
                const response = await googleLoginService({ google_token: googleToken });

                dispatch(setAccessToken(response.access_token));

                if (response && !response.detail) {
                    const res = await axiosPrivateInstance.get('profiles/getUserData/');
                    const userData = res.data.userData;

                    dispatch(setIsLoggedIn(true));

                    if (userData && userData.isFirstLogin) {
                        dispatch(setUserData(userData));
                        navigate('/setprofile');
                    } else if (userData && !userData.isFirstLogin) {
                        dispatch(setUserData(userData));
                        navigate('/home');
                    } else {
                        dispatch(setIsLoggedIn(false));
                        console.log('Something went wrong');
                    }
                } else {
                    setErrorMessage('Failed to authenticate with Google');
                }
            } catch (error) {
                console.error('Google login error:', error);
                setErrorMessage('An error occurred during Google login. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google Login Error:', error);
            setErrorMessage('Google Login Failed.');
        },
    });

    return { googleLogin, loading, errorMessage };
};
