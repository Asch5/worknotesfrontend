import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewNoteMutation } from './notesApiSlice';
import Error from '../../components/Error';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../config/roles';

const NewNoteForm = ({ users }) => {
    //console.log(users);

    const [addNewNote, { isLoading, isSuccess, isError, error }] =
        useAddNewNoteMutation();

    const { status, username } = useAuth();

    const userCurrent = users.find((el) => el.username === username);

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [userId, setUserId] = useState(userCurrent.id);

    useEffect(() => {
        if (isSuccess) {
            setTitle('');
            setText('');
            setUserId('');
            navigate('/dash/notes');
        }
    }, [isSuccess, navigate]);

    const onTitleChanged = (e) => setTitle(e.target.value);
    const onTextChanged = (e) => setText(e.target.value);
    const onUserIdChanged = (e) => setUserId(e.target.value);

    const canSave = [title, text, userId].every(Boolean) && !isLoading;

    const onSaveNoteClicked = async (e) => {
        e.preventDefault();
        console.log('onSaveNoteClicked', { user: userId, title, text });
        if (canSave) {
            await addNewNote({ user: userId, title, text });
        }
    };

    let options;

    if (status === ROLES.Admin) {
        console.log('status', status);
        //console.log(users);
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
        // const user = users.find((el) => el.username === username);
        options = (
            <option key={userCurrent.id} value={userCurrent.id}>
                {userCurrent.username}
            </option>
        );
    }

    const validTitleClass = !title ? 'red' : 'green';
    const validTextClass = !text ? 'red' : 'green';

    const [errContent, setErrContent] = useState(null);
    const errMess = error?.data?.message;

    useEffect(() => {
        if (isError) {
            setErrContent(errMess);
        }
    }, [isError, errMess]);

    const content = (
        <>
            {errContent ? (
                <Error
                    message={errContent}
                    reset_message_state={() => setErrContent(null)}
                />
            ) : // <div className="h-14 my-4"></div>
            null}
            <div className="p-4">
                <form className="max-w-xl mx-auto" onSubmit={onSaveNoteClicked}>
                    <p className="mb-5 text-4xl text-gray-900 dark:text-white">
                        New Note
                    </p>
                    <div className="mb-5">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="title"
                        >
                            Title:
                        </label>
                        <input
                            className={`bg-${validTitleClass}-50 border border-${validTitleClass}-500 text-${validTitleClass}-900 placeholder-${validTitleClass}-700 text-sm rounded-lg focus:ring-${validTitleClass}-500 focus:border-${validTitleClass}-500 block w-full p-2.5 dark:bg-${validTitleClass}-100 dark:border-${validTitleClass}-400`}
                            id="title"
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
                            htmlFor="text"
                        >
                            Text:
                        </label>
                        <textarea
                            className={`bg-${validTextClass}-50 border border-${validTextClass}-500 text-${validTextClass}-900 placeholder-${validTextClass}-700 text-sm rounded-lg focus:ring-${validTextClass}-500 focus:border-${validTextClass}-500 block w-full p-2.5 dark:bg-${validTextClass}-100 dark:border-${validTextClass}-400`}
                            id="text"
                            name="text"
                            value={text}
                            onChange={onTextChanged}
                            autoComplete="off"
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

                    <div className="flex justify-between items-end  flex-wrap sm:flex-nowrap mt-4   sm:space-x-2">
                        <div className="w-full mb-4 sm:mb-0">
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                ASSIGNED TO:
                            </label>
                            <select
                                id="username"
                                name="username"
                                value={userId}
                                onChange={onUserIdChanged}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                {options}
                            </select>
                        </div>

                        <button
                            className={
                                !canSave
                                    ? 'text-white bg-blue-200 dark:bg-blue-300 cursor-not-allowed font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center'
                                    : 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                            }
                            title="Save"
                            disabled={!canSave}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );

    return content;
};

export default NewNoteForm;
