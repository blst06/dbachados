import { useState } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { KeyWord } from '../../../types/types';
import RegisterButton from '../../Buttons/RegisterButton';
import Loader from '../../Loader/Loader';
import useFetchKeyWord from './useFetchKeyWord';
import SelectSanado from '../../Inputs/SelectSanado';

export interface formKeyWordProps {
    handleExpanded: (expanded: boolean) => void;
}

export default function formKeyWord({ handleExpanded }: formKeyWordProps) {
    const [_color, setColor] = useState<string>('#ffffff');
    const { handleSubmit, register, formState: { errors }, reset } = useForm<KeyWord>({});
    const [loading, setLoading] = useState(false);
    const { addKeyWord } = useFetchKeyWord();

    const onSubmit = async (data: KeyWord) => {
        try {
            setLoading(true)
            addKeyWord(data);
            reset();

        } catch (error) {
            console.error("Erro ao adicionar a palavra-chave:", error);
            setLoading(false)
        } finally {
            setLoading(false)
            setColor('#ffffff');
            handleExpanded(false);
        }
    }

    return (
        <Box sx={{ borderRadius: 2, padding: '20px 20px 20px', boxShadow: '1px 2px 4px' }} component="form" name='formColor' id='formColor' noValidate onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
        }}>
            <Typography variant="h6" gutterBottom>Inserir nova palavra-chave</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mb: 3 }}>
                    <TextField
                        variant='filled'
                        required
                        fullWidth
                        autoFocus
                        id="label"
                        label='Palavra Chave'
                        type="text"
                        error={!!errors?.label}
                        {...register('label', {
                            required: 'Campo obrigatório'
                        })}
                    />

                    {errors?.label && (
                        <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                            {errors.label.message}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} >
                    <SelectSanado
                        id={"type"}
                        label={"Tipo"}
                        register={register}
                        errors={errors}
                        options={[
                            { value: "problema", label: "problema" },
                            { value: "objeto", label: "objeto" }
                        ]}
                    />
                </Grid>
            </Grid>
            {loading === false ? <RegisterButton text="Registrar" /> : <Loader />}
        </Box>
    );
}