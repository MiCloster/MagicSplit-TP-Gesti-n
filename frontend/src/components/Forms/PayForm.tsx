import React, { useEffect, useState } from 'react';
import { ModalSuccess } from '../ModalSuccess';
import Select from 'react-select';
import { useAuth } from '../../auth/AuthProvider';

export const PayForm = ({ id, setOpenForm, onBalancesUpdate, members }: any) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const auth = useAuth();

    const handleMemberSelect = (selectedOption: any) => {
        setSelectedMember(selectedOption);
    };

    function closeForm() {
        setOpenForm(false);
    }
    function handleCloseAll() {
        setShowSuccessModal(false);
        closeForm();
    }    

    useEffect(() => {
        const filterMembers = members.filter((member: any) => member.pivot.balance > 0 && member.email !== auth.getUserEmail());
        setFilteredMembers(filterMembers);
    }, [id, auth]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.getToken()}`,
            },
            body: JSON.stringify({
                amount: amount,
                payer_id: auth.getUserId(),
                recipient_id: (selectedMember as any).value})
        })
        .then(response => {
            if (response.ok) {
                onBalancesUpdate();
                setShowSuccessModal(true);
            }
            
        })
        .catch(error => {
            console.error(error);
        });
        auth.handleUpdateUserBalance();
    }

    const customStyles = {
        control: (provided: any, state: any) => ({
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
                borderColor: state.isFocused ? '#A4A6A9' : '#e2e8f0', 
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
        <>
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center  sm:p-0">
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg xl:w-1/4 p-10 ">
                            <h2 className="text-2xl text-gray-700 font-bold mb-6 text-center">Pagar deuda</h2>


                            <div className="flex flex-col">
                                <div className="mb-4">
                                    <label htmlFor="memberToPay" className="text-start block text-gray-700 text-lg font-bold mb-1">Integrante a pagar</label>
                                    <Select
                                        className="w-full"
                                        styles={customStyles}
                                        options={filteredMembers.map((member: any) => ({
                                            value: member.id,
                                            label: `${member.name} - Balance: ${member.pivot.balance}`
                                        }))}
                                        onChange={handleMemberSelect}
                                        value={selectedMember}
                                        placeholder="Seleccionar miembro..."
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-start block text-slate-700 text-lg font-bold mb-1" htmlFor="amount">
                                        Monto
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-10 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-[#A4A6A9] text-start block mb-2"
                                        id="amount"
                                        placeholder="50000"
                                        required
                                    />
                                </div>
                            </div>


                            <div className="flex items-center justify-end">
                                <button onClick={closeForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-center font-semibold mr-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                    Cerrar
                                </button>
                                <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white text-center font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Pagar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {showSuccessModal &&
                    <ModalSuccess title="Pagado con éxito!" description="La deuda ha sido creado con éxito" route={`/grupo/${id}`} button="Ir a grupos" onClose={handleCloseAll} />
                }
            </div>

        </>
    )
}
