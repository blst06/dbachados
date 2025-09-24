import TextField from "@mui/material/TextField";
import { FormControl, FormHelperText, Grid } from "@mui/material";
import { Achado } from "../../types/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface DateInputProps {
  id: keyof Achado;
  label: string;
  register: UseFormRegister<Achado>;
  errors: FieldErrors<Achado>;
  dataAchado?:Date;
}

const DateSelector:React.FC<DateInputProps> = ({id, label, register, errors, dataAchado}) => {

  return (
    <>
    {dataAchado ? (
      <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
      <FormControl error={!!errors?.[id]}>
        <TextField
          id={id}
          label={label}
          defaultValue={dataAchado}
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true, // Faz a label ficar acima quando o campo é preenchido
          }}
          {...register(id, {
            required: "Este campo é obrigatório", // Validação de campo obrigatório
          })}
        />
        {errors?.[id] && (
          <FormHelperText>{errors[id]?.message}</FormHelperText>
        )}
      </FormControl>
    </Grid>
    ):(
      <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
        <FormControl error={!!errors?.[id]}>
          <TextField
            id={id}
            label={label}
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true, // Faz a label ficar acima quando o campo é preenchido
            }}
            {...register(id, {
              required: "Este campo é obrigatório", // Validação de campo obrigatório
            })}
          />
          {errors?.[id] && (
            <FormHelperText>{errors[id]?.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>
    )}
    </>
  );
};

export default DateSelector;
  
