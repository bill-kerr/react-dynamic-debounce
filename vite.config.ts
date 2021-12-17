import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3001,
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'react-dynamic-debounce',
		},
		rollupOptions: {
			external: ['react'],
			output: {
				globals: {
					react: 'react',
				},
			},
		},
	},
});
