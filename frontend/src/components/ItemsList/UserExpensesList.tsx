import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../Loading';
import { WideStackUserExpense } from '../WideStackUserExpense';
import { ReportsForm } from '../Forms/ReportsForm';
import { Filter } from '../Filter';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const UserExpensesList = () => {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [openReports, setOpenReports] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filtersVisible, setFiltersVisible] = useState(false);

    const [filterOptions, setFilterOptions] = useState({
        minAmount: '',
        maxAmount: '',
        startDate: null,
        endDate: null
    });

    const auth = useAuth();

    const fetchData = async () => {
        if (auth.getToken()) {
            fetch(`https://magicsplitapi-production.up.railway.app/api/record/expenses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`,
                }
            })
            .then(response => response.json())
            .then(data => {
                setExpenses(data.expenses);
                setCategories( [...new Set(data.expenses.map((expense: any) => ({label: expense.category_name, value: expense.category_name})))] );
                console.log(data.expenses);
                console.log(expenses);
                console.log(categories);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching expenses:', error));
        }
    };

    useEffect(() => {
        fetchData();
    }, [auth]);

    const handleFilterCategoryMembersToggle = () => {
        setFiltersVisible(!filtersVisible);
    };

    const [categories, setCategories] = useState<any[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<any>();

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilterOptions(prevOptions => ({
            ...prevOptions,
            [name]: value
        }));
    };

    const handleDateChange = (date: any, name: string) => {
        setFilterOptions(prevOptions => ({
            ...prevOptions,
            [name]: date ? new Date(date.setHours(0, 0, 0, 0)) : null
        }));
    };

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <div className='h-full flex flex-col overflow-hidden w-full'>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className='flex font-bold text-2xl
                    ml-3 justify-between items-end'>
                        Gastos
                    </div>
                    <div className="border-t border-slate-300 mx-2 my-3"></div>
                    <div className='flex flex-col justify-start'>
                        <button onClick={handleFilterCategoryMembersToggle} className='mx-4 text-end text-slate-500 font-semibold hover:text-slate-900 focus:outline-none'>
                                {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
                        </button>
                        {filtersVisible && (
                            <div className='flex flex-col border border-slate-300 mx-4 pt-2 pb-1 space-y-2'>
                                    <div className='flex items-center space-x-2 justify-end mr-1'>
                                        <p className='ml-2 text-slate-800 font-medium items-center'>Monto:</p>
                                        <input
                                            type="text"
                                            name="minAmount"
                                            placeholder="Monto Mín."
                                            value={filterOptions.minAmount}
                                            onChange={handleFilterChange}
                                            className="border bg-slate-200 rounded py-1 px-2 text-sm w-24"
                                        />
                                        <input
                                            type="text"
                                            name="maxAmount"
                                            placeholder="Monto Máx."
                                            value={filterOptions.maxAmount}
                                            onChange={handleFilterChange}
                                            className="border bg-slate-200 rounded py-1 px-2 text-sm w-24"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2  justify-end mr-1">
                                    <p className='ml-2 text-slate-800 font-medium items-center'>Fecha:</p>

                                        <div className="flex items-center">
                                            <DatePicker
                                                selected={filterOptions.startDate}
                                                onChange={(date) => handleDateChange(date, 'startDate')}
                                                name="startDate"
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Desde"
                                                className="border bg-slate-200 rounded py-1 px-2 text-sm w-24"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <DatePicker
                                                selected={filterOptions.endDate}
                                                onChange={(date) => handleDateChange(date, 'endDate')}
                                                name="endDate"
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Hasta"
                                                className="border bg-slate-200 rounded py-1 px-2 text-sm w-24"
                                            />
                                        </div>
                                    </div>

                                <div className='flex flex-row ml-2 mb-1 text-base font-medium space-x-4  justify-end mr-1'>
                                    <div className="ml-2">
                                        <Filter options={categories} onSelect={setSelectedCategory} defaultLabel='Todas las categorías' />
                                    </div>
                                </div>
                            </div>
                        )
                        }
                    </div>

                    {expenses.filter((expense: any) =>
                        (selectedCategory ? expense.category_name === selectedCategory.value : true) &&
                        (filterOptions.minAmount ? expense.amount >= parseFloat(filterOptions.minAmount) : true) &&
                        (filterOptions.maxAmount ? expense.amount <= parseFloat(filterOptions.maxAmount) : true) &&
                        (
                            !filterOptions.startDate || !filterOptions.endDate ||
                            (
                                formatDate(expense.created_at) >= formatDate(filterOptions.startDate) &&
                                formatDate(expense.created_at) <= formatDate(filterOptions.endDate)
                            )
                        )
                    ).length !== 0 ? (
                        <div className='grid grid-cols-1 gap-1 mx-4 overflow-auto'>
                            {expenses.filter((expense: any) =>
                                (selectedCategory ? expense.category_id === selectedCategory : true) &&
                                (filterOptions.minAmount ? expense.amount >= parseFloat(filterOptions.minAmount) : true) &&
                                (filterOptions.maxAmount ? expense.amount <= parseFloat(filterOptions.maxAmount) : true) &&
                                (
                                    !filterOptions.startDate || !filterOptions.endDate ||
                                    (
                                        formatDate(expense.created_at) >= formatDate(filterOptions.startDate) &&
                                        formatDate(expense.created_at) <= formatDate(filterOptions.endDate)
                                    )
                                )
                            ).map((record: any) => (
                                <WideStackUserExpense key={record.id}
                                    name={record.name}
                                    description={record.description}
                                    date={record.created_at}
                                    categoryName={record.category_name}
                                    amount={record.amount}
                                    groupName={record.group_name}
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
