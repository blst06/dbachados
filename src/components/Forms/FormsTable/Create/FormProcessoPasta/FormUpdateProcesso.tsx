import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RegisterButton from '../../../../Buttons/RegisterButton';
import { Processo, User, Diretoria } from '../../../../../types/types';
import SelectInput from '../../../../Inputs/SelectInput';
import { useEffect, useState } from 'react';
import useFetchProcesso from './useFetchProcesso';
import { TypeAlert } from '../../../../../hooks/TypeAlert';
import { diretoriasJson } from '../../../../../service/diretoriasJson';
import { GridRowId } from '@mui/x-data-grid';
import ProcessoSkeleton from './ProcessoSkeleton';
import Loader from '../../../../Loader/Loader';
import CloseIconComponent from '../../../../Inputs/CloseIcon';

export interface FormProcessoProps {
    closeModal: () => void;
    user: User | undefined;
    dataType: string;
    id: GridRowId | undefined;
}

const FormUpdateProcesso: React.FC<FormProcessoProps> = ({ closeModal, id }) => {

    const [diretorias, setDiretorias] = useState<Diretoria[]>([])
    const [processo, setProcesso] = useState<Processo | null>()
    const { getProcesso, updateProcesso } = useFetchProcesso();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Processo>({
        defaultValues: {
            id: processo?.id,
            numero: processo?.numero,
            exercicio: processo?.exercicio,
            julgado: processo?.julgado,
            unidadeGestora: processo?.unidadeGestora,
            diretoria: processo?.diretoria,
        }
    });
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const theme = useTheme();

    useEffect(() => {
        if (id) {
            setIsLoading(true)
            const fetchProcesso = async () => {
                const idString = id.toString();
                const searchProcesso = await getProcesso(idString);
                if (searchProcesso) {
                    setProcesso(searchProcesso)
                }
                reset({
                    id: searchProcesso?.id || '',
                    numero: searchProcesso?.numero || '',
                    exercicio: searchProcesso?.exercicio || '',
                    julgado: searchProcesso?.julgado || '',
                    unidadeGestora: searchProcesso?.unidadeGestora || '',
                    diretoria: searchProcesso?.diretoria || '',

                })
                setIsLoading(false)
            }
            fetchProcesso();
        }
    }, [id, reset])

    useEffect(() => {
        const fetchDiretorias = async () => {
            setDiretorias(diretoriasJson);
        };

        fetchDiretorias();
    }, []);

    const onSubmit = async (data: Processo) => {
        setLoading(true)
        try {
            const idProcesso = id?.toString();
            if (idProcesso) {
                const updatedProcesso = await updateProcesso(idProcesso, data)

                if (updatedProcesso) {
                    TypeAlert("Processo atualizado com sucesso", "success")
                    reset()
                    closeModal();
                }
            };
        } catch (error) {
            console.log(error)
            TypeAlert("Erro ao tentar atualizar o registro", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {isLoading ? (
                <ProcessoSkeleton isLoading={isLoading} />
            ) : (

                <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2, padding: '20px 20px 20px', boxShadow: '1px 2px 4px' }} component="form" name='formProcesso' noValidate onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit(onSubmit)(e);
                }} >
                    <CloseIconComponent closeModal={closeModal} textType='Atualizar Processo' />
                    <Grid container spacing={2} sx={{ pb: 1 }}>
                        <Grid item xs={12} sx={{ pb: 1 }}>
                            <TextField
                                variant='filled'
                                required
                                fullWidth
                                placeholder='XXXX/20XX'
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

                        <Grid item xs={12} sx={{ pb: 1 }}>
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
                            <FormControl fullWidth margin="normal" variant="filled">
                                <InputLabel id="diretoria-label">Diretoria</InputLabel>
                                <Select
                                    labelId='diretoria-label'
                                    id="diretoria-select"
                                    label="'Diretoria"
                                    {...register('diretoria', { required: 'Campo obrigatório' })}
                                    defaultValue={processo?.diretoria}
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
                                placeholder='XXXX'
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
                                julgado={processo?.julgado}
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
                        <RegisterButton text="Atualizar" />
                    }
                </Box >
            )}
        </>
    )
}
export default FormUpdateProcesso;


