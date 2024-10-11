import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive'

// CSS
import './messages.css';

// React MUI
import CircularProgress from '@mui/material/CircularProgress';

// React Icons
import { FaUserCircle } from "react-icons/fa";

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
    const [selectedUserFirst, setSelectedUserFirst] = useState<string | null>(null);

    // Handle responsive
    const isTabletOrPhone = useMediaQuery({ query: '(max-width: 760px)' })

    // Open conversation component
    const openConversation = (user_id: number, first_name: string, room_id: string, selectedUserImg: string) => {

        // console.log('new conversation starts')

        if (room_id && user_id) {
            setSelectedRoomId(room_id);
            setSelectedUserFirst(first_name)
            setSelectedUserImg(selectedUserImg);
            setIsConversationOpen(true);
        }
    };

    return (
        <div className={`messages-wrapper ${isTabletOrPhone ? 'messages-phone-wrapper' : ''}`}>

            {isTabletOrPhone && (
                <span className='messages-title-phone'> Messages </span>
            )}

            <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {!messages ? (
                    <div className='messages-circular'>
                        <CircularProgress sx={{ color: '#d43e73 ' }} />
                    </div>
                ) : messages.length > 0 ? (
                    <>
                        {messages.map((message) => (
                            <div key={message.user_id}>
                                <div className='messages-inner-wrapper' onClick={() => openConversation(message.user_id, message.first_name, message.room_id, message.image)}>
                                    <div>
                                        {message.image ? (
                                            <img className='messages-circle-img' alt='User Image' src={message.image} />
                                        ) : (
                                            <FaUserCircle className='messages-circle-img' />
                                        )}
                                    </div>

                                    <div className='messages-content-wrapper'>
                                        <div className='messages-content-name'>
                                            {message.first_name}
                                        </div>

                                        <div className='messages-content-text'>
                                            {message.latest_message
                                                ? (message.latest_message.length > 17
                                                    ? `${message.latest_message.slice(0, 17)}...`
                                                    : message.latest_message)
                                                : "No message"}
                                        </div>
                                    </div>
                                </div>

                                {isTabletOrPhone && (<div className='messages-underline-separator' />)} {/* underline separator */}

                            </div>
                        ))}
                    </>
                ) : (
                    <div className='messages-error-wrapper'>
                        <span> Start chatting </span>
                        <span> with your matches</span>
                    </div>
                )}

                {isConversationOpen && (
                    <Conversation
                        room_id={selectedRoomId!}
                        first_name={selectedUserFirst}
                        user_img={selectedUserImg}
                        setIsConversationOpen={setIsConversationOpen}
                        isLoadMessages={true}
                    />
                )}

            </div>

        </div>
    );
}

export default Messages;