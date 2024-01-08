import React from 'react';
import { Link } from 'react-router-dom';

function FooterPublic({ path, name }) {
    return (
        <footer className="bg-white shadow dark:bg-gray-900">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <Link to={path} className="hover:underline me-4 md:me-6">
                        {name}
                    </Link>
                </ul>
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
}

export default FooterPublic;
