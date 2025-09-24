import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Processo } from '../../types/types';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormHelperText } from '@mui/material';

export interface SelectInputProps {
  id: keyof Processo;
  register: UseFormRegister<Processo>;
  errors: FieldErrors<Processo>;
  label:string
  julgado?:string;
}

const SelectInput:React.FC<SelectInputProps> = ({label,id, register, errors, julgado}) => {

  return (
    <div>
      <FormControl variant="filled" sx={{ ml: 2, minWidth: 180 }}>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          {...register(id, {required:"Este campo é obrigatório"})}
          defaultValue={julgado}
        >
          <MenuItem value="">
            <em>Selecione...</em>
          </MenuItem>
          <MenuItem value="pendente">Pendente</MenuItem>
          <MenuItem value="regular">Regular</MenuItem>
          <MenuItem value="regular com ressalvas">Regular com Ressalvas</MenuItem>
          <MenuItem value="irregular">Irregular</MenuItem>
        </Select>
        {errors?.[id] && (
            <FormHelperText sx={{ color: 'red', ml: '10px' }}>{errors[id]?.message}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
}

export default SelectInput;