import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

// CSS
import './messages.css';

// React MUI

// React Icons

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/store';

// Hooks
import useAxiosPrivate from '../../../../Hooks/usePrivate';


function Messages() {

    // States
    const [messages, setMessages] = useState<any>([])
    const [messageContent, setMessageContent] = useState("");

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);

    
    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    return (
        <div className='messages-wrapper'>
            {/* display list of messages previews (contains with: target_user_img, latest msg, date, target_user_name) */}
        </div>
    );
}

export default Messages;