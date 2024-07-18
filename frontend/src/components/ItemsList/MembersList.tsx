import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { WideStackUser } from '../WideStackUser';
import { MdGroups } from "react-icons/md";
import { MembersAddForm } from '../Forms/MembersAddForm';
import { TiDelete } from 'react-icons/ti';
import { AdminDeleteForm } from '../Forms/AdminDeleteForm';

export const MembersList = ({ id, admins, balances, fetchDataAdmins, members, fetchDataMembers }: any) => {
  const [open, setOpen] = useState(false);
  const [openDeleteAdmin, setOpenDeleteAdmin] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState({ id: 0, name: '' });
  const auth = useAuth();
  const handleNewMember = () => {
    fetchDataMembers();
    fetchDataAdmins();
  };

  
  return (
    <>
      <div className='flex justify-between items-center ml-2 xl:ml-0 mt-2'>
        <div className='flex relative text-3xl lg:text-2xl font-semibold'>
          <MdGroups className='mr-1' size={33} />
          Miembros
        </div>
        <button onClick={() => setOpen(true)} className="text-lg bg-slate-800 py-2 px-5 lg:px-2 lg:py-1 rounded-full hover:bg-slate-600 text-slate-100 font-medium focus:outline-none">
          + Añadir
        </button>
      </div>
      <div className='grid grid-cols-1 gap-0 p-0 overflow-auto'>
        
      <>
            {admins && admins.map((admin: any) => (
            <div className='flex flex-row relative' key={admin.id}>
              <div className='grid grid-cols-1 gap-0 p-0 w-full' key={admin.id}>
                <WideStackUser
                  userId={admin.id}
                  name={admin.name + ' 👑'}
                  balance={
                    balances.find((balance: any) => balance.user_id === admin.id)?.balance || 0
                  }
                  type='member'
                  fetchOnChange={handleNewMember}
                />
              </div>
              <div>
                {admins.map((admin: any) => admin.id).includes(auth.getUserId()) && admin.id !== auth.getUserId() && (
                  <button onClick={() => { setAdminToDelete({ id: admin.id, name: admin.name }); setOpenDeleteAdmin(true); }} className='absolute top-2 right-2 text-slate-800 mt-5'><TiDelete size={20}/></button>
                )}
                {openDeleteAdmin && (
                  <AdminDeleteForm
                    setOpenForm={setOpenDeleteAdmin}
                    groupId={id}
                    adminId={adminToDelete.id}
                    adminName={adminToDelete.name}
                    fetchOnChange={handleNewMember}
                  />
                )}
              </div>
            </div>
          ))}
            {members && (
              <div className='grid grid-cols-1 gap-0 p-0'>
                {members
                  .filter((member: any) => !admins.some((admin: any) => admin.id === member.id))
                  .map((member: any) => {
                    const memberBalance =
                      balances.find((balance: any) => balance.user_id === member.id)?.balance || 0;
                    return (
                      <WideStackUser
                        key={member.id}
                        userId={member.id}
                        name={member.name}
                        balance={memberBalance}
                        type='member'
                        fetchOnChange={handleNewMember}
                      />
                    );
                  })}
              </div>
            )}
          </>
      </div>
      {open && <MembersAddForm existingMembers={members} setOpenForm={setOpen} id={id} onNewMember={handleNewMember} />}
    </>
  );
};
