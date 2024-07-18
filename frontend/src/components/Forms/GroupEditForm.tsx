import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ModalSuccess } from "../ModalSuccess";
import { CategoriesEditor } from "../CategoriesEditor";
import { CheckBox } from "../CheckBox";

interface Props {
    setOpenForm: (value: boolean) => void
    existingCategories: any
    id: any
    onNewModification?: () => void
    admins: any,
    name:any;
    members:any;
}

interface Category {
  name: string;
  members: number[];
};

export const GroupEditForm = ({setOpenForm, existingCategories, id, onNewModification, admins, members,name}: Props) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const auth = useAuth();
  const [errorResponse, setErrorResponse] = useState('');
  const [newGroupName, setNewGroupName] = useState(name);
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenPermissions, setIsOpenPermissions] = useState(false);

  const [membersWithoutAdmin, setMembersWithoutAdmin] = useState<any[]>([]);


  useEffect(() => {
    setMembersWithoutAdmin(members.filter((member: any) => !admins.some((admin: any) => admin.id === member.id)));
  }, [members, admins]);
  

  function closeForm() {
    setOpenForm(false);
  }

  function handleCloseAll() {
    setShowSuccessModal(false);
    closeForm();
  }

  async function addCategory(categoryToAdd: Category) {
    fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({ 
          name: categoryToAdd.name,
          users: categoryToAdd.members

         }),
      })
      .then(response => {
        if (response.ok) {
          setShowSuccessModal(true);
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

  async function addAdmin(adminId: any) {
    fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/addAdmin`, {
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
          console.log("Admin agregado exitosamente");
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
  async function editGroupName(newGroupName: string) {
    fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({ name: newGroupName, description: newGroupDescription }),
      })
      .then(response => {
        if (response.ok) {
          setShowSuccessModal(true);
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

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleCheckboxChange = (id: any) => {
    setSelectedMembers(prevSelectedMembers => {
      if (prevSelectedMembers.includes(id)) {
        return prevSelectedMembers.filter(memberId => memberId !== id);
      } else {
        return [...prevSelectedMembers, id];
      }
    });
  };


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const promises = [];
    if (categoriesList.length > 0) {
      const categoryPromises = categoriesList.map(category => addCategory(category));
      promises.push(Promise.all(categoryPromises));
    }

    
    if (newGroupName !== name || newGroupDescription.trim() !== '') {
      promises.push(editGroupName(newGroupName));
    }

    if (selectedMembers.length > 0) {
      const memberPromises = selectedMembers.map(memberId => addAdmin(memberId));
      promises.push(Promise.all(memberPromises));
    }

    await Promise.all(promises);
    onNewModification && onNewModification();
  }

  return (
    <>
      <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-2/3 xl:w-1/2 p-5">
              <h1 className="text-2xl font-bold mb-4">Editar Grupo</h1>
  
              <div className="overflow-y-auto max-h-5/6 mb-4">
                <div className="sm:flex sm:justify-between">
                  <div className="w-full sm:w-1/2 mb-4 sm:mb-0 pr-0 sm:pr-4">
                    <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-1">
                      Nombre
                    </label>
                    <input type="text" id="groupName" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" placeholder="Compras Casa" />
                    <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-1">
                      Descripción
                    </label>
                    <textarea id="groupName" value={newGroupDescription} onChange={(e) => setNewGroupDescription(e.target.value)} className="shadow appearance-none border rounded w-full h-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" placeholder="Grupo para dividir gastos de casa" />
                  </div>
  
                  <div className="w-full sm:w-1/2 pl-0 sm:pl-4">
                    <button onClick={() => setIsOpenCategory(!isOpenCategory)} className="block text-gray-700 bg-slate-100 rounded-sm text-lg font-bold mb-2 w-full py-2 px-4">
                      Editar categorías
                    </button>
                    {isOpenCategory && (
                      <CategoriesEditor
                        existingCategories={existingCategories}
                        setErrorResponse={setErrorResponse}
                        errorResponse={errorResponse}
                        categoriesList={categoriesList}
                        setCategoriesList={setCategoriesList}
                        members={members}
                      
                      />
                    )}
                    <button onClick={() => setIsOpenPermissions(!isOpenPermissions)} className="block text-gray-700 bg-slate-100 rounded-sm text-lg font-bold mb-2 w-full py-2 px-4">
                      Editar permisos
                    </button>
                    {isOpenPermissions && (
                      <>
                        <label className="block text-gray-700 text-md font-bold mb-2">
                          Asignar administradores:
                        </label>
                        <div className="overflow-y-auto border mb-2 shadow appearance-none rounded">
                          {membersWithoutAdmin.length > 0 ? (
                            membersWithoutAdmin.map((member: any) => (
                              <CheckBox
                                key={member.id}
                                id={member.id}
                                name={member.name}
                                handleCheckboxChange={handleCheckboxChange}
                              />
                            ))
                          ) : (
                            <p>No hay otros miembros</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
  
              <div className="flex items-center justify-center">
                <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-bold mr-3 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  Cancelar
                </button>
                <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Guardar
                </button>
              </div>
  
            </form>
          </div>
        </div>
  
        {showSuccessModal &&
          <ModalSuccess title="¡Editado con éxito!" description="Se ha editado el grupo con éxito" route={`/grupo/${id}`} button="Volver" onClose={handleCloseAll} />
        }
      </div>
    </>
  );
  
}
