import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import SignIn from './pages/SignPage/SignIn';
import { AuthProvider } from './context/AuthContext';
import Table from './pages/Dashboard/Table/Table';
import PrivateRoutes from './routes/PrivateRoutes';
import UsersAmin from './pages/Dashboard/Users_admin/UsersAdmin';
import ProfilePage from './pages/Dashboard/Profile/ProfilePage';
import PasswordChanger from './pages/SignPage/PasswordChanger';
import { CssBaseline } from '@mui/material';
import PasswordUpdater from './pages/SignPage/PasswordUpdater';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './theme/GlobalTheme';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from './context/ThemeContext';
import TemasPage from './pages/Dashboard/TemasPage/TemasPage';

function AppContent() {
  const { isDark } = useThemeContext();

  return (
    <MuiThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route path='/' element={<Navigate to="/signin" />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/mudarsenha' element={<PasswordChanger />} />
          <Route path='/reset-password' element={<PasswordUpdater />} />

          <Route path='/meuscomponentes' element={<TemasPage />} />

          <Route
            path='/dashboard/table'
            element={
              <PrivateRoutes>
                <Table />
              </PrivateRoutes>
            }
          />
          <Route
            path='/dashboard/edituser'
            element={
              <PrivateRoutes>
                <ProfilePage />
              </PrivateRoutes>
            }
          />
          <Route
            path='/dashboard/usersadmin'
            element={
              <PrivateRoutes>
                <UsersAmin />
              </PrivateRoutes>
            }
          />
        </Routes>
      </div>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </CustomThemeProvider>
  );
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;