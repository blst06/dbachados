import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { Achado, AchadoTransformado } from "../../../../../types/types";
import { db } from "../../../../../service/firebase.config";
import { useContextTable } from "../../../../../context/TableContext";
import { TypeAlert } from "../../../../../hooks/TypeAlert";
import { GridRowId } from "@mui/x-data-grid";
import useFetchTema from "../FormTemaPasta/useFetchTema";
import { useAuth } from "../../../../../context/AuthContext";

const useFetchAchado = () => {

    const { setArrayAchado } = useContextTable()
    const { getTemaById, getAllTemas } = useFetchTema();
    const { user } = useAuth(); // Acesso ao usuário logado

    // CREATE
    const setAchado = async (data: Achado) => {
        try {
            // Permissão para criar: estagiário, chefe e admin
            if (user?.cargo !== 'estagiario' && user?.cargo !== 'chefe' && user?.cargo !== 'admin') {
                TypeAlert('Você não tem permissão para criar um novo achado.', 'error');
                return null;
            }

            const colecaoRef = collection(db, "achado");
            const docRef = await addDoc(colecaoRef, {
                ...data,
                situacaoAchado: false // Definido como booleano false
            })
            console.log("Achado adicionado", docRef.id)

            return docRef.id
        } catch (error) {
            console.error("Erro ao tentar criar o novo achado", error);
            throw error;
        }
    }

    // READ
    const getAllAchados = async () => {
        try {
            const achadoRef = collection(db, "achado");
            const querySnapshot = await getDocs(achadoRef);

            if (!querySnapshot.empty) {
                const achados = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    achado: doc.data().achado,
                    analise: doc.data().analise,
                    criterioGeral: doc.data().criterioGeral,
                    data: doc.data().data,
                    gravidade: doc.data().gravidade,
                    situacaoAchado: doc.data().situacaoAchado,
                    tipo_financeiro: doc.data().tipo_financeiro,
                    tema_id: doc.data().tema_id
                })) as Achado[];

                setArrayAchado(achados);
                return achados
            } else {
                console.log("Nenhum achado encontrado.");
            }
        } catch (error) {
            console.error("Erro ao tentar resgatar os Achados:", error);
        }
    };

    const getAchadobyName = async (achadoName: string, temaId: string) => {
        try {
            const achadoRef = collection(db, "achado")
            const q = query(
                achadoRef,
                where("achado", "==", achadoName),
                where("tema_id", "==", temaId)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                TypeAlert('Já existe um achado com este texto para o tema selecionado', 'info');
                console.log(querySnapshot.docs[0].data())
                return true
            }
            return false
        } catch (error) {
            console.error("Erro ao buscar o achado: ", error);
            return false
        }
    }

    const getAchadoById = async (achadoId: GridRowId) => {
        try {
            const idAchado = achadoId.toString();
            const achadoRef = doc(db, "achado", idAchado);
            const docRef = await getDoc(achadoRef);
            const { id, ...achadoData } = docRef.data() as Achado;

            const achado = { id: docRef.id, id_tema: achadoData.tema_id, ...achadoData };
            const tema = await getTemaById(achado.tema_id)

            if (!tema) {
                throw new Error("Tema não encontrado");
            }


            const achadoCompleto = {
                achado: achado,
                tema: tema,
            }

            return achadoCompleto;

        } catch (error) {
            console.error("Erro ao tentar resgatar o achado: ", error)
            throw error;
        }
    }

    const escutarAchados = async (callback: (achados: Achado[]) => void) => {
        try {
            const colecaoRef = collection(db, "achado");

            const unsubscribe = onSnapshot(colecaoRef, async (querySnapshot) => {
                const achados: Achado[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    achado: doc.data().achado,
                    analise: doc.data().analise,
                    criterioGeral: doc.data().criterioGeral,
                    data: doc.data().data,
                    gravidade: doc.data().gravidade,
                    situacaoAchado: doc.data().situacaoAchado,
                    tema_id: doc.data().tema_id,
                    tipo_financeiro: doc.data().tipo_financeiro
                }));

                const achadosTransformados = await editorDeArrayAchado(achados);
                callback(achadosTransformados);
            });

            return unsubscribe;
        } catch (error) {
            console.error("Erro ao escutar achados: ", error);
            throw error;
        }
    };

    const editorDeArrayAchado = async (achadoData: Achado[]): Promise<AchadoTransformado[]> => {
        const temas = await getAllTemas();

        if (!temas) {
            console.error("Não foi possível obter os temas");
            return [];
        }

        const temasMap = new Map(temas.map(tema => [tema.id, tema.tema]));

        return achadoData.map(item => {
            return {
                ...item,
                tema_id: item.tema_id && temasMap.has(item.tema_id)
                    ? temasMap.get(item.tema_id)!
                    : "Tema não encontrado",
                tema_id_original: item.tema_id
            };
        });
    };

    // UPDATE
    const updateAchado = async (idAchado: string, data: Partial<Achado>) => {
        try {
            // Permissão para editar: apenas admin e chefe
            if (user?.cargo !== 'admin' && user?.cargo !== 'chefe') {
                TypeAlert('Você não tem permissão para editar um achado.', 'error');
                return false;
            }

            const achado = {
                achado: data.achado,
                analise: data.analise,
                situacaoAchado: data.situacaoAchado,
                criterioGeral: data.criterioGeral,
                data: data.data,
                gravidade: data.gravidade,
                tema_id: data.tema_id,
                tipo_financeiro: data.tipo_financeiro
            }

            const filteredAchado = Object.fromEntries(
                Object.entries(achado).filter(([_, value]) => value !== undefined)
            );

            const achadoRef = doc(db, "achado", idAchado);
            await updateDoc(achadoRef, filteredAchado)

            console.log("Achado atualizado com sucesso!");
            TypeAlert("O Achado foi atualizado", "success");
            return true
        } catch (error) {
            console.error("Erro ao atualizar Achado:", error);
            TypeAlert("Erro ao atualizar o achado", "error");
            return false;
        }
    };

    // DELETE
    const deleteAchado = async (id: string) => {
        try {
            // Permissão para deletar: apenas admin
            if (user?.cargo !== 'admin') {
                TypeAlert('Você não tem permissão para excluir um achado.', 'error');
                return;
            }

            const docRef = doc(db, "achado", id);

            const querySnapshot = await getDocs(
                query(collection(db, "coleta"), where("achadoId", "==", id))
            );

            if (!querySnapshot.empty) {
                TypeAlert("Não é possível excluir o achado, ele está vinculado a um ou mais Processos.", "info");
                return;
            } else {
                await deleteDoc(docRef);
                TypeAlert("O Achado foi excluído", "success")
            }


        } catch (error) {
            console.error("Erro ao excluir Achado:", error);
            TypeAlert("Erro ao excluir o benefício", "error");
        }
    }

    // NOVA FUNÇÃO para aprovar achado (Servidor Chefe)
    const aprovarAchado = async (id: string) => {
        try {
            // Permissão para aprovar: apenas chefe
            if (user?.cargo !== 'chefe') {
                TypeAlert('Você não tem permissão para aprovar um achado.', 'error');
                return false;
            }

            await updateAchado(id, { situacaoAchado: true }); // Definido como booleano true
            TypeAlert('O achado foi aprovado', 'success');
            return true;
        } catch (error) {
            console.error("Erro ao aprovar o achado", error);
            TypeAlert("Erro ao tentar aprovar o achado", "error");
            return false;
        }
    }


    return {
        setAchado, getAllAchados, getAchadobyName, getAchadoById, escutarAchados, updateAchado, deleteAchado, aprovarAchado
    }
}

export default useFetchAchado;