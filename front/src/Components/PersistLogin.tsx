import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import useAxiosPrivate from '../Hooks/usePrivate';
import useRefreshToken from '../Hooks/useRefreshToken';

export default function PersistLogin() {
    const refresh = useRefreshToken();
    // const { accessToken, isLoggedIn, setUser } = useAuth();
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const accessToken = localStorage.getItem('accesstoken')

    const [loading, setLoading] = useState<boolean>(true);
    const axiosPrivate = useAxiosPrivate();

    // Navigation Handle
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function verifyUser() {
            // if (!isLoggedIn) {
            //     if (isMounted) setLoading(false);
            //     return;
            // }

            try {
                await refresh();
                const { data } = await axiosPrivate.get('users/verify/');
                console.log('jio')
                console.log(data)
            } catch (error: any) {
                console.log(error?.response);
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
