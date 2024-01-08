import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import FooterPublic from '../../components/FooterPublic';
import Error from '../../components/Error';
import usePersist from '../../hooks/usePersist';
import useTitle from '../../hooks/useTitle';

const Login = () => {
    useTitle('Employee Login');

    const [persist, setPersist] = usePersist();
    const userRef = useRef();
    const errRef = useRef();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({
                username,
                password,
            }).unwrap();
            dispatch(setCredentials({ accessToken }));

            setUsername('');
            setPassword('');
            navigate('/dash');
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg(
                    'Unauthorized (User was not found or password is not match). Try to login again. If you trust this device to toggle on in the login form'
                );
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    };

    const handleUserInput = (e) => setUsername(e.target.value);
    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist((prev) => !prev);

    if (isLoading)
        return (
            <section className="flex items-center justify-center mx-auto bg-white shadow dark:bg-gray-800 text-gray-500 dark:text-gray-400  min-h-screen p-4">
                <div className="flex items-center justify-center mx-auto w-56 h-56">
                    <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        loading...
                    </div>
                </div>
            </section>
        );

    const content = (
        <section className="flex flex-col mx-auto bg-white shadow dark:bg-gray-800 text-gray-500 dark:text-gray-400  min-h-screen">
            <header className="p-4">
                <h4 className="text-2xl font-bold dark:text-white">
                    Employe Login
                </h4>
            </header>
            <main className="flex-1 my-4">
                {/* Name
                <p ref={errRef} className={errClass} aria-live="assertive">
                    {errMsg}
                </p> */}

                {errMsg ? (
                    <Error
                        message={errMsg}
                        reset_message_state={() => setErrMsg('')}
                    />
                ) : (
                    <div className="h-14 my-4"></div>
                )}

                <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            ref={errRef}
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Username:
                        </label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="text"
                            id="username"
                            ref={userRef}
                            value={username}
                            onChange={handleUserInput}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Password:
                        </label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="password"
                            id="password"
                            onChange={handlePwdInput}
                            value={password}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="flex justify-between flex-wrap mb-5">
                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Log In
                        </button>
                        <div className="flex items-center mt-4 sm:mt-0 ">
                            <label
                                htmlFor="persist"
                                className="relative inline-flex items-center cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    id="persist"
                                    className="sr-only peer"
                                    checked={persist}
                                    onChange={handleToggle}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Trust This Device
                                </span>
                            </label>
                        </div>
                    </div>
                </form>
            </main>
            <footer>
                <FooterPublic path={'/'} name={'Back to Home'} />
            </footer>
        </section>
    );

    return content;
};
export default Login;
