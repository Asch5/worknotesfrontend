import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Navbar, DarkThemeToggle } from 'flowbite-react';

import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';

// const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isManager, isAdmin } = useAuth();

    const [sendLogout, { isLoading, isSuccess, isError, error }] =
        useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);

    if (isLoading) return <Loading />;

    if (isError)
        return (
            <Error
                message={error?.data?.message}
                reset_message_state={() => {
                    navigate('/');
                }}
            />
        );

    // let dashClass = null;
    // if (
    //     !DASH_REGEX.test(pathname) &&
    //     !NOTES_REGEX.test(pathname) &&
    //     !USERS_REGEX.test(pathname)
    // ) {
    //     dashClass = 'dash-header__container--small';
    // }

    let newNoteButton = null;
    if (NOTES_REGEX.test(pathname)) {
        newNoteButton = (
            <Navbar.Link
                className="bg-white shadow dark:bg-gray-800 text-gray-500"
                as={Link}
                to="/dash/notes/new"
                active
            >
                New Note
            </Navbar.Link>
        );
    }

    let newUserButton = null;
    let userButton = null;
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <Navbar.Link
                    className="bg-white shadow dark:bg-gray-800 text-gray-500"
                    as={Link}
                    to="/dash/users"
                    active
                >
                    Users
                </Navbar.Link>
            );
        }

        if (USERS_REGEX.test(pathname)) {
            newUserButton = (
                <Navbar.Link
                    className="bg-white shadow dark:bg-gray-800 text-gray-500"
                    as={Link}
                    to="/dash/users/new"
                    active
                >
                    New User
                </Navbar.Link>
            );
        }
    }

    let notesButton = null;
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesButton = (
            <Navbar.Link
                className="bg-white shadow dark:bg-gray-800 text-gray-500"
                as={Link}
                to="/dash/notes"
                active
            >
                Notes
            </Navbar.Link>
        );
    }

    const logoutButton = (
        <Navbar.Link
            className="bg-white shadow dark:bg-gray-800 text-gray-500"
            onClick={sendLogout}
            active
            role="button"
        >
            LogOut
        </Navbar.Link>
    );

    const content = (
        <header>
            <Navbar
                className="bg-white border-gray-200 dark:bg-gray-900 px-4"
                fluid
                rounded
            >
                <div className="flex space-x-3">
                    <DarkThemeToggle />
                    <Navbar.Brand as={Link} to="/dash">
                        <span
                            className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
                            title="techNotes"
                        >
                            techNotes
                        </span>
                    </Navbar.Brand>
                </div>
                {isLoading && <p>Logging out...</p>}
                <Navbar.Toggle />
                <Navbar.Collapse>
                    {newNoteButton}
                    {newUserButton}
                    {userButton}
                    {notesButton}
                    {logoutButton}
                </Navbar.Collapse>
            </Navbar>
        </header>
    );

    return content;
};
export default DashHeader;
