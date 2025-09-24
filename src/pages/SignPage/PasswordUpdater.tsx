import { Box, Button, FormControl, FormLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Typography } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import { useForm } from 'react-hook-form';
import { EmailChanger } from '../../types/types';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authBase } from '../../service/firebase.config';
import backgroundImageTCESenha from '../../images/tce_5.jpeg';


const PasswordUpdater = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<EmailChanger>({})
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get('oobCode');
    const navigate = useNavigate();

    const onSubmit = async (data: EmailChanger) => {
        try {
            // Verifica se há um código OOB (out-of-band)
            if (!oobCode) {
                alert('Código de redefinição inválido');
                return;
            }

            await verifyPasswordResetCode(authBase, oobCode);
            // Confirma o código e atualiza a senha
            await confirmPasswordReset(authBase, oobCode, data.password);

            alert('Senha atualizada com sucesso!');
            navigate('/signin'); // Redireciona para login
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            alert('Ocorreu um erro ao atualizar sua senha. Por favor, tente novamente.');
        }
    }
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            mb: 0,
            pb: 0,
            backgroundImage: `url(${backgroundImageTCESenha})`,
            backgroundBlendMode: 'multiply',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(1, 2, 19, 0.5)',
        }}>
            <FormControl component="form" onSubmit={handleSubmit(onSubmit)}>
                <Paper sx={{ p: 6, pl: 10, pr: 10 }}>
                    <FormGroup >
                        <FormLabel>Insira a sua nova senha</FormLabel>
                        <FormLabel sx={{ fontSize: "12px", pb: 3 }}>Altere a senha e volte para a página de login
                        </FormLabel>
                        <FormControl variant="outlined" fullWidth >
                            <InputLabel sx={{ p: 'px' }} htmlFor="Nova senha">Nova Senha</InputLabel>
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
                                label="Nova senha"
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
                            <Typography variant="caption" sx={{ mr: '30px', color: 'red' }}>
                                {errors.password.message}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3, mb: 2, bgcolor: 'rgb(17 24 39)', '&:hover': {
                                    bgcolor: '#1e293b',
                                },
                            }}
                        >
                            Enviar
                        </Button>
                        <NavLink to='/signin' style={({ isActive }) => ({
                            isActive,
                            textDecoration: 'none',
                            transition: "all 0.3s ease-in-out"
                        })}><Typography sx={{
                            fontSize: "14px",
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
                        }}>Voltar para o Log in!</Typography></NavLink>
                    </FormGroup>
                </Paper>
            </FormControl>
        </Box>
    )

}

export default PasswordUpdater;