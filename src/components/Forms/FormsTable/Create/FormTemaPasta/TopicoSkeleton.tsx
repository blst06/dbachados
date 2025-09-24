import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export interface TopicoSkeletonProps {
  isLoading:boolean;
}

const TopicoSkeleton:React.FC<TopicoSkeletonProps> = ({isLoading}) => {
  return (
    <Box sx={{ width: '70vw' }}>
      <Typography variant='h2'>{isLoading && <Skeleton sx={{ml:1, mr:3, width:'25vw', mt:2}} />}</Typography> 
      <Skeleton sx={{ml:1, mr:3, height:'120px'}} />
      <Skeleton sx={{ml:1, mr:3, width:'18vw', height:'5vw'}}/>
    </Box>
  );
}

export default TopicoSkeleton;
