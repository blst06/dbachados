import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { TopicoAchado, Achado, Processo, Coleta, KeyWord } from "../types/types";


interface TableContextType {
    arrayTopicoAchado: TopicoAchado[];
    arrayAchado: Achado[];
    arrayProcesso: Processo[];
    arrayColeta: Coleta[];
    arrayKeyWord: KeyWord[];
    lastSelectedProcessoId: string | null;
    handleLocalization: {};
    setArrayTopicoAchado: Dispatch<SetStateAction<TopicoAchado[]>>;
    setArrayAchado: Dispatch<SetStateAction<Achado[]>>;
    setArrayProcesso: Dispatch<SetStateAction<Processo[]>>;
    setArrayColeta: Dispatch<SetStateAction<Coleta[]>>;
    setArrayKeyWord: Dispatch<SetStateAction<KeyWord[]>>;
    setLastSelectedProcessoId: Dispatch<SetStateAction<string | null>>;
}

interface Props {
    children: React.ReactNode;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<Props> = ({ children }) => {
    const [arrayTopicoAchado, setArrayTopicoAchado] = useState<TopicoAchado[]>([]);
    const [arrayAchado, setArrayAchado] = useState<Achado[]>([]);
    const [arrayProcesso, setArrayProcesso] = useState<Processo[]>([]);
    const [arrayColeta, setArrayColeta] = useState<Coleta[]>([]);
    const [arrayKeyWord, setArrayKeyWord] = useState<KeyWord[]>([]);
    const [lastSelectedProcessoId, setLastSelectedProcessoId] = useState<string | null>(null);

    const handleLocalization = {
        columnHeaderSortIconLabel: 'ordenar',
        columnMenuSortAsc: 'Ordenar por ASC',
        columnMenuSortDesc: 'Ordenar por Desc',
        columnMenuFilter: 'Filtrar',
        columnMenuHideColumn: 'Esconder Coluna',
        columnMenuManageColumns: 'Gerenciar Colunas',
        columnsManagementSearchTitle: 'Pesquisar',
        checkboxSelectionHeaderName: 'Caixa de Seleção',
        columnsManagementShowHideAllText: 'Mostrar/Esconder Todos',
        columnsManagementReset: 'Resetar',
        filterPanelColumns: 'Colunas',
        filterPanelOperator: 'Operador',
        filterPanelInputLabel: 'Valor',
        filterOperatorContains: 'contém',
        filterOperatorEquals: 'igual a',
        filterOperatorStartsWith: 'termina com',
        filterOperatorEndsWith: 'começa com',
        filterOperatorIsEmpty: 'está vazio',
        filterOperatorIsNotEmpty: 'não está vazio',
        filterPanelInputPlaceholder:"Filtrar valor",
        paginationRowsPerPage: "Linhas por página",
        filterOperatorIsAnyOf: 'é qualquer um',
        noRowsLabel: 'sem dados',
        columnMenuUnsort: 'Desordenar',
        noResultsOverlayLabel: 'nenhum resultado encontrado',
        footerRowSelected: (count: number) =>
            count !== 1
                ? `${count.toLocaleString()} linhas selecionadas`
                : `${count.toLocaleString()} linha selecionada`,
    };


    return (
        <TableContext.Provider value={{
            arrayTopicoAchado,
            arrayAchado,
            arrayProcesso,
            arrayColeta,
            arrayKeyWord,
            handleLocalization,
            lastSelectedProcessoId,
            setLastSelectedProcessoId,
            setArrayTopicoAchado,
            setArrayAchado,
            setArrayProcesso,
            setArrayColeta,
            setArrayKeyWord
        }}>
            {children}
        </TableContext.Provider>
    )
};


export const useContextTable = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error("useContextTable precisa ser usado dentro de um TableProvider");
    }
    return context;
}
