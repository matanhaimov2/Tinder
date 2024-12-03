import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { setAccessToken, setUserData, setIsLoggedIn } from "../../Redux/features/authSlice";

// Services
import { login } from '../../Services/authService';
import useAxiosPrivate from '../usePrivate';


// Global Veribales
import { SERVER_URL } from "../../Assets/GlobalVeriables";

export const useLogin = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Navigation Handle
    const navigate = useNavigate();

    // States
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = { username, password };

        setLoading(true);

        try {
            const response = await login(data);
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
                setErrorMessage('Username or password incorrect');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true); // Start loading
            try {
                const googleToken = tokenResponse.access_token;

                // Send the Google token to the backend for verification and user creation/fetching
                const response = await axios.post(SERVER_URL + '/users/google_login/', { google_token: googleToken });

                const { access_token, userData } = response.data;

                console.log(access_token)
                console.log(userData)

                // Store the JWT access token in Redux
                dispatch(setAccessToken(access_token));

                // Set user data in Redux and navigate based on the login status
                dispatch(setIsLoggedIn(true));
                dispatch(setUserData(userData));

                if (userData.isFirstLogin) {
                    navigate('/setprofile');
                } else {
                    navigate('/home');
                }
            } catch (error) {
                console.error('Google login error:', error);
                setErrorMessage('An error occurred during Google login. Please try again.');
            } finally {
                setLoading(false); // Stop loading
            }
        },
        onError: (error) => {
            console.error('Google Login Error:', error);
            setErrorMessage('Google Login Failed.');
        },
    });

    return {
        setUsername,
        setPassword,
        handleLogin,
        googleLogin,
        errorMessage,
        loading
    };
};
