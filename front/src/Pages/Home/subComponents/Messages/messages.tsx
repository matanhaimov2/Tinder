import React, { useEffect, useState } from 'react';

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

    // Global States

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

    return (
        <div className='messages-wrapper'>
            Messages Here
        </div>
    );
}

export default Messages;