import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { setAccessToken, setCsrfToken, setUserData, setIsLoggedIn } from "../../Redux/features/authSlice";

// Services
import { axiosPrivateInstance } from "../../Services/authService"

export default function useDeleteAccount() {
    const dispatch = useDispatch<AppDispatch>();

    // States
    const [loading, setLoading] = useState(false);

    // Navigation Handle
    const navigate = useNavigate();

    const deleteAccount = async () => {
        setLoading(true);
        try {
            await axiosPrivateInstance.post("users/deleteAccount/")

            // logout user
            dispatch(setAccessToken(''))
            dispatch(setCsrfToken(''))
            dispatch(setUserData(null))
            dispatch(setIsLoggedIn(false))

            // Clear local storage
            localStorage.removeItem('persist:root');

            navigate('/');

        } catch (error) {
            console.error('Account Deletion failed', error); // Check for any errors
        } finally {
            setLoading(false);
        }
    }

    return { deleteAccount, loading };
}