// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { setAccessToken, setCsrfToken, setUserData, setIsLoggedIn } from "../../Redux/features/authSlice";

// Services
import { axiosPrivateInstance } from "../../Services/authService"

export default function useLogout() {
    const dispatch = useDispatch<AppDispatch>();
    
    const logout = async () => {
        try {
            const res = await axiosPrivateInstance.post("users/logout/")
          
            // console.log(res)
            dispatch(setAccessToken(''))
            dispatch(setCsrfToken(''))
            dispatch(setUserData(null))
            dispatch(setIsLoggedIn(false))
            
            // Clear local storage
            localStorage.removeItem('persist:root'); // Adjust if you use a different key

        } catch (error) {
            console.error('Logout failed', error); // Check for any errors
        }
    }

    return logout
}