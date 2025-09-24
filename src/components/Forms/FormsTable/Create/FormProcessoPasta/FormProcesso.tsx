import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import RegisterButton from '../../../../Buttons/RegisterButton';
import { Processo, User, Diretoria } from '../../../../../types/types';
import SelectInput from '../../../../Inputs/SelectInput';
import { useEffect, useState } from 'react';
import useFetchProcesso from './useFetchProcesso';
import { TypeAlert } from '../../../../../hooks/TypeAlert';
import { diretoriasJson } from '../../../../../service/diretoriasJson';
import Loader from '../../../../Loader/Loader';
import CloseIconComponent from '../../../../Inputs/CloseIcon';
import { useTheme } from '@mui/material/styles';

export interface FormProcessoProps {
    closeModal: () => void;
    user: User | undefined;
    dataType: string;
}

const FormProcesso: React.FC<FormProcessoProps> = ({ closeModal }) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Processo>({});
    const [diretorias, setDiretorias] = useState<Diretoria[]>([])
    const { addProcesso } = useFetchProcesso();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const fetchDiretorias = async () => {
            setDiretorias(diretoriasJson);
        };

        fetchDiretorias();
    }, []);
    const onSubmit = async (data: Processo) => {
        try {     
            setLoading(true)
            const processo = await addProcesso(data);
            if (processo) {
                TypeAlert("Processo adicionado", "success");
                reset()
                closeModal()
            } 
        } catch (error) {
            console.error("Erro ao adicionar processo:", error);
        }
    }

    return (
        <Box sx={{backgroundColor:theme.palette.background.paper, borderRadius: 2, padding: '20px 20px 20px', boxShadow: '1px 2px 4px' }} component="form" name='formProcesso' noValidate onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}>
            <CloseIconComponent closeModal={closeModal} textType='Cadastrar proposta de Processo' />
            <Grid container spacing={2} sx={{ pb: 1 }}>
                <Grid item xs={12} sx={{ pb: 1 }}>
                    <TextField
                        variant='filled'
                        required
                        fullWidth
                        placeholder='XXXXX/20XX'
                        autoFocus
                        id="numero"
                        label='Número'
                        type="string"
                        error={!!errors?.numero}
                        {...register('numero', {
                            required: 'Campo obrigatório',
                            pattern: {
                                value: /^\d{5}\/\d{4}$/,
                                message: 'Número de processo inválido'
                            }
                        })}
                    />
                    {errors?.numero && (
                        <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                            {errors.numero.message}
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12} >
                    <TextField
                        variant='filled'
                        required
                        fullWidth
                        autoFocus
                        id="unidadeGestora"
                        label='Unidade Gestora'
                        type="string"
                        error={!!errors?.unidadeGestora}
                        {...register('unidadeGestora', {
                            required: 'Campo obrigatório',
                        })}
                    />
                    {errors?.unidadeGestora && (
                        <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                            {errors.unidadeGestora.message}
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12} sx={{ pb: 1 }}>
                    <FormControl  fullWidth margin="normal" variant="filled">
                        <InputLabel id="diretoria-label">Diretoria</InputLabel>
                        <Select
                            labelId='diretoria-label'
                            id="diretoria-select"
                            label="'Diretoria"
                            {...register('diretoria', { required: 'Campo obrigatório' })}
                            defaultValue={""}
                        >
                            <MenuItem value="">
                                <em>Selecione...</em>
                            </MenuItem>
                            {diretorias.map((diretoria) => (

                                <MenuItem key={diretoria.id} value={diretoria.id}>
                                    {diretoria.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {/* Exibe a mensagem de erro */}
                        {errors.diretoria && (
                            <FormHelperText sx={{ color: 'red', ml: '10px' }} error>
                                {errors.diretoria.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Grid>


                <Grid item xs={6} sm={4} md={2}>
                    <TextField
                        variant='filled'
                        required
                        fullWidth
                        placeholder='xxxxx'
                        autoFocus
                        id="exercicio"
                        label='Exercício'
                        type="string"
                        error={!!errors?.exercicio}
                        {...register('exercicio', {
                            required: 'Campo obrigatório',
                            pattern: {
                                value: /^\d{4}$/,
                                message: 'Exercício inválido'
                            }
                        })}
                    />
                    {errors?.exercicio && (
                        <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                            {errors.exercicio.message}
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={6} sm={4} md={2} >
                    <SelectInput
                        id={'julgado'}
                        register={register}
                        errors={errors}
                        label={"Status do Julgado"}
                    />
                </Grid>
            </Grid>
           {loading ?
                        <Box sx={{ display: 'flex', justifyContent: 'start', mt: 3 }}>
                            <Loader />
                        </Box> :
                        <RegisterButton text="Registrar" />
                    }
        </Box>
    )
}
export default FormProcesso;


