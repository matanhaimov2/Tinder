import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { setAccessToken, setUserData, setIsLoggedIn } from "../../Redux/features/authSlice";

// Services
import { login } from '../../Services/authService';
import useAxiosPrivate from '../usePrivate';

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

    return {
        setUsername,
        setPassword,
        handleLogin,
        errorMessage,
        loading
    };
};
