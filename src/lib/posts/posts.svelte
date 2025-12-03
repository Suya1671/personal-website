<script lang="ts">
import { setupViewTransition } from 'sveltekit-view-transition'
import * as m from '$lib/paraglide/messages'
import { getLocale, localizeHref } from '$lib/paraglide/runtime'

import type { PageData } from '../../routes/(landing)/$types'

interface Props {
    posts: PageData['posts']
}
const { posts }: Props = $props()

const locale: Intl.LocalesArgument = (() => {
    switch (getLocale()) {
        case 'af':
            return 'af-za'
        case 'en':
            return 'en-za'
        default:
            throw new Error(`Unknown locale: ${getLocale()}`)
    }
})()

const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
})

const { transition } = setupViewTransition()
</script>

<ul>
    {#each posts as post (post.slug)}
        <li>
            <a href={localizeHref(`/posts/${post.slug}`)} aria-labelledby={post.slug}>
                <article use:transition={`post-${post.slug}`}>
                    <header>
                        <h1 use:transition={`post-title-${post.slug}`} id={post.slug}>
                            {post.title}
                        </h1>

                        <p role="doc-subtitle" use:transition={`post-dates-${post.slug}`}>
                            {m.post_card_published({
                                published: dateFormatter.format(new Date(post.date)),
                                updated: dateFormatter.format(new Date(post.updated))
                            })}
                        </p>
                    </header>

                    <footer class="my:2x text:base">
                        <p>{post.description}</p>
                    </footer>
                </article>
            </a>
        </li>
    {/each}
</ul>

<style>
    ul {
        display: flex;
        flex-wrap: wrap;

        margin: 0 1rem;
        padding: 0;
        border-radius: 1.5rem;

        list-style: none;

        li {
            flex: 1 1 330px;
            margin: 0.5rem;
            margin-bottom: 2rem;
            transition: transform 300ms;

            &:hover {
                transform: scale(1.05);
            }

            a {
                color: var(--base);
                text-decoration: none;

                &:hover {
                    color: var(--base);
                }

                &:visited {
                    article {
                        border-color: var(--purple);
                    }

                    h1 {
                        color: var(--purple);
                    }
                }

                article {
                    display: flex;
                    flex-direction: column;

                    height: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid var(--blue);
                    border-radius: 1.5rem;

                    background: var(--surface);

                    transition: background 300ms;

                    &:hover {
                        background: var(--overlay);

                        h1 {
                            text-decoration: underline;
                        }
                    }

                    header {
                        h1 {
                            margin-bottom: 0.25rem;
                            font-size: 1.75rem;
                            line-height: 1.3em;
                            color: var(--blue);
                        }

                        p {
                            font-size: 0.9rem;
                            color: var(--subtle);
                        }
                    }

                    footer {
                        margin: 0.5rem 0;
                        color: var(--base);
                    }
                }
            }
        }

        @media (width > 64rem) {
            margin: 0 2rem;
        }
    }
</style>
