import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useMemo } from 'react';
import { formateDateToPtBr } from '../../hooks/DateFormate';
import { useContextTable } from '../../context/TableContext';
import { Coleta, Processo, TopicoAchado } from '../../types/types';
import { useDebounce } from 'use-debounce';
import React from 'react';

export interface SearchComponentProps {
    searchTerm: string;
    setSearchTerm: (e: string) => void;
    setRows: React.Dispatch<React.SetStateAction<any[]>>;
    createRows: (data: any[]) => any[];
    dataType: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ dataType, setRows, createRows, searchTerm, setSearchTerm }) => {

    const { arrayAchado, arrayTopicoAchado, arrayProcesso, arrayColeta } = useContextTable();
    //to usando esse debounc pra
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    const filterTema = useMemo(() => (tema: TopicoAchado, termo: string) => {
        const textoTema = tema.tema?.toLowerCase().includes(termo);
        let textoSituacao = false;
        if (termo === "aprovado") textoSituacao = tema.situacao === true;
        else if (termo === "pendente") textoSituacao = tema.situacao === false;
        return textoTema || textoSituacao;
    }, [])

    const filterAchado = useMemo(() => (achado: any, termo: string) => {
        const textoAchado = achado.achado?.toLowerCase().includes(termo);
        const textoTema = achado.tema_id?.toLowerCase().includes(termo) || false;
        const dataFormatada = formateDateToPtBr(achado.data?.toString() ?? "");
        const textoData = dataFormatada.toLowerCase().includes(termo);
        let textoSituacao = false;
        if (termo === "aprovado") textoSituacao = achado.situacaoAchado === true;
        else if (termo === "pendente") textoSituacao = achado.situacaoAchado === false;
        const textoCriterio = achado.criterioGeral?.toLowerCase().includes(termo);
        const textGravidade = achado.gravidade?.toLowerCase().includes(termo);
        return textoAchado || textoTema || textoSituacao || textoData || textoCriterio || textGravidade;
    }, [])

    const filterProcesso = useMemo(() => (processo: Processo, termo: string) => {
        const textoNumero = processo.numero?.toLowerCase().includes(termo);
        const textoExercicio = processo.exercicio?.toLowerCase().includes(termo);
        const textoJulgado = processo.julgado?.toLowerCase().includes(termo);
        const textoUnidade = processo.unidadeGestora?.toLowerCase().includes(termo);
        const textoDiretoria = processo.diretoria?.toLowerCase().includes(termo);
        return textoNumero || textoExercicio || textoJulgado || textoUnidade || textoDiretoria;
    }, [])

    const filterColeta = useMemo(() => (coleta: Coleta, termo: string) => {
        const textoQuantitativo = coleta.quantitativo?.toString().toLowerCase().includes(termo);
        const textoUnidade = coleta.unidade?.toLowerCase().includes(termo);
        const textoSanado = coleta.sanado?.toLowerCase().includes(termo);
        const textoValorFinanceiro = coleta.valorFinanceiro?.toString().toLowerCase().includes(termo);
        const textoColetador = coleta.coletadorId?.toLowerCase().includes(termo);
        const textoTema = coleta.temaId?.toLowerCase().includes(termo);
        const textoAchado = coleta.achadoId?.toLowerCase().includes(termo);
        const textoProcesso = coleta.processoId?.toLowerCase().includes(termo);
        return (
            textoQuantitativo ||
            textoUnidade ||
            textoSanado ||
            textoValorFinanceiro ||
            textoColetador ||
            textoTema ||
            textoAchado ||
            textoProcesso
        );
    }, []);

    const filteredData = useMemo(() => {
        const termo = debouncedSearchTerm.toLowerCase().trim();
        if (!termo) {
            switch (dataType) {
                case "tema": return arrayTopicoAchado;
                case "achado": return arrayAchado;
                case "processo": return arrayProcesso;
                case "relacionamentos": return arrayColeta;
                default: return arrayAchado;
            }
        }

        switch (dataType) {
            case "tema":
                return arrayTopicoAchado.filter(tema => filterTema(tema, termo));
            case "processo":
                return arrayProcesso.filter(processo => filterProcesso(processo, termo));
            case "relacionamentos":
                return arrayColeta.filter(coleta => filterColeta(coleta, termo));
            case "achado":
            default:
                return arrayAchado.filter(achado => filterAchado(achado, termo));
        }
    }, [
        debouncedSearchTerm,
        dataType,
        arrayAchado,
        arrayTopicoAchado,
        arrayProcesso,
        arrayColeta,
        filterTema,
        filterAchado,
        filterProcesso,
        filterColeta
    ]);

    // Atualização otimizada das linhas
    useEffect(() => {
        const newRows = createRows(filteredData);
        setRows(prevRows => {
            if (prevRows.length !== newRows.length) return newRows;
            return JSON.stringify(prevRows) === JSON.stringify(newRows) ? prevRows : newRows;
        });
    }, [filteredData, createRows, setRows]);

    return (
        <TextField
            fullWidth
            sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                        borderColor: 'primary.main',
                    },
                },
            }}
            variant="outlined"
            placeholder="Buscar termo..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default React.memo(SearchComponent);