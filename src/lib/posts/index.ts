import { slugFromPath } from '$lib/helpers/slug-from-path'
import type { Locale } from '$lib/paraglide/runtime'

const englishModules = import.meta.glob<false, '', App.MdsvexFile>(
    `/src/lib/posts/en/*.{md,svx,svelte.md}`
)
const afrikaansModules = import.meta.glob<false, '', App.MdsvexFile>(
    `/src/lib/posts/af/*.{md,svx,svelte.md}`
)

const moduleToPost = (resolver: App.MdsvexResolver, path: string) =>
    resolver().then(
        (post): App.BlogPost => ({
            ...post.metadata,
            component: post.default,
            slug: slugFromPath(path)
        })
    )

const englishPosts = Object.fromEntries(
    Object.entries(englishModules).map(
        ([path, resolver]) => [slugFromPath(path), () => moduleToPost(resolver, path)] as const
    )
)

const afrikaansPosts = Object.fromEntries(
    Object.entries(afrikaansModules).map(
        ([path, resolver]) => [slugFromPath(path), () => moduleToPost(resolver, path)] as const
    )
)

export const allPosts: Record<Locale, Record<string, () => Promise<App.BlogPost>>> = {
    af: afrikaansPosts,
    en: englishPosts
}
