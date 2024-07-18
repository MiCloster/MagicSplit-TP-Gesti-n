import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../Loading';
import { WideStackUserPayment } from '../WideStackUserPayment';
import { ReportsForm } from '../Forms/ReportsForm';
import { Filter } from '../Filter';

export const UserPaymentsList = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [openReports, setOpenReports] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const status = [
        {  id: 'accepted', name: 'Aceptado'},
        { id: 'rejected' , name: 'Rechazado'},
        { id: 'pending' , name: 'Pendiente' },
      ];
    
    const auth = useAuth();

    const fetchData = async () => {
        if (auth.getToken()) {
            fetch(`https://magicsplitapi-production.up.railway.app/api/record/payments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`,
                }
            })
            .then(response => response.json())
            .then(data => {
                setPayments(data.payments);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching payments:', error));
        }
    };

    useEffect(() => {
        fetchData();
    }, [auth]);

    const handleFilterCategoryMembersToggle = () => {
        setFiltersVisible(!filtersVisible);
    };


    return (
        <div className='h-full flex flex-col overflow-hidden w-full'>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className='flex font-bold text-2xl
                    ml-3 justify-between items-end'>
                        Pagos
                    </div>
                    <div className="border-t border-slate-300 mx-2 my-3"></div>
                    <div className='flex flex-col justify-start'>
                        <button onClick={handleFilterCategoryMembersToggle} className='mx-4 text-end text-slate-500 font-semibold hover:text-slate-900 focus:outline-none'>
                                {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
                        </button>
                        {filtersVisible && (
                            <div className='flex flex-row ml-2 mb-1 text-base font-medium space-x-4'>
                            <div className="ml-2">
                                <Filter options={status} onSelect={setSelectedStatus} defaultLabel='Todos' />
                            </div>
                        </div>
                        )
                        }
                    </div>

                    {payments.filter((payment: any) =>
                        (selectedStatus ? payment.status === selectedStatus: true) 
                    ).length !== 0 ? (
                        <div className='grid grid-cols-1 gap-1 mx-4 overflow-auto'>
                            {payments.filter((payment: any) =>
                                 (selectedStatus ? payment.status === selectedStatus: true) 
                            ).map((record: any) => (
                                <WideStackUserPayment key={record.id}
                                    payerName={record.payer_name}
                                    recipientName={record.recipient_name}
                                    date={record.created_at}
                                    amount={record.amount}
                                    groupName={record.group_name}
                                    status={record.status}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='text-lg text-slate-400 text-center mt-3'>No se encontraron gastos.</div>
                    )}

                </>
            )}
            {openReports && <ReportsForm setOpenForm={setOpenReports} />}
        </div>
    );
};
