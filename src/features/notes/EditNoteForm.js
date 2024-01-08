import { useState, useEffect } from 'react';
import { useUpdateNoteMutation, useDeleteNoteMutation } from './notesApiSlice';
import { useNavigate } from 'react-router-dom';
import Error from '../../components/Error';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';

const EditNoteForm = ({ note, users }) => {
    const [updateNote, { isLoading, isSuccess, isError, error }] =
        useUpdateNoteMutation();

    const [
        deleteNote,
        { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
    ] = useDeleteNoteMutation();

    const navigate = useNavigate();

    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [completed, setCompleted] = useState(note.completed);
    const [userId, setUserId] = useState(note.user);

    const { status, username } = useAuth();

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('');
            setText('');
            setUserId('');
            navigate('/dash/notes');
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const onTitleChanged = (e) => setTitle(e.target.value);
    const onTextChanged = (e) => setText(e.target.value);
    const onCompletedChanged = (e) => setCompleted((prev) => !prev);
    const onUserIdChanged = (e) => setUserId(e.target.value);

    const canSave = [title, text, userId].every(Boolean) && !isLoading;
    //console.log('canSave', canSave);

    const onSaveNoteClicked = async (e) => {
        if (canSave) {
            await updateNote({
                id: note.id,
                user: userId,
                title,
                text,
                completed,
            });
        }
    };

    const onDeleteNoteClicked = async () => {
        await deleteNote({ id: note.id });
    };

    const created = new Date(note.createdAt).toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    const updated = new Date(note.updatedAt).toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });

    const validTitleClass = !title ? 'red' : 'green';
    const validTextClass = !text ? 'red' : 'green';

    const [errContent, setErrContent] = useState(null);
    const errMess = error?.data?.message || delerror?.data?.message;

    useEffect(() => {
        if (isError || isDelError) {
            setErrContent(errMess);
        }
    }, [isError, isDelError, errMess]);

    let options;

    if (status === ROLES.Admin) {
        console.log('admin');
        options = users.map((user) => {
            return (
                <option key={user.id} value={user.id}>
                    {' '}
                    {user.username}
                </option>
            );
        });
    }

    if (status === ROLES.Manager) {
        const usersWithOnlyEmployRole = users.filter((user) =>
            user.roles.every(
                (role) => role !== ROLES.Manager && role !== ROLES.Admin
            )
        );

        options = usersWithOnlyEmployRole.map((user) => {
            return (
                <option key={user.id} value={user.id}>
                    {' '}
                    {user.username}
                </option>
            );
        });
    }
    if (status === ROLES.Employee) {
        const user = users.find((el) => el.username === username);
        options = (
            <option key={user.id} value={user.id}>
                {user.username}
            </option>
        );
        if (note.username !== username) {
            return (
                <Error
                    message={'Do not do that!!!'}
                    reset_message_state={() => navigate('/dash')}
                />
            );
        }
    }

    const content = (
        <>
            {' '}
            {errContent ? (
                <Error
                    message={errContent}
                    reset_message_state={() => setErrContent(null)}
                />
            ) : // <div className="h-14 my-4"></div>
            null}
            <div className="p-4">
                <form
                    className="max-w-xl mx-auto"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <p className="mb-5 text-4xl text-gray-900 dark:text-white">
                        Edit Note #{note.ticket || note.id.slice(0, 4)}
                    </p>
                    <div className="mb-5">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="note-title"
                        >
                            Title:
                        </label>
                        <input
                            className={`bg-${validTitleClass}-50 border border-${validTitleClass}-500 text-${validTitleClass}-900 placeholder-${validTitleClass}-700 text-sm rounded-lg focus:ring-${validTitleClass}-500 focus:border-${validTitleClass}-500 block w-full p-2.5 dark:bg-${validTitleClass}-100 dark:border-${validTitleClass}-400`}
                            id="note-title"
                            name="title"
                            type="text"
                            autoComplete="off"
                            value={title}
                            onChange={onTitleChanged}
                        />
                        <p
                            className={`mt-2 text-sm text-${validTitleClass}-600 dark:text-${validTitleClass}-500`}
                        >
                            <span className="font-medium">
                                {validTitleClass === 'red'
                                    ? `Oops! Some Mistake In Input!`
                                    : ``}
                            </span>
                        </p>
                    </div>
                    <div className="mb-5">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="note-text"
                        >
                            Text:
                        </label>
                        <textarea
                            className={`bg-${validTextClass}-50 border border-${validTextClass}-500 text-${validTextClass}-900 placeholder-${validTextClass}-700 text-sm rounded-lg focus:ring-${validTextClass}-500 focus:border-${validTextClass}-500 block w-full p-2.5 dark:bg-${validTextClass}-100 dark:border-${validTextClass}-400`}
                            id="note-text"
                            name="text"
                            value={text}
                            onChange={onTextChanged}
                        />
                        <p
                            className={`mt-2 text-sm text-${validTextClass}-600 dark:text-${validTextClass}-500`}
                        >
                            <span className="font-medium">
                                {validTextClass === 'red'
                                    ? `Oops! Some Mistake In Input!`
                                    : ``}
                            </span>
                        </p>
                    </div>
                    <div className="flex flex-col justify-between sm:flex-row space-x-2">
                        <div className="flex-1">
                            {status !== ROLES.Employee && (
                                <label
                                    htmlFor="note-completed"
                                    className="relative inline-flex items-center mb-5 cursor-pointer"
                                >
                                    <input
                                        id="note-completed"
                                        name="completed"
                                        type="checkbox"
                                        checked={completed}
                                        onChange={onCompletedChanged}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        WORK COMPLETE
                                    </span>
                                </label>
                            )}
                            {status !== ROLES.Employee && (
                                <div className="">
                                    <label
                                        htmlFor="note-username"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        ASSIGNED TO:
                                    </label>
                                    <select
                                        id="note-username"
                                        name="username"
                                        value={userId}
                                        onChange={onUserIdChanged}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        {options}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col justify-between mt-4 sm:mt-0">
                            <p className="mb-1">
                                Created:
                                <br />
                                {created}
                            </p>
                            <p className="">
                                Updated:
                                <br />
                                {updated}
                            </p>
                        </div>
                    </div>
                    <div className="flex mt-4 justify-between  space-x-2">
                        <button
                            className={
                                !canSave
                                    ? 'flex-1 text-white bg-blue-200 dark:bg-blue-300 cursor-not-allowed font-medium rounded-lg text-sm w-2/3 px-5 py-2.5 text-center'
                                    : 'flex-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/3  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                            }
                            title="Save"
                            onClick={onSaveNoteClicked}
                            disabled={!canSave}
                        >
                            Save
                        </button>
                        {status !== ROLES.Employee && (
                            <button
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-1/3  px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                title="Delete"
                                onClick={onDeleteNoteClicked}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );

    return content;
};

export default EditNoteForm;
