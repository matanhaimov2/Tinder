import React from 'react';

// CSS
import './construction.css';

// Images
import img from '../../Assets/Images/site_under_construction.png'

export default function Construction() {

    return (
        <div className='construction-wrapper'>
            <div className='construction-inner-wrapper'>
                <img className='construction-img' src={img} />
            </div>
        </div>
    );
}