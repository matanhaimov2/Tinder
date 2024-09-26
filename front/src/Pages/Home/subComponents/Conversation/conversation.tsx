import React, { useEffect, useState } from 'react';

// CSS
import './conversation.css';

// React MUI
import CircularProgress from '@mui/material/CircularProgress';

// React Icons
import { FaUserCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegImages } from 'react-icons/fa'; // Importing an image icon (you can choose another one)

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/store';

// Hooks
import useAxiosPrivate from '../../../../Hooks/usePrivate';

// Props Interfaces
interface ConversationProps {
    match_user_id: number;
    room_id: string;
    user_img: string | null;
    setIsConversationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Conversation({ match_user_id, room_id, user_img, setIsConversationOpen }: ConversationProps) {

    // States
    const [messages, setMessages] = useState<any[]>([]); // Replace `any` with the appropriate message type if available
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    // Fetch messages to conversation
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosPrivateInstance.get(`interactions/room/${room_id}`);
                console.log(response)
                setMessages(response.data)
                setLoading(false)
            } catch (err) {
                console.error(err);
            }
        }
        // const timer = setInterval(() => { fetchData() }, 1000)
        fetchData()
        // return () => clearInterval(timer)
    }, [room_id])

    // Send messages
    const Send = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget as HTMLFormElement; // Ensure it's recognized as an HTML form

        let data = new FormData()

        data.append("message", e.currentTarget.message.value)
        data.append("image", e.currentTarget.image.files[0])

        const response = await axiosPrivateInstance.post(`interactions/room/${room_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Ensure the correct content type
            },
        });

        console.log(response)

        form.reset();
        let messagesContainer = document.getElementById("messagesContainer");
        if (messagesContainer) {
            messagesContainer.scrollTo(0, 0);
        }
    }

    return (
        <div className='conversation-wrapper'>
            <div className='conversation-topnav-wrapper'>
                {user_img ? (
                    <img src={user_img} className='conversation-circle-img' alt="User Image" />
                ) : (
                    <FaUserCircle className='conversation-circle-img' />
                )}

                <IoMdCloseCircleOutline className='conversation-exit-button' onClick={() => setIsConversationOpen(false)} />
            </div>

            <div className='conversation-underline-separator' /> {/* underline separator */}

            <div className="conversation-messages-wrapper">
                <div className="conversation-messages-inner" id='messagesContainer'>
                    {loading ? (
                        <div className='conversation-circular'>
                            <CircularProgress sx={{ color: '#d43e73 ' }} />
                        </div>
                    ) : messages.length > 0 ? (
                        messages.map((message, i) => (
                            <div className={`${userData?.username === message.user ? 'owner' : 'another'}`} key={message.id}>
                                <div>
                                    {userData?.username !== message.user && (
                                        <>
                                            {user_img ? (
                                                <img src={user_img} className='conversation-circle-img' alt="User Image" />
                                            ) : (
                                                <FaUserCircle className='conversation-circle-img' />
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className={`${userData?.username === message.user ? 'content-owner' : 'content-another'}`}>
                                    {message.message && (
                                        <p className='content-message'>{message.message}</p>
                                    )}

                                    {/* Display the image if exists */}
                                    {message.image ? (
                                        <img className='conversation-image-file' src={`http://localhost:8000${message.image}`} loading="lazy" width={300} height={150} />
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='conversation-start-chat-title'>
                            <span> !Say hi to get the conversation going </span>
                        </div>
                    )}
                </div>
            </div>

            <div className='conversation-underline-separator' /> {/* underline separator */}

            <form className='conversation-send-wrapper' onSubmit={(e) => Send(e)}>
                <input type="file" id="fileInput" name="image" />
                {/* <div className="file-upload-wrapper">
                    <input type="file" style={{display: 'none'}} id="fileInput" name="image" />
                    
                    <label htmlFor="fileInput" className="file-input-label">
                        <FaRegImages size={40} /> 
                    </label>
                </div> */}
                <input type="text" className='conversation-send-text' name="message" placeholder="Type a message" />
                <button type='submit' className='conversation-send-submit' value="Send"> SEND </button>
            </form>
        </div>
    );
}

export default Conversation;