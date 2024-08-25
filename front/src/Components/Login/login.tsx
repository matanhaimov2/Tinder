import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

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

// Services
import { login } from '../../Services/authService';

// Props Types
type LoginProps = {
    isLoginOpen: boolean;
    setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ isLoginOpen, setIsLoginOpen }: LoginProps) {

    // States
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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

    // Navigation Handle
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            username: username,
            password: password
        }

        setLoading(true);

        try {
            const response = await login(data);
            console.log(response)

            if (response && !response.detail) {
                console.log('SUCCESS')
                // problem - access token coming as undefind even though token is there (before refreshing)
                // navigate('/home')
                // navigate('/setprofile')

                // if firstlogin => navigate('/setprofile'), else => navigate('/home')
            } else {
                setErrorMessage('Username or password incorrect');
            }

        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred. Please try again.');

        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <form className='login-wrapper' ref={loginRef} onSubmit={handleLogin}>
            <Sheet
                sx={{
                    backgroundColor: "#111418",
                    border: 'none',
                    width: 300,
                    height: 360,
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
                <div className='login-tinder-content-wrapper'>
                    <div className='login-tinder-icon-wrapper'>
                        <img className='login-tinder-icon' src={tinder_icon}></img>
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

                {/* Show CircularProgress while loading */}
                {loading ? (
                    <Box className='login-loading-wrapper'>
                        <CircularProgress color='inherit' />
                    </Box>
                ) : (
                    <Button type='submit'>Sign in</Button>
                )}

                {/* Display message */}
                {errorMessage && (
                    <Alert severity='error'> {errorMessage} </Alert>
                )}
            </Sheet>
        </form>
    );
}

export default Login;