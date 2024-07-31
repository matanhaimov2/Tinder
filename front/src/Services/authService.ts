import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";


// -- Authentication
const login = async () => {
    try {
        // Sends to back email and password to see if correct
        const response = await axios.post(SERVER_URL + "/login", )
        console.log(response);

        return response.data
    }
    catch (err) {
        console.log(err);
    }
}

const register = async () => {
    try {
        // Sends to back the data to insert db
        const response = await axios.post(SERVER_URL + "/register", )
        console.log(response);

        return response.data
    }
    catch (err) {
        console.log(err);
    }

}

export {
    login,
    register,
}