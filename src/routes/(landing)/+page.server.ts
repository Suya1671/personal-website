import { getLocale } from '$lib/paraglide/runtime';
import { allPosts } from '$lib/posts';

import type { PageServerLoad } from './$types';
import type { IProject } from './project.svelte';

export const prerender = true;

export const _projects: IProject[] = [
    {
        description: 'This very website!',
        name: 'Personal website',
        url: 'https://github.com/Suya1671/personal-website'
    },
    {
        description: 'Next-generation minecraft launcher',
        name: 'Glowsquid',
        url: 'https://github.com/glowsquid-launcher/glowsquid-new'
    },
    {
        description: 'My NixOS configuration',
        name: 'Commafiles',
        url: 'https://github.com/Suya1671/commafiles'
    }
];
export const load: PageServerLoad = async ({ depends }) => {
    depends('paraglide:lang');
    const language = getLocale();

    const posts = (await Promise.all(Object.values(allPosts[language]).map((post) => post()))).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ component: _, ...metadata }) => metadata
    );

    const publishedPosts = posts.filter((post) => post.published);

    publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

    return {
        posts: publishedPosts,
        projects: _projects
    };
};
