import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';

const Welcome = () => {
    const { username, isManager, isAdmin } = useAuth();

    useTitle(`techNotes: ${username}`);

    const date = new Date();
    const today = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
    }).format(date);

    const content = (
        <section className="p-4 flex-1">
            <p className="">{today}</p>

            <h1 className="text-5xl font-extrabold dark:text-white my-8">
                Welcome {username}!
            </h1>
            <div className="pt-4">
                <p className="font-medium hover:underline">
                    <Link to="/dash/notes">View techNotes</Link>
                </p>

                <p className="font-medium hover:underline">
                    <Link to="/dash/notes/new">Add New techNote</Link>
                </p>
                {isAdmin || isManager ? (
                    <>
                        <p className="font-medium hover:underline">
                            <Link to="/dash/users">View User Settings</Link>
                        </p>
                        <p className="font-medium hover:underline">
                            <Link to="/dash/users/new">Add New User</Link>
                        </p>
                    </>
                ) : null}
            </div>
        </section>
    );

    return content;
};
export default Welcome;
