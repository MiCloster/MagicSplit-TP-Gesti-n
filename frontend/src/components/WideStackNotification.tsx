import { useState } from 'react';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import { NotificationRespondForm } from './Forms/NotificationRespondForm';

interface Props {
  groupName: string;
  notificationId: number;
  respondNotification: (invitationId: number, userResponse: string) => void;
  messageNotification: string;
}

export const WideStackNotification = ({groupName, notificationId,respondNotification, messageNotification}: Props) => {
  const [openFormRespond, setOpenFormRespond] = useState(false);
  const [userResponse, setUserResponse] = useState('');

  const handleClick = (response: string) => {
    setUserResponse(response);
    setOpenFormRespond(true);
  }

  return (
    <>
      <div className="relative w-full p-2 mt-1 bg-slate-50">
        <div className='flex flex-row justify-between'>
          <div>
            <h3 className="text-lg font-medium tracking-tight text-slate-900 dark:text-slate-900">{groupName}</h3>
          </div>
          <div>
            <button onClick={() => handleClick('accepted')} className="mr-2 text-slate-800 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-600" title='aceptar'>
              <FaCheck size={18}/>
            </button>
            <button onClick={() => handleClick('rejected')} className="text-slate-800 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-600" title='rechazar'>
              <FaTrashAlt size={18}/>
            </button>
          </div>
        </div>
        <p className='h-8 text-sm font-normal text-slate-500 dark:text-slate-500'> {messageNotification}</p>
      </div>
      {openFormRespond && (
        <NotificationRespondForm 
          setOpenForm={setOpenFormRespond} 
          notificationId={notificationId} 
          userResponse={userResponse} 
          groupName={groupName} 
          messageNotification={messageNotification} 
          respondNotification={respondNotification} 
        />
      )}
    </>
  );
}
