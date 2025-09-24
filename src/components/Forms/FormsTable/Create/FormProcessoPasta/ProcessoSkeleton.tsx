import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export interface ProcessoSkeletonProps {
  isLoading: boolean;
}

const ProcessoSkeleton: React.FC<ProcessoSkeletonProps> = ({ isLoading }) => {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor:theme.palette.background.paper, borderRadius: 2, padding: '20px 20px 20px', boxShadow: '1px 2px 4px' }}>
      <Typography variant='h2'>{isLoading && <Skeleton sx={{ ml: 1, mr: 3, mt: 2, minWidth: '40vw' }} />}</Typography>
      <Typography variant='h2'>{isLoading && <Skeleton sx={{ ml: 1, mr: 3, mt: 2 }} />}</Typography>
      <Typography variant='h2'>{isLoading && <Skeleton sx={{ ml: 1, mr: 3 }} />}</Typography>
      <Typography variant='h2'>{isLoading && <Skeleton sx={{ ml: 1, mr: 3 }} />}</Typography>
      <Box sx={{display:"flex", flexDirection:"row", gap:2, mb:2}}>
        <Skeleton sx={{ ml: 1, mr: 3, width: '15vw', height: '4vw' }} />
        <Skeleton sx={{ ml: 1, mr: 3, width: '15vw', height: '4vw' }} />
      </Box>
      <Skeleton sx={{ ml: 1, mr: 3, width: '15vw', height: '4vw' }} />
    </Box>
  );
}

export default ProcessoSkeleton;
