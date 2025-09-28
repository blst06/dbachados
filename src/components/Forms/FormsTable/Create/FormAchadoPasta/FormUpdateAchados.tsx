import { Autocomplete, Box, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import { useContextTable } from '../../../../../context/TableContext';
import { Controller, useForm } from 'react-hook-form';
import { Achado, TopicoAchado, User } from '../../../../../types/types';
import { TypeAlert } from '../../../../../hooks/TypeAlert';
import RegisterButton from '../../../../Buttons/RegisterButton';
import { GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import DateSelector from '../../../../Inputs/DatePicker';
import RadioInput from '../../../../Inputs/RadioInput';
import Loader from '../../../../Loader/Loader';
import AchadoSkeleton from './AchadoSkeleton';
import useFetchAchado from './useFetchAchado';
import useFetchTema from '../FormTemaPasta/useFetchTema';
import CloseIconComponent from '../../../../Inputs/CloseIcon';

export interface FormUpdateAchadoProps {
  closeModal: () => void;
  user: User | undefined;
  id: GridRowId | undefined;
  dataType: string;
}

const FormUpdateAchados: React.FC<FormUpdateAchadoProps> = ({ closeModal, id, user }) => {
  const { arrayTopicoAchado } = useContextTable();
  const { getAllTemas } = useFetchTema();
  const { getAchadoById, updateAchado } = useFetchAchado();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const { control, handleSubmit, register, formState: { errors }, reset, watch, setValue } = useForm<Achado>();

  const gravidade = watch('gravidade');
  
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          if (arrayTopicoAchado.length === 0) {
            await getAllTemas();
          }
          const result = await getAchadoById(id);

          if (result) {
            reset(result.achado);
          }
        } catch (error) {
          console.error('Erro ao buscar o achado:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id, reset, arrayTopicoAchado.length, getAllTemas, getAchadoById]);

  const onSubmit = async (data: Achado) => {
    setLoading(true);
    try {
      if (id) {
        const idString = id.toString();
        await updateAchado(idString, data);
        reset();
        TypeAlert("Achado atualizado", "success");
        closeModal();
      }
    } catch (error) {
      TypeAlert("Erro ao tentar atualizar o Achado", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <AchadoSkeleton isLoading={isLoading} />
      ) : (
        <Box sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2, padding: '20px', boxShadow: '1px 2px 4px' }} component="form" name='formAchados' noValidate onSubmit={handleSubmit(onSubmit)}>
          <CloseIconComponent closeModal={closeModal} textType='Atualizar Achado' />

          <Grid item xs={12} sx={{ mb: 2 }}>
            <Controller
              name="tema_id"
              control={control}
              rules={{ required: "Selecione um tema" }}
              render={({ field }) => (
                <Autocomplete
                  options={arrayTopicoAchado}
                  getOptionLabel={(option) => option.tema}
                  value={arrayTopicoAchado.find(item => item.id === field.value) || null}
                  // ADICIONADO: Esta é a correção crucial
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tema"
                      variant="filled"
                      error={!!errors.tema_id}
                      helperText={errors.tema_id?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <TextField
              variant='filled'
              type="text"
              required
              fullWidth
              id="achado"
              label="Proposta de Achado"
              {...register('achado', { required: 'Campo obrigatório' })}
              error={!!errors.achado}
              helperText={errors.achado?.message}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 1 }}>
            {user?.cargo === 'chefe' && (
              <Controller
                name="situacaoAchado"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    color="primary"
                    value={field.value}
                    exclusive
                    fullWidth
                    onChange={(_, newValue) => {
                      if (newValue !== null) {
                        field.onChange(newValue);
                      }
                    }}
                    aria-label="Situação do Achado"
                  >
                    <ToggleButton value={false}>Pendente</ToggleButton>
                    <ToggleButton value={true}>Aprovado</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 3, alignItems: 'center' }}>
              <DateSelector id='data' register={register} errors={errors} label='Data de registro' dataAchado={watch('data')} />
              <RadioInput id={'gravidade'} label='Gravidade' errors={errors} value={gravidade || 'Baixa'} setValue={setValue} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl>
              <FormLabel id="tipo-financeiro-label">Tipo Financeiro</FormLabel>
              <Controller
                name='tipo_financeiro'
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field} value={String(field.value)} onChange={(e) => field.onChange(e.target.value === 'true')}>
                    <FormControlLabel value="true" control={<Radio />} label="Sim" />
                    <FormControlLabel value="false" control={<Radio />} label="Não" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <TextField variant='filled' type="text" fullWidth id="criterioGeral" label="Critério Geral" {...register('criterioGeral')} />
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography>Campo de Análise</Typography>
            <TextField variant='filled' type="text" multiline rows={4} fullWidth id="analise" label="Análise" placeholder='Use # + barra de espaço para indicar um título. Ex: # Título' {...register('analise')} />
          </Grid>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "start", mt: 3 }}>
              <Loader />
            </Box>
          ) : (
            <RegisterButton text="Atualizar" />
          )}
        </Box>
      )}
    </>
  );
}

export default FormUpdateAchados;