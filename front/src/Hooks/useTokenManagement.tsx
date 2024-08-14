import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Function to decode and check if token is expired
function isTokenExpired(token: string): boolean {
    try {
        const decodedToken = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    } catch (error) {
        return true; // If there's an error decoding the token, consider it expired
    }
}

// Function to refresh the access token
async function refreshAccessToken() {
    const refreshToken = Cookies.get('refresh_token');
    
    if (!refreshToken) {
        return null; // No refresh token, cannot refresh
    }

    try {
        const response = await axios.post('/api/token/refresh/', { refresh: refreshToken });
        const newAccessToken = response.data.access;
        Cookies.set('access_token', newAccessToken, { expires: 7, secure: true });
        console.log('newwwwwwww: ', newAccessToken)
        return newAccessToken;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return null; // Refresh token is likely expired or invalid
    }
}

// Function to handle logout
function handleLogout(navigate: ReturnType<typeof useNavigate>) {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    console.log('logging out');
    navigate('/');
}

// Token management in a React hook
export function TokenManagement() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokens = async () => {
            const accessToken = Cookies.get('access_token');
            const refreshToken = Cookies.get('refresh_token');

            if (accessToken && !isTokenExpired(accessToken)) {
                return; // Token is valid, no action needed
            }

            // If access token is expired, try refreshing it
            const newAccessToken = await refreshAccessToken();

            if (!newAccessToken) {
                // If refreshing fails, log out the user
                handleLogout(navigate);
            }
        };

        checkTokens();
    }, [navigate]);

    return null; // No UI needed for this hook
}
