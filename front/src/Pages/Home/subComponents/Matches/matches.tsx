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

// Components
import Conversation from '../Conversation/conversation';

// Interfaces
interface UserMatch {
    user_id: number;
    image: string;
    first_name: string;
    room_id: string[]
}

function Matches() {

    // States
    const [matches, setMatches] = useState<UserMatch[]>();
    const [isConversationOpen, setIsConversationOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUserImg, setSelectedUserImg] = useState<string | null>(null);


    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    const didMatchOccuer = useSelector((state: RootState) => state.auth.didMatchOccuer);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    // Fetch matches from backend
    useEffect(() => {
        const checkForMatches = async () => {
            // Check if there any matches for logged_in user
            const response = await axiosPrivateInstance.get('interactions/getAvailableMatches/');
            // console.log(response)
            setMatches(response.data.usersMatchesData)
        }

        checkForMatches();

    }, [didMatchOccuer])

    // Open conversation component
    const openConversation = (user_id: number, correctRoomId: string, selectedUserImg: string) => {
        setSelectedRoomId(correctRoomId);
        setSelectedUserId(user_id);
        setSelectedUserImg(selectedUserImg)
        setIsConversationOpen(true);
    };

    // Checks out of the 2 patterns the correct one and sends to openConversation
    const HandleRoomPattern = async (selectedUserId: number, room_ids: string[], selectedUserImg: string) => {
        // Look for both possible room_id patterns
        const roomIdPattern1 = `match_${userData?.user_id}_${selectedUserId}`;
        const roomIdPattern2 = `match_${selectedUserId}_${userData?.user_id}`;

        // Find the correct room_id that matches either pattern
        const correctRoomId = room_ids.find(
            (room_id) => room_id === roomIdPattern1 || room_id === roomIdPattern2
        );

        if (correctRoomId) openConversation(selectedUserId, correctRoomId, selectedUserImg)
    }

    return (
        <div className='matches-wrapper'>
            {!matches ? (
                <div className='matches-circular'>
                    <CircularProgress sx={{ color: '#d43e73 ' }} />
                </div>
            ) : matches.length > 0 ? (
                <>
                    {matches.map((match) => (
                        <div key={match.user_id}>
                            <div
                                onClick={() => HandleRoomPattern(match.user_id, match.room_id, match.image)}
                                className='matches-box-wrapper'
                                style={{
                                    backgroundColor: match.image ? 'transparent' : 'black',
                                    backgroundImage: match.image ? `url(${match.image})` : 'none',
                                }}
                            >
                                {match.first_name}
                            </div>

                            {isConversationOpen && selectedRoomId && selectedUserId && (
                                <Conversation
                                    match_user_id={selectedUserId}
                                    room_id={selectedRoomId} 
                                    user_img={selectedUserImg}
                                    setIsConversationOpen={setIsConversationOpen}
                                />
                            )}
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