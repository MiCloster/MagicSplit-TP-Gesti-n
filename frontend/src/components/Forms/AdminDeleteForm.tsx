import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ModalSuccess } from "../ModalSuccess";

interface Props {
    setOpenForm: (value: boolean) => void
    groupId: number
    adminId: number
    adminName: string
    fetchOnChange: () => void
}

export const AdminDeleteForm = ({setOpenForm, groupId, adminId,adminName, fetchOnChange}: Props) => {
  const [errorResponse,setErrorResponse] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  const auth = useAuth();
  function closeForm() {
    setOpenForm(false);
  }

  function handleCloseAll() {
    setShowSuccessModal(false);
    closeForm();
  }

  async function removeAdmin() {
    fetch(`https://magicsplitapi-production.up.railway.app/api/group/${groupId}/removeAdmin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({ 
          user_id: adminId

         }),
      })
      .then(response => {
        if (response.ok) {
          setShowSuccessModal(true);
          fetchOnChange();
          return response.json();
        } else {
          return response.json().then(json => {
            throw new Error(json.message);
          });
        }
      })
      .catch(error => {
        setErrorResponse(error.message);
      });
  }
  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    removeAdmin();
    fetchOnChange();
}

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center  sm:p-0">
        <form onSubmit={handleDelete} className="bg-white shadow-md rounded-lg xl:w-1/5 p-5 ">
          <div className="mb-4">
            <label className="text-start block text-slate-700 text-lg font-bold mb-2" htmlFor="description">
              Eliminar administrador
            </label>
            <div className='text-start text-slate-700 text-base text-wrap'>
                ¿Seguro desea eliminar a {adminName} como admin?
            </div>
            {!!errorResponse && 
            <div className='flex justify-center mb-3 bg-red-100 rounded-md'>
                <p className="text-red-500 text-center">{errorResponse}</p>
            </div>}
          </div>      
          
          <div className="flex items-center justify-end">
          <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Cancelar
          </button> 
          <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Confirmar
          </button>
          </div>
        </form>
        </div>
      </div>

      {showSuccessModal && 
      <ModalSuccess title="Borrado con éxito" description="Se ha borrado el registro con éxito" route={`/grupo/${groupId}`} button="Volver" onClose={handleCloseAll}/>
      }
    </div>
  )
}
