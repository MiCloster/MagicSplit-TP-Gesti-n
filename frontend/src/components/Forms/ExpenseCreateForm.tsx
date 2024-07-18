import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ModalSuccess } from "../ModalSuccess";
import Select from 'react-select'
import { CheckBox } from "../CheckBox";

interface Props {
    setOpenForm: (value: boolean) => void
    categories: any
    id: string
    members: any
    onNewExpense?: () => void
}

export const ExpenseCreateForm = ({setOpenForm, categories, id, onNewExpense, members}: Props) => {
  const splitOptions = [
    { value: 'equal', label: 'Todas partes por iguales' },
    { value: 'exact', label: 'Montos exactos definidos' },
  ];

  const [nameExpense, setNameExpense] = useState('');
  const [descriptionExpense, setDescriptionExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [errorResponse, setErrorResponse] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [splitType, setSplitType] = useState(splitOptions[0].value);
  const [categoryMembers, setCategoryMembers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [exactAmounts, setExactAmounts] = useState<Record<string, number>>({});

  const auth = useAuth();
  function closeForm() {
    setOpenForm(false);
  }

  function handleCloseAll() {
    setShowSuccessModal(false);
    closeForm();
  }
  
 

  useEffect(() => {
    const initialExactAmounts: Record<string, number> = {};
    members.forEach((member: any) => {
      initialExactAmounts[member.id] = 0;
    });
    setExactAmounts(initialExactAmounts);
  }, []);

  async function getCategoryMembers(categoryId: number) {
    if(auth.getToken()) {
      fetch(`https://magicsplitapi-production.up.railway.app/api/category/${categoryId}/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.getToken()}`,
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((res) => {
      setCategoryMembers(res.members);
      setSelectedMembers(res.members.map((member: any) => member.id));
    })
    }
  } 

  async function addExpense() {
    try{
      const filteredExactAmounts: Record<string, number> = {};
      if (splitType === 'exact') {
      categoryMembers.forEach((member: any) => {
          if (exactAmounts[member.id] !== 0) {
            filteredExactAmounts[member.id] = exactAmounts[member.id];
          }
        });
      }
      
      const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          group_id: id,
          category_id: selectedCategory,
          amount: amount,
          description: descriptionExpense,
          name: nameExpense,
          split_type: splitType,
          exact_amounts: filteredExactAmounts,
        }),
        })
        if (response.ok) {
          console.log("Gasto añadido con exito");
          setErrorResponse('');
          setShowSuccessModal(true);
          onNewExpense && onNewExpense();
        } else {
          const json = await response.json();
          setErrorResponse(json.message);
          return;
    }

    } catch (error){
      console.error("Error al realizar la solicitud:", error);}
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addExpense();
    auth.handleUpdateUserBalance();
  }

const handleCheckboxChange = (memberId: number) => {
  if (memberId === -1) {
    if (selectAll) {
      // Desmarcar todos
      setSelectAll(false);
      setSelectedMembers([]);
    } else {
      // Marcar todos
      setSelectAll(true);
      setSelectedMembers(categoryMembers.map((member: any) => member.id));
    }
    } else {
      setSelectedMembers(prevSelected => {
        const newSelectedMembers = prevSelected.includes(memberId)
          ? prevSelected.filter(id => id !== memberId)
          : [...prevSelected, memberId];
        if (categoryMembers.length === newSelectedMembers.length) {
          setSelectAll(true);
        } else {
          setSelectAll(false);
        }
        return newSelectedMembers;
      });
    }
};

function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, memberId: string) {
  const value = Number(event.target.value);
  setExactAmounts({ ...exactAmounts, [memberId]: value });
}

