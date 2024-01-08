import { useParams } from 'react-router-dom';
//import { useSelector } from 'react-redux';
import { useGetNotesQuery } from './notesApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';
import Loading from '../../components/Loading';
import useTitle from '../../hooks/useTitle';
import Error from '../../components/Error';
import { useNavigate } from 'react-router-dom';

const EditNote = () => {
    useTitle('techNotes: Edit Note');

    const { id } = useParams();

    const navigate = useNavigate();

    const {
        note,
        isLoading: isLoadingNote,
        error: errorNote,
    } = useGetNotesQuery('notesList', {
        selectFromResult: ({ data }) => ({
            note: data?.entities[id],
        }),
    });

    const { users, isLoading, error } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map((id) => data?.entities[id]),
        }),
    });

    if (error || errorNote) {
        console.log('error');
        return (
            <Error
                message={'We have some mistake...'}
                reset_message_state={() => navigate('/dash')}
            />
        );
    }

    if (isLoading || isLoadingNote) {
        return <Loading />;
    }

    const content = note && users && <EditNoteForm note={note} users={users} />;

    return content;
};
export default EditNote;
