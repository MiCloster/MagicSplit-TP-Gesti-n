import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { ModalSuccess } from '../components/ModalSuccess';
import img from '../prueba_img.png';

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorResponse, setErrorResponse] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const auth = useAuth();
  const goTo = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch('https://magicsplitapi-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      if (response.ok) {
        console.log("Registro exitoso");
        setErrorResponse('');
        setShowSuccessModal(true);
      } else {
        const json = await response.json();
        setErrorResponse(json.message);
        return;
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/grupos"></Navigate>;
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const id = urlParams.get('id');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const status = true;
    if (token) {
      auth.saveUser({ token, id, name, email, status });
      goTo("/grupos");
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 h-full hidden md:block">
        <img src={img} alt="App features explained" style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
        <h1 className='text-4xl font-extrabold w-auto text-center'>
          ¡Bienvenido a MagicSplit🪄!
        </h1>
        <div className="my-8 flex flex-col items-center">
          <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:shadow-sm focus:shadow-outline">
            <div className="bg-white p-2 rounded-full">
              <svg className="w-4" viewBox="0 0 533.5 544.3">
                <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
              </svg>
            </div>
            <a className="ml-4" href='https://magicsplitapi-production.up.railway.app/google/redirect'>Iniciar sesión con Google</a>
          </button>
        </div>
        <div className="text-center">
          <div className="inline-block text-sm text-gray-600 font-medium">
            O registrarse con email
          </div>
        </div>
        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
          {!!errorResponse && (
            <div className='flex justify-center mb-3 bg-red-100'>
              <p className="text-red-500 text-center">{errorResponse}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Maria'
                required
                className="pl-3 mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder='maria@gmail.com'
                required
                className="pl-3 mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder='********'
                required
                className="pl-3 mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">
                Confirmar Contraseña
              </label>
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="current-password"
                placeholder='********'
                required
                className="pl-3 mb-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Registrarse
              </button>
            </div>
          </form>
          <p className="mt-1 text-center text-sm text-gray-500">
            Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
      {showSuccessModal &&
        <ModalSuccess title="¡Registro exitoso!" description="Tu cuenta ha sido creada con éxito." route="/login" button="Iniciar Sesión" />
      }
    </div>
  );
}
