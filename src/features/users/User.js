import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery } from './usersApiSlice';
import { memo } from 'react';

const User = ({ userId }) => {
    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId],
        }),
    });

    const navigate = useNavigate();

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`);

        const userRolesString = user.roles.toString().replaceAll(',', ', ');

        //console.log('user.active', user.active);

        const cellStatus = user.active ? (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                Active
            </span>
        ) : (
            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                <span className="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
                inactive
            </span>
        );

        return (
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td className={`px-6 py-4 `}>{cellStatus} </td>
                <td className={`px-6 py-4 `}>{user.username}</td>
                <td className={`px-6 py-4 `}>{userRolesString}</td>
                <td className={`px-6 py-4 `}>
                    <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                </td>
            </tr>
        );
    } else return null;
};
const memoizedUser = memo(User);

export default memoizedUser;
