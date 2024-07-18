import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../../components/Loading';
import { MembersList } from '../../components/ItemsList/MembersList';
import { NotesList } from '../../components/ItemsList/NotesList';
import { ExpensesList } from '../../components/ItemsList/ExpensesList';
import { GroupEditForm } from '../../components/Forms/GroupEditForm';
import { PayForm } from '../../components/Forms/PayForm';
import { GroupLeaveForm } from '../../components/Forms/GroupLeaveForm';
import { IoMdExit } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { FaMoneyBillTransfer } from 'react-icons/fa6';

interface Grupo {
	id: number;
	name: string;
}

export const Grupo = () => {

	const {id} = useParams()  
	const auth = useAuth();

	const [group, setGroup] = useState<Grupo | null>(null);

	const [loading, setLoading] = useState(true);

	const [categories, setCategories] = useState<any[]>([]);

	const [admin, setAdmin] = useState<any[]>([]);

	const [balances, setBalances] = useState<any[]>([]);

	const [members,setMembers] = useState<any[]>([]);

	const [openLeaveForm, setOpenLeaveForm] = useState(false);
	const [openEditForm, setOpenEditForm] = useState(false);
	const [openPayForm, setOpenPayForm] = useState(false);

	const fetchDataMembersBalances = () => {
		if(auth.getToken()) {
			fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/balances`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${auth.getToken()}`,
				}
			})
			.then(response => response.json())
			.then(data => {
				setBalances(data.balances);
				setLoading(false);
			})
			.catch(error => console.error('Error fetching data:', error));
		}
	};

	const fetchDataAdmins = async () => {
		if (auth.getToken()) {
			try {
				const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/admins`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${auth.getToken()}`,
					}
				});
				const data = await response.json();
				setAdmin(data.admins);
				return data.admins; // Retorna los administradores
			} catch (error) {
				console.error('Error fetching data:', error);
				throw error; // Lanza el error para que pueda ser manejado por el llamador
			}
		}
	};

	const fetchDataMembers = () => {
		if (auth.getToken()) {
		  fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/members`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization': `Bearer ${auth.getToken()}`,
			}
		  })
		  .then(membersRes => membersRes.json())
		  .then(membersData => {
			setMembers(membersData.members);
			setLoading(false);
		  })
		  .catch(error => console.error('Error fetching members data:', error));
		}
	  };
	
	const fetchData = () => {
		if(auth.getToken()) {
			Promise.all([
				fetch(`https://magicsplitapi-production.up.railway.app/api/user/groups`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${auth.getToken()}`,
					}
				}),
				fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/categories`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${auth.getToken()}`,
						}
					}),
				fetchDataMembers(),
				fetchDataMembersBalances(),
				fetchDataAdmins(),
				
			])
			.then(([groupsRes, categoriesRes]) => Promise.all([groupsRes.json(), categoriesRes.json()]))
			.then(([groupsData, categoriesData]) => {
				//@ts-ignore
				const grupoEncontrado = groupsData.data.find((grupo: Grupo) => grupo.id === parseInt(id));
				setGroup(grupoEncontrado);
				setCategories(categoriesData.categories);
				setLoading(false);
			})
			.catch(error => console.error('Error fetching data:', error));
		}
	};	
	
	useEffect(() => {
		fetchData();
	}, [auth, id]);
	

	const handleNewModification = () => {
		fetchData();
	};
 
	const handleModificationBalance = () => {
		fetchDataMembersBalances();
	};

	return (
		<div className=' w-full flex flex-col'>
			
			{loading ? <Loading /> :
				<>
					<div className='flex flex-col lg:flex-row min-h-screen h-full w-full p-3'>
						{/* primer contenedor con nombre del grupo, linea y lista de gastos*/}
						<div className='xl:w-3/4 lg:w-2/3 w-full flex flex-col bg-white border rounded-3xl lg:ml-0 lg:mr-2 lg:mb-0 mb-2 p-5 relative'>
							<div className='flex justify-between items-start'>
								<div className='text-4xl text-slate-900 mx-4 m-3 font-bold'>
									{group && <div>{group.name}</div>}
								</div>
								<div className="flex space-x-2 m-3">
									<button title="Salir del grupo" onClick={() => setOpenLeaveForm(true)} className="h-10 font-bold px-2 py-1 text-slate-900 hover:bg-slate-200 rounded-xl">
										<IoMdExit size={30} />
									</button>
									<button title="Editar grupo" onClick={() => setOpenEditForm(true)} className="h-10 px-2 py-1 text-slate-900 hover:bg-slate-200 rounded-xl">
										<FaRegEdit size={30} />
									</button>
									<button title="Pagar deudas" onClick={() => setOpenPayForm(true)} className="h-10 text-lg text-slate-900 px-2 py-1 hover:bg-slate-200 rounded-xl"
										disabled={balances.find(b => b.user_id === auth.getUserId())?.balance >= 0}>
										<FaMoneyBillTransfer size={30} />
									</button>
								</div>
							</div>

							<ExpensesList id={id}  categories={categories} updateBalances={handleModificationBalance} members={members}></ExpensesList>
						</div>

						{/* segundo contenedor con miembros y lista de miembros*/}
						<div className='xl:w-1/4 lg:w-1/3 w-full flex flex-col lg:mr-2'>
							<div className='w-full h-full flex flex-col bg-white border rounded-3xl p-5 overflow-hidden relative'>
								<MembersList id={id} admins={admin} balances={balances} fetchDataAdmins={fetchDataAdmins} members={members} fetchDataMembers={fetchDataMembers} />
							</div>
							<div className='mt-2 w-full h-full flex flex-col bg-white border rounded-3xl p-5 overflow-hidden relative'>
								<NotesList id={id}/>
							</div>
						</div>
						
					</div>
					{openLeaveForm && <GroupLeaveForm setOpenForm={setOpenLeaveForm} groupId={id} />}
					{openEditForm && <GroupEditForm name={group &&group.name} members={members} setOpenForm={setOpenEditForm} existingCategories={categories} id={id} onNewModification={handleNewModification} admins={admin} />}
					{openPayForm && <PayForm members={members} setOpenForm={setOpenPayForm} onBalancesUpdate={handleModificationBalance} id={id} />}
				</>
			}
		</div>
	)
	
	
}