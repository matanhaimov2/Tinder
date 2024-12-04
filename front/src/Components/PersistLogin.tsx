import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

// Components
import PageLoader from './Loaders/pageLoader/pageLoader';

// Hooks
import useAxiosPrivate from '../Hooks/usePrivate';
import useRefreshToken from '../Hooks/auth/useRefreshToken';


export default function PersistLogin() {
    const refresh = useRefreshToken();

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const [loading, setLoading] = useState<boolean>(true);
    const axiosPrivate = useAxiosPrivate();

    // Navigation Handle
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function verifyUser() {
            if (!isLoggedIn) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                await refresh();
                await axiosPrivate.get('users/verify/');
                
            } catch (error: any) {
                console.log(error?.response);
                
                if(error && error.response && error.response.data.code==="token_not_valid") {
                    navigate('/');
                }

            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (!accessToken) {
            verifyUser();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [accessToken, refresh, axiosPrivate]);

    return loading ? <PageLoader/> : <Outlet />;
}
