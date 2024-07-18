import  { useState } from 'react'
import { ExpenseDeleteForm } from './Forms/ExpenseDeleteForm'
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from 'react-icons/md';
import { ExpenseEditForm } from './Forms/ExpenseEditForm';


function formatDate(dateString: string) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
  const day = String(date.getDate()).padStart(2, '0');

  // const hours = String(date.getHours()).padStart(2, '0');
  // const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
interface Props {
    name: string;
    description: string;
    date: string;
    category: string
    amount: string
    id: string
    group_id: string
    categories: any
  }
export const WideStackExpense = ({name, description,date,category,amount,id,group_id,categories}: Props) => {
  const [openFormDeleteExpense, setOpenFormDeleteExpense] = useState(false)
  const [openFormEditExpense, setOpenFormEditExpense] = useState(false)
  return (
    <>
    <div className = "relative w-full p-2 mt-1 bg-slate-200 dark:bg-slate-200">
      <div className='flex flex-row justify-between'>
        <div>
          <h3 className="mb-0 text-xl font-medium tracking-tight text-slate-900 dark:text-slate-900">{name}</h3>
        </div>
        <div>
          <button onClick={() => setOpenFormEditExpense(true)} className="mr-2  bg-slate-400 text-slate-800 hover:text-slate-200 px-2 py-1 border rounded-lg hover:bg-slate-600" title='Editar'>
          <MdModeEdit  size={18}/>
          </button>
          <button onClick={() => setOpenFormDeleteExpense(true)} className="text-slate-800 hover:text-slate-200 bg-slate-400 px-2 py-1 border rounded-lg hover:bg-slate-600" title='Borrar'>
            <FaTrashAlt  size={18}/>
          </button>
        </div>
      </div>
      
      {!description && <p className='h-6 mt-0 font-normal text-slate-500 dark:text-slate-500'>{description}</p>}
      
      {description && <p className='mt-0 font-normal text-slate-500 dark:text-slate-500'>{description}</p>}
      <p className='mt-0 font-normal text-slate-700 dark:text-slate-700'>Categoría: {category}</p>

      <div className='flex flex-row justify-between'>
      <p className='mt-0 font-normal text-slate-500 dark:text-slate-500'>{formatDate(date)}</p>
      <p className="text-lg flex absolute bottom-1 right-2 font-medium text-slate-700 dark:text-slate-700">{`Total: $ ${Number(amount).toLocaleString('de-DE')}`}</p>
      </div>
    </div>
    {openFormDeleteExpense && <ExpenseDeleteForm setOpenForm={setOpenFormDeleteExpense} id={id} group_id={group_id} />}
    {openFormEditExpense && <ExpenseEditForm setOpenForm={setOpenFormEditExpense} id={id} group_id={group_id} categories={categories}/>}

    </>
  )
}
