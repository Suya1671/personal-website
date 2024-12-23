// See https://kit.svelte.dev/docs/types#app

import 'svelte';
import 'unplugin-icons/types/svelte';
import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
import type { ParaglideLocals } from '@inlang/paraglide-sveltekit';

declare global {
    namespace App {
        type BlogPost = {
            author: string;
            component: typeof import('svelte').SvelteComponent;
            date: string;
            description: string;
            published: boolean;
            slug: string;
            title: string;
            updated: string;
        };
        // interface PageData {}
        // interface Platform {}

        // Interface Error {}
        interface Locals {
            paraglide: ParaglideLocals<AvailableLanguageTag>;
        }

        type MdsvexFile = {
            default: SvelteComponent;
            metadata: BlogPost & Record<string, string>;
        };

        type MdsvexResolver = () => Promise<MdsvexFile>;
    }

    module '*as=optimize' {
        const out: unknown;
        export default out;
    }
}
