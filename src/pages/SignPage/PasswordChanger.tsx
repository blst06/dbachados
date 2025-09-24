import { Box, Button, FormControl, FormLabel, Paper, TextField, Typography } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import useFetchUsers from '../../components/Forms/SignForms/useFetchUsers';
import { useForm } from 'react-hook-form';
import { EmailChanger } from '../../types/types';
import validator from 'validator';
import { NavLink } from 'react-router-dom';
import backgroundImageTCE from '../../images/tce_5.jpeg';

const PasswordChanger = () => {

    const { passwordChanger } = useFetchUsers()
    const { register, handleSubmit, formState: { errors } } = useForm<EmailChanger>({})

    const onSubmit = (data: EmailChanger) => {
        passwordChanger(data.email)
    }
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            mb: 0,
            pb: 0,
            backgroundImage: `url(${backgroundImageTCE})`,
            backgroundBlendMode: 'multiply',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(1, 2, 19, 0.5)'
        }}>

            <FormControl component="form" onSubmit={handleSubmit(onSubmit)}>
                <Paper sx={{ p: 6, pl: 10, pr: 10 }}>
                    <FormGroup >
                        <FormLabel>Insira o e-mail de cadastro no sistema para mudar sua senha.</FormLabel>
                        <FormLabel sx={{ fontSize: "12px" }}>Um e-mail de redefinição de senha será enviado.
                        </FormLabel>
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
                            <Typography variant="caption" sx={{ color: 'red' }}>
                                {errors.email.message}
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

export default PasswordChanger