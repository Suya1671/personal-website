import { languageTag } from '$i18n/runtime';
import { allPosts } from '$lib/posts';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const posts = allPosts[languageTag()];
    const { component, ...frontmatter } =
        (await posts[params.slug]) ?? error(404, `Cannot find post with slug '${params.slug}'`);

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
