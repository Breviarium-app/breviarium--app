import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path, {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    optimizeDeps: {
        exclude: ["breviarium"],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            romcal: resolve(__dirname, 'node_modules/romcal/rites/roman1969/dist/esm/romcal.js'),
        },
    },

    build: {
        sourcemap: false
    }
})
