import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { useRef, useState } from 'react';
import FormTopicoAchado from '../../Forms/FormsTable/Create/FormTemaPasta/FormTopicoAchado';
import FormAchado from '../../Forms/FormsTable/Create/FormAchadoPasta/FormAchados';
import SaveIcon from '@mui/icons-material/Save';
import { User } from '../../../types/types';
import FormProcesso from '../../Forms/FormsTable/Create/FormProcessoPasta/FormProcesso';
import FormColeta from '../../Forms/FormsTable/Create/formColetaPasta/FormColeta';
import Helper from '../../Dialog/Helper';
import { Typography } from '@mui/material';


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
  borderRadius: '10px',
};

export interface ModalAddDataProps {
  dataType: string;
  textButton:string;
  user: User;
  closeModal?:() => void;
}


const ModalAddData: React.FC<ModalAddDataProps> = ({ dataType, user, textButton }) => {
  const openButtonRef  = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    openButtonRef .current?.focus();
    setOpen(false);
  }

  return (
    <div>
      <Helper title='Clique aqui para criar um novo registro'>
      <Button ref={openButtonRef}  onClick={handleOpen}  variant='contained'>
        <SaveIcon sx={{ mr: 1 }} /> 
        <Typography>Cadastrar {textButton}</Typography>
      </Button>
      </Helper>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        disableAutoFocus={true}
        disableEnforceFocus={true}
        disableRestoreFocus={false}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {(dataType === 'tema') && (<FormTopicoAchado closeModal={handleClose} user={user} />)}
            {(dataType === 'achado') && (<FormAchado closeModal={handleClose} user={user} dataType={dataType} />)}
            {(dataType === 'processo') && (<FormProcesso closeModal={handleClose} user={user} dataType={dataType} />)}
            {(dataType === 'relacionamentos') && (<FormColeta closeModal={handleClose} user={user} />)}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalAddData;

