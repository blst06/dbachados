import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import { GridRowId } from '@mui/x-data-grid';
import { useState } from 'react';
import Loader from '../Loader/Loader';
import useFetchProcesso from '../Forms/FormsTable/Create/FormProcessoPasta/useFetchProcesso';
import useFetchAchado from '../Forms/FormsTable/Create/FormAchadoPasta/useFetchAchado';
import useFetchTema from '../Forms/FormsTable/Create/FormTemaPasta/useFetchTema';
import useFetchColeta from '../Forms/FormsTable/Create/formColetaPasta/useFetchColeta';
import useFetchKeyWord from '../Forms/FormsColors/useFetchKeyWord';



export interface VerificationProps {
    selectedRow: GridRowId;
    onClose: () => void;
    open: boolean;
    dataType: string;
}

const DeleteVerification: React.FC<VerificationProps> = ({ selectedRow, onClose, open, dataType }) => {
    const [loading, setLoading] = useState(false)
    const {deleteTema} = useFetchTema();
    const {deleteAchado} = useFetchAchado();
    const {deleteProcesso} = useFetchProcesso()
    const {deleteColeta} = useFetchColeta();
    const {deleteKeyword} = useFetchKeyWord();

    const handleDelete = async () => {
        if (dataType === 'tema') {
            setLoading(true)
            try {
                const id = selectedRow.toString();
                deleteTema(id)
                setLoading(false)
            } catch (error) {
                console.error("Erro ao tentar excluir o Tópico", error)
            }
        } else if (dataType === 'achado') {
            setLoading(true)
            try {
                const id = selectedRow.toString();
                deleteAchado(id)
                setLoading(false)
            } catch (error) {
                console.error("Erro ao tentar excluir o Achado", error)
            }
        } else if (dataType === 'processo') {
            setLoading(true)
            try {
                const id = selectedRow.toString();
                deleteProcesso(id)
                setLoading(false)
            } catch (error) {
                console.error("Erro ao tentar excluir o Processo", error)
            }
        } else if (dataType === 'relacionamentos') {
            setLoading(true)
            try {
                const id = selectedRow.toString();
                deleteColeta(id)
                setLoading(false)
            } catch (error) {
                console.error("Erro ao tentar excluir o Registro", error)
            }
        } else if (dataType === 'keyword') {
            setLoading(true)
            try {
                const id = selectedRow.toString();
                deleteKeyword(id)
                setLoading(false)
            } catch (error) {
                 console.error("Erro ao tentar excluir o Registro", error)
            }
        }
        onClose()
    };
    const handleClose = () => {
        onClose()
    };


    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Você tem certeza dessa ação?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Essa ação vai excluir o registro permanentemente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    {loading ? <Box sx={{display:"flex", justifyContent:"start", pl:3}}><Loader/></Box>:
                    <Button color="error" onClick={handleDelete} autoFocus>Excluir
                    </Button>}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default DeleteVerification
