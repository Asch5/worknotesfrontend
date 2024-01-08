import { useNavigate } from 'react-router-dom';
import { useGetNotesQuery } from './notesApiSlice';
import { memo } from 'react';

const Note = ({ noteId }) => {
    // const note = useSelector((state) => selectNoteById(state, noteId));

    const { note } = useGetNotesQuery('notesList', {
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId],
        }),
    });

    const navigate = useNavigate();

    if (note) {
        const created = new Date(note.createdAt).toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
        });

        const updated = new Date(note.updatedAt).toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
        });

        const handleEdit = () => navigate(`/dash/notes/${noteId}`);

        return (
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                >
                    {note.completed ? (
                        <span className=" text-green-500">Completed</span>
                    ) : (
                        <span className="text-red-500">Open</span>
                    )}
                </th>
                <td className="px-6 py-4">{created}</td>
                <td className="px-6 py-4">{updated}</td>
                <td className="px-6 py-4">{note.title}</td>
                <td className="px-6 py-4">{note.username}</td>

                <td className="px-6 py-4">
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

const memoizedNote = memo(Note);

export default memoizedNote;
