// Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../Redux/store';
import { setAccessToken, setCsrfToken } from "../Redux/features/authSlice";

// Services
import { axiosInstance } from "../Services/authService";

export default function useRefreshToken() {
    const dispatch = useDispatch<AppDispatch>();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    const refresh = async () => {
        if(!isLoggedIn){
            return
        }
        
        const response = await axiosInstance.post('users/refresh/')

        dispatch(setAccessToken(response.data.access));
        dispatch(setCsrfToken(response.headers["x-csrftoken"]))


        return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
    }

    return refresh
}