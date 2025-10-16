import { AllUsers, User, UserUpdate } from '../../../types/types';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../service/firebase.config';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { TypeAlert, TypeInfo } from '../../../hooks/TypeAlert';
import { authBase } from '../../../service/firebase.config';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';

const useFetchUsers = () => {
  const { setUsers, setUser } = useAuth();
  const auth = getAuth();

  const addUser = (user: User) => {
    const userRef = doc(db, 'users', user.id);
    setDoc(userRef, {
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      ativo: user.ativo
    })
      .then(() => {
        TypeAlert('Usuário cadastrado', 'success');
      })
      .catch((error) => {
        TypeAlert('Erro ao cadastrar usuário', 'error');
        console.error(error);
      });
  };

  const getUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usuarios: AllUsers[] = [];
      querySnapshot.forEach((doc) => {
        usuarios.push({ id: doc.id, ...doc.data() } as AllUsers);
      });
      setUsers(usuarios);
      return usuarios;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const getUser = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("Nenhum usuário logado.");
        return null;
      }
      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userWithId = {
          id: userDoc.id,
          ...userData
        };

        console.log("Usuário salvo no contexto:", userWithId);
        setUser(userWithId as UserUpdate);
        return userWithId;
      } else {
        console.log("Nenhum documento encontrado com o ID fornecido.");
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  };

  const getUserById = async (id: string) => {
    try {
      const userRef = doc(db, "users", id);
      const docRef = await getDoc(userRef);
      const user = { id: docRef.id, ...docRef.data() } as User;
      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID: ", error);
      return null;
    }
  };

  const updateUser = async (id: string, data: Partial<UserUpdate>) => {
    try {
      const userRef = doc(db, "users", id);

      await updateDoc(userRef, data);

      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        const updatedUser = {
          id: updatedDoc.id,
          ...updatedDoc.data()
        };
        setUser(updatedUser as UserUpdate);
        return;
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário: ", error);
      throw error;
    }
  };

  const passwordChanger = async (data: string) => {
    try {
      await sendPasswordResetEmail(authBase, data);
      TypeInfo("E-mail enviado", "success");
    } catch (error) {
      TypeInfo("Algo deu errado, consulte o log", "error");
      console.error("Erro ao mandar email", error);
    }
  };

  return {
    addUser,
    getUsers,
    getUser,
    updateUser,
    passwordChanger,
    getUserById
  };
};

export default useFetchUsers;