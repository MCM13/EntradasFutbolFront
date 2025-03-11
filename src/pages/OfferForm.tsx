import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Offer from '../models/Offer';
import { OfferService } from '../services/offer.services';
import { useNavigate, useParams } from 'react-router-dom';
import { Temporal } from 'temporal-polyfill';
import toast from 'react-hot-toast';
import { CategoryService } from '../services/categoryService';
import Category from '../models/Category';
import InputForm from '../components/InputForm';
import ErrorMsgData from '../utils/ErrorMsgData';
import TextAreaInputForm from '../components/TextAreaInputForm';

function OfferForm() {
    const now = Temporal.Now.plainDateTimeISO();
    const threeMonthsLater = now.add({ months: 3 }).toString().slice(0, 16);

    const [form, setForm] = useState<Partial<Offer>>({
        title: '',
        description: '',
        active: true,
        contactEmail: '',
        location: '',
        published: new Date().toISOString().slice(0, 16),
        expired: threeMonthsLater,
        idCategory: undefined
    });

    const [categorias, setCategorias] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setLoading(true);
            OfferService.getById(Number(id))
                .then(data => setForm({
                    ...data,
                    published: new Date(data.published || '').toISOString().slice(0, 16),
                    expired: new Date(data.expired || '').toISOString().slice(0, 16)
                }))
                .catch((error) => setErrors({ message: error.message }))
                .finally(() => setLoading(false));
        }
    }, [id]);

    useEffect(() => {
        CategoryService.getAll()
            .then(setCategorias)
            .catch(error => setErrors({ message: error.message }));
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const formData = {
                ...form,
                idCategory: form.idCategory ? Number(form.idCategory) : null,
                published: new Date(form.published || '').toISOString(),
                expired: new Date(form.expired || '').toISOString()
            };

            if (id) await OfferService.update(Number(id), formData);
            else await OfferService.create(formData);

            toast.success('¡Oferta guardada correctamente!');
            navigate('/offers');
        } catch (error) {
            toast.error('Error al guardar la oferta');
            if (Array.isArray(error)) {
                const errorObj = error.reduce((acc: Record<string, string>, err: unknown) => {
                    const errorDetail = err as ErrorMsgData;
                    acc[errorDetail.path] = errorDetail.msg;
                    return acc;
                }, {});
                setErrors(errorObj);
            } else if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: 'Error desconocido' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setForm({ ...form, [name]: checked });
    };

    if (loading) return <p className="text-center text-gray-500">Cargando...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 shadow-xl rounded-xl mt-8">
            <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
                {id ? 'Editar Oferta' : 'Crear Nueva Oferta'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <InputForm
                    text="Título"
                    name="title"
                    value={form.title || ''}
                    handleChange={handleChange}
                    error={errors.title}
                />

                <TextAreaInputForm
                    text="Descripción"
                    name="description"
                    rows={5}
                    value={form.description || ''}
                    handleChange={handleChange}
                    error={errors.description}
                />

                <InputForm
                    text="Email de Contacto"
                    name="contactEmail"
                    value={form.contactEmail || ''}
                    handleChange={handleChange}
                    error={errors.contactEmail}
                />

                <InputForm
                    text="Localización"
                    name="location"
                    value={form.location || ''}
                    handleChange={handleChange}
                    error={errors.location}
                />

                <InputForm
                    type="datetime-local"
                    text="Fecha de Publicación"
                    name="published"
                    value={form.published || ''}
                    handleChange={handleChange}
                    error={errors.published}
                />

                <InputForm
                    type="datetime-local"
                    text="Fecha de Finalización"
                    name="expired"
                    value={form.expired || ''}
                    handleChange={handleChange}
                    error={errors.expired}
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={form.active}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="text-gray-700 dark:text-gray-300">
                        Oferta Activa
                    </label>
                </div>

                <div>
                    <label
                        htmlFor="idCategory"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Categoría:
                    </label>
                    <select
                        id="idCategory"
                        name="idCategory"
                        value={form.idCategory ?? ''}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.name}
                            </option>
                        ))}
                    </select>
                    {errors.idCategory && <p className="text-red-500">{errors.idCategory}</p>}
                </div>

                {errors.message && <p className="text-red-500 text-center">{errors.message}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    {id ? 'Actualizar Oferta' : 'Publicar Oferta'}
                </button>
            </form>
        </div>
    );
}

export default OfferForm;
