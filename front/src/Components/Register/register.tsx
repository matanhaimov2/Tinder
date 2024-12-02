import React, { useEffect, useRef } from 'react';

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
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Hooks
import { useRegister } from '../../Hooks/auth/useRegister';

// Props Types
type RegisterProps = {
    isRegisterOpen: boolean;
    setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Register({ isRegisterOpen, setIsRegisterOpen }: RegisterProps) {

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

    // Using the custom hook
    const { setEmail, setUsername, setFname, setLname, setPassword, handleRegistration, message, loading } = useRegister();

    return (
        <div className='register-wrapper'>
            <form ref={registerRef} onSubmit={handleRegistration}>
                <Sheet
                    sx={{
                        backgroundColor: "#111418",
                        border: 'none',
                        width: 300,
                        height: 'fit-content',
                        mx: 'auto', // margin left & right
                        my: 0, // margin top & bottom
                        pt: '20px', // padding top
                        pb: '16px', // padding bottom
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
                            required
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel sx={{ color: 'white' }}>Username</FormLabel>
                        <Input onChange={(e) => setUsername(e.target.value)}
                            // html input attribute
                            name="username"
                            type="name"
                            placeholder="username"
                            required
                        />
                    </FormControl>

                    <div className='register-name-wrapper'>
                        <FormControl sx={{ width: '49%' }}>
                            <FormLabel sx={{ color: 'white' }}>Firstname</FormLabel>
                            <Input onChange={(e) => setFname(e.target.value)}
                                // html input attribute
                                name="firstname"
                                type="name"
                                placeholder="firstname"
                                required
                            />
                        </FormControl>

                        <FormControl sx={{ width: '49%' }}>
                            <FormLabel sx={{ color: 'white' }}>Lastname</FormLabel>
                            <Input onChange={(e) => setLname(e.target.value)}
                                // html input attribute
                                name="lastname"
                                type="name"
                                placeholder="lastname"
                                required
                            />
                        </FormControl>
                    </div>

                    <FormControl>
                        <FormLabel sx={{ color: 'white' }}>Password</FormLabel>
                        <Input onChange={(e) => setPassword(e.target.value)}
                            // html input attribute
                            name="password"
                            type="password"
                            placeholder="password"
                            required
                        />
                    </FormControl>


                    {/* Show CircularProgress while loading */}
                    {loading ? (
                        <Box className='register-loading-wrapper'>
                            <CircularProgress size={28} color='inherit' />
                        </Box>
                    ) : (
                        <Button type='submit' className='register-submit-button'>Register</Button>
                    )}

                    {/* Display message */}
                    {message && (
                        <Alert severity={message.startsWith('User registered successfully') ? 'success' : 'error'}>
                            {message}
                        </Alert>
                    )}
                </Sheet>
            </form>
        </div>
    );
}

export default Register;