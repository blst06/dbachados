import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box, FormHelperText, Grid } from '@mui/material';
import { Achado } from '../../types/types';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

export interface RadioInputProps {
    id: keyof Achado;
    label: string;
    errors: FieldErrors<Achado>
    value: string;
    setValue: UseFormSetValue<Achado>;
}

const RadioInput: React.FC<RadioInputProps> = ({ id, label, errors, setValue, value }) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(id, event.target.value); // Atualiza o valor diretamente no form
    };

    return (
        <Grid item xs={12} sx={{ mt: 3 }}>
            <FormControl error={!!errors?.[id]} sx={{ border: "1px solid #b5b9be", borderRadius: 2, pl: 2 }}>
                <FormLabel id={`${id}-label`}>{label}</FormLabel>
                <RadioGroup
                    row
                    id={id}
                    aria-labelledby={`${id}-label`}
                    value={value} // Vincula ao valor controlado
                    onChange={handleChange} // Atualiza o valor com a seleção
                >
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                        <FormControlLabel value="Baixa" control={<Radio />} label="Baixa" />
                        <FormControlLabel value="Média" control={<Radio />} label="Média" />
                        <FormControlLabel value="Alta" control={<Radio />} label="Alta" />
                    </Box>
                </RadioGroup>
                {errors?.[id] && (
                    <FormHelperText>{errors[id]?.message}</FormHelperText> // Exibindo erro caso haja
                )}
            </FormControl>
        </Grid>
    );
};
export default RadioInput;