import { preprocessMeltUI } from '@melt-ui/pp'
import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

import mdsvexConfig from './mdsvex.config.js'

/** @type {import('@sveltejs/kit').Config}*/
const config = {
    extensions: ['.svelte', ...(mdsvexConfig.extensions ?? [])],
    compilerOptions: {
        experimental: {
            async: true
        }
    },
    kit: {
        adapter: adapter(),
        alias: {
            $lib: './src/lib'
        },
        prerender: {
            // TODO: handle localisation redirects
            handleHttpError: 'warn',
            handleMissingId: 'warn'
        },
        experimental: {
            remoteFunctions: true
        },
        typescript: {
            config(config) {
                config.include.push('../vite.config.ts')
                config.include.push('../mdsvex.config.js')
                config.include.push('../eslint.config.js')
                config.include.push('../svelte.config.js')
                return config
            }
        }
    },
    preprocess: [
        vitePreprocess({ script: true }),
        mdsvex(mdsvexConfig),
        preprocessMeltUI()
    ]
}
export default config
