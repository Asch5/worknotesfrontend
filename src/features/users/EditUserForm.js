import { useState, useEffect } from 'react';
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/roles';
import Error from '../../components/Error';
import useAuth from '../../hooks/useAuth';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
    const [updateUser, { isLoading, isSuccess, isError, error }] =
        useUpdateUserMutation();

    const [
        deleteUser,
        { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
    ] = useDeleteUserMutation();

    const navigate = useNavigate();

    const { status } = useAuth();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);

    //console.log(user);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        //console.log(isSuccess);
        if (isSuccess || isDelSuccess) {
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const onRolesChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setRoles(values);
    };

    const onActiveChanged = () => setActive((prev) => !prev);

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({
                id: user.id,
                username,
                password,
                roles,
                active,
            });
        } else {
            await updateUser({ id: user.id, username, roles, active });
        }
    };

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id });
    };

    let options;

    if (status === ROLES.Manager) {
        options = (
            <option key={ROLES.Employee} value={ROLES.Employee}>
                {' '}
                {ROLES.Employee}
            </option>
        );
    }

    if (status === ROLES.Admin) {
        options = Object.values(ROLES).map((role) => {
            return (
                <option key={role} value={role}>
                    {' '}
                    {role}
                </option>
            );
        });
    }

    let canSave;
    if (password) {
        canSave =
            [roles.length, validUsername, validPassword].every(Boolean) &&
            !isLoading;
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
    }

    const valideRoles = !Boolean(roles.length) ? 'red' : 'green';
    const valideUserName = !validUsername ? 'red' : 'green';
    const validePassword = password && !validPassword ? 'red' : 'green';

    const [errContent, setErrContent] = useState(null);
    const errMess = error?.data?.message || delerror?.data?.message;

    useEffect(() => {
        if (isError || isDelError) {
            setErrContent(errMess);
        }
    }, [isError, isDelError, errMess]);

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
                        Edit User
                    </p>
                    <div className="mb-5">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="username"
                        >
                            Username: <span className="">[3-20 letters]</span>
                        </label>
                        <input
                            className={`bg-${valideUserName}-50 border border-${valideUserName}-500 text-${valideUserName}-900 placeholder-${valideUserName}-700 text-sm rounded-lg focus:ring-${valideUserName}-500 focus:border-${valideUserName}-500 block w-full p-2.5 dark:bg-${valideUserName}-100 dark:border-${valideUserName}-400`}
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="off"
                            value={username}
                            onChange={onUsernameChanged}
                        />
                        <p
                            className={`mt-2 text-sm text-${valideUserName}-600 dark:text-${valideUserName}-500`}
                        >
                            <span className="font-medium">
                                {valideUserName === 'red'
                                    ? `Oops! Some Mistake In Input!`
                                    : ``}
                            </span>
                        </p>
                    </div>
                    <div className="mb-5">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="password"
                        >
                            Password:{' '}
                            <span className="">[empty = no change]</span>{' '}
                            <span className="">[4-12 chars incl. !@#$%]</span>
                        </label>
                        <input
                            className={`bg-${validePassword}-50 border border-${validePassword}-500 text-${validePassword}-900 placeholder-${validePassword}-700 text-sm rounded-lg focus:ring-${validePassword}-500 focus:border-${validePassword}-500 block w-full p-2.5 dark:bg-${validePassword}-100 dark:border-${validePassword}-400`}
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={onPasswordChanged}
                            autoComplete="off"
                        />
                        <p
                            className={`mt-2 text-sm text-${validePassword}-600 dark:text-${validePassword}-500`}
                        >
                            <span className="font-medium">
                                {validePassword === 'red'
                                    ? `Oops! Some Mistake In Input!`
                                    : ``}
                            </span>
                        </p>
                    </div>
                    <div>
                        <div className="flex flex-col space-y-1">
                            <div className="sm:w-1/2">
                                <label
                                    htmlFor="roles"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    ASSIGNED ROLES:
                                </label>
                                <select
                                    id="roles"
                                    name="roles"
                                    multiple={true}
                                    size={status === ROLES.Admin ? 3 : 1}
                                    value={roles}
                                    onChange={onRolesChanged}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    {options}
                                </select>
                                <p
                                    className={`mt-2 text-sm text-${valideRoles}-600 dark:text-${valideRoles}-500`}
                                >
                                    <span className="font-medium">
                                        {valideRoles === 'red'
                                            ? `Oops! Some Mistake In Input!`
                                            : ``}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center mb-4">
                                <input
                                    id="user-active"
                                    name="user-active"
                                    type="checkbox"
                                    checked={active}
                                    onChange={onActiveChanged}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    htmlFor="user-active"
                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    ACTIVE
                                </label>
                            </div>
                        </div>
                        <div className="flex mt-4 justify-between  space-x-2">
                            <button
                                className={
                                    !canSave
                                        ? 'text-white bg-blue-200 dark:bg-blue-300 cursor-not-allowed font-medium rounded-lg text-sm w-2/3 px-5 py-2.5 text-center'
                                        : 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/3  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                }
                                title="Save"
                                onClick={onSaveUserClicked}
                                disabled={!canSave}
                            >
                                Save Note
                            </button>
                            <button
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-1/3  px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                title="Delete"
                                onClick={onDeleteUserClicked}
                            >
                                Delete Note
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );

    return content;
};
export default EditUserForm;
