<script lang="ts">
    import * as m from '$i18n/messages';
    import { languageTag } from '$i18n/runtime';
    import { setupViewTransition } from 'sveltekit-view-transition';

    import type { PageData } from '../../routes/(landing)/$types';

    interface Props {
        posts: PageData['posts'];
    }
    const { posts }: Props = $props();

    const getLocaleFromLanguageTag = () => {
        switch (languageTag()) {
            case 'af':
                return 'af-za';
            case 'en':
                return 'en-uk';
            default:
                throw new Error(`Unknown language tag: ${languageTag()}`);
        }
    };

    const locale = $derived(getLocaleFromLanguageTag());
    const dateFormatter = $derived(
        new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    );

    const { transition } = setupViewTransition();
</script>

<ul class="flex flex:wrap list-style:none mx:4x mx:8x@md p:0 r:6x">
    {#each posts as post (post.slug)}
        <li class="flex:1|1|330px m:2x mb:8x transform:scale(1.05):hover transition:all|300ms">
            <a
                class="group fg:surface fg:surface:visited text-decoration:none"
                href="/posts/{post.slug}"
            >
                <article
                    class="flex bg:surface bg:overlay:hover flex:col h:full px:4x py:3x r:6x transition:all|300ms"
                    use:transition={`post-${post.slug}`}
                >
                    <header>
                        <h1
                            class="casl:0.8 fg:primary mb:1x text:underline:hover"
                            use:transition={`post-title-${post.slug}`}
                        >
                            {post.title}
                        </h1>

                        <p
                            class="opacity:.7"
                            role="doc-subtitle"
                            use:transition={`post-dates-${post.slug}`}
                        >
                            {m.post_card_published({
                                published: dateFormatter.format(new Date(post.date)),
                                updated: dateFormatter.format(new Date(post.updated))
                            })}
                        </p>
                    </header>

                    <footer class="my:2x">
                        <p>{post.description}</p>
                    </footer>
                </article>
            </a>
        </li>
    {/each}
</ul>
