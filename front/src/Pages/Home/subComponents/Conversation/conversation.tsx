import React, { useEffect, useState, FormEvent, ChangeEventHandler, } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

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
    const [socket, setSocket] = useState<WebSocket | null>(null); // Typed as WebSocket or null
    const [message, setMessage] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<File>();


    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()


    useEffect(() => {
        // Connect to the WebSocket server with the username as a query parameter
        const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${room_id}/`);
        setSocket(newSocket);

        newSocket.onopen = () => console.log("WebSocket connected");
        newSocket.onclose = () => {
            setMessages([])
            console.log("WebSocket disconnected")
        };

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            newSocket.close();
        };
    }, [room_id]);

    useEffect(() => {
        if (socket) {
            console.log('is in??')
            socket.onmessage = (event) => {
                console.log('is in??')
                const data = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, data]);
                setLoading(false)
            };
        }
    }, [socket]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (message && socket) {
            const data = {
                message: message,
                username: userData?.username,
            };

            // Send the image data if available - Problem
            const fileInput = document.getElementById("fileInput") as HTMLInputElement;
            
            if (fileInput?.files && fileInput.files.length > 0) {
                const imageFile = fileInput.files[0];
                const formData = new FormData();
                formData.append("message", message);
                formData.append("image", imageFile);

                // Send the data as FormData if there's an image
                socket.send(JSON.stringify({
                    ...data,
                    image: URL.createObjectURL(imageFile), // Just for preview (you may want to handle this differently)
                }));
            } else {
                socket.send(JSON.stringify(data));
            }

            setMessage("");
        }
    };

    // Logger
    useEffect(() => {
        console.log(messages)
        console.log(selectedImage)
    }, [messages, selectedImage])

    // Handle uploaded image change
    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        const file = event.target.files as FileList;
        setSelectedImage(file?.[0]);
    };

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
                            <div className={`${userData?.username === message.username ? 'owner' : 'another'}`} key={message.id}>
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

            <form className='conversation-send-wrapper' onSubmit={handleSubmit}>
                <input type="file" id="fileInput" name="image" onChange={handleFileChange} />
                {/* <div className="file-upload-wrapper">
                    <input type="file" style={{display: 'none'}} id="fileInput" name="image" />
                    
                    <label htmlFor="fileInput" className="file-input-label">
                        <FaRegImages size={40} /> 
                    </label>
                </div> */}
                <input type="text" className='conversation-send-text' name="message" placeholder="Type a message" value={message} onChange={(event) => setMessage(event.target.value)} />
                <button type='submit' className='conversation-send-submit' value="Send"> SEND </button>
            </form>
        </div>
    );
}

export default Conversation;