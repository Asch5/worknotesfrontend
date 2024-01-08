import React from 'react';

function Loading() {
    return (
        <section className="flex items-center justify-center mx-auto bg-white shadow dark:bg-gray-800 text-gray-500 dark:text-gray-400  min-h-screen p-4">
            <div className="flex items-center justify-center mx-auto w-56 h-56">
                <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                    loading...
                </div>
            </div>
        </section>
    );
}

export default Loading;
