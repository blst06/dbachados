import { Backdrop, Box, Button, Fade, IconButton, Modal, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react'
import Divider from '@mui/material/Divider';
import { useTheme, Theme } from '@mui/material/styles';




export interface ModalAnalisesProps {
  analise: string
}

const ModalAnalises: React.FC<ModalAnalisesProps> = ({ analise }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const isTitle = (text: string) => text.startsWith('# ') && !text.includes('\n');

  const theme = useTheme<Theme>();

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 24,
    overflowY: 'auto',
    height: 'fit-content',
    maxHeight: '95vh',
    scrollbarWidth: 'thin',
    borderRadius: '10px',
    color: theme.palette.text.primary,
  };

  return (
    <>
      <Button onClick={handleOpen} variant="outlined">Exibir</Button>
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
            {analise ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
                  <Typography variant='h6'>Texto de Análise: </Typography>
                  <IconButton onClick={handleClose} sx={{
                    '&:hover': {
                      bgcolor: '#1e293b', color: '#ffffff',
                    }
                  }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider></Divider>
                {analise.split('\n').map((line, index) => (
                  <Box
                    key={index}
                    sx={{
                      borderRadius: 2,
                      padding: '10px',
                      textAlign: 'justify',
                      width: '70vw',
                      fontWeight: isTitle(line) ? 'bold' : 'normal'
                    }}>
                    <Typography
                      key={index}
                      sx={{ width: '68vw' }}
                      variant={isTitle(line) ? 'h6' : 'body1'}
                    >
                      {isTitle(line) ? line.substring(2) : line}
                    </Typography>
                  </Box>

                ))}
              </>

            ) : (
              <Typography sx={{ border: '1px solid #000', borderRadius: 2, padding: '20px 20px 20px', boxShadow: '1px 2px 4px' }}>Sem Análise</Typography>
            )}

          </Box>
        </Fade>

      </Modal>
    </>
  )
}

export default ModalAnalises