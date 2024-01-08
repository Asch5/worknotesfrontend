import { useGetUsersQuery } from './usersApiSlice';
import User from './User';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';
import useTitle from '../../hooks/useTitle';

const UsersList = () => {
    useTitle('techNotes: Users List');

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const { status } = useAuth();

    const navigate = useNavigate();
    let content;

    if (isLoading) content = <Loading />;

    if (isError) {
        content = (
            <Error
                message={error?.data?.message}
                reset_message_state={() => {
                    navigate('/dash');
                }}
            />
        );
    }

    if (isSuccess) {
        const { ids, entities } = users;

        let tableContent;
        if (status === ROLES.Admin) {
            tableContent =
                ids?.length &&
                ids.map((userId) => <User key={userId} userId={userId} />);
        }

        if (status === ROLES.Manager) {
            const onlyEmployRoles = ids.filter((id) =>
                entities[id].roles.every(
                    (role) => role !== ROLES.Manager && role !== ROLES.Admin
                )
            );
            tableContent =
                onlyEmployRoles?.length &&
                onlyEmployRoles.map((userId) => (
                    <User key={userId} userId={userId} />
                ));
        }

        content = (
            <div className="p-4 flex-1">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Status active
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Roles
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Edit
                                </th>
                            </tr>
                        </thead>
                        <tbody>{tableContent}</tbody>
                    </table>
                </div>
            </div>
        );
    }

    return content;
};
export default UsersList;
