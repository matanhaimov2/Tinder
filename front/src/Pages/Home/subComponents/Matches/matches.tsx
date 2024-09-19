import React, { useEffect, useState } from 'react';

// CSS
import './matches.css';

// React MUI
import CircularProgress from '@mui/material/CircularProgress';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/store';

// Hooks
import useAxiosPrivate from '../../../../Hooks/usePrivate';

// Interfaces
interface UserMatch {
    user_id: number;
    image: string[];
    first_name: string;
}

function Matches() {

    // States
    const [matches, setMatches] = useState<UserMatch[]>();

    // Global States
    const didMatchOccuer = useSelector((state: RootState) => state.auth.didMatchOccuer);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    useEffect(() => {
        const checkForMatches = async () => {
            // Check if there any matches for logged_in user
            const response = await axiosPrivateInstance.get('interactions/getAvailablebMatches/');

            setMatches(response.data.usersMatchesData)
        }

        checkForMatches();

    }, [didMatchOccuer])

    return (
        <div className='matches-wrapper'>
            {!matches ? (
                <div className='matches-circular'>
                    <CircularProgress sx={{ color: '#d43e73 ' }} />
                </div>
            ) : matches.length > 0 ? (
                <>
                    {matches.map((match) => (
                        <div
                            key={match.user_id}
                            className='matches-box-wrapper'
                            style={{
                                backgroundColor: match.image ? 'transparent' : 'black',
                                backgroundImage: match.image ? `url(${match.image})` : 'none',
                            }}
                        >
                            {match.first_name}
                        </div>
                    ))}
                </>
            ) : (
                <div>No matches found</div>
            )}

        </div>
    );
}

export default Matches;