import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ModalSuccess } from "../ModalSuccess";

interface GeneralFormProps {
  setOpenForm: (value: boolean) => void;
  submitUrl: string;
  successMessage: string;
  errorMessage: string;
  successRoute: string;
  existingEmails?: string[];
  onNewPerson?: () => void; // Prop para notificar al componente padre
}

export const FriendAddForm = ({ 
  setOpenForm, 
  submitUrl, 
  successMessage, 
  errorMessage, 
  successRoute, 
  existingEmails = [], 
  onNewPerson 
}: GeneralFormProps) => {
  const [email, setEmail] = useState('');
  const [errorResponse, setErrorResponse] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const auth = useAuth();

  function closeForm() {
    setOpenForm(false);
  }

  function handleCloseAll() {
    setShowSuccessModal(false);
    closeForm();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (existingEmails.map((member: any) => member.email).includes(email)) {
      setErrorResponse('Miembro ya existente');
      return;
    }

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setErrorResponse('');
        setShowSuccessModal(true);
        if (onNewPerson) {
          onNewPerson(); // Notificar al componente padre
        }
      } else {
        
        setErrorResponse(errorMessage);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setErrorResponse('El usuario no existe.');
    }
  }

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg xl:w-1/4 p-6">
            <div className="mb-4">
              <label className="text-start block text-gray-700 text-lg font-bold mb-2" htmlFor="email">
                Email
              </label>
              {errorResponse && 
                <div className='flex justify-center mb-3 bg-red-100 rounded-md'>
                  <p className="text-red-500 text-center">{errorResponse}</p>
                </div>
              }
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                id="email" 
                placeholder="julia@gmail.com"
              />
            </div>
            <div className="flex items-center justify-end">
              <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Cerrar
              </button> 
              <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Añadir
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccessModal && 
        <ModalSuccess title="¡Añadido/s con éxito!" description={successMessage} route={successRoute} button="Volver" onClose={handleCloseAll} />
      }
    </div>
  );
};
