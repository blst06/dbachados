// filepath: c:\Users\klebe\Downloads\db_deinfe-main\src\components\Forms\FormsTable\Create\FormTemaPasta\FormTopicoAchado.tsx
import { Box, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TopicoAchado, User } from '../../../../../types/types';
import RegisterButton from '../../../../Buttons/RegisterButton';
import { useState } from 'react';
import Loader from '../../../../Loader/Loader';
import useFetchTema from './useFetchTema';
import CloseIconComponent from '../../../../Inputs/CloseIcon';
import { useAuth } from '../../../../../context/AuthContext';


export interface FormTopicoAchadoProps {
  closeModal: () => void;
  user: User | undefined;
}


const FormTopicoAchado: React.FC<FormTopicoAchadoProps> = ({ closeModal, user }) => {
  const { handleSubmit, register, formState: { errors }, reset } = useForm<TopicoAchado>({});
  const [situacao, setSituacao] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const { getTemaByName } = useFetchTema();
  const { setTema } = useFetchTema();
  const theme = useTheme();
  const { user: loggedInUser } = useAuth();


  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newSituacao: string,
  ) => {
    if (newSituacao !== undefined) {
      setSituacao(newSituacao);
    }
  };


  const onSubmit = async (data: TopicoAchado) => {
    try {
      setLoading(true);


      const temaExiste = await getTemaByName(data.tema)


      if (temaExiste) return;


      if (user?.cargo !== 'chefe') {
        data.situacao = false;
      }
      const dataWithSituacao = {
        ...data,
        situacao: situacao === 'Aprovado' ? true : false
      }
      setTema(dataWithSituacao)
      reset()
    } catch (error) {
      console.error("Erro no tryCatch do submit de topico: ", error)
    } finally {
      setLoading(false)
      closeModal()
    }
  };


  return (
    <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2, padding: '20px 20px 20px', minWidth: '40vw', boxShadow: '1px 2px 4px' }} component="form" id="formTopcioAchado" name='formTopicoAchado' noValidate onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(onSubmit)(e);
    }}>


      <CloseIconComponent closeModal={closeModal} textType='Cadastrar proposta de Tema' />


      <Grid item xs={12} >
        <TextField
          variant='filled'
          required
          fullWidth
          autoFocus
          id="tema"
          label='Proposta de Tema'
          type="text"
          error={!!errors?.tema}
          {...register('tema', {
            required: 'Campo obrigatório'
          })}
        />


        {errors?.tema && (
          <Typography variant="caption" sx={{ color: 'red', ml: '10px' }} component="div">
            {errors.tema.message}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        {loggedInUser?.cargo === 'chefe' ? (
          <ToggleButtonGroup
            color="primary"
            value={situacao}
            exclusive
            onChange={handleChange}
            aria-label="toggleSituacaoTema"
          >
            <ToggleButton value='Pendente' >Pendente</ToggleButton>
            <ToggleButton value='Aprovado' >Aprovado</ToggleButton>
          </ToggleButtonGroup>
        ) : (
          <input type="hidden"{...register('situacao')} value="false" />
        )}
      </Grid>
      {loading ?
        <Box sx={{ display: 'flex', justifyContent: 'start', mt: 3 }}>
          <Loader />
        </Box> :
        <RegisterButton text="Registrar" />
      }
    </Box>
  );
}


export default FormTopicoAchado;