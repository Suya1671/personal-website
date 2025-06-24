<script lang="ts">
    import { page } from '$app/state';
    import * as m from '$lib/paraglide/messages.js';
    import { getLocale, type Locale, locales, localizeHref } from '$lib/paraglide/runtime.js';
    import DropDown from '~icons/material-symbols/arrow-drop-down';
    import Language from '~icons/material-symbols/language';
    import Menu from '~icons/material-symbols/menu-rounded';
    import Link from '~icons/material-symbols/open-in-new';
    import Arrow from '~icons/material-symbols/play-arrow-rounded';

    const translateLocale = (locale: Locale) => {
        switch (locale) {
            case 'af':
                return m.lang_af();
            case 'en':
                return m.lang_en();
            default:
                return locale;
        }
    };
</script>

{#snippet dropdownSection(title, Icon, content)}
    <div class="dropdown-section">
        <span>
            <Icon class="icon" />
            {title}
        </span>

        {@render content()}
    </div>
{/snippet}

{#snippet links()}
    <div class="links">
        <ul>
            <li>
                <a href={localizeHref('/')}>
                    <Arrow />
                    {m.header_home()}
                </a>
            </li>
            <li>
                <a href={localizeHref('/posts')}>
                    <Arrow />
                    {m.header_posts()}
                </a>
            </li>
        </ul>
    </div>
{/snippet}

{#snippet langs()}
    <ul class="langs" data-sveltekit-reload>
        {#each locales.filter((locale) => locale !== getLocale()) as locale}
            <li>
                <a
                    aria-current={locale === getLocale() ? 'page' : undefined}
                    href={localizeHref(page.url.pathname, { locale })}
                    hreflang={locale}
                >
                    <Arrow />
                    {translateLocale(locale)}
                </a>
            </li>
        {/each}
    </ul>
{/snippet}

<header>
    <section>
        <a href="/posts/the-wobbler" aria-label={m.profile_picture_caption()}>
            <enhanced:img
                alt="My profile picture, a badly drawn Wobbler from Totally Accurate Battle Simulator."
                sizes="32px 48px 64px"
                src="$lib/pictures/wobbler.png"
            >
            </enhanced:img>
        </a>

        <h1>
            <a href={localizeHref('/')}> Suya's Chaos Portal </a>
        </h1>
    </section>

    <details id="mobile-menu">
        <summary>
            <Menu aria-label="Dropdown menu" style="width: 2rem; height: 2rem;" />
        </summary>

        <nav>
            {@render dropdownSection(m.header_links(), Link, links)}
            {@render dropdownSection(translateLocale(getLocale()), Language, langs)}
        </nav>
    </details>

    <nav>
        {@render links()}
        <details id="language-dropdown">
            <summary>
                <Language />
                {translateLocale(getLocale())}
                <DropDown />
            </summary>
            {@render langs()}
        </details>
    </nav>
</header>

<style>
    h1 {
        @media (width < 48rem) {
            font-size: 1.5rem;
        }
    }

    header {
        position: relative;
        z-index: 10;
        top: 1rem;

        display: flex;
        align-items: center;
        justify-content: space-between;

        height: 3rem;
        margin: 0 1rem;
        margin-bottom: 1rem;
        border: solid 2px var(--subtle);
        border-radius: 1.5rem;

        backdrop-filter: blur(2rem);

        > section {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            justify-content: space-between;

            > a {
                display: flex;
                place-items: center;
                color: var(--surface);

                &:visited {
                    color: var(--surface);
                }

                enhanced\:img {
                    transform: scale(1);

                    display: block;
                    align-items: center;

                    aspect-ratio: 1 / 1;
                    width: 3rem;
                    height: 3rem;
                    border-radius: 100%;

                    transition: transform box-shadow border-radius;
                    transition-duration: 0.6s;

                    &:hover {
                        transform: scale(1.3);
                        border-radius: 0.5rem;
                        box-shadow: var(--shadow-md);
                    }

                    &:active {
                        transform: scale(1.1);
                        border-radius: 100%;
                        box-shadow: var(--shadow-lg);
                    }
                }
            }

            a {
                color: var(--base);
                text-decoration: none;

                &:visited {
                    color: var(--base);
                }
            }
        }

        > #mobile-menu {
            overflow: hidden;

            summary {
                display: flex;
                place-items: center;

                width: 2rem;
                height: 2rem;
                margin: 0.25rem;
                padding: 0 0.2rem;
                border-radius: 1.5rem;

                list-style: none;

                background-color: var(--overlay);
            }

            @supports (interpolate-size: allow-keywords) {
                &::details-content {
                    block-size: 0;

                    transition-timing-function: var(--m3-easing);
                    transition-duration: 600ms;
                    transition-property: block-size, content-visibility;

                    transition-behavior: allow-discrete;
                }
            }

            > nav {
                position: absolute;
                top: calc(100% + 1rem);
                left: 50%;
                transform-origin: top;
                transform: translate(-50%, 0) rotateY(90deg);

                width: 80%;
                padding: 0.5rem;
                border-radius: 1.5rem;

                font-size: 1.5rem;
                color: var(--base);

                background-color: var(--overlay);

                transition-duration: 600ms;
                transition-property: translation, block-size, content-visibility;

                transition-behavior: allow-discrete;

                @media (width > 48rem) {
                    bg: var(--primary);
                }
            }

            &[open] {
                &::details-content {
                    block-size: auto;
                }

                > nav {
                    transform: translate(-50%, 0) rotateY(0deg);
                }
            }

            @media (width > 48rem) {
                display: none;
                visibility: hidden;
            }
        }

        > nav {
            display: flex;
            flex-direction: row;
            gap: 1rem;

            padding: 0.5rem;
            border-radius: 1.5rem;

            font-size: 1.5rem;
            text-align: center;

            background-color: light-dark(var(--primary-100), var(--primary));

            #language-dropdown {
                position: relative;

                display: flex;
                place-items: center;

                padding: 0.25rem;
                padding-left: 0.5rem;
                border-radius: 1.5rem;

                background-color: var(--surface);

                summary {
                    display: flex;
                    flex-direction: row;
                    gap: 0.25rem;
                    align-items: center;

                    width: max-content;
                    height: 100%;

                    font-size: 1.25rem;
                    color: var(--base);

                    background: none;
                }

                @media (width < 48rem) {
                    flex-direction: column;
                }
            }

            @media (width < 48rem) {
                display: none;
                visibility: hidden;
            }
        }

        @media (width > 52.125rem) {
            position: sticky;
        }
    }

    .dropdown-section {
        position: relative;

        display: flex;

        padding: 0.5rem 1rem;
        border-radius: 1.25rem;

        color: var(--base);
        text-align: left;

        background: var(--surface);

        & :global(.icon) {
            display: inline;
            vertical-align: middle;
        }

        @media (width < 48rem) {
            flex-direction: column;

            &:not(:last-child) {
                margin-bottom: 0.5rem;
            }
        }
    }

    .links {
        border-radius: 1.5rem;
        text-align: left;
        background-color: var(--surface);

        ul {
            display: flex;
            gap: 1ch;

            padding-right: 0.5rem;
            padding-left: 0;
            border-radius: 1.5rem;

            font-size: 1.25rem;

            transition: all 300ms;

            li {
                display: flex;
                align-items: center;
                list-style: none;

                a {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    color: var(--base);

                    &:visited {
                        color: var(--base);
                    }
                }
            }

            @media (width < 48rem) {
                flex-direction: column;
            }
        }

        @media (width > 48rem) {
            padding: 0.5rem;
        }
    }

    .langs {
        top: calc(100% + 0.25rem);
        right: 0;

        display: flex;
        flex-direction: column;

        padding: 0.5rem;
        border-radius: 1.5rem;

        font-size: 1.25rem;

        background-color: var(--surface);

        li {
            list-style: none;

            a {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
        }

        @media (width > 48rem) {
            position: absolute;
            padding: 0.25rem;
            padding-right: 0.75rem;
            background-color: var(--overlay);
        }
    }
</style>
