import { Outlet } from 'react-router-dom';
import DashHeader from './DashHeader';
import DashFooter from './DashFooter';

const DashLayout = () => {
    return (
        <>
            <div className="flex flex-col justify-between mx-auto bg-white shadow dark:bg-gray-800 text-gray-500 dark:text-gray-400  min-h-screen">
                <DashHeader />
                <Outlet />
                <DashFooter />
            </div>
        </>
    );
};
export default DashLayout;
