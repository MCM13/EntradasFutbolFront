import { useEffect, useState } from "react";
import { UserService } from "../services/userService";
import User from "../models/User";

function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        UserService.getProfile()
            .then(setUser)
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Error desconocido");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 mt-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Mi Perfil
            </h2>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {loading ? (
                <p className="text-center">Cargando perfil...</p>
            ) : (
                user && (
                    <div className="space-y-6">
                        {/* Nombre y Apellidos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Apellidos</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.surname}</p>
                            </div>
                        </div>

                        {/* Correo Electrónico */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Correo Electrónico</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
                        </div>

                        {/* Rol */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rol</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{user.role}</p>
                        </div>

                        {/* Curso */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Curso</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.course || "No especificado"}</p>
                        </div>

                        {/* Activado */}
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cuenta activa:</p>
                            <span
                                className={`px-3 py-1 rounded-full text-white text-sm ${user.active ? "bg-green-600" : "bg-red-600"
                                    }`}
                            >
                                {user.active ? "Sí" : "No"}
                            </span>
                        </div>

                        {/* Notificaciones */}
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notificaciones por email:</p>
                            <span
                                className={`px-3 py-1 rounded-full text-white text-sm ${user.acceptNotifications ? "bg-green-600" : "bg-gray-500"
                                    }`}
                            >
                                {user.acceptNotifications ? "Sí" : "No"}
                            </span>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default Profile;
