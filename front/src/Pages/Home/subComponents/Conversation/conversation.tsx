import React, { useEffect, useState, useRef } from 'react';

// CSS
import './conversation.css';

// React MUI
import CircularProgress from '@mui/material/CircularProgress';

// React Icons
import { FaUserCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/store';

// Assets
import { DOMAIN, SERVER_URL } from "../../../../Assets/GlobalVeriables";

// Hooks
import useAxiosPrivate from '../../../../Hooks/usePrivate';

// Components
import { useTheme } from '../../../../Components/Theme/ThemeContext';

// Sub Components
import UnMatch from './Unmatch/unMatch';

// Props Interfaces
interface ConversationProps {
    room_id: string;
    first_name: string | null;
    user_img: string | null;
    setIsConversationOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadMessages: boolean;
}

function Conversation({ room_id, first_name, user_img, setIsConversationOpen, isLoadMessages }: ConversationProps) {

    // States
    const [messages, setMessages] = useState<any[]>([]); // Replace `any` with the appropriate message type if available
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [socket, setSocket] = useState<WebSocket | null>(null); // Typed as WebSocket or null
    const [message, setMessage] = useState<string>("");
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false); // Track if a file is selected

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    const { theme } = useTheme();

    // Refs
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const axiosPrivateInstance = useAxiosPrivate()

    useEffect(() => {
        // Connect to the WebSocket server with the username as a query parameter
        const newSocket = new WebSocket(`ws://${DOMAIN}/ws/chat/${room_id}/`);
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log("WebSocket connected")

            // Load messages if there's already a chat history
            if (!isLoadMessages) {
                setLoading(false);
            }
        };

        newSocket.onclose = () => {
            console.log("WebSocket disconnected")

            setMessages([])
            setLoading(true);
        };

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            newSocket.close();
            setSocket(null);
        };
    }, [room_id]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, data]);
                setLoading(false)
            };
        }
    }, [socket]);

    // Send message
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        const isImageSent = fileInput?.files && fileInput.files.length > 0;

        if ((isImageSent || message) && socket) {

            const data = {
                message: message,
                username: userData?.username,
            };

            // Send the image data if available
            if (fileInput?.files && fileInput.files.length > 0) {
                const imageFile = fileInput.files[0];
                const formData = new FormData();
                formData.append("image", imageFile);
                formData.append("username", userData?.username!);

                const response = await axiosPrivateInstance.post(`interactions/imageHandler/${room_id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response) {
                    // Send the data as FormData if there's an image
                    socket.send(JSON.stringify({
                        ...data,
                        image: response.data.imageUrl
                    }));

                    fileInput.value = '';
                    setIsFileSelected(false); // Reset the file selection state here
                }

            } else {
                socket.send(JSON.stringify(data));
            }

            setMessage("");
        }
    };

    // Function to format the timestamp - hh-mm-am/pm
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    };

    // Function to format the date - mm/dd/yyyy
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };

    // Scroll to the bottom of the div whenever the messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        setIsFileSelected(!!fileInput.files?.length); // Convert to boolean
    };

    const handleClearFile = () => {
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ''; // Clear the file input
            setIsFileSelected(false); // Reset the state
        }
    };

    return (
        <div className={`conversation-wrapper ${theme}alt`}>
            <div className={`conversation-topnav-wrapper ${theme}`}>
                <div className='conversation-topnav-inner'>
                    {user_img ? (
                        <img src={user_img} className='conversation-circle-img' alt="User Image" />
                    ) : (
                        <FaUserCircle className='conversation-circle-img' />
                    )}

                    <span style={{ fontWeight: '600' }}> {first_name} </span>
                </div>


                <div className='conversation-topnav-divider'>
                    <UnMatch room_id={room_id} />

                    <IoMdCloseCircleOutline className='conversation-exit-button' onClick={() => setIsConversationOpen(false)} />
                </div>
            </div>

            <div className='conversation-underline-separator' /> {/* underline separator */}

            <div className="conversation-messages-wrapper">
                <div className="conversation-messages-inner" id='messagesContainer' ref={messagesEndRef}>
                    {loading ? (
                        <div className='conversation-circular'>
                            <CircularProgress sx={{ color: 'var(--secondary-color)' }} />
                        </div>
                    ) : messages.length > 0 ? (
                        messages.map((message, i) => {
                            // Format current message's date
                            const currentMessageDate = new Date(message.timestamp).toLocaleDateString();

                            // Format the previous message's date if it exists
                            const previousMessage = messages[i - 1];
                            const previousMessageDate = previousMessage
                                ? new Date(previousMessage.timestamp).toLocaleDateString()
                                : null;

                            // Show date if it's the first message or the date has changed
                            const showDate = i === 0 || currentMessageDate !== previousMessageDate;

                            return (
                                <div className='conversation-messages-container' key={message.id}>
                                    {/* Date divider */}
                                    {showDate && (
                                        <div className="conversation-date-divider">
                                            {formatDate(message.timestamp)}
                                        </div>
                                    )}

                                    <div className={`${userData?.username === message.username ? 'owner' : 'another'}`}>
                                        <div>
                                            {userData?.username !== message.username && (
                                                <>
                                                    {user_img ? (
                                                        <img src={user_img} className='conversation-circle-img' alt="User Image" />
                                                    ) : (
                                                        <FaUserCircle className='conversation-circle-img' />
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <div className={`${userData?.username === message.username ? 'content-owner' : 'content-another'}`}>

                                            {/* Display the image if exists */}
                                            {message.image ? (
                                                <img className='conversation-image-file' src={`${SERVER_URL}/media/${message.image.replace("/media", "")}`} loading="lazy" width={300} height={150} />
                                            ) : (
                                                ''
                                            )}

                                            {message.message && (
                                                <p className='content-message'>{message.message}</p>
                                            )}

                                            <p className={`${userData?.username === message.username ? 'content-timestamp-left' : 'content-timestamp-right'}`}>{formatTimestamp(message.timestamp)}</p>

                                        </div>
                                    </div>
                                </div>

                            )
                        })
                    ) : (
                        <div className='conversation-start-chat-title'>
                            <span> !Say hi to get the conversation going </span>
                        </div>
                    )}
                </div>
            </div>

            <div className='conversation-underline-separator' /> {/* underline separator */}

            <form className={`conversation-send-wrapper ${theme}`} onSubmit={handleSubmit}>

                <div className="file-upload-wrapper">
                    <input type="file" id="fileInput" name="image" className='file-upload-input' onChange={handleFileChange} />

                    {isFileSelected ? (
                        <div className="file-clear-icon">
                            <IoMdCloseCircleOutline size={30} onClick={handleClearFile} />
                        </div>
                    ) : (
                        <label htmlFor="fileInput" className="file-input-label">
                            <CiImageOn size={30} />
                        </label>
                    )}

                </div>

                <input type="text" style={{ color: theme === 'dark' ? 'white' : 'black' }} className='conversation-send-text' name="message" placeholder="Type a message" value={message} onChange={(event) => setMessage(event.target.value)} />
                <button type='submit' className='conversation-send-submit' value="Send"> SEND </button>
            </form>
        </div>
    );
}

export default Conversation;