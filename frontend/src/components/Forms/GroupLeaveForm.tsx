import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ModalSuccess } from "../ModalSuccess";

interface Props {
    setOpenForm: (value: boolean) => void;
    groupId: any;
}

export const GroupLeaveForm = ({setOpenForm, groupId}: Props) => {
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

  async function leaveGroup() {
    try{
      const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/group/${groupId}/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
      }
      })
      if (response.ok) {
        console.log("Grupo abandonado exitosamente");
        setErrorResponse('');
        setShowSuccessModal(true);
      } else {
        const json = await response.json();
        setErrorResponse(json.message);
        return;
    }

    } catch (error){
      console.error("Error al realizar la solicitud:", error);}
  }

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    leaveGroup();
}

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center  sm:p-0">
        <form onSubmit={handleDelete} className="bg-white shadow-md rounded-lg xl:w-1/5 p-5 ">
          <div className="mb-4">
            <label className="text-start block text-slate-700 text-lg font-bold mb-2" htmlFor="description">
              Abandonar Grupo
            </label>
            <div className='text-start text-slate-700 text-base text-wrap'>
                ¿Seguro desea abandonar el grupo?
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
      <ModalSuccess title="Abandonado con éxito" description="Has abandonado el grupo." route={`/grupos`} button="Volver" onClose={handleCloseAll}/>
      }
    </div>
  )
}
