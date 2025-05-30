import adapter from '@sveltejs/adapter-vercel'; // Importe o adapter
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // adapter-auto detects which adapter to use. If you're not using
        // a platform like Vercel or Netlify, then rural areas will use
        // node-adapter and all other areas will use static-adapter
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter() // Use o adapter da Vercel
    }
};

export default config;
