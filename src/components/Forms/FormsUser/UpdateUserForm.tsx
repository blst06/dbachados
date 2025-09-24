import { useEffect } from 'react';
import { useState } from 'react';
import { UserUpdate } from '../../../types/types';
import { Avatar, Box, Button, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import { TypeAlert } from '../../../hooks/TypeAlert';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useAuth } from '../../../context/AuthContext';
import useFetchUsers from '../SignForms/useFetchUsers';
import { useNavigate } from 'react-router-dom';

const UpdateUserForm = () => {
  const [email] = useState(localStorage.getItem('email'))
  const { getUser, updateUser } = useFetchUsers();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<UserUpdate>({})
  const navigate = useNavigate();
;
  useEffect(() => {
    const fetchUser = async () => {
      await getUser()
    };
    fetchUser()

  }, [email, user?.id])

  const handleNavigation = () => {
    navigate('/dashboard/table')
  }

  const onSubmit = async (data: UserUpdate) => {
    try {
      if (user) {
        await updateUser(user.id, data)
        TypeAlert("Usuário atualizado", "success")
      }

    } catch (error) {
      console.error("Erro na função updateUser do hook useFetchUser()", error)
      TypeAlert("Erro ao tentar atualizar o registro do usuário", "error")
    }

  }

  return (
    <div>
      {user && (
        <Box noValidate component='form' name='updateUserForm' onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(onSubmit)(e);
        }}>
          <Box
            sx={{
              mt:3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{
              m: 1, bgcolor: 'primary.main', '&:hover': {
                bgcolor: 'secondary.main',
              }
            }}>
              <ManageAccountsIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
              Atualizar Usuário
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <TextField
                  autoComplete="given-name"
                  type="text"
                  required
                  fullWidth
                  id="nome"
                  label="Nome Completo"
                  defaultValue={user.nome}
                  autoFocus
                  error={errors?.nome?.type === 'required'}
                  {...register('nome', { required: true })}
                />
                {errors?.nome?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>Campo obrigatório</Typography>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mb: 2 }}>
                <TextField
                  autoComplete="given-name"
                  type="email"
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  defaultValue={user.email}
                  autoFocus
                  error={!!errors?.email}
                  {...register("email", { required: 'Campo obrigatório', validate: (value) => validator.isEmail(value) || 'Insira um E-mail válido' })}
                />
                {errors?.email?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                    E-mail é um campo obrigatório
                  </Typography>
                )}
                {errors?.email?.type === 'validate' && (
                  <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                    Por favor, insira um e-mail válido
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mb: 2 }}>
                <TextField
                  autoComplete="given-name"
                  type="text"
                  required
                  fullWidth
                  id="cargo"
                  label="Cargo"
                  defaultValue={user.cargo}
                  autoFocus
                  error={!!errors?.cargo}
                  inputProps={{
                    readOnly: true,
                  }}
                  {...register('cargo', { required: true })}
                />
                {errors?.cargo && (
                  <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                    Campo obrigatório
                  </Typography>
                )}
              </Grid>

              <Grid item sx={{ width: '100%' }}>
                <Grid sx={{ display: 'flex', flexDirection: 'row', ml: "10px" }}>
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ mt: "8px" }}>Ativo:</FormLabel>
                  <RadioGroup
                    aria-labelledby="radio-buttons-ativo-inativo"
                    defaultValue="S"
                    aria-required
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'row', ml: "10px" }}>
                      <FormControlLabel {...register('ativo')} id='formRdio1' value="S" control={<Radio />} label="SIM" />
                      <FormControlLabel {...register('ativo')} id='formRdio2' value="N" control={<Radio />} label="NÃO" />
                    </Box>
                  </RadioGroup>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mb: 2, cursor: "pointer"
                }}
              >
                Atualizar
              </Button>
              <Button onClick={handleNavigation} variant="outlined">
                <NavigateBeforeIcon />
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  Voltar para Dashboard
                </Typography>
              </Button>



            </Grid>
          </Box>
        </Box>
      )}
    </div>
  )
}

export default UpdateUserForm