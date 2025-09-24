import { Backdrop, Box, Button, Divider, Fade, Modal, Paper } from '@mui/material'
import { useState } from 'react'
import KeyIcon from '@mui/icons-material/Key';
import AccordionTransition from '../../Accordion/Accordion';
import KeyWordList from './KeyWordList';
import Helper from '../../Dialog/Helper';
import CloseIconComponent from '../../Inputs/CloseIcon';

const ModalColor = () => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    overflowY: 'auto',
    height: 'fit-content',
    maxHeight: '95vh',
    scrollbarWidth: 'thin',
    borderRadius: '10px',
};
    
    return (
        <>
            <Helper title='Clique para gerenciar palavras-chave'>
                <Button onClick={handleOpen} variant="outlined">
                    <KeyIcon fontSize="small" sx={{ mr: .5 }} />
                    Palavras-Chave
                </Button>
            </Helper>
            <Modal
                aria-labelledby="transition-modal-color"
                aria-describedby="transition-modal-description-color"
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
                    <Paper sx={style}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pl:2, pr:2 }}>
                            <CloseIconComponent closeModal={handleClose} textType='Gerenciar Palavras-chave' />
                        </Box>
                        <Divider />
                        <Box >
                            <AccordionTransition />
                            <Divider />
                            <KeyWordList />
                        </Box>


                    </Paper>
                </Fade>

            </Modal>
        </>
    )
}

export default ModalColor;