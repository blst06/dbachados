import TextField from "@mui/material/TextField";
import { FormControl, FormHelperText, Grid } from "@mui/material";
import { Processo } from "../../types/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface DateProcessoProps {
  id: keyof Processo;
  label: string;
  register: UseFormRegister<Processo>;
  errors: FieldErrors<Processo>;
  dataProcesso?:Date;
}

const DateSelectorProcesso:React.FC<DateProcessoProps> = ({id, label, register, errors, dataProcesso}) => {

  return (
    <>
    {dataProcesso ? (
      <Grid item xs={12} sm={6} >
      <FormControl  error={!!errors?.[id]}>
        <TextField
          id={id}
          label={label}
          defaultValue={dataProcesso}
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
          <FormHelperText sx={{ color: 'red', ml: '10px' }}>{errors[id]?.message}</FormHelperText>
        )}
      </FormControl>
    </Grid>
    ):(
      <Grid item xs={12} sm={6} >
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
            <FormHelperText sx={{ color: 'red', ml: '10px' }}>{errors[id]?.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>
    )}
    </>
  );
};

export default DateSelectorProcesso;

