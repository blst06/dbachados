import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useContextTable } from '../../../context/TableContext';
import { useEffect, useMemo, useState } from 'react';
import useFetchKeyWord from './useFetchKeyWord';
import DeleteVerification from '../../Dialog/VerificationStep';
import ColorCircleCopy from './ColorCircleCopy';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Helper from '../../Dialog/Helper';
import EditIcon from '@mui/icons-material/Edit';
import ModalUpdatePF from '../../Modals/DataTableModals/ModalUpdateForms';
import { useAuth } from '../../../context/AuthContext';

export default function KeyWordList() {
    const { arrayKeyWord, setArrayKeyWord } = useContextTable();
    const { escutarKeyWords } = useFetchKeyWord();
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [selectedKey, setSelectedKey] = useState('')
    const [dataType] = useState('keyword')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRow, setSelectedRow] = useState<string>('')
    const [openModal, setOpenModal] = useState(false)
    const { user } = useAuth();

    const arrayKeyWordFiltrado = useMemo(() => {
        if (!searchTerm.trim()) return arrayKeyWord;

        const termo = searchTerm.toLowerCase().trim();

        return arrayKeyWord.filter(keyword => {
            // Busca no campo 'label' (texto)
            const textoLabel = keyword.label.toLowerCase().includes(termo);

            // Busca no campo 'type'
            const textoType = keyword.type.toLowerCase().includes(termo);

            // Retorna true se qualquer um dos campos corresponder
            return textoLabel || textoType;
        });
    }, [arrayKeyWord, searchTerm]);


    function handleUpdate(selectedRow: string) {
        setSelectedRow(selectedRow);
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        const unsubscribe = escutarKeyWords((keywords) => {
            setArrayKeyWord(keywords);
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const handleDelete = async (id: string) => {
        setSelectedKey(id);
        setOpenModalDelete(true);
    }

    const handleCloseModalDelete = () => {
        setOpenModalDelete(false);
        setSelectedKey('');
    };

    return (
        <>{arrayKeyWord && arrayKeyWord.length > 0 ? (

            <List sx={{ width: '100%', bgcolor: 'background.paper', p: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar por, palavra-chave ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ p: 1, borderRadius: '5px' }}
                />
                {arrayKeyWordFiltrado.map((value, index) => (
                    <ListItem sx={{p:2}}
                        key={index}
                        disableGutters
                    >
                        <ListItemText 
                            primary={
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <ColorCircleCopy type={value.type} />
                                    {value.label}
                                </span>
                            }
                            secondary={`tipo: ${value.type}`} />
                        <Helper title="Clique aqui para editar o registro">
                            <IconButton color="primary" onClick={() => handleUpdate(value.id)}>
                                <EditIcon sx={{ fontSize: '30px', mb: 1, animation: 'flipInX 0.5s ease-in-out' }} />
                            </IconButton>
                        </Helper>
                        <Helper title="Clique aqui para deletar o registro">
                            <IconButton color="error" onClick={() => handleDelete(value.id)}

                            >
                                <DeleteIcon sx={{ fontSize: '30px', mb: 1, animation: 'flipInX 0.5s ease-in-out' }} />
                            </IconButton>
                        </Helper>
                    </ListItem>
                ))}
                {selectedRow !== null && (
                    <ModalUpdatePF
                        id={selectedRow}
                        dataType={dataType}
                        open={openModal}
                        user={user}
                        onClose={handleCloseModal}
                    />
                )}
                {selectedKey !== null && (
                    <DeleteVerification
                        selectedRow={selectedKey}
                        dataType={dataType}
                        onClose={handleCloseModalDelete}
                        open={openModalDelete}
                    />
                )}
            </List>
        ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>

                <Typography>Sem palavra-chave</Typography>
            </Box>
        )}
        </>

    );
}
