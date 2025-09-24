import React from 'react'
import { Achado } from '../../../../../../types/types';
import { Box, Divider, Paper, Typography } from '@mui/material';
import HighlightedText from '../../../../../DataTable/HighLightMidleware';
import ModalColor from '../../../../FormsColors/ModalColor';

export interface AchadoPaperProps {
    achado: Achado;
}

const AchadoPaper: React.FC<AchadoPaperProps> = ({ achado }) => {

    return (
        <Paper sx={{ mb: 2, pb:1 }}>
            <Typography sx={{ mt: 2, pl: 2, pt: 1, fontWeight: 'bold' }}>Achado:</Typography>
            <Typography sx={{ p: 2, pt: 0 }}><HighlightedText text={achado.achado} /></Typography>

            <Divider />
            <Box sx={{ bgColor: '#f1f5f9', m:1 }}>
                <ModalColor />
            </Box>
        </Paper>
    )
}

export default AchadoPaper