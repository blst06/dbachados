import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import FormTopicoAchado from '../../FormTemaPasta/FormTopicoAchado';
import { User } from '../../../../../../types/types';
import FormAchado from '../../FormAchadoPasta/FormAchados';
import FormProcesso from '../../FormProcessoPasta/FormProcesso';


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

interface ModalColetaProps {
  dataType: string;
  open: boolean;
  onClose: () => void;
  user: User;
}


const ModalColeta: React.FC<ModalColetaProps> = ({ dataType, open, onClose, user }) => {

  const renderForm = () => {
    switch (dataType) {
      case 'Tema':
        return <FormTopicoAchado closeModal={onClose}  user={user} />

      case 'Achado':
        return <FormAchado closeModal={onClose}  user={user} dataType={dataType} />

      case 'Processo':
        return <FormProcesso closeModal={onClose}  user={user} dataType={dataType} />
    }
  }

  return (
    <Box >
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
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
            {renderForm()}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export default ModalColeta;