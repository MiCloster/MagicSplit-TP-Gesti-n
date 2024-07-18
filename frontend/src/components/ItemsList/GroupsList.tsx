import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../Loading';
import { Card } from '../Card';
import { GroupCreateForm } from '../Forms/GroupCreateForm';

interface Props {
    updateGroups: boolean;
    onUpdateGroups: (value: boolean) => void;
}

export const GroupsList = ({ updateGroups, onUpdateGroups }: Props) => {
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    const fetchData = () => {
        if (auth.getToken()) {
            fetch(`https://magicsplitapi-production.up.railway.app/api/user/groups`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.getToken()}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    setGroups(data.data);
                    setLoading(false);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    };

    useEffect(() => {
        fetchData();
    }, [auth]);

    useEffect(() => {
        if (updateGroups) {
            fetchData();
            onUpdateGroups(false);
        }
    }, [updateGroups]);

    const handleNewGroup = () => {
        fetchData();
    };

    

    return (
        <div className="h-full flex flex-col overflow-ayto">
            <div className="border-t border-gray-300 my-3"></div>
            <div className="text-3xl text-slate-900 ml-3 font-bold flex justify-between items-center">
                <span>Grupos</span>
                <button onClick={() => setOpen(true)} className="text-xl bg-slate-800 hover:bg-slate-600 py-2 px-8 rounded-full text-slate-100 font-semibold focus:outline-none">
                        + Crear grupo
                </button>
            </div>
            <div className="border-t border-gray-300 my-4"></div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {groups.length === 0 && !loading ? (
                        <div className="text-lg text-slate-400 text-center mt-3">Aún no tenés grupos. ¡Creá uno o pedí una invitación!</div>
                    ) : (
                        <div className="flex-grow overflow-auto">
                            <div className="grid grid-rows-* lg:grid-cols-2 xl:grid-cols-3 gap-4 p-2 ml-2 mr-2">
                                {groups.map((grupo: any) => (
                                    <Card key={grupo.id} name={grupo.name} balance={grupo.pivot.balance} description={grupo.description} id={grupo.id}></Card>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {open && <GroupCreateForm setOpenForm={setOpen} onNewGroup={handleNewGroup}></GroupCreateForm>}
        </div>
    );
};
