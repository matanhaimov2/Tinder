import { useState } from 'react';
import { useMediaQuery } from 'react-responsive'

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
    withFilteredConv?: UserMatch[];
}

function Matches({ matches, withFilteredConv }: UserMatchProps) {

    // States
    const [isConversationOpen, setIsConversationOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [selectedUserImg, setSelectedUserImg] = useState<string | null>(null);
    const [selectedUserFirst, setSelectedUserFirst] = useState<string | null>(null);
    const [isLoadMessages, setIsLoadMessages] = useState(false);

    // Handle responsive
    const isTabletOrPhone = useMediaQuery({ query: '(max-width: 760px)' })

    // Open conversation component
    const openConversation = (user_id: number, first_name: string, room_id: string, selectedUserImg: string) => {

        // console.log('new conversation starts')

        // If there is a chat history, load the messages. Otherwise skip.
        if (withFilteredConv?.some(user => user.user_id === user_id)) {
            setIsLoadMessages(true);
        }
        else {
            setIsLoadMessages(false);
        }

        if (room_id && user_id) {
            setSelectedRoomId(room_id);
            setSelectedUserFirst(first_name)
            setSelectedUserImg(selectedUserImg);
            setIsConversationOpen(true);
        }
    };


    return (
        <div className={`matches-wrapper ${isTabletOrPhone ? 'matches-phone-wrapper' : ''}`}>

            {isTabletOrPhone ? (
                <div className='matches-inner-phone-wrapper'>
                    <span className='matches-title-phone-wrapper'> Matches </span>

                    <div className='matches-swiping-match-phone-wrapper'>
                        {!matches ? (
                            <div className='matches-circular'>
                                <CircularProgress sx={{ color: '#d43e73 ' }} />
                            </div>
                        ) : matches.length > 0 ? (
                            <>
                                {matches.map((match) => (
                                    <div className='matches-swiping-match-phone' key={match.user_id}>
                                        <div
                                            onClick={() => openConversation(match.user_id, match.first_name, match.room_id, match.image)}
                                            className='matches-box-phone-wrapper'
                                            style={{
                                                backgroundColor: match.image ? 'transparent' : 'black',
                                                backgroundImage: match.image ? `url(${match.image})` : 'none',
                                            }}
                                        >
                                            <span style={{ color: 'white', paddingInline: '2%' }}> {match.first_name} </span>
                                        </div>

                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className='matches-error-phone-wrapper'>
                                <span> No matches found </span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {!matches ? (
                        <div className='matches-circular'>
                            <CircularProgress sx={{ color: '#d43e73 ' }} />
                        </div>
                    ) : matches.length > 0 ? (
                        <>
                            {matches.map((match) => (
                                <div key={match.user_id}>
                                    <div
                                        onClick={() => openConversation(match.user_id, match.first_name, match.room_id, match.image)}
                                        className='matches-box-wrapper'
                                        style={{
                                            backgroundColor: match.image ? 'transparent' : 'black',
                                            backgroundImage: match.image ? `url(${match.image})` : 'none',
                                        }}
                                    >
                                        <span style={{ color: 'white', paddingInline: '2%' }}> {match.first_name} </span>
                                    </div>

                                </div>
                            ))}
                        </>
                    ) : (
                        <div className='matches-error-wrapper'>
                            <span> No matches found </span>
                        </div>
                    )}
                </>
            )}



            {isConversationOpen && (
                <Conversation
                    room_id={selectedRoomId!}
                    first_name={selectedUserFirst}
                    user_img={selectedUserImg}
                    setIsConversationOpen={setIsConversationOpen}
                    isLoadMessages={isLoadMessages}
                />
            )}
        </div>
    );
}

export default Matches;