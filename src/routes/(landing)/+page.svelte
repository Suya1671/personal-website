<script lang="ts">
    import PageHead from '$lib/components/page-head.svelte';
    import * as m from '$lib/paraglide/messages';
    import Posts from '$lib/posts/posts.svelte';
    import { Island } from 'sveltekit-islands';

    import type { PageData } from './$types';

    import Hero from './hero.svelte';
    import Skills from './skills.svelte';

    interface Props {
        data: PageData;
    }
    const { data }: Props = $props();
</script>

<PageHead description={m.landingpagedesc()} />

<Island component={Hero}></Island>

<Skills {data} />

<h2>Posts</h2>

<Posts posts={data.posts} />

<style>
    h2 {
        width: min-content;
        margin: 0.5rem 0;
        margin-left: 1rem;

        font-size: 2.25rem;
        color: var(--primary);

        @media (width > 64rem) {
            margin-left: 2rem;
        }
    }
</style>
