import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Create = () => {
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        correo: "",
        telefono: "",
        direccion: "",
        genero: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [errors, setErrors] = useState({});
    const [rol] = useState("Cliente");
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const accountDropdownRef = useRef(null);
    const navigate = useNavigate();

    // Expresiones regulares para validación
    const regexes = {
        nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
        correo: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        telefono: /^(\+57|57)?3\d{9}$/,
        direccion: /^[a-zA-Z0-9\s,'-]{3,100}$/
    };

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'nombres':
            case 'apellidos':
                if (!regexes.nombre.test(value)) {
                    error = `${name === 'nombres' ? 'El nombre' : 'Los apellidos'} deben contener solo letras y espacios, entre 2 y 50 caracteres.`;
                }
                break;
            case 'correo':
                if (!regexes.correo.test(value)) {
                    error = "El formato del correo electrónico no es válido.";
                }
                break;
            case 'telefono':
                if (!regexes.telefono.test(value)) {
                    error = "El número de teléfono debe ser un número colombiano válido.";
                }
                break;
            case 'direccion':
                if (!regexes.direccion.test(value)) {
                    error = "La dirección debe tener entre 3 y 100 caracteres alfanuméricos.";
                }
                break;
            case 'genero':
                if (!value) {
                    error = "Por favor seleccione un género.";
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        const error = validateField(name, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length === 0) {
            registroUsuario();
        } else {
            setErrors(newErrors);
        }
    };

    const registroUsuario = () => {
        axios.post("https://railway-back-bd-production.up.railway.app/users/create", {
            Nombres: formData.nombres,
            Apellidos: formData.apellidos,
            Correo: formData.correo,
            Telefono: formData.telefono,
            Direccion: formData.direccion,
            Genero: formData.genero,
            Rol: rol
        }).then(() => {
            setSuccess("Registro exitoso. Por favor, revisa tu correo electrónico para obtener tus credenciales de acceso.");
            setError(""); // Limpiamos el mensaje de error si existía.
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }).catch(error => {
            setSuccess(""); // Limpiamos el mensaje de éxito si existía.
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Ocurrió un error inesperado. Por favor, inténtelo de nuevo.");
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setIsAccountDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <header className="bg-gray-800 py-4 shadow-md w-full">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <Link to="/" className="text-lg font-bold text-gray-100">
                        Solo Electricos
                    </Link>

                    <nav className="flex justify-center space-x-4 mt-4 md:mt-0">
                        <ul className="flex flex-wrap justify-center space-x-4">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-100 hover:text-gray-300"
                                >
                                    Inicio
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <div className="relative" ref={accountDropdownRef}>
                            <button
                                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                className="flex items-center text-gray-100 hover:text-gray-300 focus:outline-none"
                            >
                                <span>Mi Cuenta</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </button>
                            {isAccountDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <Link
                                        to="/registroUsuarioCliente"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Registrarme
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 m-4">
                <div className="max-w-md mx-auto p-8 bg-white rounded-md shadow-md">
                    <h2 className="text-2xl font-semibold text-center mb-6">Crear una cuenta</h2>
                    {/* Alerta de éxito */}
                    {success && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 relative rounded-r-lg shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">
                                        ¡Éxito!
                                    </h3>
                                    <p className="mt-1 text-sm text-green-700">
                                        {success}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSuccess("")}
                                    className="absolute top-4 right-4 text-green-600 hover:text-green-800"
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Alerta de error */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 relative rounded-r-lg shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        ¡Error!
                                    </h3>
                                    <p className="mt-1 text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setError("")}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>
                        <div className="flex mb-4">
                            <div className="w-1/2 pr-2">
                                <label htmlFor="nombres" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                                <input
                                    type="text"
                                    id="nombres"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    placeholder="Ingresar nombre"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.nombres ? 'border-red-500' : ''}`}
                                />
                                {errors.nombres && <p className="text-red-500 text-xs italic">{errors.nombres}</p>}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label htmlFor="apellidos" className="block text-gray-700 text-sm font-bold mb-2">Apellidos</label>
                                <input
                                    type="text"
                                    id="apellidos"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    placeholder="Ingresar apellidos"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.apellidos ? 'border-red-500' : ''}`}
                                />
                                {errors.apellidos && <p className="text-red-500 text-xs italic">{errors.apellidos}</p>}
                            </div>
                        </div>
                        <div className="flex mb-4">
                            <div className="w-1/2 pr-2">
                                <label htmlFor="telefono" className="block text-gray-700 text-sm font-bold mb-2">Número de teléfono</label>
                                <input
                                    type="text"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="Ingresar número telefónico"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.telefono ? 'border-red-500' : ''}`}
                                />
                                {errors.telefono && <p className="text-red-500 text-xs italic">{errors.telefono}</p>}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label htmlFor="genero" className="block text-gray-700 text-sm font-bold mb-2">Género</label>
                                <select
                                    id="genero"
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.genero ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Seleccionar género</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                </select>
                                {errors.genero && <p className="text-red-500 text-xs italic">{errors.genero}</p>}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="direccion" className="block text-gray-700 text-sm font-bold mb-2">Dirección de residencia</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Ingresar dirección"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.direccion ? 'border-red-500' : ''}`}
                            />
                            {errors.direccion && <p className="text-red-500 text-xs italic">{errors.direccion}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="correo" className="block text-gray-700 text-sm font-bold mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="Ingresar correo electrónico"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.correo ? 'border-red-500' : ''}`}
                            />
                            {errors.correo && <p className="text-red-500 text-xs italic">{errors.correo}</p>}
                        </div>
                        <div className="text-center mx-auto">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue">
                                Registrarme
                            </button>
                            <p className="mt-4 text-sm text-gray-600">
                                Al registrarte, recibirás un correo con tus credenciales de acceso.
                            </p>
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                ¿Ya tiene una cuenta?
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Create;
