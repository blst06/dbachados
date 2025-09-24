import { Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export interface KeywordSkeleltonProps {
  isLoading: boolean;
}

const KeywordSkelelton: React.FC<KeywordSkeleltonProps> = ({ isLoading }) => {
  const theme = useTheme();
  
  //reveja esse método, não funcionou, tente usar os tamanhos pré-definidos que o vinicius fez na branch dele
  //const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setScreenWidth(window.innerWidth)
  //   };
  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   }
  // }, []);


  return (
    <Box sx={{ bgcolor:theme.palette.background.paper, minWidth: '20vw'}}>
      <Typography variant='h2'>{isLoading && <Skeleton sx={{ ml: 1, mr: 3, }} />}</Typography>
      <Skeleton sx={{ ml: 1, mr: 3, height: '90px' }} />
      <Skeleton sx={{ ml: 1, mr: 3, height: '90px', width:'20vw' }} />
      <Skeleton sx={{ ml: 1, mr: 3, height: '90px', width:'7vw' }} />
      <Skeleton sx={{ ml: 1, mr: 3, height: '70px', width:'12vw' }} />
    </Box>
  );
}

export default KeywordSkelelton;
