<script lang="ts">
    import PageHead from '$lib/components/page-head.svelte';
    import * as m from '$lib/paraglide/messages';
    import { getLocale } from '$lib/paraglide/runtime';
    import Giscus from '@giscus/svelte';
    import '@portaljs/remark-callouts/styles.css';
    import { createTableOfContents } from '@melt-ui/svelte';
    import { Island } from 'sveltekit-islands';

    import './giscus.css';

    import { setupViewTransition } from 'sveltekit-view-transition';

    import type { PageData } from './$types';

    import ToC from './table-of-contents.svelte';

    interface Props {
        data: PageData;
    }
    const { data }: Props = $props();

    if (
        !data.frontmatter.date ||
        !data.frontmatter.updated ||
        !data.frontmatter.description ||
        data.frontmatter.published === undefined
    ) {
        throw new Error('Missing date or updated in frontmatter');
    }

    // Svelte's template doesn't recognize the type narrowing done above
    const description = data.frontmatter.description;
    const draft = !data.frontmatter.published;

    const datePublished = new Date(data.frontmatter.date);
    const dateModified = new Date(data.frontmatter.updated);

    const dateFormatter = new Intl.DateTimeFormat('en-uk', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const { transition } = setupViewTransition();

    const {
        elements: { item },
        states: { headingsTree }
    } = createTableOfContents({
        activeType: 'highest-parents',
        exclude: [],
        selector: '#article'
    });
</script>

<PageHead {description} title={data.frontmatter.title} />

<svelte:head>
    <meta content="article" property="og:type" />
    <meta content={datePublished.toISOString()} property="og:article:published_time" />
    <meta content={dateModified.toISOString()} property="og:article:modified_time" />
</svelte:head>

<div class="grid justify-items:center grid-layout:article">
    <aside class="grid-area:sidebar mx:2x align-self:start top:10x sticky@md">
        {#key $headingsTree}
            <ToC {item} tree={$headingsTree} />
        {/key}
    </aside>

    <article
        class="break-word bg:surface grid-area:content r:4x $col:blue $primary:text-primary $vgreen:green $vorange:orange $vred:red $vteal:teal px:4x text:5x justify-self:center max-w:75ch mb:6x hypens-auto md:mx-0 text-justify"
        id="article"
        use:transition={`post-${data.slug}`}
    >
        <header class="py:4x mb:3x">
            <hr
                class="border:none r:2x $from:text-primary $to:secondary gradient(45deg,var(--from),var(--to)) h:1x"
            />

            <h1 class="text:8x text:center" use:transition={`post-title-${data.slug}`}>
                {data.frontmatter.title}
            </h1>

            <hr
                class="border:none r:2x $from:secondary $to:text-primary gradient(45deg,var(--from),var(--to)) h:1x"
            />

            <p class="fg:subtle opacity:.9 my-0" use:transition={`post-dates-${data.slug}`}>
                {m.post_card_by({ author: data.frontmatter.author })} | {m.post_card_published({
                    published: dateFormatter.format(datePublished),
                    updated: dateFormatter.format(dateModified)
                })}
                {#if draft}
                    | <span class="fg:red">{m.post_card_draft()}</span>
                {/if}
            </p>
        </header>

        <div class="max-w:calc(100vw-2rem)">
            <!-- This ensures the JS for the component is only loaded if the post requires/asks for it -->
            {#if data.frontmatter.useJS}
                <Island component={data.component}></Island>
            {:else}
                <data.component></data.component>
            {/if}
        </div>

        <Giscus
            category="Announcements"
            categoryId="DIC_kwDOI0N8xs4Caho4"
            emitMetadata="1"
            inputPosition="top"
            lang={getLocale()}
            loading="lazy"
            mapping="og:title"
            reactionsEnabled="1"
            repo="Suya1671/personal-website"
            repoId="R_kgDOI0N8xg"
            strict="0"
        />
    </article>

    <aside class="hidden grid-area:notes md:block mr-4"></aside>
</div>

<style>
    .grid-layout\:article {
        grid-template-areas:
            'sidebar'
            'content';
    }

    @media (min-width: 1024px) {
        .grid-layout\:article {
            grid-template-areas:
                'sidebar content'
                'sidebar notes';

            grid-template-columns: 1fr 3fr;
        }
    }

    @media (min-width: 1440px) {
        .grid-layout\:article {
            grid-template-areas: 'sidebar content notes';
            grid-template-columns: 1fr 3fr 1fr;
        }
    }

    :global(#article) {
        & :global(> article h1) {
            font-size: 2.5rem;
        }

        & :global(:is(h1, h2, h3, h4, h5, h6)) {
            transform: none !important;
            & :global(> a) {
                display: inline-block;
                position: relative;
                text-decoration: none;
                transition: all 300ms var(--m3-easing);

                &::after {
                    background: var(--col) none repeat scroll;
                    bottom: 0;
                    content: '';
                    display: block;
                    height: 0.125rem;
                    position: absolute;
                    transition: all 300ms var(--m3-easing);
                    width: 0;
                }

                &:hover {
                    color: var(--col);
                    &::after {
                        width: 100%;
                    }
                }
            }
        }

        & :global(h1 > a) {
            color: var(--primary) !important;
        }

        & :global(h2 > a) {
            color: var(--primary) !important;
        }

        & :global(h3 > a) {
            color: var(--vred) !important;
        }

        & :global(h4 > a) {
            color: var(--vorange) !important;
        }

        & :global(h5 > a) {
            color: var(--vgreen) !important;
        }

        & :global(h6 > a) {
            color: var(--vteal) !important;
        }

        & :global(a) {
            color: var(--vblue) !important;
        }

        & :global(pre) {
            border-radius: 1rem;
            padding: 1rem;
            max-width: calc(100vw - 4rem);
            overflow-x: auto;
        }

        & :global(code) {
            border-radius: 1rem;
            overflow-x: auto;
        }

        :global(:is(.callout, .blockquote)) {
            border-radius: 1rem;
            padding: 1rem;
            margin: 1rem;
            overflow-x: auto;
        }

        @media (prefers-color-scheme: dark) {
            & :global(:is(.shiki, .shiki span)) {
                color: var(--shiki-dark) !important;
                background-color: var(--shiki-dark-bg) !important;
                /* Optional, if you also want font styles */
                font-style: var(--shiki-dark-font-style) !important;
                font-weight: var(--shiki-dark-font-weight) !important;
                text-decoration: var(--shiki-dark-text-decoration) !important;
            }

            :global(:is(.callout, .blockquote)) {
                --callout-bg-color: #060516;
            }
        }
    }
</style>
