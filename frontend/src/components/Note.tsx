import React, { useState } from 'react'
import { NoteDeleteForm } from './Forms/NoteDeleteForm';
import { NoteEditForm } from './Forms/NoteEditForm';
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

interface Props {
  content: string;
  noteId: number;
  groupId: string;
  fetchOnChange: () => void;
  }

export const Note = ({noteId, content, groupId, fetchOnChange}: Props) => {

  const [openFormEditNote, setOpenFormEditNote] = useState(false)
  const [openFormDeleteNote, setOpenFormDeleteNote] = useState(false)

  return (
    <>
    <div className = "relative w-full p-2 my-1 bg-amber-100">
      <div className='flex flex-row justify-between items-start'>
        <div>
        <h3 className="text-lg font-normal tracking-tight text-slate-700 dark:text-slate-900 p-2">
          {content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </h3>
        </div>
        <div className="flex flex-row p-2">
          <button onClick={() => setOpenFormEditNote(true)} className="mr-2  text-slate-800 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-amber-600" title='editar'>
          <MdEdit  size={18}/>
          </button>
          <button onClick={() => setOpenFormDeleteNote(true)} className="text-slate-800 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-amber-600" title='eliminar'>
            <FaTrashAlt  size={18}/>
          </button>
        </div>
      </div>

      <div className='flex flex-row justify-between'>
      </div>
    </div>
    {openFormEditNote && <NoteEditForm setOpenForm={setOpenFormEditNote} noteId={noteId} previousContent={content} groupId={groupId} fetchOnChange={fetchOnChange}/>}
    {openFormDeleteNote && <NoteDeleteForm setOpenForm={setOpenFormDeleteNote} noteId={noteId} groupId={groupId} fetchOnChange={fetchOnChange}/>}

    </>
  )
}
