<script lang="ts">
    import PageHead from '$lib/components/page-head.svelte';
    import Posts from '$lib/posts/posts.svelte';

    import type { PageData } from './$types';

    interface Props {
        data: PageData;
    }
    const { data }: Props = $props();
</script>

<PageHead description="My blog posts" title="Posts" />

<h1>Posts</h1>
<Posts posts={data.posts} />

<style>
    h1 {
        margin-left: 1rem;
        font-size: 2.5rem;

        @media (width > 64rem) {
            margin-left: 2rem;
        }
    }
</style>
