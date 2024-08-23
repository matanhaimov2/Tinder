import useAuth from "./useAuth"
import { axiosPrivateInstance } from "../api/apiConfig"

export default function useLogout() {
    // const { setUser, setAccessToken, setCSRFToken, setIsLoggedIn } = useAuth()

    const logout = async () => {
        try {
            const response = await axiosPrivateInstance.post("users/logout/")

            // setAccessToken(null)
            // setCSRFToken(null)
            // setUser({})
            // setIsLoggedIn(false)
            localStorage.clear()

        } catch (error) {
            console.log(error)
        }
    }

    return logout
}