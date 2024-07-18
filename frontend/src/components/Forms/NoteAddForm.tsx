import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ModalSuccess } from "../ModalSuccess";

interface Props {
    setOpenForm: (value: boolean) => void
    id: string
    onNewNote?: () => void
}

export const NoteAddForm = ({setOpenForm, id, onNewNote}: Props) => {

  const [content, setContent] = useState('');
  const [errorResponse, setErrorResponse] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  const auth = useAuth();
  function closeForm() {
    setOpenForm(false);
  }

  function handleCloseAll() {
    setShowSuccessModal(false);
    closeForm();
  }
 
  async function addNote() {
    try{
      
      const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          content: content,
        }),
        })
        if (response.ok) {
          console.log("Nota añadida con exito");
          setErrorResponse('');
          setShowSuccessModal(true);
          onNewNote && onNewNote();
        } else {
          const json = await response.json();
          setErrorResponse(json.message);
          return;
    }

    } catch (error){
      console.error("Error al realizar la solicitud:", error);}
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addNote();
  }
  
  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg w-full sm:w-3/4 md:w-1/3 lg:w-1/4 p-3 sm:p-5">
            <h1 className="text-2xl font-bold mb-4">Crear nota</h1>
            
            <div className='flex flex-col sm:flex-row justify-between'>
              <div className="w-full mb-4 sm:mr-2">
                <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="shadow appearance-none border rounded w-full h-36 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-start block" placeholder={`20/06~27/06 Viaje a Córdoba`} required/>
              </div>
            </div>
            {!!errorResponse && 
              <div className='flex justify-center mb-1 bg-red-100 rounded-md'>
                <p className="text-red-500 text-center">{errorResponse}</p>
              </div>}
            <div className="flex items-center justify-end mt-2">
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
      <ModalSuccess title="¡Creado con éxito!" description="Se ha agregado con éxito" route={`/grupo/${id}`} button="Volver" onClose={handleCloseAll}/>
      }
    </div>
  )
  
}
