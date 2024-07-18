import { useEffect, useState } from 'react';
import { CheckBox } from './CheckBox'
import { AiOutlineEdit } from 'react-icons/ai';
import { CategoryEditForm } from './Forms/CategoryEditForm';


export const CategoriesEditor = ({existingCategories, categoriesList, setCategoriesList, setErrorResponse, errorResponse,members}:any) => {
    const [category, setCategory] = useState('');
    const [selectAll, setSelectAll] = useState(true);
    const [allMembersId, setAllMembersId] = useState(members.map((member: any) => member.id));
    const [openEditCategory, setOpenEditCategory] = useState(false);
    const [categorySelectedToEdit, setCategorySelectedToEdit] = useState({id:0});

    useEffect(() => {
      setAllMembersId(members.map((member: any) => member.id));
    },[])

    function addCategoryToList() {
        if (category.trim() !== '') {
          if (existingCategories.map((cat: any) => cat.name).includes(category.trim())
            || categoriesList.some((cat: any) => cat.name === category.trim())) {
            setErrorResponse('Categoría ya existente');
            return;
          }
        
        setErrorResponse('');
        
        const newCategory = {
          name: category.trim(),
          members: allMembersId.slice() // Copia de los miembros seleccionados
        };
    
        setCategoriesList([...categoriesList, newCategory]);
        setCategory(''); 
        setAllMembersId(members.map((member: any) => member.id));
        setSelectAll(true);
      }
    }
    
    const handleCheckboxChange = (memberId: number) => {
        if (memberId === -1) {
          if (selectAll) {
            // Desmarcar todos
            setSelectAll(false);
            setAllMembersId([]);
          } else {
            // Marcar todos
            setSelectAll(true);
            setAllMembersId(members.map((member:any) => member.id));
          }
          } else {
            //@ts-ignore
            setAllMembersId(prevSelected => {
              const newSelectedMembers = prevSelected.includes(memberId)
                ? prevSelected.filter((id:any) => id !== memberId)
                : [...prevSelected, memberId];
              if (members.length === newSelectedMembers.length) {
                setSelectAll(true);
              } else {
                setSelectAll(false);
              }
              return newSelectedMembers;
            });
          }
      };

    return (
    <div>
                {existingCategories && <div className='flex flex-wrap max-h-20 mb-2 overflow-auto'>
                  {existingCategories.map((existingCategory: any) => (
                    <div className="border p-1 mr-1 mb-1 rounded-md bg-slate-300 flex flex-row" key={existingCategory.id}>
                      {existingCategory.name}
                      <button onClick={() =>{ setOpenEditCategory(true), setCategorySelectedToEdit(existingCategory)}} className='ml-1'><AiOutlineEdit size={15}/></button>
                      </div>
                  ))}
                </div>}
                {categoriesList && <div className='flex flex-wrap max-h-20 overflow-auto'>
                  {categoriesList.map((newCategory: any) => (
                    <div className="border p-1 mr-1 mb-1 rounded-md bg-slate-100" key={newCategory.name}>{newCategory.name}</div>
                  ))}
                </div>}

                {!!errorResponse && 
                <div className='flex justify-center mb-1 bg-red-100 rounded-md'>
                    <p className="text-red-500 text-center">{errorResponse}</p>
                </div>}
                <label htmlFor="existingCategories" className="text-start block text-gray-700 text-md font-bold mb-2">
                  Nombre de la nueva categoría:
                </label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 shadow appearance-none border rounded w-11/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-start block mb-2" id="existingCategories" placeholder="Ej: Supermercado"/>
                <label htmlFor="memberCategory" className="text-start block text-gray-700 text-md font-bold mb-2">
                  Quienes pertenecen a esta categoría:
                </label>
                <div className="overflow-y-auto h-40 border mb-2 shadow appearance-none rounded">
                  <div className="flex">
                      <CheckBox
                              id={-1}
                              name={'Todos'}
                              handleCheckboxChange={handleCheckboxChange}
                              checked={selectAll} />
                    </div>
                    {members.map((member:any) => (
                          <CheckBox
                            key={member.id}
                            id={member.id}
                            name={member.name}
                            handleCheckboxChange={handleCheckboxChange}
                            checked={allMembersId.includes(member.id)} />
                      ))}
                </div>
                <button type="button" onClick={addCategoryToList} className="w-auto h-10 mb-3  bg-slate-500 hover:bg-slate-700 text-white font-semibold ml-2 px-3 rounded focus:outline-none focus:shadow-outline">
                  Añadir nueva categoría
                </button> 

                {openEditCategory && <CategoryEditForm setOpenForm={setOpenEditCategory} category={categorySelectedToEdit} membersGroup={members} />}
              </div>
  )
}
