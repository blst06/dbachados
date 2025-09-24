import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import useFetchTema from '../components/Forms/FormsTable/Create/FormTemaPasta/useFetchTema';
import useFetchAchado from '../components/Forms/FormsTable/Create/FormAchadoPasta/useFetchAchado';
import useFetchProcesso from '../components/Forms/FormsTable/Create/FormProcessoPasta/useFetchProcesso';
import { useContextTable } from '../context/TableContext';
import { useTheme } from '@mui/material/styles';
import { TypeInfo } from './TypeAlert';

const useExportToExcel = () => {
    const { getAllTemas } = useFetchTema();
    const { getAllAchados } = useFetchAchado();
    const { getAllProcessos } = useFetchProcesso();
    const { arrayColeta, arrayKeyWord } = useContextTable();
    const theme = useTheme();

    const exportToExcel = async (dataType: string, fileName: 'data.xlsx') => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(dataType);

        let headers: string[] = [];
        let rows: any[] = [];

        try {
            switch (dataType) {

                case 'tema': {
                    try {
                        const temas = await getAllTemas();

                        if (!temas || temas.length === 0) {
                            console.log("Nenhum tema encontrado.");
                            TypeInfo("Não há dados para exportar", "info");
                            return;
                        };

                        headers = ['Tema', 'Situação'];
                        rows = temas.map((tema) => [
                            tema.tema,
                            tema.situacao ? 'Aprovado' : 'Pendente']);
                        rows.sort((a, b) => a[0].localeCompare(b[0]));

                    } catch (error) {
                        console.error("erro ao tentar exportar os temas: ", error)
                    }

                    break;
                }

                case 'achado': {

                    try {
                        const achado = await getAllAchados();
                        const temas = await getAllTemas();

                        if (!achado || achado.length === 0) {
                            console.log("Nenhum achado encontrado.");
                            TypeInfo("Não há dados para exportar", "info");
                            return;
                        };

                        if (!temas || temas.length === 0) {
                            console.log("Nenhum tema encontrado.");
                            TypeInfo("Não há dados para exportar", "info");
                            return;
                        }

                        const temaMap = new Map(temas.map((tema) => [tema.id, tema.tema]));

                        headers = ['Temas', 'Achado', 'Análise', 'Data', 'Tipo financeiro' , 'Gravidade', 'Critério Geral', 'Situação Achado'];
                        rows = achado.map((achado) => [
                            temaMap.get(achado.tema_id) || 'Tema não encontrado',
                            achado.achado,
                            achado.analise,
                            achado.data,
                            achado.tipo_financeiro ? 'sim' : 'não',
                            achado.gravidade,
                            achado.criterioGeral,
                            achado.situacaoAchado === true ? 'Aprovado' : 'Pendente'
                        ]);
                        rows.sort((a, b) => a[0].localeCompare(b[0]));
                    } catch (error) {
                        console.error("erro ao tentar exportar os achados: ", error)
                    }

                    break;
                }

                case 'processo': {
                    try {
                        const processos = await getAllProcessos();

                        if (!processos || processos.length === 0) {
                            console.log("Nenhum processo encontrado.");
                            TypeInfo("Não há dados para exportar", "info");
                            return;
                        };

                        headers = ['Número', 'Exercício', 'Unidade Gestora', 'Diretoria', 'Julgado'];
                        rows = processos.map((processos) => [
                            processos.numero,
                            processos.exercicio,
                            processos.unidadeGestora,
                            processos.diretoria,
                            processos.julgado
                        ]);
                        rows.sort((a, b) => a[1] - b[1]);
                    } catch (error) {
                        console.error("erro ao tentar exportar os processos: ", error)
                    }
                    break;
                };

                case 'relacionamentos': {
                    try {

                        if (!arrayColeta || arrayColeta.length === 0) {
                            console.log("Nenhum relacionamento encontrado.");
                            return;
                        };

                        headers = ['Processo', 'Tema', 'Achado', 'Valor Fianceiro', 'Quantitativo', 'Unidade', 'Coletador ID', 'Sanado', 'Situação Encontrada'];
                        rows = arrayColeta.map((coleta) => [
                            coleta.processoId,
                            coleta.temaId,
                            coleta.achadoId,
                            coleta.valorFinanceiro,
                            coleta.quantitativo,
                            coleta.unidade,
                            coleta.coletadorId,
                            coleta.sanado,
                            coleta.situacao_encontrada
                        ]);
                        rows.sort((a, b) => a[1].localeCompare(b[1]));
                    } catch (error) {
                        console.error("erro ao tentar exportar os processos: ", error)
                    }
                    break;
                };

                default:
                    console.warn('Tipo de dado não reconhecido: ', dataType);
                    break;
            }

            sheet.addTable({
                name: `Tabela_${dataType}`,
                ref: 'A1',
                headerRow: true,
                style: {
                    theme: 'TableStyleMedium2',
                    showRowStripes: true,
                },
                columns: headers.map((header) => ({ name: header })),
                rows: rows,
            });

            sheet.columns = headers.map((header, index) => ({
                header,
                key: header,
                width: Math.max(
                    10, // Largura mínima
                    ...rows.map(row =>
                        (row[index]?.toString()?.length || 0) + 2 // Adiciona um pequeno espaço extra
                    ),
                    header.length + 2 // Garante que o cabeçalho também caiba
                )
            }));

            // Destaca palavras-chave na coluna 'Achado' usando lógica semelhante ao middleware
            const achadoColIdx = headers.findIndex(h => h.toLowerCase() === 'achado');
            if (achadoColIdx !== -1) {
                // Prepara as palavras-chave mantendo a formatação original
                const keywords = arrayKeyWord.map(item => ({
                    ...item,
                    words: item.label.split(' '),
                    original: item.label,
                    length: item.label.length
                }));
                // Ordena por: 1) palavras com mais termos, 2) termos mais longos
                keywords.sort((a, b) => {
                    if (b.words.length !== a.words.length) {
                        return b.words.length - a.words.length;
                    }
                    return b.length - a.length;
                });
                rows.forEach((row, i) => {
                    const cellValue = row[achadoColIdx];
                    if (typeof cellValue === 'string' && keywords.length > 0) {
                        // Divide o texto em tokens (palavras e espaços)
                        const tokens = cellValue.split(/(\s+)/);
                        let richTextArr = [];
                        let idx = 0;

                        const checkExactMatch = (token: string, keywordWord: string) => {
                            return token.toLowerCase() === keywordWord.toLowerCase();
                        };

                        while (idx < tokens.length) {
                            // Função para verificar se uma sequência de tokens corresponde a uma palavra-chave
                            const checkForKeyword = (startIndex: number) => {
                                const remainingTokens = tokens.length - startIndex;
                                for (const keyword of keywords) {
                                    if (keyword.words.length * 2 - 1 > remainingTokens) continue;
                                    let match = true;
                                    for (let j = 0; j < keyword.words.length; j++) {
                                        const tokenIndex = startIndex + j * 2;
                                        if (!checkExactMatch(tokens[tokenIndex], keyword.words[j])) {
                                            match = false;
                                            break;
                                        }
                                    }
                                    if (match) {
                                        return {
                                            keyword,
                                            length: keyword.words.length * 2 - 1
                                        };
                                    }
                                }
                                return null;
                            };
                            const result = checkForKeyword(idx);
                            if (result) {
                                richTextArr.push({
                                    text: tokens.slice(idx, idx + result.length).join(''),
                                    font: {
                                        color: {
                                            argb: result.keyword.type === 'problema' ? theme.palette.error.main.replace('#', '') : theme.palette.primary.main.replace('#', ''),
                                        },
                                        bold: true,
                                    }
                                });
                                idx += result.length;
                            } else {
                                richTextArr.push({ text: tokens[idx] });
                                idx++;
                            }
                        }
                        const cell = sheet.getCell(i + 2, achadoColIdx + 1);
                        cell.value = { richText: richTextArr };
                    }
                });
            }

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), fileName);
        } catch (error) {
            console.error(`Erro ao exportar dados de ${dataType}:`, error);
        }
    };

    return {
        exportToExcel
    };

}

export default useExportToExcel