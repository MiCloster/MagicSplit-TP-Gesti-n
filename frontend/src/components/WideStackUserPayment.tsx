function formatDate(dateString: string) {
	const date = new Date(dateString);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); 
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}
interface Props {
		date: string;
		amount: string
		groupName: string
		payerName: string
		recipientName: string
		status: string;
	}
export const WideStackUserPayment = ({payerName, recipientName,  date, amount, groupName, status}: Props) => {
	return (
		<>
		<div className = "relative w-full p-2 mt-1 bg-slate-200 dark:bg-slate-200">
			<div className='flex flex-row justify-between'>
				<h3 className="mb-0 text-normal font-medium tracking-tight text-slate-700 dark:text-slate-700">{groupName}</h3>
				{status === 'accepted' && <h3 className="mb-0 text-normal font-medium tracking-tight text-slate-700 dark:text-slate-700">Aceptado</h3>}
				{status === 'rejected' && <h3 className="mb-0 text-normal font-medium tracking-tight text-slate-700 dark:text-slate-700">Rechazado</h3>}
				{status === 'pending' && <h3 className="mb-0 text-normal font-medium tracking-tight text-slate-700 dark:text-slate-700">Pendiente</h3>}

			</div>
		
			<p className='mt-0 font-normal text-slate-900 dark:text-slate-900'>{payerName} pagó a {recipientName}</p>

			<div className='flex flex-row justify-between'>
			<p className='mt-0 font-normal text-slate-500 dark:text-slate-500'>{formatDate(date)}</p>
			<p className="text-lg flex absolute bottom-1 right-2 font-medium text-slate-700 dark:text-slate-700">{`Total: $ ${Number(amount).toLocaleString('de-DE')}`}</p>
			</div>
		</div>
		</>
	)
}
