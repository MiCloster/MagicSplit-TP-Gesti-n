import { GroupsList } from '../components/ItemsList/GroupsList';
import { FriendsList } from '../components/ItemsList/FriendsList';
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { NotificationsList } from "../components/ItemsList/NotificationList";

export const Grupos = () => {
  const [updateGroups, setUpdateGroups] = useState(false);
  const auth = useAuth();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-full w-full p-3">
      <div className='xl:w-3/4 lg:w-2/3 w-full flex flex-col bg-white border rounded-3xl lg:ml-0 lg:mr-2 lg:mb-0 mb-2 p-5 relative'>
        <div className='flex justify-between items-start'>
          <div>
            <div className='text-3xl text-slate-900 m-3 mt-3 font-bold'>Balance Total</div>
            <div className='text-3xl text-slate-900 m-3 font-bold'>$ {auth.getUserBalance()} </div>
          </div>
        </div>
        <GroupsList updateGroups={updateGroups} onUpdateGroups={setUpdateGroups} />
      </div>
      <div className="xl:w-1/4 lg:w-1/3 w-full flex flex-col lg:mr-2">
        <div className="flex flex-col h-full">
          <div className="mb-2 h-1/2 lg:h-1/2 flex flex-col bg-white border rounded-3xl p-5 overflow-hidden relative">
            <FriendsList />
          </div>
          <div className="h-1/2 lg:h-1/2 flex flex-col bg-white border rounded-3xl p-5 overflow-hidden relative">
            <NotificationsList onGroupsUpdate={setUpdateGroups} />
          </div>
        </div>
      </div>
    </div>
  );
}
