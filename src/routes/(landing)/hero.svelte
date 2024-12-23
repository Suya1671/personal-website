<script lang="ts">
    import { browser } from '$app/environment';
    import * as m from '$i18n/messages';
    import { easeEmphasized } from 'm3-svelte';
    import { animate, type AnimationSequence } from 'motion';
    import { onMount } from 'svelte';
    import Discord from '~icons/ic/baseline-discord';
    import Email from '~icons/material-symbols/mail-outline';

    const names = ['Suya\\1671', 'A Badly Drawn Wobbler'];
    const longestName = names.reduce((a, b) => (a.length > b.length ? a : b));

    const ease = easeEmphasized;
    const random = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    };

    const prefersReducedMotion = () =>  {
        if (!browser) throw new Error('prefersReducedMotion is only available in the browser');
        return matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    const animateWord = (word: string) => {
        if (prefersReducedMotion()) return;
        const selector = `.${word} .letter`;
        const elements = document.querySelectorAll(selector);

        for (const element of elements) {
            animate(
                element,
                {
                    '--casl': [0, 1],
                    fontWeight: [400, 900],
                    rotate: random(-15, 15),
                    scale: random(0.95, 1.05),
                    x: random(-15, 15),
                    y: random(-15, 15)
                },
                {
                    duration: 0.3,
                    ease
                }
            );
        }
    };

    const endAnimateWord = (word: string) => {
        const selector = `.${word} .letter`;

        animate(
            selector,
            {
                '--casl': [1, 0],
                fontWeight: [900, 400],
                rotate: 0,
                scale: 1,
                x: 0,
                y: 0
            },
            {
                duration: 0.3,
                ease
            }
        );
    };

    onMount(() => {
        if (prefersReducedMotion()) return;
        const duration = 0.6;
        const delay = 2.5;

        const tlDefinition: AnimationSequence = [];

        for (const [i] of names.entries()) {
            const selector = `.names .name-${i}`;

            tlDefinition.push(
                [
                    selector,
                    {
                        '--casl': [0, 1],
                        fontWeight: [100, 600],
                        opacity: [0, 1],
                        y: [-30, 0]
                    }
                ],
                [
                    selector,
                    {
                        '--casl': [1, 0],
                        fontWeight: [600, 100],
                        opacity: [1, 0],
                        y: [0, 30]
                    },
                    { delay }
                ]
            );
        }

        animate(tlDefinition, {
            defaultTransition: {
                duration,
                ease
            },
            repeat: Infinity
        });
    });
</script>

<section
    class="flex rel bg:base fg:base flex:auto@children flex:col flex:row@>1080px gap:6x justify-items:stretch m:6x mt:0x"
    id="landing"
>
    <section class="flex align-items:center bg:surface flex:0|0|600px flex:col px:4x r:4x">
        <div class="flex gap:6x@sm justify-content:space-between mt:6x place-items:center r:4x">
            <div
                class={'r:4x ~all|300ms gradient(90deg,var(--from),var(--to)) $from:text-primary $to:secondary scale(0.9):hover scale(1.25):hover>div>picture>img mr:5x flex:grow'}
            >
                <div class="flex p:2x place-items:center r:6x">
                    <enhanced:img
                        alt="A contemporary portrait of me."
                        class="object-cover ~all|300ms h:auto r:4x vertical:middle w:36x"
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
                            class="name-{i} animate-casl gradient-text inline $from:text-primary $to:secondary gradient(60deg,var(--from),var(--to))"
                        >
                            {#each name.split('\\') as segement}
                                {segement}<wbr />
                            {/each}
                        </span>
                    {/each}
                    <!-- add an always invisible "spacer" span for the largest one. This prevents weird resizing issues-->
                    <span
                        class="animate-casl inline invisible $casl:1 font:semibold"
                        aria-hidden="true">{longestName}</span
                    >
                </span>
            </h1>
        </div>
        <div class="flex align-items:center flex:col my:8x w:full">
            <ul
                class={'my:0 gap:6x@<2xs flex flex:col@<2xs align-items:center justify-content:space-around pl:0 text:6x list-style:none@<2xs w:full'}
            >
                {#snippet tag(name: string, content: string, href?: string)}
                    <li class="flex flex-grow:1 justify-content:center list-style:none w:full">
                        <h2
                            class={name}
                            onmouseenter={() => animateWord(name)}
                            onmouseleave={() => endAnimateWord(name)}
                            ontouchend={() => endAnimateWord(name)}
                            ontouchstart={() => animateWord(name)}
                        >
                            {#if href}
                                <a
                                    class="flex fg:surface fg:surface:visited fg:blue:hover>span text-decoration:surface text-decoration:blue:hover text-underline-offset:14 text:underline"
                                    {href}
                                    rel="me"
                                >
                                    {#each content.split('') as letter}
                                        <span class="letter animate-casl inline-block"
                                            >{letter}</span
                                        >
                                    {/each}
                                </a>
                            {:else}
                                <span class="flex px:1x">
                                    {#each content.split('') as letter}
                                        <span class="letter animate-casl inline-block"
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
                class="flex align-items:center align-items:start@md flex:col@<2xs gap:1ch line-height:0 list-style:none mt:8x my:0 pl:0 text:5x"
            >
                <li
                    class="flex align-items:center fg:surface fg:surface:visited gap:1ch text-decoration:blue:hover"
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
                    class="flex align-items:center fg:surface fg:surface:visited gap:1ch text-decoration:blue:hover"
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

    <section class="flex flex:row place-items:center text:5x">
        <p>
            Hey! I'm Suyash, your probably-not-local computer nerd programming person. I like to
            make questionably useful apps and websites, along with being a walking advertisement for
            my current favourite thing (website, game, song, etc.).
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
