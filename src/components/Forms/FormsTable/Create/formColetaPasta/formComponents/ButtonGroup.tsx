import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../../../../../../context/AuthContext';
import ModalColeta from './ModalColeta';
import { useState } from 'react';
import Helper from '../../../../../Dialog/Helper';



const GroupButtonColeta = () => {
    const itens = ['Tema', 'Achado', 'Processo']
    const { user } = useAuth()
    const [modalOpen, setModalOpen] = useState(false);
    const [dataType, setDataType] = useState('');

    const handleClose = () => {
        setModalOpen(false)
    }

    const handleModalForm = (item: string) => {
        setDataType(item);
        setModalOpen(true);

    }
    return (
        <>
            <ButtonGroup id="buttonGroupColeta" variant="contained" aria-label="Button group coleta">
                {itens.map((item, index) => (
                    <Helper title="Clique aqui para criar um novo registro">
                        <Button key={index} onClick={() => handleModalForm(item)}>
                            <SaveIcon sx={{ mr: 0.5 }} />
                            Proposta de {item}
                        </Button>
                    </Helper>
                ))}
            </ButtonGroup>

            <ModalColeta
                dataType={dataType}
                open={modalOpen}
                onClose={handleClose}
                user={user}
            />
        </>
    );
}

export default GroupButtonColeta;
