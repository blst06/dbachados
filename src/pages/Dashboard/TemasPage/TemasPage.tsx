import { useState, useEffect } from 'react';
import { buscarTemas } from '../../../controller/MeuComponente';
import { Tema } from '../../../types/types';

function TemasPage() {
    const [temas, setTemas] = useState<Tema[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTemas = async () => {
            try {
                const data = await buscarTemas();
                setTemas(data);
            } catch (error) {
                console.error("Erro ao buscar os temas:", error);
            } finally {
                setLoading(false);
            }
        };

        getTemas();
    }, []);

    if (loading) {
        return <div>Carregando temas...</div>;
    }

    return (
        <div>
            <h1>Lista de Temas</h1>
            <ul>
                {temas.map((tema) => (
                    <li key={tema.id}>{tema.tema}</li>
                ))}
            </ul>
        </div>
    );
}

export default TemasPage;