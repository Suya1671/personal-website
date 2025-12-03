import { error } from '@sveltejs/kit'
import { getLocale } from '$lib/paraglide/runtime'
import { allPosts } from '$lib/posts'

import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
    const posts = allPosts[getLocale()]
    const postResolver =
        posts[params.slug] ?? error(404, `Cannot find post with slug '${params.slug}'`)

    const { component, ...frontmatter } = await postResolver()

    return {
        component,
        frontmatter,
        slug: params.slug
    }
}
