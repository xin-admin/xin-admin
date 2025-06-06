import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { URL, fileURLToPath } from 'node:url';

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;
  return {
    base: viteEnv.VITE_BASE_URL,
    build: {
      rollupOptions: {
        output: {
          assetFileNames: chunkInfo => {
            const name = chunkInfo.names[0];

            if (name?.endsWith('.css')) {
              return 'css/[name]-[hash].css';
            }

            const imgExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

            if (imgExts.some(ext => name?.endsWith(`.${ext}`))) {
              return 'images/[name]-[hash].[ext]';
            }

            if (name?.endsWith('.js')) {
              return 'js/[name]-[hash].js';
            }

            return 'assets/[name]-[hash].[ext]';
          },
          chunkFileNames: chunkInfo => {
            // 检查文件路径，如果是 pages 目录下的文件，则修改文件名和路径
            const filePath = chunkInfo.facadeModuleId;

            if (filePath) {
              // 提取文件的父文件夹作为文件名
              if (filePath.includes('/src/pages/')) {
                // 提取文件的父文件夹作为文件名
                const pageName = filePath.split('/src/pages/')[1];
                // 替换 [name] 为  name 因为vite不支持
                const newPath = pageName.replace(/\[([^\]]+)\]/g, '$1');

                const path = newPath.slice(0, newPath.lastIndexOf('/'));

                return `js/pages/${path}/[name]-[hash].js`;
              } else if (filePath.includes('/src/components/')) {
                return `js/components/[name]-[hash].js`;
              }
            }
            return 'js/[name]-[hash].js'; // 默认处理方式
          },
        }
      }
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      open: true,
      port: 3000,
      proxy: {},
      warmup: {
        clientFiles: ['./index.html', './src/{pages,components}/*']
      }
    }
  }
})
