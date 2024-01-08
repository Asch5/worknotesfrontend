import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const DashFooter = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { username, status } = useAuth();

    const onGoHomeClicked = () => navigate('/dash');

    let goHomeButton = null;
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        );
    }

    const content = (
        // <footer className="dash-footer">
        //     {goHomeButton}
        //     <p>Current User:</p>
        //     <p>Status:</p>
        // </footer>
        <footer className="bg-white shadow dark:bg-gray-900">
            <div className="w-full mx-auto p-4 md:flex md:items-center md:justify-between">
                {/* <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                <Link to={path} className="hover:underline me-4 md:me-6">
                    {name}
                </Link>
            </ul> */}
                <div className="flex space-x-4">
                    {goHomeButton}
                    <div>
                        <ul className="flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 ">
                            <p>Current User: {username}</p>
                        </ul>
                        <ul className="flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 ">
                            <p>Status: {status}</p>
                        </ul>
                    </div>
                </div>
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2024{' '}
                    <a
                        href="https://github.com/Asch5/"
                        className="mr-2 hover:underline"
                    >
                        Asch5™.
                    </a>
                    All Rights Reserved.
                </span>
            </div>
        </footer>
    );
    return content;
};
export default DashFooter;
