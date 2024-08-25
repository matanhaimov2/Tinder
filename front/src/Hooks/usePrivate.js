import { axiosPrivateInstance } from "../Services/authService";
import { useEffect } from 'react'
// import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

export default function useAxiosPrivate() {

    const accessToken = localStorage.getItem('accesstoken')
    // const setAccessToken = localStorage.getItem('CSRFToken')
    const csrftoken = localStorage.getItem('CSRFToken')
    // const user = localStorage.getItem('isLoggedIn')
    // const { accessToken, setAccessToken, csrftoken, user } = useAuth()
    const refresh = useRefreshToken()

    useEffect(() => {
        const requestIntercept = axiosPrivateInstance.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                    config.headers['X-CSRFToken'] = csrftoken
                }
                return config
            },
            (error) => Promise.reject(error)
        )
        console.log('jio2')
        const responseIntercept = axiosPrivateInstance.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const { csrfToken: newCSRFToken, accessToken: newAccessToken } = await refresh();
                
                    localStorage.setItem('accesstoken', newAccessToken)
                
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    prevRequest.headers['X-CSRFToken'] = newCSRFToken
                    return axiosPrivateInstance(prevRequest)
                }
                return Promise.reject(error);
            }
        )
        console.log('jio2')

        return () => {
            axiosPrivateInstance.interceptors.request.eject(requestIntercept)
            axiosPrivateInstance.interceptors.response.eject(responseIntercept)
        }
    }, [accessToken])

    return axiosPrivateInstance
}