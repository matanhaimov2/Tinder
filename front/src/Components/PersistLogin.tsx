import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

// Hooks
import useAxiosPrivate from '../Hooks/usePrivate';
import useRefreshToken from '../Hooks/useRefreshToken';

export default function PersistLogin() {
    const refresh = useRefreshToken();

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const userData = useSelector((state: RootState) => state.auth.userData);

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
                const { data } = await axiosPrivate.get('users/verify/');
                
                console.log(data)
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

    return loading ? <>Loading</> : <Outlet />;
}
