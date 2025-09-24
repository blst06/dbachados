import { Box, Skeleton } from "@mui/material";
import { achadoHeader, coletaHeader, processoHeader, topicoAchadoHeader } from "../../service/columns";

interface DataTableSkeletonProps {
  dataType: string; // Adicionamos o tipo de dados
  isLoading: boolean;
  visibleRows?: number;
}

const DataTableSkeleton: React.FC<DataTableSkeletonProps> = ({ 
  dataType,
  isLoading,
  visibleRows = 10 
}) => {
  if (!isLoading) return null;

  // Mapeia os headers baseado no dataType
  const getHeaders = () => {
    switch (dataType) {
      case 'tema': return topicoAchadoHeader;
      case 'achado': return achadoHeader;
      case 'processo': return processoHeader;
      case 'relacionamentos': return coletaHeader;
      default: return null; 
    }
  };

  const headers = getHeaders();

  if (!headers) return null;

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      backgroundColor: 'background.paper'
    }}>
      {/* Cabeçalhos */}
      <Box sx={{ display: 'flex', width: '100%', p: 1 }}>
        {headers.map((header, index) => (
          <Skeleton
            key={`header-${index}`}
            variant="rectangular"
            width={header.minWidth}
            height={50}
            sx={{ 
              mx: 0.5, 
              borderRadius: 1,
              flexShrink: 0
            }}
          />
        ))}
      </Box>
      
      {/* Linhas */}
      {Array.from({ length: visibleRows }).map((_, rowIndex) => (
        <Box key={`row-${rowIndex}`} sx={{ display: 'flex', width: '100%', p: 1 }}>
          {headers.map((header, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="rectangular"
              width={header.minWidth}
              height={40}
              sx={{ 
                mx: 0.5, 
                borderRadius: 1,
                flexShrink: 0
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default DataTableSkeleton;