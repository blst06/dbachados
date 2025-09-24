import { Tooltip, IconButton, useTheme } from '@mui/material';

interface ColorCircleCopyProps {
    type:string;
}

const ColorCircleCopy = ({ type }: ColorCircleCopyProps) => {
    const theme = useTheme();
    
    const color = type === 'problema' 
        ? theme.palette.error.main 
        : theme.palette.primary.main;

    return (
        <Tooltip title={`Tipo: ${type}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                    style={{
                        display: 'inline-block',
                        width: 22,
                        height: 22,
                        borderRadius: '100%',
                        background: color,
                        border: '1px solid #cbd5e1',
                        marginRight: 8,
                    }}
                />
                <IconButton 
                    size="small" 
                  
                >
                </IconButton>
            </div>
        </Tooltip>
    );
};

export default ColorCircleCopy;