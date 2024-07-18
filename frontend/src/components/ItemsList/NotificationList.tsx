import { FaEnvelope } from "react-icons/fa";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { WideStackNotification } from "../WideStackNotification";

interface Props {
    onGroupsUpdate: (value: boolean) => void;
}

export const NotificationsList = ({ onGroupsUpdate }: Props) => {
    const [loading, setLoading] = useState(true);
    const [invitations, setInvitations] = useState([]);
    const [paymentsPending, setPaymentsPending] = useState([]);
    const auth = useAuth();

    const fetchInvitations = async () => {
        if (auth.getToken()) {
            fetch(`https://magicsplitapi-production.up.railway.app/api/invitations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`,
                }
            })
                .then(response => response.json())
                .then(data => {
                    setInvitations(data.invitations);
                    setLoading(false);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    };

    const fetchPaymentsPending = async () => {
        if (auth.getToken()) {
            fetch(`https://magicsplitapi-production.up.railway.app/api/payments/pending`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`,
                }
            })
                .then(response => response.json())
                .then(data => {
                    setPaymentsPending(data.payments);
                    setLoading(false);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    };

    async function respondInvitation({ invitationId, userResponse }: { invitationId: number, userResponse: string }) {
        try {
          const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/invitation/response`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.getToken()}`,
            },
            body: JSON.stringify({
              invitation_id: invitationId,
              response: userResponse,
            }),
          });
          if (response.ok) {
            console.log("Respondido con éxito");
            fetchInvitations();
            if (userResponse === 'accepted') {
              onGroupsUpdate(true);
            }
          } 
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
        }
      }
      

      async function respondPaymentPending({ paymentId, userResponse }: { paymentId: number, userResponse: string }) {
        try{
          const response = await fetch(`https://magicsplitapi-production.up.railway.app/api/payment/response `, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.getToken()}`,
          },
          body: JSON.stringify({
              payment_id: paymentId,
              response: userResponse,
          }),
          })
          if (response.ok) {
            console.log("Respondido con exito");
            fetchPaymentsPending();
            if(userResponse === 'accepted') {
              onGroupsUpdate(true);
            }
          } 
        } catch (error){
          console.error("Error al realizar la solicitud:", error);}
      }  
    useEffect(() => {
        fetchInvitations();
        fetchPaymentsPending();
    }, []);

    return (
        <>
            <div className='flex relative text-3xl xl:text-2xl font-semibold mb-5 m-2'>
                <FaEnvelope className='mr-1' size={33} />
                Notificaciones
            </div>
            <div className='grid grid-cols-1 gap-0 p-0 overflow-scroll md:overflow-hidden lg:overflow-auto'>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        {(invitations && invitations.length > 0) || (paymentsPending && paymentsPending.length > 0) ? (
                            <div className='grid grid-cols-1 gap-0 p-0'>
                                {invitations && invitations.map((invitation: any) => (
                                    <WideStackNotification
                                        key={invitation.id}
                                        groupName={invitation.group.name}
                                        notificationId={invitation.id}
                                        respondNotification={(invitationId: number, userResponse: string) => respondInvitation({ invitationId, userResponse })}
                                        messageNotification="Te han invitado a unirte al grupo"
                                    />
                                ))}
                                {paymentsPending && paymentsPending.map((payment: any) => (
                                    <WideStackNotification
                                        key={payment.id}
                                        groupName={payment.group.name}
                                        notificationId={payment.id}
                                        respondNotification={(paymentId: number, userResponse: string) => respondPaymentPending({ paymentId, userResponse })}
                                        messageNotification={`${payment.payer_id} te ha invitado a confirmar el pago de $${payment.amount}`}
                                        
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className='text-lg text-slate-400 text-center'>No hay notificaciones.</p>
                        )}
                    </>
                )}
            </div>
            
        </>
    );
}
