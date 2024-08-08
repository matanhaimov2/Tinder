import React, { useEffect, useState, useRef } from 'react';

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

// Services
import { register } from '../../Services/authService';

// Props Types
type RegisterProps = {
    isRegisterOpen: boolean;
    setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Register({ isRegisterOpen, setIsRegisterOpen }: RegisterProps) {

    // States
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [fname, setFname] = useState<string>('');
    const [lname, setLname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            email: email,
            username: username,
            first_name: fname,
            last_name: lname,
            password: password
        }

        setLoading(true);

        try {
            const response = await register(data);
            console.log(response);

            if (response && response.success) {
                setMessage(response.success)
            } else {
                setMessage(response.error[0]);
            }

        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');

        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <form className='register-wrapper' ref={registerRef} onSubmit={handleRegistration}>
            <Sheet
                sx={{
                    backgroundColor: "#111418",
                    border: 'none',
                    width: 300,
                    height: 520,
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

                <div className='register-name-wrapper'>
                    <FormControl sx={{ width: '49%' }}>
                        <FormLabel sx={{ color: 'white' }}>Firstname</FormLabel>
                        <Input onChange={(e) => setFname(e.target.value)}
                            // html input attribute
                            name="firstname"
                            type="name"
                            placeholder="firstname"
                        />
                    </FormControl>

                    <FormControl sx={{ width: '49%' }}>
                        <FormLabel sx={{ color: 'white' }}>Lastname</FormLabel>
                        <Input onChange={(e) => setLname(e.target.value)}
                            // html input attribute
                            name="lastname"
                            type="name"
                            placeholder="lastname"
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
                    />
                </FormControl>


                {/* Show CircularProgress while loading */}
                {loading ? (
                    <Box className='register-loading-wrapper'>
                        <CircularProgress color='inherit'/>
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
    );
}

export default Register;