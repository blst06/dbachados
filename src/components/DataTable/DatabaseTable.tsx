import Paper from '@mui/material/Paper';
import { Box, Button, Divider, Grid, IconButton, MenuItem, Select, Tooltip, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRowId, GridRowParams } from '@mui/x-data-grid';
import { ColumnConfig } from '../../types/types';
import { useEffect, useRef, useState } from 'react';
import { topicoAchadoHeader, achadoHeader, processoHeader, coletaHeader } from '../../service/columns';
import { useContextTable } from '../../context/TableContext';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import ModalUpdatePF from '../Modals/DataTableModals/ModalUpdateForms';
import ModalAddData from '../Modals/DataTableModals/ModalAddDataTable';
import useExportToExcel from '../../hooks/useExportToExcel';
import useFetchProcesso from '../Forms/FormsTable/Create/FormProcessoPasta/useFetchProcesso';
import { useAuth } from '../../context/AuthContext';
import useFetchUsers from '../Forms/SignForms/useFetchUsers';
import ModalAnalises from '../Modals/DataTableModals/ModalAnalise';
import DeleteVerification from '../Dialog/VerificationStep';
import DeleteIcon from '@mui/icons-material/Delete';
import { formateDateToPtBr, formatCurrency } from '../../hooks/DateFormate';
import useFetchAchado from '../Forms/FormsTable/Create/FormAchadoPasta/useFetchAchado';
import useFetchTema from '../Forms/FormsTable/Create/FormTemaPasta/useFetchTema';
import useFetchColeta from '../Forms/FormsTable/Create/formColetaPasta/useFetchColeta';
import DataTableSkeleton from './DataTableSkeleton';
import Helper from '../Dialog/Helper';
import HighlightedText from './HighLightMidleware';
import ModalColor from '../Forms/FormsColors/ModalColor';
import useFetchKeyWord from '../Forms/FormsColors/useFetchKeyWord';
import SearchComponent from './SearchComponent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


