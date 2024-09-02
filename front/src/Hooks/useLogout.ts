// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../Redux/store';
import { setAccessToken, setCsrfToken, setUserData, setIsLoggedIn } from "../Redux/features/authSlice";

// Services
import { axiosPrivateInstance } from "../Services/authService"

export default function useLogout() {
    const dispatch = useDispatch<AppDispatch>();

    const logout = async () => {
        try {
            const response = await axiosPrivateInstance.post("users/logout/")

            dispatch(setAccessToken(''))
            dispatch(setCsrfToken(null))
            dispatch(setUserData([]))
            dispatch(setIsLoggedIn(false))
            console.log('nurds')
            // delete from localstorage redux persist

        } catch (error) {
            console.error('Logout failed', error); // Check for any errors
        }
    }

    return logout
}