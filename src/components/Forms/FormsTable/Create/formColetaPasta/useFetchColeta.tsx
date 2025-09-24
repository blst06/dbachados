import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../../service/firebase.config";
import { Coleta } from "../../../../../types/types";
import useFetchAchado from "../FormAchadoPasta/useFetchAchado";
import useFetchTema from "../FormTemaPasta/useFetchTema";
import useFetchProcesso from "../FormProcessoPasta/useFetchProcesso";
import { ColetaTransformada } from "../../../../../types/types";
import useFetchUsers from "../../../SignForms/useFetchUsers";
import { TypeAlert } from "../../../../../hooks/TypeAlert";
import { useContextTable } from "../../../../../context/TableContext";
import { useAuth } from "../../../../../context/AuthContext";

const useFetchColeta = () => {

    const { getAllAchados, getAchadoById } = useFetchAchado();
    const { getAllTemas } = useFetchTema();
    const { getAllProcessos, getProcessoById } = useFetchProcesso();
    const { getUsers, getUserById } = useFetchUsers();
    const { setArrayColeta } = useContextTable();
    const { user } = useAuth();


    const addColeta = async (data: Coleta) => {
        try {
            if (user?.cargo !== 'estagiario' && user?.cargo !== 'chefe' && user?.cargo !== 'admin') {
                TypeAlert('Você não tem permissão para adicionar uma nova coleta.', 'error');
                return false;
            }
            const { temaId, ...resto } = data
            const coletaRef = collection(db, 'coleta');

            if (!resto.achadoId) {
                TypeAlert("Você não selecionou um achado", "error")
                return false
            }

            const querySnapshot = await getDocs(
                query(
                    coletaRef,
                    where("achadoId", "==", resto.achadoId),
                    where("processoId", "==", resto.processoId),
                )
            );
            if (!querySnapshot.empty) {
                TypeAlert("Já existe um relacionamento cadastrado com esse achado e processo", "error")
                return false
            }

            await addDoc(coletaRef, resto);
            console.log('Coleta cadastrada com sucesso');
            return true
        } catch (error) {
            console.error('Erro ao cadastrar coleta', error);
            return false
        }
    };

    //READ
    const escutarColeta = async (callback: (achados: ColetaTransformada[]) => void) => {
        try {
            const colecaoRef = collection(db, "coleta");

            const unsubscribe = onSnapshot(colecaoRef, async (querySnapshot) => {
                // Mapeia os documentos para objetos Coleta
                const coletas: Coleta[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    temaId: doc.data().temaId,
                    achadoId: doc.data().achadoId,
                    processoId: doc.data().processoId,
                    coletadorId: doc.data().coletadorId,
                    valorFinanceiro: doc.data().valorFinanceiro,
                    sanado: doc.data().sanado,
                    unidade: doc.data().unidade,
                    situacao_encontrada: doc.data().situacao_encontrada,
                    comentario: doc.data().comentario,
                    quantitativo: doc.data().quantitativo,
                }));

                // Transforma os IDs em valores legíveis
                const coletasTransformadas = await editorDeArrayColeta(coletas);
                setArrayColeta(coletasTransformadas);
                callback(coletasTransformadas);
            });

            return unsubscribe;
        } catch (error) {
            console.error("Erro ao escutar coletas: ", error);
            throw error;
        }
    };

    const editorDeArrayColeta = async (coletaData: Coleta[]): Promise<ColetaTransformada[]> => {
        const achados = await getAllAchados();
        const temas = await getAllTemas();
        const processos = await getAllProcessos();
        const usuarios = await getUsers();

        if (!achados || !temas || !processos || !usuarios) {
            console.error("Não foi possível obter todos os dados necessários");
            return []
        }

        const achadosMap = new Map(achados.map(achado => [achado.id, achado.achado]));
        const temasMap = new Map(temas.map(tema => [tema.id, tema.tema]));
        const processoMap = new Map(processos.map(processo => [processo.id, processo.numero]));
        const usuariosMap = new Map(usuarios.map(usuario => [usuario.id, usuario.nome]));

        return coletaData.map(item => {
            const novaColeta: ColetaTransformada = {
                ...item,
                achadoId: item.achadoId && achadosMap.has(item.achadoId)
                    ? achadosMap.get(item.achadoId)!
                    : item.achadoId,
                processoId: item.processoId && processoMap.has(item.processoId)
                    ? processoMap.get(item.processoId)!
                    : item.processoId,
                temaId: item.temaId && temasMap.has(item.temaId)
                    ? temasMap.get(item.temaId)!
                    : item.temaId,
                coletadorId: item.coletadorId && usuariosMap.has(item.coletadorId)
                    ? usuariosMap.get(item.coletadorId)!
                    : item.coletadorId
            };

            // Se não tem temaId mas tem achadoId, busca do achado
            if (!novaColeta.temaId && item.achadoId) {
                const achado = achados.find(a => a.id === item.achadoId);
                if (achado?.tema_id && temasMap.has(achado.tema_id)) {
                    novaColeta.temaId = temasMap.get(achado.tema_id)!;
                }
            }

            return novaColeta;
        });
    };

    const getColetaById = async (id: string) => {
        try {
            const docRef = doc(db, "coleta", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                console.error("Registro não encontrado")
            }
            const coleta = { id: docSnap.id, ...docSnap.data() } as Coleta;
            const achado = await getAchadoById(coleta.achadoId)
            const processo = await getProcessoById(coleta.processoId)

            if (!achado || !processo) {
                console.error("Achado ou processo não encontrado")
                return null;
            }

            const coletaCompleta = {
                coleta: coleta,
                achado: achado.achado,
                tema: achado.tema,
                processo: processo
            };

            return coletaCompleta

        } catch (error) {
            console.error("Erro ao buscar coleta por ID: ", error);
            return null;
        }
    }

    //UPDATE
    const updateColeta = async (idColeta: string, data: Partial<Coleta>) => {
        try {
            if (user?.cargo !== 'admin' && user?.cargo !== 'chefe') {
                TypeAlert('Você não tem permissão para editar uma coleta.', 'error');
                return false;
            }
            const coletaRef = doc(db, "coleta", idColeta);

            const querySnapshot = await getDocs(
                query(
                    collection(db, "coleta"),
                    where("achadoId", "==", data.achadoId),
                    where("processoId", "==", data.processoId),
                )
            );

            if (!querySnapshot.empty && querySnapshot.docs[0].id !== idColeta) {
                TypeAlert("Já existe um relacionamento cadastrado com esse achado e processo", "error")
                return false
            } else {
                await updateDoc(coletaRef, data)

                const coletaTransformada = await editorDeColeta(querySnapshot.docs[0].data() as Coleta)

                if (coletaTransformada) {
                    setArrayColeta(prevColetas =>
                        prevColetas.map(coleta =>
                            coleta.id === coletaTransformada.id ? coletaTransformada : coleta
                        )
                    );
                }

                TypeAlert("Coleta atualizada com sucesso!", "success")
                return true
            }
        } catch (error) {
            console.error("Erro ao atualizar coleta: ", error);
            return false;
        }
    };

    const editorDeColeta = async (coleta: Coleta): Promise<ColetaTransformada | null> => {
        const achado = await getAchadoById(coleta.achadoId)
        const processo = await getProcessoById(coleta.processoId)
        const usuario = await getUserById(coleta.coletadorId)


        if (!achado || !processo || !usuario) {
            console.error("Achado ou processo ou usuário não encontrado")
            return null;
        }

        const coletaEditada: ColetaTransformada = {
            ...coleta,
            achadoId: achado.achado.achado,
            temaId: achado.tema.tema,
            processoId: processo?.numero,
            coletadorId: usuario?.nome,
        };

        return coletaEditada;
    }

    //DELETE
    const deleteColeta = async (id: string) => {
        try {
            if (user?.cargo !== 'admin') {
                TypeAlert('Você não tem permissão para excluir uma coleta.', 'error');
                return;
            }
            const docRef = doc(db, "coleta", id);
            await deleteDoc(docRef);
            TypeAlert("O relacionamento foi excluído", "success")
            return
        } catch (error) {
            console.error("Erro ao tentar deletar o registro: ", error);
            throw error;
        }
    }

    // NOVA FUNÇÃO para aprovar coleta (Servidor Chefe)
    const aprovarColeta = async (idColeta: string) => {
        try {
            if (user?.cargo !== 'chefe') {
                TypeAlert('Você não tem permissão para aprovar uma coleta.', 'error');
                return false;
            }

            await updateColeta(idColeta, { sanado: "sanado" });
            TypeAlert('A coleta foi aprovada', 'success');
            return true;
        } catch (error) {
            console.error("Erro ao tentar aprovar a coleta", error);
            TypeAlert("Erro ao tentar aprovar a coleta", "error");
            return false;
        }
    }

    return {
        addColeta, escutarColeta, deleteColeta, getColetaById, updateColeta, editorDeArrayColeta, aprovarColeta
    }
}
export default useFetchColeta;