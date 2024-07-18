import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthProvider';
import Loading from '../Loading';
import { Note } from '../Note';
import { FaPlus } from 'react-icons/fa';
import { MdStickyNote2 } from "react-icons/md";
import { NoteAddForm } from '../Forms/NoteAddForm';

export const NotesList = ({ id }: any) => {
    const [openAddNote, setOpenAddNote] = useState(false);
    const auth = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchData = () => {
      if (auth.getToken()) {
        fetch(`https://magicsplitapi-production.up.railway.app/api/group/${id}/notes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.getToken()}`,
          }
        })
        .then(notesRes => notesRes.json())
        .then(notesData => {
          setNotes(notesData.notes);
          setLoading(false);
        })
        .catch(error => console.error('Error fetching notes data:', error));
      }
    };
    

    useEffect(() => {
        fetchData();
    }, [auth, id]);

    const handleNewNote = () => {
      fetchData();
  };
    return (
      <>
        <div className='flex justify-between items-center ml-2 xl:ml-0 mt-2 mb-5'>
          <div className='flex relative text-3xl lg:text-2xl font-semibold'>
          <MdStickyNote2 className='mr-1' size={33}/>
            Notas
          </div>
          <button onClick={() => setOpenAddNote(true)} className="text-lg bg-slate-800 py-2 px-5 lg:px-2 lg:py-1 rounded-full hover:bg-slate-600 text-slate-100 font-medium focus:outline-none">
            + Añadir
          </button>
        </div>
        <div className='grid grid-cols-1 gap-0 p-0 overflow-auto'>
          {loading ? (
            <Loading />
          ) : (
            <>
              {notes && notes.length > 0 ? (
                <div className='grid grid-cols-1 gap-0 p-0'>
                    {notes.map((note: any) => (
                    <Note key={note.id}
                    noteId={note.id}
                    content = {note.content}
                    groupId = {id}
                    fetchOnChange={fetchData}>
                    </Note>
                    ))}
                </div>
                ) : (
                <p className='text-lg text-slate-400 text-center'>No hay notas.</p>
                )}
            </>
          )}
        </div>
        {false &&
        <button
          onClick={() => setOpenAddNote(true)}
          className="absolute bottom-5 right-5 m-3 flex items-center justify-center h-10 w-10 xl:w-14 xl:h-14 bg-slate-700 rounded-full shadow-md transition-all duration-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-400 z-10"
        >
          <FaPlus size={14} color='white'/>
        </button>
        }
        {openAddNote &&  <NoteAddForm setOpenForm={setOpenAddNote} id={id} onNewNote={handleNewNote} />}
      </>
    );
  };
  