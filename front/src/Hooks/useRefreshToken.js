import { axiosInstance } from "../Services/authService";
// import useAuth from "./useAuth";

export default function useRefreshToken() {
    // const { isLoggedIn, setAccessToken, setCSRFToken } = useAuth()
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    const refresh = async () => {
        // if(!isLoggedIn){
        //     return
        // }
        
        const response = await axiosInstance.post('users/refresh/')
        // setAccessToken(response.data.access)
        console.log('hiaefniknik')
        localStorage.setItem('accesstoken', response.data.access)
        localStorage.setItem('CSRFToken', response.headers["x-csrftoken"])
        // setCSRFToken(response.headers["x-csrftoken"])

        return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
    }

    return refresh
}