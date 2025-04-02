<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { getLocale, localizeHref } from '$lib/paraglide/runtime';
    import { setupViewTransition } from 'sveltekit-view-transition';

    import type { PageData } from '../../routes/(landing)/$types';

    interface Props {
        posts: PageData['posts'];
    }
    const { posts }: Props = $props();

    const locale: Intl.LocalesArgument = (() => {
        switch (getLocale()) {
            case 'af':
                return 'af-za';
            case 'en':
                return 'en-za';
            default:
                throw new Error(`Unknown locale: ${getLocale()}`);
        }
    })();

    const dateFormatter = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const { transition } = setupViewTransition();
</script>

<ul class="flex list-style:none p:0 r:6x mx:4x flex:wrap mx:8x@md">
    {#each posts as post (post.slug)}
        <li class="flex:1|1|330px m:2x transition:all|300ms mb:8x transform:scale(1.05):hover">
            <a
                class="text-decoration:none fg:surface fg:surface:visited group"
                href={localizeHref(`/posts/${post.slug}`)}
            >
                <article
                    class="flex bg:surface r:6x transition:all|300ms px:4x py:3x flex:col h:full bg:overlay:hover"
                    use:transition={`post-${post.slug}`}
                >
                    <header>
                        <h1
                            class="text:7x fg:primary line-height:1.3em mb:1x text:underline:hover casl:0.8"
                            use:transition={`post-title-${post.slug}`}
                        >
                            {post.title}
                        </h1>

                        <p
                            class="opacity:.7 text:base"
                            role="doc-subtitle"
                            use:transition={`post-dates-${post.slug}`}
                        >
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
