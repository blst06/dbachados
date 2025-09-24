import { Autocomplete, Divider, TextField, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Controller, useForm } from 'react-hook-form';
import RegisterButton from "../../../../Buttons/RegisterButton";
import { Processo, User, Coleta, Achado } from '../../../../../types/types';
import { useEffect, useState } from "react";
import useFetchAchado from "../FormAchadoPasta/useFetchAchado";
import { useContextTable } from "../../../../../context/TableContext";
import useFetchProcesso from "../FormProcessoPasta/useFetchProcesso";
import { formatCurrency } from "../../../../../hooks/DateFormate";
import SelectSanado from "../../../../Inputs/SelectSanado";
import useFetchColeta from "./useFetchColeta";
import { TypeAlert } from "../../../../../hooks/TypeAlert";
import GroupButtonColeta from "./formComponents/ButtonGroup";
import useFetchTema from "../FormTemaPasta/useFetchTema";
import ModalListAchados from "./formComponents/ModalListAchado";
import Loader from "../../../../Loader/Loader";
import ModalUpdatePF from "../../../../Modals/DataTableModals/ModalUpdateForms";
import { GridRowId } from "@mui/x-data-grid";
import CloseIconComponent from "../../../../Inputs/CloseIcon";
import AchadoPaper from "./formComponents/AchadoPaper";
export interface FormColetaProps {
    closeModal: () => void;
    user: User;
}

