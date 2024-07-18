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
    categoryName: string
    amount: string
    groupName: string
  }
export const WideStackUserExpense = ({name, description,date,categoryName,amount,groupName}: Props) => {
  return (
    <>
    <div className = "relative w-full p-2 mt-1 bg-slate-200 dark:bg-slate-200">
      <div className='flex flex-row justify-between'>
        <div>
          <h3 className="mb-0 text-normal font-medium tracking-tight text-slate-700 dark:text-slate-700">{groupName}</h3>
          <h3 className="mb-0 text-xl font-medium tracking-tight text-slate-900 dark:text-slate-900">{name}</h3>
        </div>
      </div>
      
      {!description && <p className='h-6 mt-0 font-normal text-slate-500 dark:text-slate-500'>{description}</p>}
      
      {description && <p className='mt-0 font-normal text-slate-500 dark:text-slate-500'>{description}</p>}
      <p className='mt-0 font-normal text-slate-700 dark:text-slate-700'>Categoría: {categoryName}</p>

      <div className='flex flex-row justify-between'>
      <p className='mt-0 font-normal text-slate-500 dark:text-slate-500'>{formatDate(date)}</p>
      <p className="text-lg flex absolute bottom-1 right-2 font-medium text-slate-700 dark:text-slate-700">{`Total: $ ${Number(amount).toLocaleString('de-DE')}`}</p>
      </div>
    </div>
    </>
  )
}
