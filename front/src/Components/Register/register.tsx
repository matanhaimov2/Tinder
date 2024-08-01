import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

// CSS
import './register.css';

// Images
import tinder_icon from '../../Assets/Images/tinder_fire_logo.png';

// React MUI
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

// Services

// Props Types
type RegisterProps = {
    isRegisterOpen: boolean;
    setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Register({ isRegisterOpen, setIsRegisterOpen }: RegisterProps) {

    // States
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Refs
    const registerRef = useRef<HTMLFormElement>(null);

    // Close register when clicking outside of the component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (registerRef.current && !registerRef.current.contains(event.target as Node)) {
                if (isRegisterOpen) { // if upload new product form is on
                    setIsRegisterOpen(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    // Navigation Handle
    const navigate = useNavigate();

    return (
        <form className='register-wrapper' ref={registerRef}>
            <Sheet
                sx={{
                    backgroundColor: "#111418",
                    border: 'none',
                    width: 300,
                    height: 400,
                    mx: 'auto', // margin left & right
                    my: 12, // margin top & bottom
                    py: 6, // padding top & bottom
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                    color: 'white'
                }}
                variant="outlined"
            >
                <div className='register-tinder-content-wrapper'>
                    <div className='register-tinder-icon-wrapper'>
                        <img className='register-tinder-icon' src={tinder_icon}></img>
                    </div>

                    <div className='register-tinder-title-wrapper'>
                        <h1>Create account</h1>
                    </div>
                </div>

                <FormControl>
                    <FormLabel sx={{ color: 'white' }}>Email</FormLabel>
                    <Input onChange={(e) => setEmail(e.target.value)}
                        // html input attribute
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel sx={{ color: 'white' }}>Username</FormLabel>
                    <Input onChange={(e) => setUsername(e.target.value)}
                        // html input attribute
                        name="username"
                        type="name"
                        placeholder="username"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel sx={{ color: 'white' }}>Password</FormLabel>
                    <Input onChange={(e) => setPassword(e.target.value)}
                        // html input attribute
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                </FormControl>

                <Button type='submit' sx={{ mt: 1 /* margin top */ }}>Register</Button>

                {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
            </Sheet>
        </form>
    );
}

export default Register;