import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../Loading';
import { WideStackUser } from '../WideStackUser';
import { FriendAddForm } from '../Forms/FriendAddForm';
import { IoPeopleSharp } from "react-icons/io5";

export const FriendsList = () => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setFriends(data.friends);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  };

  useEffect(() => {
    fetchData();
  }, [auth]);

  const handleNewFriend = () => {
    fetchData();
  };


  return (
    <>
      <div className="text-3xl xl:text-xl text-slate-900 ml-2 xl:ml-0 mt-2 mb-5 font-bold flex justify-between items-center">
        <div className='flex relative text-3xl lg:text-2xl font-semibold'>
          <IoPeopleSharp className='mr-1' size={33}/>
          Amigos
        </div>
      
        <button onClick={() => setOpen(true)} className="text-lg bg-slate-800 py-2 px-5 lg:px-2 lg:py-1 rounded-full hover:bg-slate-600 text-slate-100 font-medium focus:outline-none">
            + Añadir
          </button>
      </div>
      
      <div className='grid grid-cols-1 gap-0 p-0 overflow-auto'>
        {loading ? (
          <Loading />
        ) : (
          <>
            {friends && friends.length > 0 ? (
              <div className='grid grid-cols-1 gap-0 p-0'>
                {friends.map((person: any) => (
                  <WideStackUser key={person.id}
                    userId={person.id} 
                    name={person.name} 
                    balance={person.balance} 
                    type='friend'
                    fetchOnChange={fetchData}>
                  </WideStackUser>
                ))}
              </div>
            ) : (
              <p className='text-lg text-slate-400 text-center'>Aquí no hay nadie.</p>
            )}
          </>
        )}
      </div>
      
      {open && <FriendAddForm 
        setOpenForm={setOpen} 
        submitUrl="https://magicsplitapi-production.up.railway.app/api/user/friend"
        successMessage="Amigo añadido con éxito"
        errorMessage="El usuario no existe"
        successRoute="/grupos"
        onNewPerson={handleNewFriend} 
      />}
    </>
  );
};
