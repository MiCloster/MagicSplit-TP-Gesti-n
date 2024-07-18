import { Link } from 'react-router-dom';

interface Props {
    name: string;
    balance: string;
    description: string
    id: string
  }

function formatBalance(balance: number) {
  if (balance === 0) return 'Estás al día';
  return balance < 0 
    ? `Debe $ ${Math.abs(balance).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
    : `Le deben $ ${balance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const Card = ({name,balance,description,id}: Props) => {
  return (
    <Link to={`/grupo/${id}`} className="block p-5 pb-12 bg-slate-700 rounded-3xl shadow hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 relative">
        <h3 className="mb-2 text-3xl max-h-[72px] font-bold tracking-tight text-slate-100 dark:text-white overflow-hidden text-ellipsis">{name}</h3>
        <p className='mt-2 font-normal text-slate-100 dark:text-slate-100 overflow-clip h-12'>{description}</p>
        <p className="text-xl absolute bottom-3 right-5 flex justify-end mt-2 font-normal text-slate-100 dark:text-slate-100">{formatBalance(Number(balance))}</p>
    </Link>
  )
}
