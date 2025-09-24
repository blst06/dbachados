import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { Achado, TopicoAchado, User } from '../../../../../types/types'
import { TypeAlert } from '../../../../../hooks/TypeAlert';
import { useContextTable } from '../../../../../context/TableContext';
import { Autocomplete, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';
import RegisterButton from '../../../../Buttons/RegisterButton';
import { useEffect, useState } from 'react';
import RadioInput from '../../../../Inputs/RadioInput';
import DateSelector from '../../../../Inputs/DatePicker';
import Loader from '../../../../Loader/Loader';
import useFetchAchado from './useFetchAchado';
import ModalTema from '../FormTemaPasta/ModalTema';
import useFetchTema from '../FormTemaPasta/useFetchTema';
import CloseIconComponent from '../../../../Inputs/CloseIcon';
import { useTheme } from '@mui/material/styles';

export interface FormAchadoProps {
  closeModal: () => void;
  user: User;
  dataType: string;
}

const FormAchado: React.FC<FormAchadoProps> = ({ closeModal, user }) => {

  const { control, register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<Achado>({
    defaultValues: {
      gravidade: 'Baixa'
    }
  });
  const { getAllTemas } = useFetchTema();
  const { getAchadobyName } = useFetchAchado();
  const { setAchado } = useFetchAchado();
  const [situacaoAchado, setSituacaoAchado] = useState<string | null>(null);
  const { arrayTopicoAchado } = useContextTable()
  const [loading, setLoading] = useState(false);
  const gravidade = watch('gravidade', 'Baixa');
  const theme = useTheme();


  useEffect(() => {
    getAllTemas()
  })


  const handleChangeSituacaoAchado = (
    _: React.MouseEvent<HTMLElement>,
    newSituacao: string | null
  ) => {
    if (newSituacao !== null) {
      setSituacaoAchado(newSituacao);
    }
  };


  const onSubmit = async (data: Achado) => {
    setLoading(true)
    //bloco que manipula e salva o achado
    try {
      const achadoExiste = await getAchadobyName(data.achado, data.tema_id);
      if (achadoExiste) {
        setLoading(false)
        return
      }

      if (user?.cargo !== 'chefe') {
        data.situacaoAchado = false;
      }

      const dataWithSituacao = {
        ...data,
        situacaoAchado: situacaoAchado === 'Aprovado' ? true : false,
      };

      console.log(dataWithSituacao)

      await setAchado(dataWithSituacao);
      TypeAlert("Achado adicionado", "success");
      reset();
      closeModal();
      return;
    } catch (error) {
      TypeAlert("Erro ao tentar adicionar o achado", "error");
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2, padding: '20px 20px 20px', boxShadow: '1px 2px 4px' }} component="form" name='formAchados' id='formAchados' noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}>
      <CloseIconComponent closeModal={closeModal} textType='Cadastrar proposta de Achado' />
      <Grid item xs={12} sx={{ mb: 2 }}>
        <Controller
          name="tema_id"
          control={control}
          rules={{ required: 'Campo obrigatório' }}
          render={({ field }) => (
            <Autocomplete
              disablePortal
              autoFocus
              id="autocomplete-tema_id"
              options={arrayTopicoAchado}
              getOptionLabel={(option: TopicoAchado) => option.tema}
              onChange={(_, value) => field.onChange(value?.id || '')}
              ListboxProps={{
                style: {
                  maxHeight: '200px',
                  overflow: 'auto',
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tema"
                  variant="filled"
                  required
                  placeholder='Selecione um Tema'
                  focused={true}
                  error={!!errors.tema_id}
                  helperText={errors.tema_id?.message}
                />
              )}
            />
          )}
        />
      </Grid>

      <ModalTema dataType='tema' user={user} />
      <Grid item xs={12} sx={{ mt: 3 }}>
        <TextField
          variant='filled'
          autoComplete="given-name"
          type="text"
          required
          fullWidth
          id="achado"
          label="Proposta de Achado"
          error={errors?.achado?.type === 'required'}
          {...register('achado', {
            required: 'Campo obrigatório',
          })}
        />
        {errors?.achado && (
          <Typography variant="caption" sx={{ color: 'red', ml: '10px', mb: 0 }}>
            {errors.achado?.message}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        {user?.cargo === 'chefe' ? (<ToggleButtonGroup
          id="situacaoAchado"
          color="primary"
          value={situacaoAchado}
          exclusive
          onChange={handleChangeSituacaoAchado}
          aria-label="Situação do Achado"

        >
          <ToggleButton value='Pendente' >Pendente</ToggleButton>
          <ToggleButton value='Aprovado' >Aprovado</ToggleButton>
        </ToggleButtonGroup>) : (
          <input id="situacaoAchado" type="hidden"{...register('situacaoAchado')} value="false" />
        )}
      </Grid>

      <Grid item xs={12} sm={4} >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 12 }}>
          <DateSelector id='data' register={register} errors={errors} label='Data de registro' />
          <RadioInput id={'gravidade'}
            label='Gravidade'
            errors={errors}
            value={gravidade}
            setValue={setValue} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group-tipo-financeiro">Tipo Financeiro</FormLabel>
          <Controller
            name='tipo_financeiro'
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group-tipo-financeiro"
                name="tipo_financeiro"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value === 'true')}
              >
                <FormControlLabel value={true} control={<Radio />} label="Sim" />
                <FormControlLabel value={false} control={<Radio />} label="Não" />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <TextField
            variant='filled'
            autoComplete="given-name"
            type="text"
            fullWidth
            id="criterioGeral"
            label="Critério Geral"
            error={errors?.criterioGeral?.type === 'required'}
            {...register('criterioGeral', {
            })}
          />
          {errors?.criterioGeral && (
            <Typography variant="caption" sx={{ color: 'red', ml: '10px', mb: 0 }}>
              {errors.criterioGeral?.message}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} sx={{ mt: 3 }}>
          <Typography>Campo de Análise</Typography>
          <TextField
            variant='filled'
            autoComplete="analise"
            type="text"
            multiline
            rows={4}
            fullWidth
            id="analise"
            label="Análise"
            placeholder='Use # + barra de espaço para indicar um título. Ex: # Título'
            {...register('analise')}
          />
        </Grid>
      </Grid>
      {loading ? <Box sx={{ display: "flex", justifyContent: "start", mt: 3 }}><Loader />
      </Box> :
        <RegisterButton text="Registrar" />
      }
    </Box>
  )
}

export default FormAchado;