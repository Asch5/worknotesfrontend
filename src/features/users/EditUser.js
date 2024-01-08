import { useParams } from 'react-router-dom';
import { useGetUsersQuery } from './usersApiSlice';
import EditUserForm from './EditUserForm';
import useTitle from '../../hooks/useTitle';
import Error from '../../components/Error';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

const EditUser = () => {
    useTitle('techNotes: Edit User');

    const navigate = useNavigate();

    const { id } = useParams();

    const { user, error, isLoading } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id],
        }),
    });

    if (error) {
        return (
            <Error
                message={'We have some mistake...'}
                reset_message_state={() => navigate('/dash')}
            />
        );
    }

    if (isLoading) {
        return <Loading />;
    }

    const content = <EditUserForm user={user} />;

    return content;
};
export default EditUser;
