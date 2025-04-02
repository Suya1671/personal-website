<script lang="ts">
    import { type Snippet } from 'svelte';
    import { setupViewTransition } from 'sveltekit-view-transition';

    import type { LayoutData } from './$types';

    import '../app.css';
    import Footer from './footer.svelte';
    import Header from './header.svelte';

    setupViewTransition();

    interface Props {
        children: Snippet;
        data: LayoutData;
    }
    const { children, data }: Props = $props();
</script>

<Header />
<main class="bg:base fg:base pt:4x">
    {@render children()}
</main>
<Footer footerText={data.footerText} />

<style></style>
