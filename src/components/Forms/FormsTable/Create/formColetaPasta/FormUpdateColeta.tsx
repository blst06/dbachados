import { Autocomplete, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Controller, useForm } from 'react-hook-form';
import RegisterButton from "../../../../Buttons/RegisterButton";
import { Processo, Coleta, Achado, ColetaUpdate, User } from '../../../../../types/types';
import { useEffect, useState } from "react";
import useFetchAchado from "../FormAchadoPasta/useFetchAchado";
import { useContextTable } from "../../../../../context/TableContext";
import useFetchProcesso from "../FormProcessoPasta/useFetchProcesso";
import { formatCurrency } from "../../../../../hooks/DateFormate";
import SelectSanado from "../../../../Inputs/SelectSanado";
import useFetchColeta from "./useFetchColeta";
import { TypeAlert } from "../../../../../hooks/TypeAlert";
import { GridRowId } from "@mui/x-data-grid";
import Loader from "../../../../Loader/Loader";
import ColetaSkeleton from "./formComponents/ColetaSkeleton";
import useFetchTema from "../FormTemaPasta/useFetchTema";
import ModalListAchados from "./formComponents/ModalListAchado";
import CloseIconComponent from "../../../../Inputs/CloseIcon";
import { useTheme } from '@mui/material/styles';
import AchadoPaper from "./formComponents/AchadoPaper";


export interface FormUpdateColetaProps {
    closeModal: () => void;
    id: GridRowId;
    user: User;
}

const FormUpdateColeta: React.FC<FormUpdateColetaProps> = ({ closeModal, id }) => {

    const [coleta, setColeta] = useState<ColetaUpdate>()

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<Coleta>({
        defaultValues: {
            id: coleta?.coleta.id,
            temaId: coleta?.tema.id,
            achadoId: coleta?.achado.id,
            processoId: coleta?.processo.id,
            coletadorId: coleta?.coleta.coletadorId,
            valorFinanceiro: coleta?.coleta.valorFinanceiro,
            sanado: coleta?.coleta.sanado || '',
            unidade: coleta?.coleta.unidade,
            situacao_encontrada: coleta?.coleta.situacao_encontrada || '',
            comentario: coleta?.coleta.comentario || '',
            quantitativo: coleta?.coleta.quantitativo,
        },
    });
    const { updateColeta } = useFetchColeta();
    const { getAllAchados } = useFetchAchado();
    const { getAllProcessos } = useFetchProcesso();
    const { getAllTemas } = useFetchTema();
    const { arrayProcesso } = useContextTable();
    const [displayValue, setDisplayValue] = useState('');
    const fieldValue = watch('valorFinanceiro');
    const { getColetaById } = useFetchColeta();
    const [loading, setLoading] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [achado, setAchado] = useState<Achado | null>();
    const [_achadoTemaId, setAchadoTemaId] = useState<string>('');
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            await getAllTemas();
            await getAllAchados();
            await getAllProcessos();
        }
        fetchData();
    }, [])


    useEffect(() => {
        setIsLoading(true);
        const fetchColeta = async () => {
            try {
                const registro = await getColetaById(id as string)
                if (!registro) {
                    console.error("Erro ao buscar o registro de coleta")
                    return
                }
                setColeta(registro)
                setAchado(registro.achado)


                reset({
                    id: registro.coleta.id,
                    temaId: registro.tema.id || '',
                    achadoId: registro.achado.id || '',
                    processoId: registro.processo.id || '',
                    coletadorId: registro.coleta.coletadorId || '',
                    valorFinanceiro: registro.coleta.valorFinanceiro || 0,
                    sanado: registro.coleta.sanado || '',
                    unidade: registro.coleta.unidade || '',
                    situacao_encontrada: registro.coleta.situacao_encontrada || '',
                    comentario: registro.coleta.comentario || '',
                    quantitativo: registro.coleta.quantitativo || 0,
                })
            } catch (error) {
                console.error("Erro ao carregar coleta:", error);
            } finally {
                setIsLoading(false);

            }

        }
        fetchColeta();
    }, [id])

    const handleSelectAchado = (achado: Achado) => {
        if (achado.id) {
            setValue('achadoId', achado.id, { shouldValidate: true });
            setAchado(achado)
            setAchadoTemaId(achado.tema_id)
        }
    };


    // Atualiza o valor formatado quando o valor do campo muda
    useEffect(() => {
        if (fieldValue !== undefined) {
            setDisplayValue(formatCurrency(fieldValue.toString()));
        }
    }, [fieldValue]);

    const onSubmit = async (data: Coleta) => {
        try {
            setLoading(true)

            const updatedColeta = await updateColeta(data.id, data);

            if (updatedColeta) {
                TypeAlert("Coleta atualizada com sucesso", "success")
                closeModal()
                setLoading(false)
            } else {
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
            TypeAlert("Erro ao atualizar coleta", "error")
            console.error("Erro ao atualizar coleta:", error);
            closeModal()
        }
    }

    return (
        <>
            {
                isloading ? (
                    <ColetaSkeleton isLoading={isloading} />
                ) : (
                    <Box sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        padding: '20px 20px 20px',
                        boxShadow: '1px 2px 4px',
                        minWidth: '30vw'
                    }} component="form" name='formAchados' noValidate onSubmit={handleSubmit(onSubmit)} >
                        <CloseIconComponent closeModal={closeModal} textType='Atualizar Coleta' />

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="processoId"
                                    control={control}
                                    rules={{ required: 'Campo obrigatório' }}
                                    defaultValue={coleta?.processo.id || ""}
                                    render={({ field }) => (
                                        <Autocomplete
                                            disablePortal
                                            autoFocus
                                            id="autocomplete-processo"
                                            options={arrayProcesso}
                                            getOptionLabel={(option: Processo) => option.numero}
                                            defaultValue={arrayProcesso.find(processo => processo.id === field.value || null)}
                                            isOptionEqualToValue={(option, value) => option.id === value.id} // eu uso essa opção pra comparar a opção com o valor real no array Compara por ID
                                            onChange={(_, value) => field.onChange(value?.id || '')}
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
                                                    focused={true}
                                                    error={!!errors.processoId}
                                                    helperText={errors.processoId?.message}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                            <ModalListAchados onSelectAchado={handleSelectAchado} />
                            {achado &&
                                <AchadoPaper achado={achado} />
                            }
                        </Grid >
                        <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <SelectSanado
                                    id={"sanado"}
                                    label={"Sanado"}
                                    register={register}
                                    errors={errors}
                                    defaultValue={coleta?.coleta.sanado}
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
                                    autoFocus
                                    id="valorFinanceiro"
                                    label="Valor Financeiro"
                                    fullWidth
                                    error={!!errors?.valorFinanceiro}
                                    value={displayValue}
                                    inputProps={{
                                        inputMode: 'numeric',
                                    }}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const rawValue = e.target.value.replace(/\D/g, '');
                                        // Converte para número antes de setar o valor
                                        setValue('valorFinanceiro', Number(rawValue), { shouldValidate: true });
                                    }}
                                />
                                {errors?.valorFinanceiro && (
                                    <Typography variant="caption" sx={{ color: 'red', ml: '10px' }}>
                                        {errors.valorFinanceiro.message}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
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
                            <RegisterButton text="Atualizar" />
                        }
                    </Box >
                )

            }
        </>


    )
}

export default FormUpdateColeta;