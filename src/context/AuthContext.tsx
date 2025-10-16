import { createContext, useContext, useEffect, useState } from "react";
import { AllUsers, AuthData, User, UserLogin } from "../types/types";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { TypeAlert } from "../hooks/TypeAlert";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { authBase } from "../service/firebase.config";
import env from "../service/env"; // Importe o env

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean; // Adicionado para verificar se é admin
    login: (data: UserLogin, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => void;
    logout: () => void;
    auth: any
    user: User;
    setUser: (user: User) => void;
    users: AllUsers[];
    setUsers: (users: AllUsers[]) => void;
}

interface Props {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const initialUser: User = {
    id: '',
    nome: '',
    email: '',
    cargo: '',
    ativo: '',
    senha: ''
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Novo estado para o admin
    const navigate = useNavigate()
    const cookies = new Cookies()
    const auth = cookies.get('focusToken');
    const [user, setUser] = useState<User>(initialUser);
    const [users, setUsers] = useState<AllUsers[]>([])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authBase, (user) => {
            if (user) {
                user.getIdToken().then((token) => {
                    if (user.email !== null) {
                        setCookies({ token, email: user.email });
                        setIsLoggedIn(true);
                        // Verifica se o email do usuário logado é o do admin
                        if (user.email === env.VITE_EMAIL_ADMIN) {
                            setIsAdmin(true);
                        } else {
                            setIsAdmin(false);
                        }
                    }
                });
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false); // Garante que o estado de admin seja falso no logout
            }
        });
        return () => unsubscribe();
    }, []);

    const setCookies = (authData: AuthData) => {
        const cookies = new Cookies()
        cookies.set('focusToken', authData.token, { path: '/' })
        localStorage.setItem('email', authData.email)
    }

    const login = async (data: UserLogin, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
        setLoading(true)
        try {
            const userCredentials = await signInWithEmailAndPassword(authBase, data.email, data.password);
            const user = userCredentials.user;

            const token = await user.getIdToken();
            if (user.email !== null) {
                setCookies({ token, email: user.email })
            }
            setIsLoggedIn(true)
            navigate('/dashboard/table');
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
                TypeAlert('Email ou senha incorretos', 'error');
            } else {
                TypeAlert(error.message, 'error');
            }
        } finally {
            setLoading(false)
        }
    };

    const logout = async () => {
        const cookies = new Cookies();
        try {
            await signOut(authBase);
            cookies.remove('focusToken', { path: '/' })
            localStorage.removeItem('email')
            setIsLoggedIn(false)
            setIsAdmin(false); // Limpa o estado de admin no logout
            navigate('/signin')
        } catch (error: any) {
            TypeAlert(error.message, 'error')
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout, auth, user, setUser, users, setUsers }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
};