<script lang="ts">
    import { browser } from '$app/environment';
    import PageHead from '$lib/components/page-head.svelte';
    import * as m from '$lib/paraglide/messages';
    import { getLocale } from '$lib/paraglide/runtime';
    import '@portaljs/remark-callouts/styles.css';
    import Giscus from '@giscus/svelte';

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

    const getTheme = () => {
        if (!browser) return;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
</script>

<PageHead {description} title={data.frontmatter.title} />

<svelte:head>
    <meta content="article" property="og:type" />
    <meta content={datePublished.toISOString()} property="og:article:published_time" />
    <meta content={dateModified.toISOString()} property="og:article:modified_time" />
</svelte:head>

<article
    class="break-word bg:surface grid-area:content r:4x $col:blue $primary:text-primary $vgreen:green $vorange:orange $vred:red $vteal:teal px:4x text:5x justify-self:center max-w:75ch mb:6x hypens-auto md:mx-0 text-justify"
    id="article"
    use:transition={`post-${data.slug}`}
>
    <aside class="toc">
        <ToC />
    </aside>

    <header>
        <hr class="top" />

        <h1 use:transition={`post-title-${data.slug}`}>
            {data.frontmatter.title}
        </h1>

        <hr class="bottom" />

        <p use:transition={`post-dates-${data.slug}`}>
            {m.post_card_by({ author: data.frontmatter.author })} | {m.post_card_published({
                published: dateFormatter.format(datePublished),
                updated: dateFormatter.format(dateModified)
            })}
            {#if draft}
                | <span class="draft">{m.post_card_draft()}</span>
            {/if}
        </p>
    </header>

    <div class="content">
        <p>
            <data.component></data.component>
        </p>
    </div>

    <Giscus
        class="comments"
        props={{
            category: 'Announcements',
            categoryId: 'DIC_kwDOI0N8xs4Caho4',
            class: 'giscus',
            emitMetadata: '1',
            inputPosition: 'top',
            lang: getLocale(),
            loading: 'lazy',
            mapping: 'og:title',
            reactionsEnabled: '1',
            repo: 'Suya1671/personal-website',
            repoId: 'R_kgDOI0N8xg',
            strict: '0',
            theme: getTheme()
        }}
    />

    <aside class="notes hidden grid-area:notes md:block mr-4"></aside>
</article>

<style>
    article {
        display: grid;
        grid-template-areas:
            'title'
            'sidebar'
            'content'
            'comments';
        justify-items: center;

        header {
            grid-area: title;

            width: min(100vw - 2rem, 75ch);
            padding: 1rem;
            padding-top: 1.5rem;
            border-radius: 1rem 1rem 0 0;

            font-size: 1.2rem;

            background: var(--surface);

            hr {
                height: 0.25rem;
                border: none;
                border-radius: 0.5rem;

                &.top {
                    background: linear-gradient(45deg, var(--primary), var(--secondary));
                }

                &.bottom {
                    background: linear-gradient(45deg, var(--secondary), var(--primary));
                }
            }

            h1 {
                font-size: 2rem;
                text-align: center;
            }

            p {
                margin-top: 1rem;
                color: var(--subtle);
                opacity: 0.8;

                .draft {
                    color: var(--red);
                }
            }
        }

        @media (width >= 1024px) {
            grid-template-areas:
                'sidebar title'
                'sidebar content'
                'sidebar notes'
                'sidebar comments';
            grid-template-columns: 1fr 3fr;
        }

        @media (width >= 1440px) {
            grid-template-areas:
                'sidebar title notes'
                'sidebar content notes'
                'sidebar comments notes';
            grid-template-columns: 1fr 3fr 1fr;
        }
    }

    .toc {
        top: 4.5rem;
        grid-area: sidebar;
        align-self: self-start;
        margin: 0 0.5rem;

        @media (width > 64rem) {
            position: sticky;
        }

        @media (width <= 1024px) {
            width: calc(100% - 2rem);
            padding: 1rem 0;
            background: var(--surface);
        }
    }

    .content {
        overflow: scroll;
        grid-area: content;

        width: min(100vw - 2rem, 75ch);
        margin-bottom: 1rem;
        padding: 0 1rem;
        padding-bottom: 1rem;
        border-radius: 0 0 1rem 1rem;

        font-size: 1.2rem;

        background: var(--surface);

        p {
            max-width: 75ch;
        }
    }

    :global(#article > .content) {
        & :global(h1) {
            --col: var(--primary);

            font-size: 2.5rem;
        }

        & :global(:is(h1, h2, h3, h4, h5, h6)) {
            transform: none !important;
            color: var(--col);

            & :global(> a) {
                position: relative;

                display: inline-block;

                color: var(--col);
                text-decoration: none;

                transition: all 300ms var(--m3-easing);

                &::after {
                    content: '';

                    position: absolute;
                    bottom: 0;

                    display: block;

                    width: 0;
                    height: 0.125rem;

                    background: var(--col) none repeat scroll;

                    transition: all 300ms var(--m3-easing);
                }

                &:hover {
                    color: var(--col);

                    &::after {
                        width: 100%;
                    }
                }
            }
        }

        & :global(h2) {
            --col: var(--primary);
        }

        & :global(h3) {
            --col: var(--red);
        }

        & :global(h4) {
            --col: var(--orange);
        }

        & :global(h5) {
            --col: var(--green);
        }

        & :global(h6) {
            --col: var(--teal);
        }

        & :global(a) {
            color: var(--blue);
        }

        & :global(pre) {
            overflow-x: auto;
            max-width: calc(100vw - 4rem);
            padding: 1rem;
            border-radius: 1rem;
        }

        & :global(code) {
            overflow-x: auto;
            border-radius: 1rem;
        }

        :global(:is(.callout, .blockquote)) {
            overflow-x: auto;
            margin: 1rem;
            padding: 1rem;
            border-radius: 1rem;
        }

        :global(> *:not(:last-child)) {
            margin-bottom: 1rem;
        }

        @media (prefers-color-scheme: dark) {
            & :global(:is(.shiki, .shiki span)) {
                font-weight: var(--shiki-dark-font-weight) !important;

                /* Optional, if you also want font styles */
                font-style: var(--shiki-dark-font-style) !important;
                color: var(--shiki-dark) !important;
                text-decoration: var(--shiki-dark-text-decoration) !important;

                background-color: var(--shiki-dark-bg) !important;
            }

            :global(:is(.callout, .blockquote)) {
                --callout-bg-color: #060516;
            }
        }
    }

    :global(.comments) {
        grid-area: comments;
        width: 100%;
    }
</style>
