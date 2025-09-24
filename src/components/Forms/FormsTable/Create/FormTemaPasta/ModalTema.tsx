
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { useState } from 'react';
import FormTopicoAchado from './FormTopicoAchado';
import SaveIcon from '@mui/icons-material/Save';
import { User } from '../../../../../types/types';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
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

export interface ModalAddDataProps {
    dataType: string;
    user: User;
    closeModal?: () => void;
}


const ModalTema: React.FC<ModalAddDataProps> = ({ dataType, user }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    return (
        <div>
            <Button onClick={handleOpen} variant='contained'>
                <SaveIcon sx={{ mr: 1 }} /> Cadastrar {dataType}
            </Button>
            <Modal
                aria-labelledby="transition-modal-paraTema"
                aria-describedby="transition-modal-para-abrir-o-tema"
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
                        <FormTopicoAchado closeModal={handleClose} user={user} />
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default ModalTema;

