import { useState, useEffect } from 'react';

// Services
import useAxiosPrivate from '../usePrivate';

// Interfaces
interface UserMatch {
    user_id: number;
    image: string;
    first_name: string;
    room_id: string;
    latest_message: string | null;
    latest_message_timestamp: string | null;
}

export const useMatches = (didMatchOccuer: boolean) => {
    // States
    const [matches, setMatches] = useState<UserMatch[]>();
    const [messages, setMessages] = useState<UserMatch[]>();
    
    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate();

    useEffect(() => {
        const checkForMatches = async () => {
            try {
                const response = await axiosPrivateInstance.get('interactions/getAvailableMatches/');
                const filteredMatches = response.data.usersMatchesData.filter((match: UserMatch) => match.latest_message !== null);
                setMatches(response.data.usersMatchesData);
                setMessages(filteredMatches);
            } catch (error) {
                console.error('Failed to fetch matches:', error);
            }
        };

        checkForMatches();
    }, [didMatchOccuer, axiosPrivateInstance]);

    return { matches, messages };
};
