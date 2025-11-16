// See https://kit.svelte.dev/docs/types#app

import 'svelte'
import 'unplugin-icons/types/svelte'
import type { AvailableLanguageTag } from '$lib/paraglide/runtime'
import type { ParaglideLocals } from '@inlang/paraglide-sveltekit'

declare global {
    namespace App {
        type BlogPost = {
            author: string
            component: import('svelte').Component
            date: string
            description: string
            published: boolean
            slug: string
            title: string
            updated: string
            /**
             * Whether or not this post can use JS to enhance it
             *
             * This actually controls whether or not the client loads the JS for this component
             */
            useJS?: boolean
        }
        // interface PageData {}
        // interface Platform {}

        // Interface Error {}
        interface Locals {
            paraglide: ParaglideLocals<AvailableLanguageTag>
        }

        type MdsvexFile = {
            default: SvelteComponent
            metadata: BlogPost & Record<string, string>
        }

        type MdsvexResolver = () => Promise<MdsvexFile>
    }

    module '*&enhanced' {
        const out: Exclude<import('@sveltejs/enhanced-img').EnhancedImgAttributes['src'], string>
        export default out
    }
}
