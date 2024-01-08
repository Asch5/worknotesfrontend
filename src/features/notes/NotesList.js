import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';
import Error from '../../components/Error';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';

const NotesList = () => {
    useTitle('techNotes: Notes List');

    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetNotesQuery('notesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const { isManager, isAdmin, username } = useAuth();

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
        const { ids, entities } = notes;

        // console.log('entities', entities);
        // console.log('ids', ids);

        let filteredIds;
        if (isManager || isAdmin) {
            filteredIds = [...ids];
        } else {
            filteredIds = ids.filter(
                (noteId) => entities[noteId].username === username
            );
        }

        const tableContent =
            ids?.length &&
            filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

        content = (
            <div className="flex-1 p-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Updated
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Owner
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
export default NotesList;
