import { Box, Grid, TextField, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TopicoAchado, User } from '../../../../../types/types';
import { GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import RegisterButton from '../../../../Buttons/RegisterButton';
import { useContextTable } from '../../../../../context/TableContext';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { TypeAlert } from '../../../../../hooks/TypeAlert';
import Loader from '../../../../Loader/Loader';
import TopicoSkeleton from './TopicoSkeleton';
import useFetchTema from './useFetchTema';
import CloseIconComponent from '../../../../Inputs/CloseIcon';

interface TopicoAchadoProp {
  closeModal: () => void;
  id: GridRowId | undefined;
  user: User | undefined;
}


const FormUpdateTopicoAchado: React.FC<TopicoAchadoProp> = ({ closeModal, id, user }) => {
  const { handleSubmit, register, formState: { errors }, reset } = useForm<TopicoAchado>({});
  const [temaAchado, setTemaAchado] = useState<TopicoAchado | null>(null);
  const { arrayTopicoAchado } = useContextTable();
  const [situacao, setSituacao] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateTema } = useFetchTema();
  const theme = useTheme();


  // Função para buscar o tema do achado
  const getTemaAchado = () => {
    const tema = arrayTopicoAchado.find(item => item.id === id);
    console.log(tema)
    setTemaAchado(tema || null);
  };


  useEffect(() => {
    if (id) {
      setIsLoading(true)
      getTemaAchado();
      setIsLoading(false)

    }
  }, [id, arrayTopicoAchado]);

  useEffect(() => {
    if (temaAchado) {
      setSituacao(temaAchado?.situacao === false ? 'Pendente' : 'Aprovado');
    }
  }, [temaAchado])

  const onSubmit = async (data: TopicoAchado) => {
    // Simulando a atualização (API ou outra lógica aqui)
    const updateData = {
      ...data,
      situacao: situacao === 'Aprovado' ? true : false
    }

    setLoading(true)

    try {
      const idTema = id?.toString();
      if (idTema) {
        const temaUpdated = await updateTema(idTema, updateData)
        if (temaUpdated) {
          reset()
          closeModal();
        }
      }
    } catch (error) {
      TypeAlert("Erro ao tentar atualizar o registro", "error")
    } finally {
      setLoading(false)
    }
  };

  if (isLoading) {
    return <TopicoSkeleton isLoading={isLoading} />
  }

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newSituacao: string,
  ) => {
    if (newSituacao !== undefined) {
      setSituacao(newSituacao);
    }
  };


  return (
    <>
      {temaAchado && (
        <Box sx={{backgroundColor: theme.palette.background.paper, borderRadius: 2, padding: '20px 20px 20px', minWidth: '40vw', boxShadow: '1px 2px 4px' }}
          component="form" name="formUpdateTopicoAchado" id="formUpdateTopicoAchado" noValidate onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}>
           <CloseIconComponent closeModal={closeModal} textType='Atualizar Tema' />
          <Grid item xs={12} sm={4}>
            <TextField
              variant="filled"
              required
              defaultValue={temaAchado?.tema}
              fullWidth
              autoFocus
              id="tema"
              label="Tema"
              type="text"
              error={!!errors?.tema}
              {...register('tema', {
                required: 'Campo obrigatório'
              })}
            />
            {errors?.tema && (
              <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                {errors.tema?.message}
              </Typography>
            )}
            {user?.cargo === "chefe" &&
              <Box>
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
              </Box>
            }
          </Grid>
          {loading ? <Box sx={{ display: "flex", justifyContent: 'start', mt: 3 }}>
            <Loader />
          </Box> : <RegisterButton text="Atualizar" />
          }
        </Box>
      )}
    </>
  );
};

export default FormUpdateTopicoAchado;
