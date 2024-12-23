import { languageTag } from '$i18n/runtime';
import { slugFromPath } from '$lib/helpers/slug-from-path';
import { allPosts } from '$lib/posts';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';

import type { EntryGenerator, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const posts = allPosts[languageTag()];
    const { component, ...frontmatter } =
        (await posts[params.slug]) ?? error(404, 'Post not found');

    const cannotFindPost = !frontmatter?.title;

    if (cannotFindPost) {
        error(404, `Cannot find post with slug '${params.slug}'`);
    }

    let html = render(component, {
        context: new Map(),
        props: {}
    })
        .body.replaceAll('<!--[-->', '')
        .replaceAll('<!--]-->', '');

    return {
        frontmatter,
        postHtml: html,
        slug: params.slug
    };
};

export const entries: EntryGenerator = (async () => {
    const modules = import.meta.glob(`/src/lib/posts/*.{md,svx,svelte.md}`);

    const postPromises = Object.entries(modules).map(async ([path, resolver]) =>
        resolver().then(
            (post): App.BlogPost => ({
                ...(post as App.MdsvexFile).metadata,
                slug: slugFromPath(path)
            })
        )
    );

    const posts = await Promise.all(postPromises);
    return posts.map(({ slug }) => ({ slug }));
}) satisfies EntryGenerator;
