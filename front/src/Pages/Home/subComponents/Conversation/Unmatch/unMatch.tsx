import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2'

// React MUI
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Hooks
import useAxiosPrivate from '../../../../../Hooks/usePrivate';

// Props Interfaces
interface UnmatchProps {
    room_id: string
}

export default function UnMatch({ room_id }: UnmatchProps) {

    // States
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Refs
    const closeRef = useRef<HTMLFormElement>(null);

    // Use Private hook
    const axiosPrivateInstance = useAxiosPrivate()

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
    
    const handleUnmatch = async () => {
        const data = {
            room_id: room_id
        }

        try {
            setLoading(true)

            // Unmatch users
            const response = await axiosPrivateInstance.post('interactions/unmatchUser/', data);
            setLoading(false)
            setOpen(false);

            if (response && response.data.success) {
                // Raise a success alert
                await Swal.fire({
                    title: "Unmatch Successful!",
                    text: "You have successfully unmatched this user.",
                    icon: "success",
                    confirmButtonText: "Great!",
                }).then(() => {
                    window.location.reload(); // Refresh the page after the alert
                });
            }

        } catch (err) {
            setLoading(false)
            setOpen(false);
            console.log(err)

            // Raise an error alert
            await Swal.fire({
                title: 'Error!',
                text: 'Failed to unmatch user. Please try again.',
                icon: 'error',
            })
        }
    };

    return (
        <div>
            <Button style={{fontFamily: 'Montserrat, sans-serif'}} onClick={() => setOpen(true)}>Unmatch</Button>
            <Backdrop open={open} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <Box ref={closeRef}
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                            m: 1,
                            width: 200,
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span>Do you want to unmatch</span>
                                <span>?this user</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                                <span onClick={handleUnmatch} style={{ cursor: 'pointer', color: 'var(--primary-color)' }}>Yes, unmatch</span>
                                <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', color: '#888888' }}>Cancel</span>
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