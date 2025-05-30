import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: { 
		port: 8083 // <--- Defina a porta desejada aqui 
	} 
});
