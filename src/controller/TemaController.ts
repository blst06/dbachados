import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

async function temaExiste(tema: string): Promise<boolean> {
  const db = getFirestore();
  const temasCollection = collection(db, 'temas');
  const q = query(temasCollection, where('tema', '==', tema));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

async function criarTema(tema: string) {
  try {
    if (await temaExiste(tema)) {
      throw new Error('Já existe um tema com este nome.');
    }

    const db = getFirestore();
    const temasCollection = collection(db, 'temas');
    const docRef = await addDoc(temasCollection, { tema });

    console.log('Tema criado com sucesso! ID:', docRef.id);
  } catch (error: any) {
    console.error('Erro ao criar tema:', error.message);
    throw error;
  }
}

async function buscarTemas() {
  try {
    const db = getFirestore();
    const temasCollection = collection(db, 'temas');
    const querySnapshot = await getDocs(temasCollection);

    const temas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Temas buscados com sucesso:', temas);

    return temas;
  } catch (error: any) {
    console.error('Erro ao buscar temas:', error.message);
    throw error;
  }
}

export { criarTema, buscarTemas };