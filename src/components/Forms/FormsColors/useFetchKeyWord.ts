import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { KeyWord } from "../../../types/types";
import { db } from "../../../service/firebase.config";
import { TypeAlert } from "../../../hooks/TypeAlert";
import { GridRowId } from "@mui/x-data-grid";

const useFetchKeyWord = () => {

    const addKeyWord = async (data: KeyWord) => {
        try {
            const colecaoRef = collection(db, "keyword");

            const querySnapshot = await getDocs(
                query(
                    colecaoRef,
                    where('label', '==', data.label),
                )
            );

            if (!querySnapshot.empty) {
                TypeAlert("Essa palavra-chave já foi registrada", "error");
                return false;
            }

            const docRef = await addDoc(colecaoRef, {
                label: data.label,
                type: data.type,
            });
            TypeAlert("Uma nova palavra-chave foi adicionada", "success");
            return docRef.id;
        } catch (error) {
            console.error("Erro ao inserir a palavra-chave:", error);
            TypeAlert("Erro ao adicionar a palavra-chave", "error");
        }
    };

    //READ  
    const escutarKeyWords = (callback: (keywords: KeyWord[]) => void) => {
        try {
            const colecaoRef = collection(db, "keyword");

            // Escuta mudanças em tempo real na coleção "keyword"
            const unsubscribe = onSnapshot(colecaoRef, (querySnapshot) => {
                const keywords = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    label: doc.data().label,
                    type: doc.data().type,
                    color: doc.data().color,
                })) as KeyWord[];

                callback(keywords); // Chama a função de callback com os keywords atualizados
            });

            return unsubscribe; // Retorna a função para parar de escutar as mudanças
        } catch (error) {
            console.error("Erro ao escutar keywords: ", error);
            throw error;
        }
    };

    const getKeywordById = async (id: string | GridRowId) => {
        try {
            const docRef = doc(db, "keyword", id.toString());
            const docSnapshot = await getDoc(docRef);

            if (!docSnapshot.exists()) {
                TypeAlert("Essa Keyword não existe", "error")
            }

            const keywordData = {
                id: docSnapshot.id,
                ...docSnapshot.data()
            } as KeyWord

            keywordData.type.toLowerCase();

            return keywordData;

            // return {
            //     id: docSnapshot.id,
            //     ...docSnapshot.data()
            // } as KeyWord;

        } catch (error) {
            console.log(error)
            TypeAlert("Erro ao buscar a Keyword, VERIFIQUE O LOG NO CONSOLE", "error")
        }
    }

    //UPDATE
    const updateKeyWord = async (data: KeyWord) => {
        try {
            const keywordRef = doc(db, 'keyword', data.id);
            const currentDoc = await getDoc(keywordRef);

            if (!currentDoc.exists()) {
                TypeAlert("Palavra-chave não encontrada", "error");
                return;
            }

            const currentData = currentDoc.data();
            const hasLabelChanged = currentData?.label !== data.label;
            const hasTypeChanged = currentData?.type !== data.type;

            // Se nada mudou
            if (!hasLabelChanged && !hasTypeChanged) {
                TypeAlert("Palavra-chave mantida sem alterações", "info");
                return;
            }

            // Dados para atualizar
            const updateData: Partial<KeyWord> = {};

            if (hasLabelChanged) {
                updateData.label = data.label;
            }

            if (hasTypeChanged) {
                updateData.type = data.type;
            }

            // Atualiza apenas os campos que mudaram
            await updateDoc(keywordRef, updateData);
            TypeAlert("Palavra-chave atualizada com sucesso!", "success");
            return;

        } catch (error) {
            console.error("Erro ao atualizar palavra-chave:", error);
            TypeAlert("Erro ao atualizar palavra-chave", "error");
            return;
        }
    };

    //DELETE
    const deleteKeyword = async (id: string) => {
        try {
            const keywordRef = doc(db, 'keyword', id);
            await deleteDoc(keywordRef);
            TypeAlert("A Palavra-Chave foi excluída", "success");
        } catch (error) {
            console.error("Erro ao tentar excluir a Palavra-Chave", error);
            TypeAlert("Erro ao excluir a palavra-chave", "error");
            throw error;
        }
    }


    return {
        addKeyWord,
        escutarKeyWords,
        updateKeyWord,
        deleteKeyword,
        getKeywordById
    }

}

export default useFetchKeyWord;