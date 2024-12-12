import { useEffect, useState, useRef } from 'react';

// React MUI
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Hooks
import useDeleteAccount from '../../../Hooks/auth/useDeleteAccount';

export default function DeleteAccount() {

    // States
    const [open, setOpen] = useState(false);

    // Refs
    const closeRef = useRef<HTMLFormElement>(null);

    // Get deleteAccount function from the hook
    const { deleteAccount, loading } = useDeleteAccount();

    // Close paper when clicking outside of the component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (closeRef.current && !closeRef.current.contains(event.target as Node)) {
                if (open) { // if unMatch component is on
                    setOpen(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [open]);

    return (
        <div>
            <Button style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--primary-color)', width: '100%' }} onClick={() => setOpen(true)}>delete my account</Button>
            <Backdrop open={open} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} aria-hidden={!open}>
                <Box
                    ref={closeRef}
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                            m: 1,
                            width: 300,
                        },
                    }}
                >
                    {!loading ? (
                        <Paper
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                background: '#3c4045',
                                color: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                gap: '20px',
                                alignItems: 'center',
                                textAlign: 'center',
                                maxWidth: '300px',
                                margin: 'auto',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', direction: 'ltr' }}>
                                <h2 style={{ color: 'var(--primary-color)' }}>We’re sad to see you go!</h2>
                                <span>Are you sure you want to delete your account?</span>
                            </div>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', gap: '40px' }}>
                                <Button
                                    onClick={deleteAccount}
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: 'var(--primary-button-bg)',
                                        color: '#fff',
                                        width: '100px',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        '&:hover': { backgroundColor: 'var(--primary-button-bg-hover)' },
                                        fontFamily: 'Montserrat, sans-serif',
                                    }}
                                >
                                    Yes
                                </Button>
                                <Button
                                    onClick={() => setOpen(false)}
                                    sx={{
                                        backgroundColor: '#888888',
                                        color: '#fff',
                                        width: '100px',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        '&:hover': { backgroundColor: '#555555' },
                                        fontFamily: 'Montserrat, sans-serif',
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Paper>
                    ) : (
                        <CircularProgress sx={{ color: 'var(--secondary-color)' }} />
                    )}
                </Box>
            </Backdrop>
        </div>
    );
}