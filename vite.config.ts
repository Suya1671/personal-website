import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

const targets = browserslistToTargets(
    browserslist('defaults, not IE 11, not IE_Mob 11, not OperaMini all')
);

export default defineConfig({
    build: {
        cssMinify: 'lightningcss'
    },
    css: {
        devSourcemap: true,
        lightningcss: {
            targets
        },
        transformer: 'lightningcss'
    },
    plugins: [
        enhancedImages(),
        sveltekit(),
        paraglideVitePlugin({
            // doesn't work on CSR yet. Neat feature though!
            // experimentalMiddlewareLocaleSplitting: true,
            outdir: './src/lib/paraglide',
            project: './project.inlang',
            strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale']
        }),
        Icons({
            autoInstall: true,
            compiler: 'svelte'
        })
    ],
    server: {
        fs: {
            allow: ['./master.css.ts']
        }
    }
});
