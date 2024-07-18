import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import Loading from "../Loading";

interface Member {
    id: number;
    name: string;
}

interface Props {
    setOpenForm: (value: boolean) => void;
    category: any;
    membersGroup: Member[];
}

export const CategoryEditForm = ({ setOpenForm, category, membersGroup }: Props) => {
    const [categoryMembers, setCategoryMembers] = useState<Member[]>([]);
    const [membersToRemove, setMembersToRemove] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [nonCategoryMembers, setNonCategoryMembers] = useState<Member[]>([]);
    const [membersToAdd, setMembersToAdd] = useState<number[]>([]);

    const auth = useAuth();

    function closeForm() {
        setOpenForm(false);
    }


    async function getCategoryMembers() {
        if (auth.getToken()) {
            fetch(`https://magicsplitapi-production.up.railway.app/api/category/${category.id}/members`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`,
                }
            })
                .then((res) => {
                    if (res.ok) {
                        setLoading(false);
                        return res.json();
                    }
                })
                .then((res) => {
                    setCategoryMembers(res.members);
                })
                .catch((error) => {
                    console.error('Error fetching category members:', error);
                    setLoading(false);
                });
        }
    }

    async function removeMember(memberId: number) {
        if (auth.getToken()) {
            fetch(`https://magicsplitapi-production.up.railway.app/api/category/${category.id}/removeMember`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`,
                },
                body: JSON.stringify({
                    user_id: memberId
                }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .catch((error) => {
                    console.error('Error removing member:', error);
                });
        }
    }

    async function addMember(memberId: number) {
        if (auth.getToken()) {
            fetch(`https://magicsplitapi-production.up.railway.app/api/category/${category.id}/addMember`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`,
                },
                body: JSON.stringify({
                    user_id: memberId
                }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .catch((error) => {
                    console.error('Error adding member:', error);
                });
        }
    }

    const handleDelete = (memberId: number) => {
        setMembersToRemove([...membersToRemove, memberId]);
    };

    const handleAdd = (memberId: number) => {
        setMembersToAdd([...membersToAdd, memberId]);
    };

    useEffect(() => {
        getCategoryMembers();
    }, []);

    useEffect(() => {
        const membersNotInCategory = membersGroup.filter((member: Member) =>
            !categoryMembers.some((categoryMember: Member) => categoryMember.id === member.id)
        );

        setNonCategoryMembers(membersNotInCategory);
    }, [categoryMembers, membersGroup]);

    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        const promises = [];
        if (membersToRemove.length > 0) {
            const categoryPromises = membersToRemove.map(member => removeMember(member));
            promises.push(Promise.all(categoryPromises));
        }
        if (membersToAdd.length > 0) {
            const categoryPromises = membersToAdd.map(member => addMember(member));
            promises.push(Promise.all(categoryPromises));
        }

        try {
            await Promise.all(promises);
            closeForm();
        } catch (error) {
            console.error('Error handling members:', error);
        }
    }

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="bg-white shadow-md rounded-lg xl:w-1/4 p-5">
                        <h1 className="text-xl font-bold mb-4">Editar Categoría {category.name} </h1>

                        <div className="mb-4">
                            <h3 className="text-center block text-slate-700 text-lg font-bold mb-2">
                                Miembros actuales
                            </h3>
                            <div className="overflow-y-auto h-24 border mb-2 shadow appearance-none rounded">
                                {loading ? <Loading /> :
                                    <>
                                        <ul className="list-none text-center">
                                            {categoryMembers.map((member: Member) => (
                                                <li key={member.id} className="flex items-center justify-between mb-1">
                                                    <span className={`ml-5 ${membersToRemove.includes(member.id) ? 'line-through text-gray-400' : ''}`}>{member.name}</span>
                                                    <button
                                                        className={`text-slate-500 mr-5 text-base hover:underline ${membersToRemove.includes(member.id) ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        onClick={() => handleDelete(member.id)}
                                                        disabled={membersToRemove.includes(member.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                }
                            </div>
                        </div>

                        <div>
                            <h3 className="text-center block text-slate-700 text-lg font-bold mb-2">
                                Miembros que no están en la categoría
                            </h3>
                            <div className="overflow-y-auto h-24 border mb-2 shadow appearance-none rounded">
                                {loading ? <Loading /> :
                                    <>
                                        <ul className="list-none text-center">
                                            {nonCategoryMembers.map((member: Member) => (
                                                <li key={member.id} className="flex items-center justify-between mb-1">
                                                    <span className={`ml-5 ${membersToAdd.includes(member.id) ? 'underline text-gray-400' : ''}`}>{member.name}</span>
                                                    <button
                                                        className={`text-slate-500 mr-5 text-base hover:underline ${membersToAdd.includes(member.id) ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        onClick={() => handleAdd(member.id)}
                                                        disabled={membersToAdd.includes(member.id)}
                                                    >
                                                        Añadir
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                Cancelar
                            </button>
                            <button onClick={handleSubmit} className="bg-slate-700 hover:bg-slate-800 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};
