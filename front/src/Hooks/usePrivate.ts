import { useEffect } from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../Redux/store';
import { setAccessToken } from "../Redux/features/authSlice";

// Hookes
import useRefreshToken from "./useRefreshToken";

// Services
import { axiosPrivateInstance } from "../Services/authService";

export default function useAxiosPrivate() {

    const refresh = useRefreshToken()

    const dispatch = useDispatch<AppDispatch>();
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const csrfToken = useSelector((state: RootState) => state.auth.csrfToken);
    const userData = useSelector((state: RootState) => state.auth.userData);


    useEffect(() => {
        const requestIntercept = axiosPrivateInstance.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                    config.headers['X-CSRFToken'] = csrfToken
                }
                return config
            },
            (error) => Promise.reject(error)
        )
        const responseIntercept = axiosPrivateInstance.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const { csrfToken: newCSRFToken, accessToken: newAccessToken } = await refresh() as { csrfToken: string; accessToken: string };;
                
                    dispatch(setAccessToken(newAccessToken))
                
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    prevRequest.headers['X-CSRFToken'] = newCSRFToken
                    return axiosPrivateInstance(prevRequest)
                }
                return Promise.reject(error);
            }
        )

        return () => {
            axiosPrivateInstance.interceptors.request.eject(requestIntercept)
            axiosPrivateInstance.interceptors.response.eject(responseIntercept)
        }
    }, [accessToken])

    return axiosPrivateInstance
}