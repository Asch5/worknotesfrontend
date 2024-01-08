import { useGetUsersQuery } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';
import Loading from '../../components/Loading';
import useTitle from '../../hooks/useTitle';

const NewNote = () => {
    useTitle('techNotes: New Note');

    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map((id) => data?.entities[id]),
        }),
    });

    const content = users ? <NewNoteForm users={users} /> : <Loading />;

    return content;
};
export default NewNote;
