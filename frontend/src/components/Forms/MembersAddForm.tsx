import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { ModalSuccess } from '../ModalSuccess'
import { useAuth } from '../../auth/AuthProvider';

interface Props {
    existingMembers: any[];
    setOpenForm: (value: boolean) => void
    id: any
    onNewMember?: () => void
}
export const MembersAddForm = ({existingMembers, setOpenForm, id, onNewMember}: Props) => {
    const [member,setMember] = useState('')
    const [membersList,setMembersList] = useState<any[]>([])
    const [errorResponse, setErrorResponse] = useState('')
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [fictionalMembers, setFictionalMembers] = useState<any[]>([])
    const [fictionalName, setFictionalName] = useState('')

    const [successfullyAdded, setSuccessfullyAdded] = useState<any[]>([])
    const auth = useAuth();
    const [messageSuccess, setMessageSuccess] = useState('');
    function addMemberToList() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(member)) {
        setErrorResponse('Por favor, introduce una dirección de correo electrónico válida.');
        return;
        }
        if (member.trim() !== '') {
          if (existingMembers.map((cat: any) => cat.email).includes(member.trim())
            || membersList.some(addedMember => addedMember === member.trim())) {
            setErrorResponse('Integrante ya agregado');
            return;
          }
        
        setErrorResponse('');
        setMembersList([...membersList, member]);
        setMember(''); 
      }
    }

    function closeForm() {
        setOpenForm(false);
      }
    
      function handleCloseAll() {
        closeForm();
      }

      async function addMember(memberToAdd: any) {
        try {
            const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`,
                },
                body: JSON.stringify({ email: memberToAdd }),
            });
    
            if (response.ok) {
                return { member: memberToAdd, success: true };
            } else {
                if(response.status === 403){
                  setErrorResponse('Usuario ya invitado');
                }
                else{
                  return { member: memberToAdd, success: false }; 
                }
                
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            setMembersList([])
            return { member: memberToAdd, success: false }; 
        }
    }

    async function processMembersList(membersList: any[]) {
      try {
          const results = await Promise.all(membersList.map(async (member) => {
              return await addMember(member);
          }));
        
          const successfullMembers = results
              .filter(result => result !== undefined && result.success)
              .map(result => result!.member);

          const errorMembers = results
              .filter(result => result !== undefined && !result.success)
              .map(result => result!.member);

          if (successfullMembers.length > 0) {
              setSuccessfullyAdded([...successfullyAdded, ...successfullMembers]);
              onNewMember && onNewMember();
              const successMessage = `Se invitó con éxito a ${successfullMembers.join(', ')}.`;
              setMessageSuccess(prevMessage => prevMessage ? `${prevMessage}\n${successMessage}` : successMessage);
          }

          if(errorMembers.length > 0){
            const errorMessage = `No se pudo invitar a ${errorMembers.join(', ')}.`;
            setMessageSuccess(prevMessage => prevMessage ? `${prevMessage}\n${errorMessage}` : errorMessage);
            setErrorResponse(`No se pudo invitar a ${errorMembers.join(', ')}`);
          }
      } catch (error) {
          console.error("Error al invitar miembros:", error);
      }
  }
    
    function addFictionalPersonToList() {
      if (fictionalName.trim() !== '') {
        setFictionalMembers([...fictionalMembers, fictionalName]);
        setFictionalName('');
      }
    }

    async function addFictionalMember(fictionalMemberToAdd:any) {
      console.log(fictionalMemberToAdd)
      try {
        const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/fake_member`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.getToken()}`,
            },
            body: JSON.stringify({ name: fictionalMemberToAdd }),
        });

        if (response.ok) {
            setShowSuccessModal(true);
            onNewMember && onNewMember();
        } else{
          setErrorResponse('No tienes permisos para realizar está acción');
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        
        setShowSuccessModal(false);
        setMembersList([])
    }
      
    }


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (existingMembers.map((member: any) => member.email).includes(member)) {
          setErrorResponse('Miembro ya existente');
          return;
      }

      if (membersList.length > 0) {
          await processMembersList(membersList);
      }

      if (fictionalMembers.length > 0) {
          await Promise.all(fictionalMembers.map(async (fictionalMember) => {
              return await addFictionalMember(fictionalMember);
          }));
          const fictionMessage = 'Integrantes ficticios añadidos.';
          setMessageSuccess(prevMessage => prevMessage ? `${prevMessage}\n${fictionMessage}` : fictionMessage);
      }

      if (successfullyAdded.length > 0 ) {
        setShowSuccessModal(true);
    }
  }

  const fetchData = () => {
    if (auth.getToken()) {
      fetch(`https://magicsplitapi-production.up.railway.app/api/user/friends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        }
      })
      .then(response => response.json())
      .then(data => {
        const mappedData = data.friends.map((friend: any) => ({
          label: `${friend.name} (${friend.email})`,
          value: friend.email,
        }));
        setFriends(mappedData);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  };
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [auth]);

    const customStyles = {
      control: (provided: any, state:any) => ({
        ...provided,
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        appearance: 'none',
        borderColor: '#e2e8f0',
        borderRadius: '0.25rem',
        minHeight: '38px',
        height: '38px',
        padding: '0 0.25rem',
        width: '100%',
        '&:hover': {
          borderColor: state.isFocused ? '#A4A6A9' : '#e2e8f0', // Cambia el color del borde en hover
        }
      }),
    
      valueContainer: (provided: any) => ({
        ...provided,
        height: '38px',
        padding: '0 8px',
      }),
    
      indicatorsContainer: (provided: any) => ({
        ...provided,
        height: '38px',
      }),
    
      singleValue: (provided: any) => ({
        ...provided,
        color: '#0f172a',
      }),
    
      menu: (provided: any) => ({
        ...provided,
        with: '100%',
        border: 'none',
        borderRadius: '0',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        marginTop: '0',
      }),
    
      placeholder: (provided: any) => ({
        ...provided,
        color: '#9CA5B1',
      }),
    
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#cbd5e1' : state.isFocused ? '#f1f5f9' : null,
        color: '#0f172a',
        border: 'none',
        cursor: 'pointer',
        padding: '2px 12px',
        fontWeight: 'normal',
        with: '100%',
      })
      };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-96 p-5">
            <h2 className="text-2xl font-semibold text-slate-600 mb-4 text-center">Agregar Miembros</h2>
            <div className="mb-4">
            <label className="block text-slate-700 text-lg font-bold mb-1" htmlFor="category">
                  Lista de amigos
                </label>
                <Select 
                  styles={customStyles}
                  className="basic-single w-full block text-slate-700 font-normal text-base text-start mb-2"
                  isSearchable={false}
                  options={friends}
                  onChange={(option) => {
                    setMember(option?.value);
                  }}
                  placeholder="Seleccione un amigo"
                />
              <label className="block text-gray-700 text-lg font-bold mb-1" htmlFor="existingCategories">
                Invitar integrantes
              </label>    
              {membersList && (
              <div className='flex flex-wrap max-h-20 overflow-auto'>
                  {membersList.map((newMember: any) => (
                  <div className="border p-1 mr-1 mb-1 rounded-md bg-slate-100 text-gray-500" style={{ maxWidth: '150px' }} key={newMember}>
                      {newMember.length > 15 ? `${newMember.substring(0, 15)}...` : newMember}
                  </div>
                  ))}
              </div>
              )}
              {!!errorResponse && 
              <div className='flex justify-center mb-1 bg-red-100 rounded-md'>
                  <p className="text-red-500 text-center">{errorResponse}</p>
              </div>}   
              <div className='flex justify-between'>
                <input type="email" value={member} onChange={(e) => setMember(e.target.value)} className="h-10 shadow appearance-none border rounded w-3/4 sm:w-5/6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="members" placeholder="pablo@gmail.com"/>
                <button type="button" onClick={addMemberToList} className="w-auto h-10 bg-slate-500 hover:bg-slate-700 text-white font-semibold ml-2 px-3 rounded focus:outline-none focus:shadow-outline">
                  Invitar
                </button>
              </div>
            </div>
  
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-1" htmlFor="existingCategories">
                Agregar personas ficticias
              </label>    
              {membersList && (
              <div className='flex flex-wrap max-h-20 overflow-auto'>
                  {fictionalMembers.map((newPerson: any) => (
                  <div className="border p-1 mr-1 mb-1 rounded-md bg-slate-100 text-gray-500" style={{ maxWidth: '150px' }} key={newPerson}>
                      {newPerson.length > 15 ? `${newPerson.substring(0, 15)}...` : newPerson}
                  </div>
                  ))}
              </div>
              )}
                
              <div className='flex justify-between'>
                <input type="text" value={fictionalName} onChange={(e) => setFictionalName(e.target.value)} className="h-10 shadow appearance-none border rounded w-3/4 sm:w-5/6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fictionalPerson" placeholder="Marcelo, Pedro, ..."/>
                <button type="button" onClick={addFictionalPersonToList} className="w-auto h-10 bg-slate-500 hover:bg-slate-700 text-white font-semibold ml-2 px-3 rounded focus:outline-none focus:shadow-outline">
                  Invitar
                </button>
              </div>
            </div>
  
            <div className="flex items-center justify-end">
              <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Cancelar
              </button> 
              <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </div>
      {showSuccessModal && 
        <ModalSuccess title="Invitados con éxito!" description={messageSuccess} route={`/grupo/${id}`} button="Volver" onClose={handleCloseAll} />
      }
    </div>
  );
  
  
}
