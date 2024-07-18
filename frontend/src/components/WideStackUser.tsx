import  { useState } from 'react'
import { FaDeleteLeft } from "react-icons/fa6";
import { FriendDeleteForm } from './Forms/FriendDeleteForm';

interface Props {
    name: string;
    balance: string;
    type: string;
    userId: number;
    fetchOnChange: () => void;
  }

  function formatBalance(balance: number) {
    if (balance === 0) return 'Está al día';
    return balance < 0 
      ? `Debe $ ${Math.abs(balance).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
      : `Le deben $ ${balance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

export const WideStackUser = ({userId, name,balance,type, fetchOnChange}: Props) => {

  const [openFormDeleteFriend, setOpenFormDeleteFriend] = useState(false);

  return (
    <>
    <div className = "relative w-full p-2 mt-1 bg-slate-50">
    <div className='flex flex-row justify-between'>
        <h3 className="mb-0 text-lg font-medium tracking-tight text-slate-900">{name}</h3>
        {type === 'friend' && 
        <button onClick={() => setOpenFormDeleteFriend(true)} className="text-slate-800 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-600" title='Borrar'>
        <FaDeleteLeft  size={18}/>
      </button>
        }
    </div>
        {balance !== null && balance !== undefined && <p className='mt-0 font-normal text-slate-500'>{formatBalance(Number(balance))}</p>}
    </div>
    {openFormDeleteFriend && <FriendDeleteForm setOpenForm={setOpenFormDeleteFriend} friendId={userId} friendName={name} fetchOnChange={fetchOnChange}/>}
    </>
  )
}
