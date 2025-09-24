import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useFetchUsers from '../Forms/SignForms/useFetchUsers';
import { useAuth } from '../../context/AuthContext';


export default function ListUsers() {

    const { users } = useAuth()
    const { getUsers } = useFetchUsers()


    useEffect(() => {
        try {
            if (users.length === 0) {
                getUsers()
            }
        } catch (error) {
            console.error("Erro ao buscar os usuários")
        }
    }, [users])

    return (
        <Grid sx={{ overflowY: 'auto', height: '95vh', scrollbarWidth: 'thin', pt: 10, pl: 2, pr: 2 }} >
            <Grid container sx={{ gap: 2, p: 0 }}>{users?.map((user: any) => (
                <List key={user.id} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: '100%', maxWidth: 380, bgcolor: 'background.paper', mb: 2 }}>
                    <AccountCircleIcon sx={{ fontSize: { xs: 30, sm: 40, md: 50 } }} />
                    <ListItem alignItems="center" sx={{ display: "flex", justifyContent: "center", textAlign: "center" }} >
                        <ListItemText
                            primary={user.nome}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline', fontSize: 16 }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {user.email}
                                        <br />
                                    </Typography>
                                    <Typography component='span' >
                                        {user.cargo}
                                    </Typography>
                                    <Typography component='span' sx={{ display: 'none' }}>
                                        {user.id}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                        <br />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </List>
            ))}</Grid>
        </Grid>
    );
}
