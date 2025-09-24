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
  const [tema, setTema] = useState<TopicoAchado>({ id: '', tema: '', situacao: false })
  const [achado, setAchado] = useState<Achado>()
  const { arrayTopicoAchado } = useContextTable()
  const [_situacaoAchado, setSituacaoAchado] = useState<string | null>(null);
  const { getAllTemas } = useFetchTema()
  const { getAchadoById } = useFetchAchado()
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { control, handleSubmit, register, formState: { errors }, setValue, reset, watch } = useForm<Achado>({
    defaultValues: {
      tema_id: tema.id, // Inicialize o id do tópico
      achado: achado?.achado || '', // Inicialize com o achado, caso disponível
      analise: achado?.analise || '', // Inicialize a análise, caso disponível
      situacaoAchado: achado?.situacaoAchado || false, // Inicialize com o estado padrão
      criterioGeral: achado?.criterioGeral,
    },
  });
  const gravidade = watch('gravidade', achado?.gravidade);
  const { updateAchado } = useFetchAchado();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true)
        try {
          if (arrayTopicoAchado.length === 0) {
            const fetchTemas = async () => {
              await getAllTemas();
            }
            fetchTemas()

          }
          // Aguarda a resolução da promessa
          const result = await getAchadoById(id);

          if (result) {
            setAchado(result.achado)
            setTema(result.tema)
            // Reseta o formulário com os dados do achado
            reset({
              id: result.achado.id || '',
              tema_id: result.tema?.id || '',
              achado: result.achado?.achado || '',
              analise: result.achado?.analise || '',
              situacaoAchado: result.achado?.situacaoAchado || false,
              tipo_financeiro: result.achado?.tipo_financeiro || false,
              gravidade: result.achado?.gravidade || '',
              criterioGeral: result.achado.criterioGeral || '',
            });
          }
        } catch (error) {
          console.error('Erro ao buscar o achado:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData(); // Chama a função assíncrona
  }, [id, reset, arrayTopicoAchado.length]);


  useEffect(() => {
    if (achado?.situacaoAchado === true) {
      setSituacaoAchado("Aprovado")
    } else {
      setSituacaoAchado("Pendente")
    }
  }, [])

  const onSubmit = async (data: Achado) => {
    setLoading(true)

    try {
      if (id) {
        const idString = id?.toString()
        await updateAchado(idString, data)
        reset()
        TypeAlert("Achado atualizado", "success")
        closeModal()
        setLoading(false)
      }
    } catch (error) {
      TypeAlert("Erro ao tentar atualizar o Achado", "error")
    }

  }


  return (
    <>
      {isLoading ? (
        <AchadoSkeleton isLoading={isLoading} />
      ) : (
        <Box sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2, padding: '20px 20px 20px', boxShadow: '1px 2px 4px' }} component="form" name='formAchados' noValidate onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(onSubmit)(e);
        }}>

          <CloseIconComponent closeModal={closeModal} textType='Atualizar Achado' />

          <Grid item xs={12} sx={{ mb: 2 }}>
            <Controller
              name="tema_id"
              control={control}
              defaultValue={tema.id || ''}
              rules={{ required: "Selecione um tema" }}
              render={({ field }) => (
                <Autocomplete
                  options={arrayTopicoAchado}
                  getOptionLabel={(option: TopicoAchado) => option.tema}
                  defaultValue={arrayTopicoAchado.find(item => item.id === field.value) || null}
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
              defaultValue={achado?.achado}
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
            {user?.cargo === 'chefe' ? (<Controller
              name="situacaoAchado"
              defaultValue={achado?.situacaoAchado}
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  color="primary"
                  value={field.value}
                  exclusive
                  onChange={(_, newValue) => field.onChange(newValue)}
                  aria-label="Situacao do Achado"
                >
                  <ToggleButton value={false}>Pendente</ToggleButton>
                  <ToggleButton value={true}>Aprovado</ToggleButton>
                </ToggleButtonGroup>
              )}
            />) : (
              <input type="hidden"{...register('situacaoAchado')} value="false" />
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
              <DateSelector id='data' register={register} errors={errors} label='Data de registro' dataAchado={achado?.data} />

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
          {loading ? <Box sx={{ display: "flex", justifyContent: "start", mt: 3 }}>
            <Loader />
          </Box> :
            <RegisterButton text="Atualizar" />
          }
        </Box>
      )}
    </>
  );
}

export default FormUpdateAchados;
