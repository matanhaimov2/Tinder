import React, { useEffect, useRef } from 'react';

// CSS
import './login.css';

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

// Components
import GoogleLoginButton from './subComponents/GoogleLoginButton';

// Hooks
import { useLogin } from '../../Hooks/auth/useLogin';

// Props Types
type LoginProps = {
    isLoginOpen: boolean;
    setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ isLoginOpen, setIsLoginOpen }: LoginProps) {

    // Refs
    const loginRef = useRef<HTMLFormElement>(null);

    // Close login when clicking outside of the component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
                if (isLoginOpen) { // if upload new product form is on
                    setIsLoginOpen(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    // Using the custom hook
    const { setUsername, setPassword, handleLogin, errorMessage, loading } = useLogin();

    return (
        <div className='login-wrapper'>
            <form ref={loginRef} onSubmit={handleLogin}>
                <Sheet
                    sx={{
                        backgroundColor: "#111418",
                        border: 'none',
                        width: 300,
                        height: 'fit-content',
                        mx: 'auto', // margin left & right
                        my: 0, // margin top & bottom
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
                    <div className='login-tinder-content-wrapper'>
                        <div className='login-tinder-icon-wrapper'>
                            <img className='login-tinder-icon' src={tinder_icon} alt='Tinder Icon'></img>
                        </div>

                        <div className='login-tinder-title-wrapper'>
                            <h1>Get Started</h1>
                        </div>
                    </div>

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
                        <Box className='login-loading-wrapper'>
                            <CircularProgress size={28} color='inherit' />
                        </Box>
                    ) : (
                        <Button type='submit'>Sign in</Button>
                    )}

                    {/* Display message */}
                    {errorMessage && (
                        <Alert severity='error'> {errorMessage} </Alert>
                    )}

                    <GoogleLoginButton />

                </Sheet>

            </form>
        </div>
    );
}

export default Login;