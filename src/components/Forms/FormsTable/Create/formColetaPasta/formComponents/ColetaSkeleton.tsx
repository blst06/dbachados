import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

export interface ColetaSkeletonProps {
  isLoading: boolean;
}

const ColetaSkeleton: React.FC<ColetaSkeletonProps> = ({ isLoading }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.paper, 
      borderRadius: 2, 
      padding: '20px 20px 20px', 
      boxShadow: '1px 2px 4px',
      minWidth: '30vw' 
    }}>
      {/* Título */}
      <Typography variant='h2'>
        {isLoading && <Skeleton width="40%" height={50} sx={{ mb: 3 }} />}
      </Typography>

      {/* Seção Achado */}
      <Grid item xs={12} md={6} sx={{ mb: 2 }}>
        <Skeleton variant="rectangular" width="50%" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="40%" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={120} />
      </Grid>

      {/* Linha 1 - Processo e Sanado */}
      <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
      </Grid>

      {/* Linha 2 - Valor Financeiro e Unidade */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
      </Grid>

      {/* Linha 3 - Quantitativo e Situação Encontrada */}
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={12}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
        <Grid item xs={12} md={12}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
      </Grid>

      {/* Botão */}
      <Skeleton variant="rectangular" width="30%" height={40} />
    </Box>
  );
}

export default ColetaSkeleton;