import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { TopicoAchado } from "../../../../../types/types";
import { db } from "../../../../../service/firebase.config";
import { TypeAlert } from "../../../../../hooks/TypeAlert";
import { useContextTable } from "../../../../../context/TableContext";
import { useAuth } from "../../../../../context/AuthContext";


const useFetchTema = () => {


    const { setArrayTopicoAchado } = useContextTable();
    const { user } = useAuth()


    const setTema = async (data: TopicoAchado) => {
        try {
            const allowedRoles = ['admin', 'chefe', 'estagiario'];
            if (!allowedRoles.includes(user?.cargo)) {
                TypeAlert('Você não tem permissão para criar um tipo de achado.', 'error');
                return;
            }

            const colecaoRef = collection(db, "tema");

            const docRef = await addDoc(colecaoRef, {
                tema: data.tema, // Nome do tipo de achado
                situacao: false // Definido como booleano false para pendente
            })
            console.log("Tipo de Tema inserido com sucesso! ID:", docRef.id);
            TypeAlert('Tipo de Tema adicionado', 'success');
        } catch (error: any) {
            console.error("Erro ao inserir o documento", error)
            TypeAlert(error.message, 'error')
        }
    }


    const escutarTemas = (callback: (temas: TopicoAchado[]) => void) => {
        try {
            const colecaoRef = collection(db, "tema");

            const unsubscribe = onSnapshot(colecaoRef, (querySnapshot) => {
                const temas = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    tema: doc.data().tema,
                    situacao: doc.data().situacao,
                })) as TopicoAchado[];

                callback(temas);
            });

            return unsubscribe;
        } catch (error: any) {
            console.error("Erro ao escutar temas: ", error);
            throw error;
        }
    };


    const getAllTemas = async () => {
        try {
            const temasRef = collection(db, "tema");
            const q = query(temasRef, orderBy("tema", "asc"));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const temas = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    tema: doc.data().tema,
                    situacao: doc.data().situacao,
                })) as TopicoAchado[];

                setArrayTopicoAchado(temas);
                return temas
            } else {
                console.log("Nenhum tipo de tema encontrado.");
            }
        } catch (error: any) {
            console.error("Erro ao tentar resgatar os Tipos de Tema:", error);
            throw error;
        }
    }


    const getTemaByName = async (temaString: string) => {
        try {
            const temasRef = collection(db, "tema");
            const q = query(temasRef, where("tema", "==", temaString))
            const querySnapshot = await getDocs(q)
            if (!querySnapshot.empty) {
                TypeAlert("O tipo de tema já existe no banco de dados", "info")
                return true
            }
            return false
        } catch (error: any) {
            console.error("Erro ao buscar o tipo de tema: ", error)
            TypeAlert(error.message, 'error')
            return false
        }
    }


    const getTemaById = async (temaId: string) => {
        try {
            const temaRef = doc(db, "tema", temaId);
            const docRef = await getDoc(temaRef);

            if (docRef.exists()) {
                return { id: docRef.id, ...docRef.data() } as TopicoAchado
            } else {
                console.log("Tipo de tema não existe no banco")
            }
        } catch (error: any) {
            console.error("Erro ao tentar resgatar o tipo de tema: ", error)
            throw error
        }
    }


    const updateTema = async (id: string, data: Partial<TopicoAchado>) => {
        try {
            const docRef = doc(db, "tema", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.id !== id) {
                TypeAlert("O Tipo de Tema já existe no banco de dados", "error")
                return false
            }

            await updateDoc(docRef, data);
            TypeAlert("O Tipo de Tema foi atualizado", "success")
            return true
        } catch (error: any) {
            console.error("Erro ao tentar atualizar o Tipo de Tema", error);
            throw error;
        }

    }

    const deleteTema = async (id: string) => {
        try {
            const docRef = doc(db, "tema", id);
            await deleteDoc(docRef);
            console.log("Documento deletado da coleçao Tema")
            TypeAlert("O tipo de tema foi excluído", "success")
            return
        } catch (error: any) {
            console.error("Erro ao tentar deletar o dado: ", error);
            throw error;
        }
    }

    // NOVA FUNÇÃO para aprovar tipo de achado (Servidor Chefe)
    const aprovarTema = async (id: string) => {
        try {
            await updateTema(id, { situacao: true }); // Definido como booleano true para aprovado
            TypeAlert('O tipo de tema foi aprovado', 'success');
            return true;
        } catch (error) {
            console.error("Erro ao aprovar o tipo de tema", error);
            TypeAlert("Erro ao tentar aprovar o tipo de tema", "error");
            return false;
        }
    }

    return {
        setTema, escutarTemas, getAllTemas, getTemaByName, getTemaById, updateTema, deleteTema, aprovarTema
    }
}


export default useFetchTema