const availableCategories = [
  ...categories.map((category: any) => ({ category_id: category.id, value: category.name, label: category.name, members: category.members}))
];
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
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg w-full sm:w-3/4 md:w-1/2 p-3 sm:p-5">
            <h1 className="text-2xl font-bold mb-4">Crear gasto</h1>
            
            <div className='flex flex-col sm:flex-row justify-between'>
              
              <div className="w-full sm:w-1/2 mb-4 sm:mr-2">
                <label htmlFor="name" className="text-start w-full block text-gray-700 text-lg font-bold mb-1">
                  Nombre
                </label>
                <input type="text" id="nameExpense" value={nameExpense} onChange={(e) => setNameExpense(e.target.value)} className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-start block mb-2" placeholder="Carne / Gaseosas" required/>
                <label className="text-start block text-slate-700 text-lg font-bold mb-1" htmlFor="category">
                  Categoría
                </label>
                <Select 
                  styles={customStyles}
                  className="basic-single w-full block text-slate-700 font-normal text-base text-start mb-2"
                  isSearchable={false}
                  options={availableCategories}
                  onChange={(option) => {
                    setSelectedCategory(option?.category_id);
                    getCategoryMembers(option?.category_id);
                  }}
                  placeholder="Seleccione una categoría"
                  required
                />
                <label className="text-start block text-slate-700 text-lg font-bold mb-1" htmlFor="amount">
                  Monto
                </label>
                <input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full h-10 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-[#A4A6A9] text-start block mb-2" id="amount" placeholder="50000" required/>
                <label htmlFor="name" className="text-start w-full block text-gray-700 text-lg font-bold mb-1">
                  Descripción
                </label>
                <textarea id="descriptionExpense" value={descriptionExpense} onChange={(e) => setDescriptionExpense(e.target.value)} className="shadow appearance-none border rounded w-full h-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-start block mb-2" placeholder={`Asado 3 kg${'\n'}Matambre 1 kg${'\n'}3 Gaseosas 1.5 lts`}/>
              </div>
  
              <div className="w-full sm:w-1/2">
                <label htmlFor="splitType" className="text-start block text-gray-700 text-lg font-bold mb-1">Forma de División</label>
                <Select 
                    styles={customStyles}
                    className="basic-single flex text-slate-700 font-normal text-base text-start h-10 mb-2"
                    isSearchable={false}
                    options={splitOptions}
                    onChange={
                      (option) => {
                        setSplitType(option?.value || '');
                      }
                    }
                    defaultValue={splitOptions[0]}
                  />
  
                <label htmlFor="memberCategory" className="text-start block text-gray-700 text-lg font-bold mb-1">
                  Miembros involucrados
                </label>
                <div className="overflow-y-auto h-72 border mb-2 shadow appearance-none rounded">
                  {categoryMembers && selectedCategory
                  && (splitType === 'equal') 
                  && <div>
                    <div className="flex">
                      <CheckBox
                        id={-1}
                        name={'Todos'}
                        handleCheckboxChange={handleCheckboxChange}
                        checked={selectAll} />
                    </div>
                    {categoryMembers.map((member: any) => (
                      <CheckBox
                        key={member.id}
                        id={member.id}
                        name={member.name}
                        handleCheckboxChange={handleCheckboxChange}
                        checked={selectedMembers.includes(member.id)} />
                    ))}
                    <div/>
                  </div>}
                  {categoryMembers && selectedCategory
                  && (splitType === 'exact') 
                  && <div className="flex-col">
                    {categoryMembers.map((member: any) => (
                      <div className="flex justify-between mb-2">
                        <div className='p-4 text-gray-700 overflow-hidden'>{member.name}</div>
                        <input
                          className="w-3/5 h-10 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-[#A4A6A9] text-start block m-2"
                          key={member.id}
                          id={member.id}
                          name={member.name} 
                          onChange={(e) => handleInputChange(e, member.id)}
                          value={exactAmounts[member.id]}
                        />
                      </div>
                    ))}
                    <div/>
                  </div>}
                </div>
              </div>
            </div>
            {!!errorResponse && 
              <div className='flex justify-center mb-1 bg-red-100 rounded-md'>
                <p className="text-red-500 text-center">{errorResponse}</p>
              </div>}
            <div className="flex items-center justify-end mt-4">
              <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Cerrar
              </button> 
              <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Añadir
              </button>
            </div>
          </form>
        </div>
      </div>
  
      {showSuccessModal && 
      <ModalSuccess title="¡Creado con éxito!" description="Se ha agregado con éxito" route={`/grupo/${id}`} button="Volver" onClose={handleCloseAll}/>
      }
    </div>
  )
  
}
