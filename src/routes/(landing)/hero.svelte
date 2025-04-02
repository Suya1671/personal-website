<script lang="ts">
    import { browser } from '$app/environment';
    import { easeEmphasizedCss } from '$lib/helpers/easing';
    import * as m from '$lib/paraglide/messages';
    import { createTimeline, utils, waapi } from 'animejs';
    import { onMount } from 'svelte';
    import Discord from '~icons/ic/baseline-discord';
    import Email from '~icons/material-symbols/mail-outline';

    const names = ['Suya\\1671', 'A Badly Drawn Wobbler'];
    const longestName = names.reduce((a, b) => (a.length > b.length ? a : b));

    const prefersReducedMotion = () => {
        if (!browser) throw new Error('prefersReducedMotion is only available in the browser');
        return matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    const animateWord = (word: string) => {
        if (prefersReducedMotion()) return;
        const selector = `.${word} .letter`;

        waapi.animate(selector, {
            '--casl': [0, 1],
            duration: 300,
            ease: easeEmphasizedCss,
            fontWeight: [400, 900],
            rotate: () => utils.random(-15, 15),
            scale: () => utils.random(0.95, 1.05),
            x: () => utils.random(-15, 15),
            y: () => utils.random(-15, 15)
        });
    };

    const endAnimateWord = (word: string) => {
        const selector = `.${word} .letter`;

        waapi.animate(selector, {
            '--casl': [1, 0],
            duration: 300,
            ease: easeEmphasizedCss,
            fontWeight: [900, 400],
            rotate: 0,
            scale: 1,
            x: 0,
            y: 0
        });
    };

    onMount(() => {
        if (prefersReducedMotion()) return;
        const duration = 600;
        const delay = 2500;

        let tlDefinition = createTimeline({
            autoplay: false,
            defaults: { duration },
            loop: true
        });

        for (const [i] of names.entries()) {
            const selector = `.names .name-${i}`;

            tlDefinition
                .sync(
                    waapi.animate(selector, {
                        '--casl': [0, 1],
                        ease: easeEmphasizedCss,
                        fontWeight: [100, 600],
                        opacity: [0, 1],
                        y: [-30, 0]
                    })
                )
                .sync(
                    waapi.animate(selector, {
                        '--casl': [1, 0],
                        delay,
                        ease: easeEmphasizedCss,
                        fontWeight: [600, 100],
                        opacity: [1, 0],
                        y: [0, 30]
                    })
                );
        }

        tlDefinition.play();
    });
</script>

<section
    class="flex rel bg:base gap:6x m:6x fg:base flex:col justify-items:stretch mt:0x flex:row@>1080px"
    id="landing"
>
    <section class="flex bg:surface flex:0|0|600px r:4x px:4x align-items:center flex:col">
        <div class="flex place-items:center r:4x justify-content:space-between mt:6x gap:6x@sm">
            <div
                class={'r:4x ~all|300ms gradient(90deg,var(--from),var(--to)) $from:text-primary $to:secondary scale(0.9):hover scale(1.25):hover>div>picture>img mr:5x flex:grow'}
            >
                <div class="flex p:2x place-items:center r:6x">
                    <enhanced:img
                        alt="A contemporary portrait of me."
                        class="~all|300ms r:4x h:auto vertical:middle w:36x object-cover"
                        loading="eager"
                        sizes="min(180px, 100vw)"
                        src="$lib/pictures/face.png?w=160;140"
                    ></enhanced:img>
                </div>
            </div>
            <h1
                class={'m:0 tml:2x ext:center text:10x line-height:1.2! {mb:0;px:0;text:left}@lg'}
                class:text:12x!@xs={browser}
                class:line-height:1.2!@xs={browser}
            >
                {m.hello()}
                <span class="flex flex:col" class:names={browser}>
                    {#each names as name, i}
                        <span
                            class="name-{i} gradient-text inline $from:text-primary $to:secondary gradient(60deg,var(--from),var(--to)) animate-casl"
                        >
                            {#each name.split('\\') as segement}
                                {segement}<wbr />
                            {/each}
                        </span>
                    {/each}
                    <!-- add an always invisible "spacer" span for the largest one. This prevents weird resizing issues-->
                    <span
                        class="inline invisible $casl:1 font:semibold animate-casl"
                        aria-hidden="true">{longestName}</span
                    >
                </span>
            </h1>
        </div>
        <div class="flex my:8x align-items:center flex:col w:full">
            <ul
                class={'my:0 gap:6x@<2xs flex flex:col@<2xs align-items:center justify-content:space-around pl:0 text:6x list-style:none@<2xs w:full'}
            >
                {#snippet tag(name, content, href)}
                    <li class="flex list-style:none flex-grow:1 justify-content:center w:full">
                        <h2
                            class={name}
                            onmouseenter={() => animateWord(name)}
                            onmouseleave={() => endAnimateWord(name)}
                            ontouchend={() => endAnimateWord(name)}
                            ontouchstart={() => animateWord(name)}
                        >
                            {#if href}
                                <a
                                    class="flex text:underline fg:surface text-decoration:surface text-underline-offset:14 fg:surface:visited fg:blue:hover>span text-decoration:blue:hover"
                                    {href}
                                    rel="me"
                                >
                                    {#each content.split('') as letter}
                                        <span class="inline-block animate-casl letter"
                                            >{letter}</span
                                        >
                                    {/each}
                                </a>
                            {:else}
                                <span class="flex px:1x">
                                    {#each content.split('') as letter}
                                        <span class="inline-block animate-casl letter"
                                            >{letter}</span
                                        >
                                    {/each}
                                </span>
                            {/if}
                        </h2>
                    </li>
                {/snippet}
                {@render tag('student', m.hero_student())}
                {@render tag('programmer', m.hero_programmer(), 'https://github.com/Suya1671')}
                {@render tag('gamer', m.hero_gamer(), 'https://steamcommunity.com/id/Suya1671')}
            </ul>
            <ul
                class="flex gap:1ch list-style:none my:0 text:5x align-items:center line-height:0 mt:8x pl:0 align-items:start@md flex:col@<2xs"
            >
                <li
                    class="flex gap:1ch align-items:center fg:surface fg:surface:visited text-decoration:blue:hover"
                >
                    <Email class="h-8 w-8" />
                    <a
                        class="fg:surface fg:surface:visited text-decoration:blue:hover"
                        href="mailto:suyashtnt@gmail.com"
                    >
                        Suyashtnt@gmail.com
                    </a>
                </li>
                <li
                    class="flex gap:1ch align-items:center fg:surface fg:surface:visited text-decoration:blue:hover"
                >
                    <Discord class="h-8 w-8" />
                    <a
                        class="fg:surface fg:surface:visited text-decoration:blue:hover"
                        href="https://discord.com"
                        onclick={(e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText('suyashtnt');
                            alert('Copied to clipboard!');
                        }}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        @suyashtnt
                    </a>
                </li>
            </ul>
        </div>
    </section>

    <section class="flex place-items:center text:5x flex:row">
        <p>
            Hey! I'm Suya, your probably-not-local computer nerd programming person. I like to make
            (questionably useful) apps, websites, and random utilities. I also am known to be a
            walking advertisement for my current favourite thing (be it a game, song, website,
            etc.).
        </p>
        <!-- <enhanced:img
            alt="My desktop computer rice."
            class="block aspect:21/9@md h:full max-h:full max-w:full obj:contain r:4x w:auto"
            loading="eager"
            sizes="min(1280px, 100vw)"
            src="$lib/pictures/Computer.png?w=1280;720;480;360;240"
        ></enhanced:img> -->
    </section>
</section>

<style>
    .names {
        display: grid;
    }

    .names > * {
        grid-row: 1;
        grid-column: 1;
    }

    .animate-casl {
        font-variation-settings:
            'CASL' var(--casl),
            'MONO' var(--casl);
    }
</style>