export default function DatabaseTable() {

  const [dataType, setDataType] = useState('relacionamentos');
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const { handleLocalization, setArrayTopicoAchado, setArrayColeta,
    setArrayAchado, setArrayProcesso, setArrayKeyWord } = useContextTable();
  const [selectedRow, setSelectedRow] = useState<GridRowId>(0)
  const [openModal, setOpenModal] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const { exportToExcel } = useExportToExcel()
  const { user } = useAuth()
  const { getUser } = useFetchUsers()
  const { escutarTemas, aprovarTema } = useFetchTema();
  const { escutarAchados, aprovarAchado } = useFetchAchado();
  const { escutarProcessos } = useFetchProcesso();
  const { escutarColeta } = useFetchColeta();
  const [isLoading, setIsLoading] = useState(true);
  const [textButton, setTextButton] = useState('')
  const { escutarKeyWords } = useFetchKeyWord();
  const [searchTerm, setSearchTerm] = useState<string>('')
  const theme = useTheme();

  useEffect(() => {
    const initialLoadEvent = {
      target: {
        value: dataType
      }
    };
    handleDataTypeChange(initialLoadEvent);
    return () => { };
  }, []);

  const handleDataTypeChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value as string;
    setDataType(value)
    setIsLoading(true);
    let keywordUnsubscribe: (() => void) | undefined;

    keywordUnsubscribe = escutarKeyWords((keywords) => {
      setArrayKeyWord(keywords);
    });
    switch (value) {
      case 'tema':
        setTextButton('Tema')
        setColumns(createGridColumns(topicoAchadoHeader));
        const temaListener = escutarTemas((temas) => {
          setArrayTopicoAchado(temas)
          setRows(createRows(temas))
          setIsLoading(false);
        })
        return () => temaListener;
      case 'achado':
        setTextButton('Tipo de Achado')
        setColumns(createGridColumns(achadoHeader));
        const achadoListener = escutarAchados((achados) => {
          const keywordListener = escutarKeyWords((keyword) => {
            return keyword;
          })
          keywordListener();
          setArrayAchado(achados)
          setRows(createRows(achados))
          setIsLoading(false);
        })
        return () => achadoListener;
      case 'processo':
        setTextButton('Processo')
        setColumns(createGridColumns(processoHeader));
        const processoListener = escutarProcessos((processos) => {
          setArrayProcesso(processos)
          setRows(createRows(processos))
          setIsLoading(false);
        })
        return () => processoListener;
      case 'relacionamentos':
        setTextButton('Coleta')
        setColumns(createGridColumns(coletaHeader));
        const coletaListener = escutarColeta((coleta) => {
          setArrayColeta(coleta)
          setRows(createRows(coleta))
          setIsLoading(false);
        })
        return () => coletaListener;
      default:
        setColumns([]);
        setRows([])
        keywordUnsubscribe
    }
  };

  const createGridColumns = (headers: ColumnConfig[]): GridColDef[] => {
    return headers.map(header => ({
      key: header.id,
      field: header.id,
      headerName: header.label,
      width: header.minWidth,
      editable: false,
      headerClassName: 'bold-header',
      renderCell: (params) => {
        if (header.id === "acoes") {
          const isPending = dataType === 'tema' ? params.row.situacao === false : params.row.situacaoAchado === false;
          return (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              {user?.cargo === 'chefe' && isPending && (
                <Helper title="Clique aqui para aprovar o registro">
                  <IconButton color="success" onClick={() => {
                    if (dataType === 'tema') {
                      aprovarTema(params.row.id)
                    } else if (dataType === 'achado') {
                      aprovarAchado(params.row.id)
                    }
                  }}>
                    <CheckCircleIcon sx={{ fontSize: '30px', mb: 1, animation: 'flipInX 0.5s ease-in-out' }} />
                  </IconButton>
                </Helper>
              )}

              {user?.cargo === 'admin' && (
                <Helper title="Clique aqui para editar o registro">
                  <IconButton color="primary" onClick={() => handleUpdate(params.row.id)}>
                    <EditIcon sx={{ fontSize: '30px', mb: 1, animation: 'flipInX 0.5s ease-in-out' }} />
                  </IconButton>
                </Helper>
              )}
              {user?.cargo === 'admin' && (
                <Helper title="Clique aqui para deletar o registro">
                  <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                    <DeleteIcon sx={{ fontSize: '30px', mb: 1, animation: 'flipInX 0.5s ease-in-out' }} />
                  </IconButton>
                </Helper>
              )}
            </Box>
          );
        }

        if (header.id === 'data') {
          return formateDateToPtBr(params.value)
        }
        if (header.id === 'valorFinanceiro') {
          return formatCurrency(params.value)
        }
        if (header.id === 'analise') {
          return <ModalAnalises key={params.row.id} analise={params.row.analise} />
        }
        // CORRIGIDO: Agora o código espera um valor booleano ou null/undefined
        if (['situacaoAchado', 'situacao', 'sanado'].includes(header.id)) {
          // Lógica de renderização flexível para booleanos e strings
          const value = params.value;
          const isAprovado = value === true || value === 'aprovado' || value === 'julgado' || value === 'sanado';
          const aprovadoColor = theme.palette.mode === 'dark' ? '#22c55e' : '#86efac';
          const pendenteColor = theme.palette.mode === 'dark' ? '#facc15' : '#fcd34d';

          if (value === null || value === undefined) {
              return <span style={{color: 'grey'}}>Status não definido</span>;
          }

          return (
            <span style={{
              background: isAprovado ? aprovadoColor : pendenteColor,
              fontWeight: 'bold',
              padding: '5px 5px',
              borderRadius: '5px'
            }}>
              {isAprovado ? "Aprovado" : "Pendente"}
            </span>
          );
        }

        if (header.id === 'achado' || header.id === 'achadoId') {
          return (
            <Tooltip
              title={params.value || ''}
              arrow
              enterDelay={500}
              placement="top-start"
              slotProps={{
                tooltip: {
                  sx: {
                    fontSize: '14px',
                  },
                },
              }}
            >
              <div style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}>
                <HighlightedText text={params.value || ''} />
              </div>
            </Tooltip>
          );
        }

        if (header.id === 'tipo_financeiro') {
          return (
            <span style={{
              background: params.value
                ? theme.palette.success.main
                : theme.palette.error.main,
              color: theme.palette.getContrastText(
                params.value
                  ? theme.palette.success.dark
                  : theme.palette.error.dark
              ),
              padding: '5px 10px',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              minWidth: '50px',
              textAlign: 'center'
            }}>
              {params.value ? "Sim" : "Não"}
            </span>
          );
        }

        return (
          <Tooltip
            title={params.value || ''}
            arrow
            enterDelay={500}
            placement="top-start"
            slotProps={{
              tooltip: {
                sx: {
                  fontSize: '14px',
                },
              },
            }}
          >
            <div style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',

            }}>
              {params.value}
            </div>
          </Tooltip>
        );
      },
      filterable: true,
    }));
  };

  const createRows = (data: any[]): any[] => {
    return data.map((item) => ({
      id: item.id,
      ...item,
    }));
  };

  useEffect(() => {
    getUser()
  }, [])

  handleLocalization

  const getVisibleColumnsFromModel = (columns: GridColDef[], model: GridColumnVisibilityModel) => {
    return console.log(columns, model)
  };

  const optionsSelect = [
    { value: 'tema', string: 'Temas' },
    { value: 'achado', string: 'Banco de Achados' },
    { value: 'processo', string: 'Processos' },
    { value: 'relacionamentos', string: 'Coleta' },
  ]

  function handleUpdate(selectedRow: GridRowId) {
    setSelectedRow(selectedRow);
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseModalDelete = () => {
    setOpenModalDelete(false);
  };

  const dataTypeRef = useRef(dataType);

  useEffect(() => {
    dataTypeRef.current = dataType;
  }, [dataType, selectedRow]);

  const handleDelete = async (selectedRow: GridRowId) => {
    setSelectedRow(selectedRow)
    setOpenModalDelete(true)
  }

  return (
    <Grid sx={{
      height: '95vh',
      pt: 10,
      pl: 2,
      pr: 2,
      overflow: 'hidden'
    }}>
      <Paper sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography
          gutterBottom
          variant='h5'
          component='div'
          sx={{ padding: '20px' }}>
          Coleta
        </Typography>
        <Grid container alignItems="center" spacing={2} sx={{ mb: 2, mt: 1, pl: 2, pr: 2 }}>
          <Grid item>
            <Select
              name="dataTypeSelect"
              id="dataTypeSelect"
              value={dataType}
              onChange={handleDataTypeChange}
              sx={{ minWidth: 140 }}
            >
              {optionsSelect.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.string}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <ModalAddData dataType={dataType} textButton={textButton} user={user} />
          </Grid>
          <Grid item>
            <ModalColor />
          </Grid>
          <Grid item>
            <Helper title="Clique aqui para exportar os dados dessa tabela">
              <Button variant="contained" sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#fde68a' : '#fb923c',
                color: theme.palette.mode === 'dark' ? '#232b3b' : '#fff',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? '#fbbf24' : '#fdba74',
                },
                minWidth: 40,
                height: 40,
                p: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} onClick={() => {
                exportToExcel(dataType, 'data.xlsx')
              }}>
                <FileDownloadIcon />
              </Button>
            </Helper>
          </Grid>
          <Grid item xs>
            <SearchComponent dataType={dataType} setRows={setRows} createRows={createRows} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Grid>
        </Grid>
        <Divider />
        <Box sx={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          position: 'relative'
        }}>
          {isLoading && (
            <DataTableSkeleton
              dataType={dataType}
              isLoading={isLoading}
              visibleRows={rows.length || 10}
            />
          )}
          <Box sx={{ visibility: isLoading ? 'hidden' : 'visible', height: '100%', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              showCellVerticalBorder
              localeText={handleLocalization}
              slotProps={{
                panel: {
                  sx: {
                    '& .MuiDataGrid-filterForm': {
                      width: 700,
                      gap: 2,
                    },
                    '.MuiDataGrid-filterFormValueInput': {
                      width: 400,
                    },
                  },
                },
              }}
              filterMode="client"
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              onRowClick={(params: GridRowParams) => {
                setSelectedRow(params.id);
              }}
              getRowClassName={(params: GridRowParams) => {
                return params.id === selectedRow ? 'selected-row' : '';
              }}
              onColumnVisibilityModelChange={(model: GridColumnVisibilityModel) => {
                const visibleCols = getVisibleColumnsFromModel(columns, model);
                return visibleCols;
              }}
              sx={{
                '& .MuiDataGrid-virtualScroller': {
                  overflowX: 'hidden' // Esconde o scroll horizontal se necessário
                },

                '& .MuiDataGrid-columnHeaders': {
                  position: 'sticky', // Mantém os headers visíveis
                  top: 0,
                  backgroundColor: 'primary.main',
                  zIndex: 1

                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold !important',
                  fontSize: '0.875rem',
                },
                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
                  outline: 'none',
                },

                cursor: 'pointer'
              }}
            />
          </Box>
        </Box>
      </Paper>
      {selectedRow !== null && (
        <ModalUpdatePF
          id={selectedRow}
          dataType={dataType}
          open={openModal}
          user={user}
          onClose={handleCloseModal}
        />
      )}
      {selectedRow !== null && (
        <DeleteVerification
          selectedRow={selectedRow}
          dataType={dataType}
          onClose={handleCloseModalDelete}
          open={openModalDelete}
        />
      )}
    </Grid>
  );
}