import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definindo a interface para o estado do store
interface AppState {
    dopen: boolean;
    updateOpen: (dopen: boolean) => void;
}

// Função que define o estado inicial e as ações do store
const appStore = (set: (fn: (state: AppState) => AppState) => void): AppState => ({
    dopen: true,
    updateOpen: (dopen) => set((state) => ({ ...state, dopen })),
});

// Persistindo o store
const persistedAppStore = persist<AppState>(appStore, { name: "my_app_store" });

// Criando o hook personalizado
export const useAppStore = create(persistedAppStore);