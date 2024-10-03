import React, { useEffect, useState } from 'react';

// CSS
import './messages.css';

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
    messages?: UserMatch[];
}

function Messages({ messages }: UserMatchProps) {
    
    // States
    const [isConversationOpen, setIsConversationOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [selectedUserImg, setSelectedUserImg] = useState<string | null>(null);

    // Open conversation component
    const openConversation = (user_id: number, room_id: string, selectedUserImg: string) => {

        // console.log('new conversation starts')

        if(room_id && user_id) {
            setSelectedRoomId(room_id);
            setSelectedUserImg(selectedUserImg);    
            setIsConversationOpen(true);
        }
    };

    return (
        <div className='messages-wrapper'>
            {!messages ? (
                <div className='messages-circular'>
                    <CircularProgress sx={{ color: '#d43e73 ' }} />
                </div>
            ) : messages.length > 0 ? (
                <>
                    {messages.map((message) => (
                        <div key={message.user_id}>
                            <div className='messages-inner-wrapper' onClick={() => openConversation(message.user_id, message.room_id, message.image)}>
                                <div>
                                    <img className='messages-circle-img' src={message.image} />
                                </div>

                                <div className='messages-content-wrapper'>
                                    <div className='messages-content-name'>
                                        {message.first_name}
                                    </div>

                                    <div className='messages-content-text'>
                                        {message.latest_message}
                                    </div>
                                </div>
                            </div>

                            {isConversationOpen && (
                                <Conversation
                                    room_id={selectedRoomId!}
                                    user_img={selectedUserImg}
                                    setIsConversationOpen={setIsConversationOpen}
                                    isLoadMessages={true}
                                />
                            )}
                        </div>
                    ))}
                </>
            ) : (
                <div className='messages-error-wrapper'>
                    <span> Start chatting </span>
                    <span> with your matches</span>
                </div>
            )}

        </div>
    );
}

export default Messages;