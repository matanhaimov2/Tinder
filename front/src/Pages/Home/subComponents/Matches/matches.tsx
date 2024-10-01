import React, { useEffect, useState } from 'react';

// CSS
import './matches.css';

// React MUI
import CircularProgress from '@mui/material/CircularProgress';

// Components
import Conversation from '../Conversation/conversation';

// Interfaces
interface UserMatch {
    user_id: number;
    image: string;
    first_name: string;
    room_id: string;
    latest_message: string | null;
    latest_message_timestamp: string | null;
}

interface UserMatchProps {
    matches?: UserMatch[];
}

function Matches({ matches }: UserMatchProps) {

    // States
    const [isConversationOpen, setIsConversationOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUserImg, setSelectedUserImg] = useState<string | null>(null);

    // Open conversation component
    const openConversation = (user_id: number, room_id: string, selectedUserImg: string) => {
        // Close the current conversation if open
        if (isConversationOpen) {
            setIsConversationOpen(false);
        }
        
        setSelectedRoomId(room_id);
        setSelectedUserId(user_id);
        setSelectedUserImg(selectedUserImg)
        setIsConversationOpen(true);
    };

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
                                onClick={() => openConversation(match.user_id, match.room_id, match.image)}
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