import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../../service/firebase.config"
import { Processo } from "../../../../../types/types"
import { TypeAlert } from "../../../../../hooks/TypeAlert";
import { useContextTable } from "../../../../../context/TableContext";
import { useAuth } from "../../../../../context/AuthContext";

const useFetchProcesso = () => {

    const { setArrayProcesso, arrayProcesso } = useContextTable();
    const { user } = useAuth()

    //CREATE
    const addProcesso = async (data: Processo): Promise<boolean> => {
        try {
            if (user?.cargo !== 'estagiario' && user?.cargo !== 'chefe' && user?.cargo !== 'admin') {
                TypeAlert('Você não tem permissão para adicionar um novo processo.', 'error');
                return false;
            }

            const processoRef = collection(db, "processo");
            const querySnapshot = await getDocs(
                query(processoRef, where("numero", "==", data.numero))
            );

            if (!querySnapshot.empty) {
                TypeAlert("Já existe um processo com esse número", "error");
                return false;
            }

            const docRef = await addDoc(processoRef, data);
            setArrayProcesso([...arrayProcesso, { ...data, id: docRef.id }])
            console.log("Processo adicionado com sucesso", docRef.id);
            return true
        } catch (error) {
            console.error("Erro ao tentar adicionar o processo", error);
            throw error;

        }
    }

    //READ
    const getProcessoById = async (id: string): Promise<Processo | null> => {
        try {
            const processoRef = doc(db, "processo", id);
            const docRef = await getDoc(processoRef);
            if (docRef.exists()) {
                return { id: docRef.id, ...docRef.data() } as Processo;
            } else {
                console.log("Processo não encontrado");
                return null;
            }
        } catch (error) {
            console.error("Erro ao tentar buscar o processo", error);
            return null;
        }

    }

    const escutarProcessos = (callback: (temas: Processo[]) => void) => {
        try {
            const colecaoRef = collection(db, "processo");

            const unsubscribe = onSnapshot(colecaoRef, (querySnapshot) => {
                const processos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    numero: doc.data().numero,
                    exercicio: doc.data().exercicio,
                    unidadeGestora: doc.data().unidadeGestora,
                    diretoria: doc.data().diretoria,
                    julgado: doc.data().julgado,

                })) as Processo[];

                callback(processos); // Chama a função de callback com os processos atualizados
            });

            return unsubscribe; // Retorna a função para parar de escutar as mudanças
        } catch (error) {
            console.error("Erro ao escutar processos: ", error);
            throw error;
        }
    };

    const getAllProcessos = async () => {
        try {
            const processoRef = collection(db, "processo");
            const q = query(processoRef, orderBy("numero", "asc"));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const processos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    numero: doc.data().numero,
                    exercicio: doc.data().exercicio,
                    julgado: doc.data().julgado,
                    unidadeGestora: doc.data().unidadeGestora,
                    diretoria: doc.data().diretoria,
                })) as Processo[];

                setArrayProcesso(processos)
                return processos

            } else {
                console.log("Nenhum processo encontrado.");
                return [];
            }
        } catch (error) {
            console.error("Erro ao tentar resgatar os Processos:", error);
            return [];
        }
    }

    const getProcesso = async (id: string): Promise<Processo | null> => {
        try {
            const processoRef = doc(db, "processo", id);
            const processoDoc = await getDoc(processoRef);

            if (processoDoc.exists()) {
                return { id: processoDoc.id, ...processoDoc.data() } as Processo;
            } else {
                console.log("Processo não existe no banco");
                return null;
            }
        } catch (error) {
            console.error("Erro ao tentar buscar o processo: ", error);
            throw error;
        }
    };

    //UPDATE
    const updateProcesso = async (id: string, data: Partial<Processo>) => {
        try {
            if (user?.cargo !== 'admin' && user?.cargo !== 'chefe') {
                TypeAlert('Você não tem permissão para editar um processo.', 'error');
                return false;
            }

            const docRef = doc(db, "processo", id);

            const querySnapshot = await getDocs(
                query(collection(db, "processo"),
                    where("numero", "==", data.numero),
                ))

            if (!querySnapshot.empty && querySnapshot.docs[0].id !== id) {
                TypeAlert("Já existe um processo com esse número", "error");
                return false
            }
            await updateDoc(docRef, data);
            TypeAlert("O Processo foi atualizado", "success")
            return true


        } catch (error) {
            console.error("Erro ao tentar atualizar o Processo useFetch", error);
            throw error;
        }
    }

    //DELETE
    const deleteProcesso = async (id: string) => {
        try {
            if (user?.cargo !== 'admin') {
                TypeAlert('Você não tem permissão para excluir um processo.', 'error');
                return;
            }

            const processoRef = doc(db, "processo", id);

            const querySnapshot = await getDocs(
                query(collection(db, "coleta"), where("processoId", "==", id))
            );

            if (!querySnapshot.empty) {
                TypeAlert("Não é possível excluir o Processo, ele está vinculado a um ou mais Achados", "info")
                return;
            } else {
                await deleteDoc(processoRef);
                TypeAlert("O Processo foi excluído", "success")
            }
        } catch (error) {
            console.error("Erro ao tentar excluir o Processo", error);
            throw error;
        }
    }

    // NOVA FUNÇÃO para aprovar processo (Servidor Chefe)
    const aprovarProcesso = async (id: string) => {
        try {
            if (user?.cargo !== 'chefe') {
                TypeAlert('Você não tem permissão para aprovar um processo.', 'error');
                return false;
            }
            await updateProcesso(id, { julgado: "julgado" });
            TypeAlert('O processo foi aprovado', 'success');
            return true;
        } catch (error) {
            console.error("Erro ao aprovar o processo", error);
            TypeAlert("Erro ao tentar aprovar o processo", "error");
            return false;
        }
    }


    return {
        addProcesso, getProcessoById, escutarProcessos, getProcesso, updateProcesso, deleteProcesso, getAllProcessos, aprovarProcesso
    }
}

export default useFetchProcesso