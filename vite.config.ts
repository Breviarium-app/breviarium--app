import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path, {resolve} from "path";
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    optimizeDeps: {
        exclude: ["breviarium"],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            romcal: resolve(__dirname, 'node_modules/romcal/dist/esm/romcal.mjs'),
        },
    },

    build: {
        sourcemap: false
    }
})
