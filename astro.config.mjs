import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from "@astrojs/sitemap";
import tailwind from '@astrojs/tailwind';
import { defineConfig } from "astro/config";
import remarkGfm from 'remark-gfm';

const site = 'https://fdm-hub.com';

export default defineConfig({
    site,
    integrations: [sitemap(), mdx(), react(), tailwind({
        applyBaseStyles: false
    })],
    markdown: {
        remarkPlugins: [remarkGfm],
    },
    vite: {
        server: {
            port: 4321
        }
    }
});