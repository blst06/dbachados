import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import RadioGroup from '@mui/material/RadioGroup/RadioGroup';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio/Radio';
import validator from 'validator'
import { useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl/FormControl';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput/OutlinedInput';
import { User } from '../../../types/types'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CloseIcon from '@mui/icons-material/Close';
import useFetchUsers from '../SignForms/useFetchUsers';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { authBase } from '../../../service/firebase.config';
import { useState } from 'react';
import Loader from '../../Loader/Loader';


interface SignUpProps {
  closeModal: () => void;
}

const RegisterForm: React.FC<SignUpProps> = ({ closeModal }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<User>({});
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const { getUsers, addUser } = useFetchUsers()
  const [loading, setLoading] = useState(false)

  const onSubmit = (data: User) => {
    setLoading(true)
    if (data.senha) {
      createUserWithEmailAndPassword(authBase, data.email, data.senha)
        .then((userCredential) => {
          const user = userCredential.user;
          const userData = {
            id: user.uid,
            nome: data.nome,
            email: data.email,
            cargo: data.cargo,
            ativo: data.ativo
          }
          addUser(userData)

        }).catch((error) => {
          console.log('erro no registro de usuário, componente registerForm', error)
        }).finally(() => {
          getUsers()
          closeModal()
          setLoading(false)
        })

    }
  }

  const handleModalClose: any = () => {
    closeModal()
  }

  return (
    <Container maxWidth="xs" sx={{ height: 'fit-content' }} >
      <CssBaseline />
      <IconButton onClick={handleModalClose} sx={{
        ml: 35, mb: 0, mr: 0, '&:hover': {
          bgcolor: '#1e293b', color: '#ffffff',
        }
      }}>
        <CloseIcon />
      </IconButton>
      <Box
        sx={{

          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{
          m: 1, bgcolor: 'rgb(17 24 39)', '&:hover': {
            bgcolor: '#1e293b',
          }
        }}>
          <HowToRegIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registro de Usuário
        </Typography>
        <Box component="form" id='registerForm' noValidate onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(onSubmit)(e);
        }} sx={{ mt: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                type="text"
                required
                fullWidth
                id="nome"
                label={errors.nome ? errors.nome.message : "Nome Completo"}
                autoFocus
                error={errors?.nome?.type === 'required'}
                {...register('nome', { required: true })}
              />
            </Grid>
            {errors?.nome?.type === 'required' && (
              <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>Campo obrigatório</Typography>
            )}
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                id="email"
                label="E-mail"
                type="email"
                autoFocus
                error={!!errors?.email}
                {...register("email", { required: 'Campo obrigatório', validate: (value) => validator.isEmail(value) || 'Insira um E-mail válido' })}
              />
            </Grid>
            {errors?.email && (
              <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                {errors.email.message}
              </Typography>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="cargo"
                label="Cargo"
                type="text"
                error={!!errors?.cargo}
                {...register('cargo', { required: 'Campo obrigatório' })}
              />
            </Grid>
            {errors?.cargo && (
              <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                {errors.cargo.message}
              </Typography>
            )}
            <Grid sx={{ width: '100%' }}>
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
            <FormControl sx={{ ml: 1, width: '100%' }} variant="outlined" error={!!errors?.senha}>
              <InputLabel sx={{ p: 'px' }} htmlFor="senha">Senha</InputLabel>
              <OutlinedInput
                required
                id="senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                label="senha"
                autoComplete='off'
                error={!!errors?.senha}
                {...register('senha', {
                  required: 'Campo obrigatório',
                  minLength: {
                    value: 8,
                    message: 'A senha deve ter 8 caracteres no mínimo',
                  },
                  pattern: {
                    value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                    message: 'A senha deve conter letras maiúsculas, minúsculas, números e um caractere especial #$%'
                  }
                })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {errors?.senha && (
              <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                {errors.senha.message}
              </Typography>
            )}
            {loading ? (
              <Loader />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3, mb: 2, bgcolor: 'rgb(17 24 39)', '&:hover': {
                    bgcolor: '#1e293b',
                  }
                }}
              >
                Registrar
              </Button>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterForm;
