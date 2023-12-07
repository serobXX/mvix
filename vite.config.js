import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  build: {
    outDir: 'build'
  },
  resolve: {
    alias: [
      { find: 'api/', replacement: '/src/api/' },
      { find: 'components/', replacement: '/src/components/' },
      { find: 'constants/', replacement: '/src/constants/' },
      { find: 'hooks/', replacement: '/src/hooks/' },
      { find: 'pages/', replacement: '/src/pages/' },
      { find: 'utils/', replacement: '/src/utils/' },
      { find: 'slices/', replacement: '/src/slices/' },
      { find: 'selectors/', replacement: '/src/selectors/' },
      { find: 'hoc/', replacement: '/src/hoc/' }
    ]
  },
  loader: { '.js': '.jsx' }
})
