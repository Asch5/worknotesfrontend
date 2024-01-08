import { Outlet } from 'react-router-dom';
import { DarkThemeToggle, Flowbite } from 'flowbite-react';

const Layout = () => {
    return (
        <div className="mx-auto min-h-screen">
            <Flowbite>
                {/* <DarkThemeToggle /> */}
                <Outlet />
            </Flowbite>
        </div>
    );
};
export default Layout;
