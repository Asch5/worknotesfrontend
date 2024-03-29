import { Outlet, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { useNavigate } from 'react-router-dom';

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const navigate = useNavigate();

    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
        useRefreshMutation();

    useEffect(() => {
        if (
            effectRan.current === true ||
            process.env.NODE_ENV !== 'development'
        ) {
            // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                //console.log('verifying refresh token');
                try {
                    //const response =
                    await refresh();
                    //const { accessToken } = response.data
                    setTrueSuccess(true);
                } catch (err) {
                    console.error(err);
                }
            };

            if (!token && persist) verifyRefreshToken();
        }

        return () => (effectRan.current = true);

        // eslint-disable-next-line
    }, []);

    let content;
    if (!persist) {
        // persist: no
        //console.log('no persist')
        content = <Outlet />;
    } else if (isLoading) {
        //persist: yes, token: no
        //console.log('loading')
        content = <Loading />;
    } else if (isError) {
        //persist: yes, token: no

        console.log(error?.data?.message);
        content = (
            <div className=" bg-white shadow dark:bg-gray-800 text-gray-500 dark:text-gray-400  min-h-screen p-4">
                <Error
                    message={'Unauthorized Please Login Again'}
                    reset_message_state={() => navigate('/login')}
                />
            </div>
        );
    } else if (isSuccess && trueSuccess) {
        //persist: yes, token: yes
        //console.log('success')
        content = <Outlet />;
    } else if (token && isUninitialized) {
        //persist: yes, token: yes
        //console.log('token and uninit')
        //console.log(isUninitialized)
        content = <Outlet />;
    }

    return content;
};
export default PersistLogin;
