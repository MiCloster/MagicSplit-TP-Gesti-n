import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ModalSuccess } from "../ModalSuccess";

interface Props {
    setOpenForm: (value: boolean) => void;
    onNewGroup: () => void; 
}

export const GroupCreateForm = ({setOpenForm, onNewGroup}: Props) => {
  const [nameGroup, setNameGroup] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  const auth = useAuth();
  function closeForm() {
    setOpenForm(false);
  }
  function handleCloseAll() {
    setShowSuccessModal(false);
    closeForm();
  }
  
  async function createGroup() {
    try{
      const response = await fetch('https://magicsplitapi-production.up.railway.app/api/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
      },
      body: JSON.stringify({
          name: nameGroup,
          description: description,
      }),
      });
      if (response.ok) {
        console.log("Creado con exito");
        setShowSuccessModal(true);
        onNewGroup(); 
      } 
    } catch (error){
      console.error("Error al realizar la solicitud:", error);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createGroup();
  }

  return (
    <>
    <div className="relative z-60">
      <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg xl:w-1/4 p-10 ">
          <div className="mb-4">
            <label className="text-start block text-gray-700 text-lg font-bold mb-2" htmlFor="username">
              Nombre del grupo
            </label>
            <input value={nameGroup} onChange={(e) => setNameGroup(e.target.value)}  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Juntada" required/>
          </div>
          <div className="mb-6">
            <label className="text-start text-lg block text-gray-700 font-bold mb-2" htmlFor="description">
              Descripción
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="Descripción"/>
          </div>
          <div className="flex items-center justify-end">
          <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-semibold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Cerrar
          </button> 
          <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white text-center font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Crear
          </button>
          </div>
        </form>
      </div>
    </div>
    
    {showSuccessModal && 
      <ModalSuccess title="¡Creado con éxito!" description="El grupo ha sido creado con éxito" route="/grupos" button="Ir a grupos" onClose={handleCloseAll}/>
    }
    </>
  )
}
