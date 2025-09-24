import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { UserLogin } from '../../../types/types';
import validator from 'validator';
import FormControl from '@mui/material/FormControl/FormControl';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import IconButton from '@mui/material/IconButton/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput/OutlinedInput';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import Loader from '../../Loader/Loader';
import { NavLink } from 'react-router-dom';
import backgroundTceImage from '../../../images/tce_1.jpeg'
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        DEINFE
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>({})
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const { login } = useAuth();
  const [loading, setLoading] = useState(false)


  const onSubmit = (data: UserLogin) => {

    login(data, setLoading);

  }

  return (
    <>
      <Grid container component="main" sx={{ height: '100vh' }} >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundTceImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: { xs: 2, sm: 3, md: 4 }
          }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '400px',

            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', '&:hover': { bgcolor: 'secondary.main' } }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Entrar
            </Typography>
            <Box component="form" name='signinForm' noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, flex: 'col', display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%', height: '100%' }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="E-mail"
                autoComplete="email"
                autoFocus
                error={!!errors?.email}
                {...register("email", { required: 'Campo obrigatório', validate: (value) => validator.isEmail(value) || 'Insira um E-mail válido' })}
              />
              {errors?.email && (
                <Typography variant="caption" sx={{ color: 'error.light' }}>
                  {errors.email.message}
                </Typography>
              )}
              <FormControl sx={{ width: '100%', mt:1 }} variant="outlined" error={!!errors?.password}>
                <InputLabel sx={{ p: 'px' }} htmlFor="senha">Senha</InputLabel>
                <OutlinedInput
                  sx={{
                    '& input::-ms-reveal': {
                      display: 'none'
                    }
                  }}
                  required
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  label="Senha"
                  autoComplete="current-password"
                  error={!!errors?.password}
                  {...register('password', {
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
              {errors?.password && (
                <Typography variant="caption" sx={{ mr: '30px', color: 'error.light' }}>
                  {errors.password.message}
                </Typography>
              )}
              {loading ? (
                <Box sx={{ margin: '15px auto' }}>
                  <Loader />
                </Box>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Entrar
                </Button>
              )}
              <Box sx={{ mt: 2, m: 'auto' }}>
                <NavLink to='/mudarsenha' style={({ isActive }) => ({
                  isActive,
                  textDecoration: 'none',
                  transition: "all 0.3s ease-in-out"
                })}><Typography sx={{
                  color: "#6c6e8f",
                  '&:hover': {
                    color: "#1e293b", // Cor do texto no hover (opcional)
                    textDecoration: "underline",
                    textDecorationColor: "#1e293b",

                  },

                  '&.active': {
                    color: "#ddd",
                    textDecoration: "underline",
                    textDecorationColor: "#ff5722",
                    fontWeight: "bold"
                  }
                }}>Trocar Senha</Typography></NavLink>
              </Box>
              <Copyright sx={{ pt: '15px', m: 'auto' }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}