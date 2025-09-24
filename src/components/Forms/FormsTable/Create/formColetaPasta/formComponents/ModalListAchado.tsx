import { Backdrop, Box, Button, Fade, Modal } from '@mui/material'
import { useState } from 'react'
import { Achado } from '../../../../../../types/types';
import TableAchados from './TableAchados';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    overflowY: 'auto',
    height: 'fit-content',
    maxHeight: '95vh',
    scrollbarWidth: 'thin',
    background: 'linear-gradient(90deg, #e2e8f0, #f1f5f9)',
    borderRadius: '10px',
};

export interface ModalListAchadoProps {
    onSelectAchado: (achado: Achado) => void;
}

const ModalListAchados: React.FC<ModalListAchadoProps> = ({ onSelectAchado }) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const dataType = 'achado';

    

    return (
        <>
            <Button  onClick={handleOpen} variant="outlined" >Selecionar Achado</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <>
                            <TableAchados dataType={dataType} closeFunction={handleClose} onAchadoSelected={onSelectAchado}/>
                        </>
                    </Box>
                </Fade>

            </Modal>
        </>
    )
}

export default ModalListAchados;