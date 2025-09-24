import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do arquivo .env
  const env = loadEnv(mode, process.cwd(), '');
  

  return {
    plugins: [react()],
    // Define apenas as variáveis necessárias para o cliente
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV), 
      global:'window',
    },
  };
});