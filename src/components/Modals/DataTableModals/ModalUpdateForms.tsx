import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { GridRowId } from '@mui/x-data-grid';
import FormUpdateAchados from '../../Forms/FormsTable/Create/FormAchadoPasta/FormUpdateAchados';
import FormUpdateTopicoAchado from '../../Forms/FormsTable/Create/FormTemaPasta/formUpdateTopicoAchado';
import { User } from '../../../types/types';
import FormUpdateProcesso from '../../Forms/FormsTable/Create/FormProcessoPasta/FormUpdateProcesso';
import FormUpdateColeta from '../../Forms/FormsTable/Create/formColetaPasta/FormUpdateColeta';
import FormUpdateKeyWord from '../../Forms/FormsColors/FormUpdateKeyWord';

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

interface ModalUpdateProps {
  id: GridRowId | string;
  dataType: string;
  open: boolean;
  onClose: () => void;
  user: User;
}


const ModalUpdatePF: React.FC<ModalUpdateProps> = ({ id, dataType, open, onClose, user }) => {

  const renderForm = () => {
    switch (dataType) {
      case 'tema':
        return <FormUpdateTopicoAchado closeModal={onClose} id={id} user={user} />

      case 'achado':
        return <FormUpdateAchados closeModal={onClose} id={id} user={user} dataType={dataType} />

      case 'processo':
        return <FormUpdateProcesso closeModal={onClose} id={id} user={user} dataType={dataType} />

      case 'relacionamentos':
        //o formUpdateColeta usa um dataTypeLocal para conseguir abrir o formUpdateAchado
        return <FormUpdateColeta closeModal={onClose} id={id}  user={user} />

      case 'keyword':
        //o formUpdateColeta usa um dataTypeLocal para conseguir abrir o formUpdateAchado
        return <FormUpdateKeyWord closeModal={onClose} id={id}  user={user} />
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

export default ModalUpdatePF;