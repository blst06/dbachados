import { Autocomplete, Box, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import { useContextTable } from '../../../../../context/TableContext';
import { Controller, useForm } from 'react-hook-form';
import { Achado, User } from '../../../../../types/types';
import { TypeAlert } from '../../../../../hooks/TypeAlert';
import RegisterButton from '../../../../Buttons/RegisterButton';
import { GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  const { control, handleSubmit, register, formState: { errors }, reset, watch } = useForm<Achado>();

  // Variável que define se os campos são somente leitura
  const isReadOnly = user?.cargo === 'chefe';

  // CORREÇÃO DO LOOP: O useEffect agora só depende do `id` para buscar os dados.
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
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); // Depender apenas do 'id' quebra o loop.

  const onSubmit = async (data: Achado) => {
    setLoading(true);
    try {
      if (id) {
        const idString = id.toString();
        await updateAchado(idString, data);
        reset();
        TypeAlert("Registro atualizado com sucesso", "success");
        closeModal();
      }
    } catch (error) {
      TypeAlert("Erro ao tentar atualizar o registro", "error");
    } finally {
      setLoading(false);
    }
  };
  
  // Transforma a data para o formato YYYY-MM-DD que o input type="date" espera
  const formattedDate = watch('data') ? new Date(watch('data')).toISOString().split('T')[0] : '';

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
                  readOnly={isReadOnly} // CAMPO TRAVADO
                  options={arrayTopicoAchado}
                  getOptionLabel={(option) => option.tema}
                  value={arrayTopicoAchado.find(item => item.id === field.value) || null}
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
              InputProps={{
                readOnly: isReadOnly, // CAMPO TRAVADO
              }}
            />
          </Grid>

          {/* ESTE CAMPO CONTINUA EDITÁVEL PARA O CHEFE */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            {(user?.cargo === 'chefe' || user?.cargo === 'admin') && (
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
          
          <Grid item xs={12} sx={{ mt: 3 }}>
             <TextField 
                id='data' 
                label='Data de registro' 
                type="date"
                defaultValue={formattedDate}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: isReadOnly }} // CAMPO TRAVADO
                variant="filled"
                fullWidth
              />
          </Grid>

          <Grid item xs={12} md={6} sx={{ mt: 2 }}>
            <FormControl>
              <FormLabel id="tipo-financeiro-label">Tipo Financeiro</FormLabel>
              <Controller
                name='tipo_financeiro'
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field} value={String(field.value)} onChange={(e) => field.onChange(e.target.value === 'true')}>
                    <FormControlLabel value="true" control={<Radio disabled={isReadOnly} />} label="Sim" />
                    <FormControlLabel value="false" control={<Radio disabled={isReadOnly} />} label="Não" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <TextField variant='filled' type="text" fullWidth id="criterioGeral" label="Critério Geral" {...register('criterioGeral')} InputProps={{ readOnly: isReadOnly }} />
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography>Campo de Análise</Typography>
            <TextField variant='filled' type="text" multiline rows={4} fullWidth id="analise" label="Análise" placeholder='Use # + barra de espaço para indicar um título. Ex: # Título' {...register('analise')} InputProps={{ readOnly: isReadOnly }}/>
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