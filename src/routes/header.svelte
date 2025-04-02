<script lang="ts">
    import { page } from '$app/state';
    import * as m from '$lib/paraglide/messages';
    import { getLocale, type Locale, locales, localizeHref } from '$lib/paraglide/runtime';
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
    <div
        class="flex rel bg:surface r:5x px:4x py:2x fg:surface text:left flex:col@<xs mb:2x:not(:last)@<xs"
    >
        <span>
            <Icon class="inline vertical:middle" />
            {title}
        </span>

        {@render content()}
    </div>
{/snippet}

{#snippet links()}
    <div class="bg:surface r:6x fg:surface text:left p:2x@xs">
        <ul class={'r:6x transition:all|300ms my:0 flex flex:col@<xs pl:0 pr:2x text:5x'}>
            <li class="list-style:none">
                <a
                    class="flex align-items:center fg:base flex:row fg:base:visited"
                    href={localizeHref('/')}
                >
                    <Arrow />
                    {m.header_home()}
                </a>
            </li>
            <li class="list-style:none">
                <a
                    class="flex align-items:center fg:base flex:row fg:base:visited"
                    href={localizeHref('/posts')}
                >
                    <Arrow />
                    {m.header_posts()}
                </a>
            </li>
        </ul>
    </div>
{/snippet}

{#snippet langs()}
    <ul
        class={'abs@xs r:6x bg:surface bg:overlay@xs my:0 flex top:calc(100%+0.25rem) flex:col p:2x p:1x@xs pr:3x@xs  text:5x right:0'}
        data-sveltekit-reload
    >
        {#each locales.filter((locale) => locale !== getLocale()) as locale}
            <li class="list-style:none">
                <a
                    aria-current={locale === getLocale() ? 'page' : undefined}
                    class="flex align-items:center flex:row"
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

<nav
    class="flex rel border:2|subtle/.80 r:6x mx:4x align-items:center bd:blur(8x) h:12x justify-content:space-between mb:4x top:4x z:10 sticky@sm"
>
    <section class="flex gap:2x align-items:center justify-content:space-between">
        <a
            class="flex place-items:center"
            href="/posts/the-wobbler"
            aria-label={m.profile_picture_caption()}
        >
            <enhanced:img
                alt="My profile picture, a badly drawn Wobbler from Totally Accurate Battle Simulator."
                class={'aspect-square size:12x r:full align-items:center ~duration:300 ~transform ~shadow {scale(1.3);r:2x;shadow:4x}:hover block'}
                sizes="32px 48px 64px"
                src="$lib/pictures/wobbler.png"
            >
            </enhanced:img>
        </a>

        <h1 class="my:0 text:6x">
            <a class="fg:base fg:base:visited" href={localizeHref('/')}> Suya's Chaos Portal </a>
        </h1>
    </section>

    <details class="hidden@xs">
        <summary class="bg:overlay list-style:none p:2x r:6x h:8x">
            <Menu aria-label="Dropdown menu" class="size:8x" />
        </summary>

        <div
            class={'w:80% abs left:50% top:calc(100%+1rem) flex:row transform:top rotate(90,0) r:6x bg:text-primary@xs bg:overlay p:2x text:6x transition:all|300ms translate(-50%,0) gap:4x'}
        >
            {@render dropdownSection(m.header_links(), Link, links)}
            {@render dropdownSection(translateLocale(getLocale()), Language, langs)}
        </div>
    </details>

    <div
        class={'flex:row r:6x bg:primary bg:text-primary@dark text:center text:6x hidden@<xs flex gap:4x p:2x text:5x fg:black'}
    >
        {@render links()}
        <details
            class="flex rel bg:surface p:1x place-items:center r:6x fg:surface pl:2x flex:col@<xs"
        >
            <summary
                class="flex bg:none border:none gap:1x text:5x align-items:center flex:row h:full"
            >
                <Language />
                {translateLocale(getLocale())}
                <DropDown />
            </summary>
            {@render langs()}
        </details>
    </div>
</nav>
