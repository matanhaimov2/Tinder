import axios from "axios";
import { access } from "fs";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";

// Props Types
type RegisterData = {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
}

type LoginData = {
    username: string;
    password: string;
}

const register = async (data : RegisterData) => {
    try {
        // Sends to back the data to insert db
        const response = await axios.post(SERVER_URL + "/users/register/", data)
        console.log(response);

        return response.data
    }
    catch (err: any) {
        if (err.response) {
            return err.response.data;
        } else {
            return { error: ["An unknown error occurred."] };
        }
    }
}

const login = async (data : LoginData) => {
    try {
        // Sends to back username and password to see if correct
        const response = await axios.post(SERVER_URL + "/users/login/", data, {
            withCredentials: true // Include cookies
        })

        return response.data;
    }
    catch (err: any) {
        if (err.response) {
            return err.response.data;
        } else {
            return { error: ["An unknown error occurred."] };
        }
    }
}

export const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})


export const axiosPrivateInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})


export {
    login,
    register,
}