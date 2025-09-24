import { Box, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { KeyWord, KeyWordUpdate, User } from "../../../types/types";
import useFetchKeyWord from "./useFetchKeyWord";
import { GridRowId } from "@mui/x-data-grid";
import RegisterButton from "../../Buttons/RegisterButton";
import Loader from "../../Loader/Loader";
import { useEffect, useState } from "react";
import CloseIconComponent from "../../Inputs/CloseIcon";
import SelectSanado from "../../Inputs/SelectSanado";
import KeywordSkelelton from "./KeywordSkeleton";

interface FormUpdateKeyWordProps {
    closeModal: () => void;
    id: GridRowId | string;
    user: User;
}

const FormUpdateKeyWord: React.FC<FormUpdateKeyWordProps> = ({ closeModal, id }) => {
    const [keyword, setKeyword] = useState<KeyWord>();
    const { handleSubmit, register, reset, formState: { errors } } = useForm<KeyWord>({
    });
    const { updateKeyWord } = useFetchKeyWord();
    const [loading, setLoading] = useState(false);
    const { getKeywordById } = useFetchKeyWord();

    console.log(id)

    useEffect(() => {
        const fetchData = async () => {
            const keyword = await getKeywordById(id);
            if (keyword) {
                setKeyword(keyword);
            }
        };
        fetchData();
    }, [id, getKeywordById, reset]);

    const onSubmit = async (data: KeyWordUpdate) => {
        try {
            setLoading(true)
            if (keyword) {
                const dataToUpdate = {
                    ...data,
                    id: keyword.id
                }
                await updateKeyWord(dataToUpdate)
            }

        } catch (error) {
            console.log("erro no submit de updatekeyword", error)
        } finally {
            setLoading(false)
            closeModal()
        }
    }

    return (
        <>
            {keyword ? (
                <Box sx={{
                    borderRadius: 2,
                    padding: '20px 20px 20px',
                    boxShadow: '1px 2px 4px',
                    backgroundColor:'background.paper'

                }}
                    component="form" name='formUpdateColor' id='formUpdateColor' noValidate onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit(onSubmit)(e);
                    }}>
                    <CloseIconComponent closeModal={closeModal} textType='Atualizar Palavra-chave' />
                    <Grid item xs={12} sx={{ mb: 3 }}>
                        <TextField
                            variant='filled'
                            autoComplete="given-name"
                            type="text"
                            defaultValue={keyword?.label}
                            required
                            fullWidth
                            id="label"
                            label="Palavra-chave"
                            error={errors?.label?.type === 'required'}
                            {...register('label', {
                                required: 'Campo obrigatório',
                            })}
                        />
                        {errors?.label && (
                            <Typography variant="caption" sx={{ color: 'red', ml: '10px', mb: 0 }}>
                                {errors.label?.message}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SelectSanado
                            id={"type"}
                            label={"Tipo"}
                            register={register}
                            errors={errors}
                            defaultValue={keyword?.type}
                            options={[
                                { value: "problema", label: "problema" },
                                { value: "objeto", label: "objeto" }
                            ]}
                        />
                    </Grid>
                    {loading === false ? <RegisterButton text="Atualizar" /> : <Loader />}

                </Box>

            ) : (
                <KeywordSkelelton isLoading={loading}/>
            )}
        </>


    )
}

export default FormUpdateKeyWord;