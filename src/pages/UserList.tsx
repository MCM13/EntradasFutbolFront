import { useEffect, useState } from 'react';
import { UserService } from '../services/userService';

interface User {
    id: number;
    name: string;
    surname: string;
    role: string;
    course: string;
    email: string;
    active: boolean;
    acceptNotifications: boolean;
}

function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const userList = await UserService.getAll();
                setUsers(userList);
            } catch (error) {
                const msg = error instanceof Error ? error.message : 'Error desconocido';
                setMessage(msg);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-700 dark:text-gray-200">
                Cargando...
            </div>
        );
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8">
            {message && (
                <div className="text-center text-red-500 font-semibold my-4">{message}</div>
            )}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Apellido</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Rol</th>
                        <th scope="col" className="px-6 py-3">Curso</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr
                                key={user.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4">{user.surname}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4 capitalize">{user.role}</td>
                                <td className="px-6 py-4">{user.course}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {user.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs"
                                        onClick={() => console.log('Editar', user.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
                                        onClick={() => console.log('Eliminar', user.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                            >
                                No hay usuarios disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
