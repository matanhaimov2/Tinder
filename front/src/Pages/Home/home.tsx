import React, { useEffect, useState } from 'react';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

export default function Home() {
    const userData = useSelector((state: RootState) => state.auth.userData);
    console.log(userData,'damn')
    
    return (
        <div>
            home
        </div>
    );
}