const FormColeta: React.FC<FormColetaProps> = ({ closeModal, user }) => {

    const { arrayProcesso, lastSelectedProcessoId, setLastSelectedProcessoId } = useContextTable();
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<Coleta>({
        defaultValues: {
            sanado: "",
            processoId: lastSelectedProcessoId || "",
        }
    });
    const { addColeta } = useFetchColeta();
    const { getAllAchados } = useFetchAchado();
    const { getAllProcessos } = useFetchProcesso();
    const { getAllTemas } = useFetchTema();
    const [achado, setAchado] = useState<Achado | null>();
    const [displayValue, setDisplayValue] = useState('');
    const fieldValue = watch('valorFinanceiro');
    const [_achadoTemaId, setAchadoTemaId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [dataType, setDataType] = useState<string>('')
    const { getAchadoById } = useFetchAchado();
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            await getAllAchados();
            await getAllTemas();
            await getAllProcessos();
        }
        fetchData();
    }, [])

    // Atualiza o valor formatado quando o valor do campo muda
    useEffect(() => {
        if (fieldValue !== undefined) {
            setDisplayValue(formatCurrency(fieldValue.toString()));
        }
    }, [fieldValue]);


    const handleSelectAchado = (achado: Achado) => {
        if (achado.id) {
            setValue('achadoId', achado.id, { shouldValidate: true });
            setAchado(achado)
            setDataType('achado')
            setAchadoTemaId(achado.tema_id)
        }
    };

    const handleCloseModal = async () => {
        setOpenModal(false);
        if (achado?.id) {
            const updatedAchado = await getAchadoById(achado.id);
            if (updatedAchado) setAchado(updatedAchado.achado)
        }
    };


    const onSubmit = async (data: Coleta) => {
        try {
            setLoading(true)
            const formData = {
                ...data,
                coletadorId: user.id
            }

            const Coleta = await addColeta(formData);
            if (Coleta) {
                TypeAlert("Coleta adicionada", "success");
                reset()
                closeModal()
            }
        } catch (error) {
            TypeAlert("Erro ao tentar adicionar a coleta", "error")
            console.log("Erro no Submit", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ borderRadius: 2, padding: '20px 20px 20px', boxShadow: '1px 2px 4px' }} component="form" name='formColeta' id='formColeta' noValidate onSubmit={handleSubmit(onSubmit)}>
            <CloseIconComponent closeModal={closeModal} textType='Cadastro de proposta de Coleta' />
            <Grid item xs={12} sx={{ mb: 2 }} >
                <Divider textAlign="center" sx={{ my: 4, color: theme.palette.text.primary }}>Seção de Formulários</Divider>
                <GroupButtonColeta />
                <Divider textAlign="center" sx={{ my: 4, color: theme.palette.text.primary }}>Seção de relação Tema - Achado - Processo</Divider>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                {/* Processo - Ocupa metade da linha */}
                <Grid item xs={12} md={6}>
                    <Controller
                        name="processoId"
                        control={control}
                        rules={{ required: 'Campo obrigatório' }}
                        render={({ field }) => (
                            <Autocomplete
                                disablePortal
                                id="autocomplete-processo"
                                options={arrayProcesso}
                                getOptionLabel={(option: Processo) => option.numero}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={arrayProcesso.find(p => p.id === field.value) || null}
                                onChange={(_, value) => {
                                    const newId = value?.id || '';
                                    field.onChange(newId);
                                    setLastSelectedProcessoId(newId);
                                }}
                                ListboxProps={{
                                    style: {
                                        maxHeight: '200px',
                                        overflow: 'auto',
                                    },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Processo"
                                        variant="filled"
                                        placeholder="Selecione um processo"
                                        error={!!errors.processoId}
                                        helperText={errors.processoId?.message}
                                        fullWidth
                                    />
                                )}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    {achado &&
                        <AchadoPaper achado={achado} />
                    }
                </Grid >

                <Grid item xs={12} md={12}>
                    <ModalListAchados onSelectAchado={handleSelectAchado} />
                </Grid>
                {/* Sanado - Ocupa metade da linha */}

            </Grid>

            {/* Segunda linha com 2 campos */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Valor Financeiro - Ocupa metade da linha */}
                <Grid item xs={12} md={6}>
                    <SelectSanado
                        id={"sanado"}
                        label={"Sanado"}
                        register={register}
                        errors={errors}
                        options={[
                            { value: "sanado", label: "sanado" },
                            { value: "não sanado", label: "não Sanado" }
                        ]}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        variant="filled"
                        placeholder="R$ 0,00"
                        id="valorFinanceiro"
                        label="Valor Financeiro"
                        error={!!errors?.valorFinanceiro}
                        value={displayValue}
                        inputProps={{
                            inputMode: 'numeric',
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const rawValue = e.target.value.replace(/\D/g, '');
                            setValue('valorFinanceiro', Number(rawValue), { shouldValidate: true });
                        }}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Terceira linha com 2 campos */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Unidade - Ocupa metade da linha */}
                <Grid item xs={12} md={6}>
                    <TextField
                        variant="filled"
                        id="unidade"
                        label="Unidade"
                        type="text"
                        error={!!errors?.unidade}
                        {...register('unidade')}
                        fullWidth
                    />
                </Grid>
                {/* Quantitativo - Ocupa metade da linha */}
                <Grid item xs={12} md={6}>
                    <TextField
                        variant="filled"
                        id="quantitativo"
                        label="Quantitativo"
                        type="number"
                        error={!!errors?.quantitativo}
                        {...register('quantitativo')}
                        fullWidth
                    />
                    {errors?.quantitativo && (
                        <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                            {errors.quantitativo.message}
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Situação Encontrada - Ocupa metade da linha */}
                <Grid item xs={12} md={12}>
                    <TextField
                        variant="filled"
                        id="comentario"
                        multiline
                        label="Comentário"
                        type="text"
                        error={!!errors?.comentario}
                        {...register('comentario')}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Situação Encontrada - Ocupa toda a linha */}
                <Grid item xs={12} md={12}>
                    <TextField
                        variant="filled"
                        id="situacao_encontrada"
                        multiline
                        label="Situação Encontrada"
                        type="text"
                        error={!!errors?.situacao_encontrada}
                        {...register('situacao_encontrada')}
                        fullWidth
                    />
                </Grid>
            </Grid>
            {loading ?
                <Box sx={{ display: 'flex', justifyContent: 'start', mt: 3 }}>
                    <Loader />
                </Box> :
                <RegisterButton text="Registrar" />
            }
            {achado?.id !== null && (
                <ModalUpdatePF
                    id={achado?.id as GridRowId}
                    dataType={dataType}
                    open={openModal}
                    user={user}
                    onClose={handleCloseModal}
                />
            )}
        </Box >
    )
}

export default FormColeta;