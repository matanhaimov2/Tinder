import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Global Veribales
import { SERVER_URL } from "../Assets/GlobalVeriables";

export function TokenManagement() {
    const navigate = useNavigate();
    const [user, setUser] = useState<string | null>(null);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(SERVER_URL + '/users/auth/status', { withCredentials: true });
            console.log(response)
            if (response.data.isAuthenticated) {
                // User is logged in
                setUser(response.data.username);
            } else {
                // User is logged out
                setUser(null);
                navigate('/'); // Redirect to login or another route
            }
        } catch (error) {
            console.error('Error checking auth status', error);
            setUser(null);
            navigate('/'); // Redirect to login or another route
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, [navigate]);

    // return { user };
    return null;
}