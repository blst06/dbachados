import { Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export interface AchadoSkeletonProps {
  isLoading: boolean;
}

const AchadoSkeleton: React.FC<AchadoSkeletonProps> = ({ isLoading }) => {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor:theme.palette.background.paper}}>
      <Typography variant='h2'>{isLoading && <Skeleton sx={{ ml: 1, mr: 3, minWidth: '30vw'}} />}</Typography>
      <Skeleton sx={{ ml: 1, mr: 3, height: '90px' }} />
      <Skeleton sx={{ ml: 1, mr: 3, height: '90px' }} />
      <Skeleton sx={{ ml: 1, mr: 3, height: '75px', width: '15vw', mt: '-30px' }} />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Skeleton sx={{ ml: 1, mr: 3, height: '75px', width: '10vw' }} />
        <Skeleton sx={{ ml: 1, mr: 3, height: '75px', width: '15vw' }} />
      </Box>
      <Skeleton sx={{ ml: 1, mr: 3, height: '75px', width: '15vw', mb: '-37px' }} />
      <Skeleton sx={{ ml: 1, mr: 3, height: '120px' }} />
      <Skeleton sx={{ ml: 1, mr: 3, height: '150px' }} />
      <Skeleton sx={{ ml: 1, mr: 3, width: '15vw', height: '5vw' }} />
    </Box>
  );
}

export default AchadoSkeleton;
