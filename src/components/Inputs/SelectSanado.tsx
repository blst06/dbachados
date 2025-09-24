import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export interface SelectSanadoProps<T extends FieldValues> {
    id: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    label: string;
    defaultValue?: T[Path<T>];
    options: {
        value: T[Path<T>];
        label: string;
    }[];
}


const SelectSanado = <T extends FieldValues>({
    label,
    id,
    register,
    errors,
    defaultValue,
    options
}: SelectSanadoProps<T>) => {

    return (
        <div>
            <FormControl fullWidth variant="filled" >
                <InputLabel id={`${id}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${id}-label`}
                    id={id}
                    defaultValue={typeof defaultValue === 'string' ? defaultValue.toLowerCase() : (defaultValue || '')}
                    {...register(id)}
                    error={!!errors[id]}
                >
                    <MenuItem value="">
                        <em>Selecione...</em>
                    </MenuItem>
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value.toLowerCase()}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default SelectSanado;