import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";

// -- Health Check
const healthCheck = async () => {
    try {
        // Sends to back email and password to see if correct
        const response = await axios.get(SERVER_URL + "/healthCheck")
        console.log(response);

        return response.data.res
    }
    catch (err) {
        return false;
    }
}

export {
    healthCheck,
}