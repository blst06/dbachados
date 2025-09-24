import { createTheme, responsiveFontSizes } from "@mui/material";

export const lightTheme = responsiveFontSizes(createTheme({
     palette: {
        mode: "light",
        primary: {
            main: "#2563eb",         // azul mais suave
            contrastText: "#fff",
        },
        secondary: {
            main: "#f59e42",         // laranja suave
            contrastText: "#fff",
        },
        background: {
            default: "#f3f6fc",      // cinza-azulado bem claro
            paper: "#ffffff",        // branco puro para cards
        },
        text: {
            primary: "#1e293b",      // azul escuro
            secondary: "#475569",    // cinza azulado
        },
        success: {
            main: "#16a34a",  // Verde principal
            light: "#86efac", // Verde claro (para o "Sim")
            dark: "#15803d",   // Verde escuro
            contrastText: "#fff"
        },
        error: {
            main: "#dc2626",   // Vermelho principal
            light: "#fca5a5",  // Vermelho claro (para o "Não")
            dark: "#b91c1c",    // Vermelho escuro
            contrastText: "#fff"
        },
    },
    typography: {
        fontFamily: '"Poppins", sans-serif',
    },
}));

export const darkTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#60a5fa",         // azul claro
            contrastText: "#1e293b",
        },
        secondary: {
            main: "#fbbf24",         // amarelo suave
            contrastText: "#1e293b",
        },
        background: {
            default: "#181f2a",      // azul escuro para fundo
            paper: "#232b3b",        // azul/cinza escuro para cards
        },
        text: {
            primary: "#f3f6fc",      // quase branco
            secondary: "#cbd5e1",    // cinza claro
        },
         success: {
            main: "#22c55e",   // Verde principal
            light: "#4ade80",   // Verde claro (para o "Sim")
            dark: "#16a34a",    // Verde escuro
            contrastText: "#fff"
        },
        error: {
            main: "#ef4444",    // Vermelho principal
            light: "#f87171",   // Vermelho claro (para o "Não")
            dark: "#dc2626",    // Vermelho escuro
            contrastText: "#fff"
        },
    },
    typography: {
        fontFamily: '"Poppins", sans-serif',
    },
}));

// Exporte o tema padrão (claro, por exemplo)
export default lightTheme;