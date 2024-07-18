import Select from 'react-select';

interface Props{
    options: any;
    onSelect: (value: any) => void;
    defaultLabel: string;
}
export  const Filter = ({ options, onSelect, defaultLabel }:Props) => {
  console.log(options)
    const formattedOptions = [
        { value: '', label: defaultLabel},
        ...(options && options.length > 0 ? 
            options.map(({ name, id }: any) => ({ value: id, label: name })) 
            : []
        ),
      ];

      

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: '#E3E8EF',
      boxShadow: state.isFocused ? '0 0 0 1px 2px rgba(0, 0, 0, 0.1)' : provided.boxShadow,
      border: 'none',
      borderRadius: '3px',
      minHeight: '30px',
      height: '30px',
    }),
  
    valueContainer: (provided: any) => ({
      ...provided,
      height: '30px',
      padding: '0 8px',
    }),

    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '30px',
    }),

    singleValue: (provided: any) => ({
      ...provided,
      color: '#0f172a',
    }),

    menu: (provided: any) => ({
      ...provided,
      width: 'auto',
      border: 'none',
      borderRadius: '0',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#cbd5e1' : state.isFocused ? '#f1f5f9' : null,
      color: '#0f172a',
      border: 'none',
      cursor: 'pointer',
      padding: '2px 12px',
      fontWeight: 'normal',
      '&:hover': {
        backgroundColor: state.isSelected ? '#cbd5e1' : '#f1f5f9', // Cambia el color del fondo cuando hace click
      }
    })
    };

  return (
    <Select
      styles={customStyles}
      className="basic-single flex"
      defaultValue={formattedOptions[0]}
      isSearchable={false}
      options={formattedOptions}
      onChange={(option) => onSelect(option?.value)}
    />
    
  );
};

