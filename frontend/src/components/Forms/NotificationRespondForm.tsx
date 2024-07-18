interface Props {
    setOpenForm: (value: boolean) => void;
    notificationId: number;
    userResponse: string;
    groupName: string;
    messageNotification: string;
    respondNotification: (invitationId: number, userResponse: string) => void;
  }
  
  export const NotificationRespondForm = ({setOpenForm, notificationId, userResponse, groupName, messageNotification, respondNotification}: Props) => {
    function closeForm() {
      setOpenForm(false);
    }
  
    function handleRespond(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      respondNotification(notificationId, userResponse);
    }
  
    return (
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <form onSubmit={handleRespond} className="bg-white shadow-md rounded-lg xl:w-1/5 p-5">
              <div className="mb-4">
                {userResponse === 'accepted' && <label className="text-start block text-slate-700 text-lg font-bold mb-2" htmlFor="description">
                  Aceptar
                </label>}
                {userResponse === 'rejected' && <label className="text-start block text-slate-700 text-lg font-bold mb-2" htmlFor="description">
                  Rechazar
                </label>}
                <div className='text-start text-slate-700 text-base'>
                  {`¿Seguro deseas ${userResponse === 'accepted' ? 'aceptar' : 'rechazar'} la acción de ${messageNotification}${messageNotification === 'unirte al grupo' ? ' ' + groupName : ''}?`}
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
      </div>
    );
  }
  