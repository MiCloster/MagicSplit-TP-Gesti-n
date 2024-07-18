import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ModalSuccess } from "../ModalSuccess";
import Select from 'react-select'

interface Props {
    setOpenForm: (value: boolean) => void
    id: string
    group_id: string
    categories: any
}

export const ExpenseEditForm = ({setOpenForm, id, group_id, categories}: Props) => {
  const [errorResponse,setErrorResponse] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [nameExpense, setNameExpense] = useState('');
  const [descriptionExpense, setDescriptionExpense] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const auth = useAuth();
  function closeForm() {
    setOpenForm(false);
  }

  function handleCloseAll() {
    setShowSuccessModal(false);
    closeForm();
  }

  async function editExpense() {
    try{
      const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/expense/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`,
      },
      body: JSON.stringify({
        ...(nameExpense ? { name: nameExpense } : {}),
        ...(descriptionExpense ? { description: descriptionExpense } : {}),
        ...(selectedCategory ? { category_id: selectedCategory } : {}),
      }),
      })
      if (response.ok) {
        console.log("Gasto editado con exito");
        setErrorResponse('');
        setShowSuccessModal(true);
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
    editExpense();
}

const availableCategories = [
  ...categories.map((category: any) => ({ category_id: category.id, value: category.name, label: category.name }))
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


  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center  sm:p-0">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg xl:w-1/5 p-5 ">
        <h1 className="text-2xl font-bold mb-4">Editar gasto</h1>  

          <div className="mb-4">
            <label className="text-start block text-slate-700 text-lg font-bold mb-1" htmlFor="description">
              Nombre
            </label>
            <input value={nameExpense} onChange={(e) => setNameExpense(e.target.value)} type="text" id="nameExpense" className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Snacks / Dulces" />
          </div>
          <div className='text-lg font-medium'>
            <label className="text-start block text-slate-700 text-lg font-bold mb-1" htmlFor="category">
              Categoría
            </label>
            <Select 
              styles={customStyles}
              className="basic-single flex text-slate-700 font-normal text-base text-start mb-3"
              isSearchable={false}
              options={availableCategories}
              onChange={(option) => setSelectedCategory(option?.category_id)}
              placeholder="Seleccione una categoría"
            />
          </div>
          <div className="mb-4">
            <label className="text-start block text-slate-700 text-lg font-bold mb-1" htmlFor="description">
              Descripción
            </label>
            <textarea value={descriptionExpense} onChange={(e) => setDescriptionExpense(e.target.value)} id="descriptionExpense" className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Oreos, Doritos, Rex" />
          </div>     
          {/*<div className="mb-4">
            <label className="text-start block text-slate-700 text-lg font-bold mb-2" htmlFor="description">
              Monto
            </label>
            <input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="2000" />
          </div>*/}
          {!!errorResponse && 
                <div className='flex justify-center mb-1 bg-red-100 rounded-md'>
                    <p className="text-red-500 text-center">{errorResponse}</p>
                </div>}  
          <div className="flex mt-4 items-center justify-end">
          <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-bold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Cancelar
          </button> 
          <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Guardar
          </button>
          </div>
        </form>
        </div>
      </div>

      {showSuccessModal && 
      <ModalSuccess title="Editado con éxito" description="Se ha editado el gasto con éxito" route={`/grupo/${group_id}`} button="Volver" onClose={handleCloseAll}/>
      }
    </div>
  )
}
