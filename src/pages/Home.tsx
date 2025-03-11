import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Hero Section */}
            <header className="bg-green-600 dark:bg-green-800 text-white text-center py-16 px-6">
                <h1 className="text-5xl font-extrabold">Compra Entradas para los Mejores Partidos</h1>
                <p className="mt-4 text-lg">
                    Vive la pasión del fútbol en vivo. Consigue tus entradas de forma fácil y segura.
                </p>
                {!isAuthenticated &&
                    <Link
                        to="/register"
                        className="mt-6 inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition"
                    >
                        Regístrate Gratis
                    </Link>
                }
            </header>

            {/* Beneficios / Características */}
            <section className="max-w-6xl mx-auto py-10 px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                    ¿Por qué comprar con nosotros?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                    La mejor experiencia para los amantes del fútbol.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
                    {/* Beneficio 1 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white"> Partidos Exclusivos</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Acceso a los partidos más importantes y exclusivos del país.
                        </p>
                    </div>

                    {/* Beneficio 2 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white"> Compra Segura</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Tus entradas 100% garantizadas, compra con total confianza.
                        </p>
                    </div>

                    {/* Beneficio 3 */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white"> Ofertas Especiales</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Descuentos exclusivos para nuestros usuarios registrados.
                        </p>
                    </div>
                </div>

                {!isAuthenticated &&
                    <Link
                        to="/register"
                        className="mt-10 inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
                    >
                        ¡Empieza Hoy!
                    </Link>
                }
            </section>
        </div>
    );
}

export default Home;
