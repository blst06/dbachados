import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../hooks/appStore';
import TableChartIcon from '@mui/icons-material/TableChart';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {  useState, useEffect } from 'react';
import env from '../../service/env';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function SideNav() {
  const theme = useTheme();
  const open = useAppStore((state) => state.dopen);
  const [email] = useState(localStorage.getItem('email'))
  

  const [pages, setPages] = useState<any>([
        // {name:'Análises', link:'/dashboard', icon: <QueryStatsIcon/> },
        {name:'Pesquisa de dados', link:'/dashboard/table',  icon:<TableChartIcon/>},
        
  ]);

  const verifyUser = () => {
    if(email === env.VITE_EMAIL_ADMIN){
      setPages([
        // {name:'Análises', link:'/dashboard', icon: <QueryStatsIcon/> },
        {name:'Pesquisa de dados', link:'/dashboard/table',  icon:<TableChartIcon/>},
        {name:'Gerência de usuários', link:'/dashboard/usersadmin',  icon:<GroupAddIcon/>}])
    }
  }
  const location = useLocation()


useEffect(() => {
  verifyUser()
},[])
  

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box height={30}/>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List sx={{pt:0}}>
            {pages.map((page:any, index:any) => (
              <ListItem key={index} disablePadding > 
                <ListItemButton
                  component={NavLink as any}
                  to={page?.link}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    ...(location.pathname === page.link && {
                      backgroundColor: `${theme.palette.primary.main} !important`,
                      color: `${theme.palette.primary.contrastText} !important`,
                    }),
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary,
                      ...(location.pathname === page.link && {
                        color: theme.palette.primary.contrastText,
                      })
                    }}
                  >
                    {page?.icon}
                  </ListItemIcon>
                  <ListItemText primary={page?.name} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box> 
    </>
  );
}


