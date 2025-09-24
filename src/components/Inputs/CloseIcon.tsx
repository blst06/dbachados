import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close';

export interface CloseIconComponentProps {
    closeModal: () => void;
    textType: string;
}

const CloseIconComponent = ({ closeModal, textType }: CloseIconComponentProps) => {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap:5}}>
            <Typography
                variant="h5"
                sx={{
                    pt: 3,
                    pb: 3,
                    color: theme.palette.text.primary // usa a cor do tema
                }}
            >
                {textType}
            </Typography>
            <IconButton onClick={closeModal}
                sx={{
                    bgcolor: theme.palette.mode === 'dark' ? '#232b3b' : '#e0e7ef',
                    color: theme.palette.text.primary,
                    '&:hover': {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                    }
                }}>
                <CloseIcon />
            </IconButton>
        </Box>
    )
}

export default CloseIconComponent;