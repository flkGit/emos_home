/*
 * @Author: flkgit 26158700+flkGit@users.noreply.github.com
 * @Date: 2025-09-27 21:33:18
 * @LastEditors: flkgit 26158700+flkGit@users.noreply.github.com
 * @LastEditTime: 2025-09-29 21:37:17
 * @FilePath: /emos_home/vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by 26158700+flkGit@users.noreply.github.com, All Rights Reserved. 
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      // https://developers.cloudflare.com/turnstile/troubleshooting/testing/
      'import.meta.env.TURNSTILE_SITE_KEY': `'${mode == 'production' ? env.TURNSTILE_SITE_KEY : '1x00000000000000000000AA'}'`,
    },
    build: {
      cssCodeSplit: false,
    },
    plugins: [
      vue(),
      vueJsx(),
      cloudflare(),
      tailwindcss(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          },
        ],
      }),
      Components({
        dirs: ['web/components'],
        resolvers: [NaiveUiResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./web', import.meta.url)),
        '@common': fileURLToPath(new URL('./common', import.meta.url)),
        '@server': fileURLToPath(new URL('./server', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'https://dev.emos.lol',
          // target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
