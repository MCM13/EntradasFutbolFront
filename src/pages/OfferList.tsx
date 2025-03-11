import { ChangeEvent, useEffect, useState } from "react";
import { OfferService } from "../services/offer.services";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Offer from "../models/Offer";

function TicketList() {
    const [tickets, setTickets] = useState<Offer[]>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [queryParams, setQueryParams] = useSearchParams();
    const titleQuery = queryParams.get("title") || "";

    useEffect(() => {
        OfferService.search(titleQuery)
            .then(setTickets)
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, [titleQuery]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setQueryParams(newTitle ? { title: newTitle } : {});
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Estás seguro que quieres eliminar esta entrada?"))
            return;

        try {
            await OfferService.delete(id);
            setTickets(tickets?.filter((ticket) => ticket.id !== id));
            toast.success("Entrada eliminada correctamente!");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error desconocido");
        }
    };

    return (
        <div className="flex flex-col gap-6 py-8">
            <h2 className="text-4xl font-extrabold text-center dark:text-white">
                Lista de Entradas Disponibles
            </h2>

            <Link
                to="/offers/new"
                className="mx-auto text-white w-fit bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
                Añadir Nueva Entrada
            </Link>

            {/* Search bar */}
            <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar partido o equipo..."
                    value={titleQuery}
                    onChange={handleSearchChange}
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            {/* Loader / Error / Empty State */}
            {loading && <p className="text-center">Cargando entradas...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {tickets?.length === 0 && <p className="text-center">No hay entradas disponibles.</p>}

            {/* Ticket Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                {tickets?.map((ticket) => (
                    <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h5 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {ticket.title}
                            </h5>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {ticket.description}
                            </p>
                            <div className="flex justify-center gap-3 mt-4">
                                <Link
                                    to={`/offers/${ticket.id}`}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                    Ver
                                </Link>
                                <Link
                                    to={`/offers/edit/${ticket.id}`}
                                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(ticket.id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TicketList;
