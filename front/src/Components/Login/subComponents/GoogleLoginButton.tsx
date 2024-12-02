// React MUI
import { Button, CircularProgress, Alert } from '@mui/material';

// React Icons
import { FcGoogle } from "react-icons/fc";

// Hooks
import { useGoogleAuth } from '../../../Hooks/auth/useGoogleAuth';

const GoogleLoginButton = () => {
    const { googleLogin, loading, errorMessage } = useGoogleAuth();

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {loading ? (
                <Button
                    sx={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '50px',
                        backgroundColor: '#ffffff',
                        color: 'black',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        position: 'relative',
                        '&:hover': {
                            backgroundColor: '#f1f1f1',  // Light grayish hover
                        },
                        '&:disabled': {
                            backgroundColor: '#f0f0f0', // Disabled state
                        }
                    }}
                    disabled
                >
                    <CircularProgress size={24} color="inherit" sx={{ position: 'absolute' }} />
                </Button>
            ) : (
                <Button
                    sx={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '50px',
                        backgroundColor: '#ffffff',
                        color: 'black',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Montserrat, sans-serif',
                        gap: '10px',
                        '&:hover': {
                            backgroundColor: '#f1f1f1',
                        },
                    }}
                    onClick={() => googleLogin()}
                    startIcon={<FcGoogle />}
                >
                    Sign in with Google
                </Button>
            )}
            
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </div>
    );
};

export default GoogleLoginButton;
