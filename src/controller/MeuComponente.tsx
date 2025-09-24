import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Tema } from "../types/types"; // ou defina direto aqui

export async function buscarTemas(): Promise<Tema[]> {
  const db = getFirestore();
  const temasCollection = collection(db, "temas");
  const snapshot = await getDocs(temasCollection);

  const temas: Tema[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      tema: data.tema || "" // garante que tema nunca seja undefined
    };
  });

  return temas;
}

// NOVO CÓDIGO A SER ADICIONADO
export async function aprovarTema(temaId: string) {
  try {
    const db = getFirestore();
    const temaRef = doc(db, "temas", temaId);
    
    await updateDoc(temaRef, {
      situacao: "aprovado"
    });

    console.log("Tema aprovado com sucesso!");
    return true; 
  } catch (error) {
    console.error("Erro ao aprovar o tema:", error);
    return false;
  }
}