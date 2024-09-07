import axios from "axios";

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";

// Health Check
const healthCheck = async () => {
    try {
        const response = await axios.post(SERVER_URL + "/users/healthCheck/")
      
        return response.data.status
    }
    catch (err) {
        return false;
    }
}

export {
    healthCheck,
}