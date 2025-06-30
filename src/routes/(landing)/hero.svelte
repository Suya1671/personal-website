<script lang="ts">
    import { browser } from '$app/environment';
    import { createImageSet } from '$lib/helpers/css';
    import { easeEmphasizedCss } from '$lib/helpers/easing';
    import * as m from '$lib/paraglide/messages';
    import Orbit from '$lib/pictures/Orbit.png?w=600;300&h=240;600;800&enhanced';
    import { createTimeline, utils, waapi } from 'animejs';
    import { onMount } from 'svelte';
    import Discord from '~icons/ic/baseline-discord';
    import Email from '~icons/material-symbols/mail-outline';

    const names = ['Suya Singh', 'Suya\\1671', 'A Badly Drawn Wobbler'];
    const longestName = names.reduce((a, b) => (a.length > b.length ? a : b));

    const prefersReducedMotion = () => {
        if (!browser) throw new Error('prefersReducedMotion is only available in the browser');
        return matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    const animateWord = (word: string) => {
        if (prefersReducedMotion()) return;
        const selector = `.${word} .letter`;

        waapi.animate(selector, {
            '--casl': () => utils.random(0, 1),
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

    const heroBgImageSet = createImageSet(Orbit.sources);

    onMount(() => {
        if (prefersReducedMotion()) return;
        const duration = 1000;
        const delay = 5000;

        CSS.registerProperty({
            inherits: false,
            initialValue: '0',
            name: '--casl',
            syntax: '<number>'
        });

        const timeline = createTimeline({
            autoplay: false,
            defaults: { duration },
            loop: true
        });

        for (const [i] of names.entries()) {
            const selector = `.name-${i}`;

            timeline.call(() =>
                waapi.animate(selector, {
                    '--casl': [0, 1],
                    composition: 'replace',
                    duration,
                    ease: easeEmphasizedCss,
                    filter: ['blur(12px)', 'blur(0px)'],
                    fontWeight: [100, 600],
                    opacity: [0, 1],
                    y: [-30, 0]
                })
            );

            timeline.add({ duration: delay });

            timeline.call(() =>
                waapi.animate(selector, {
                    '--casl': [1, 0],
                    composition: 'replace',
                    duration,
                    ease: easeEmphasizedCss,
                    filter: ['blur(0px)', 'blur(12px)'],
                    fontWeight: [600, 100],
                    opacity: [1, 0],
                    y: [0, 30]
                })
            );
        }

        timeline.play();
    });
</script>

<section class="landing">
    <section
        style="

--bg: {heroBgImageSet};"
    >
        <div class="greeting">
            <div class="image-container">
                <enhanced:img
                    alt="A contemporary portrait of me."
                    loading="eager"
                    sizes="min(180px, 100vw)"
                    src="$lib/pictures/face.png?w=160;140"
                ></enhanced:img>
            </div>
            <h1 class="hello" class:browser>
                {m.hello()}
                <span class="names animate-casl" class:browser>
                    {#each names as name, i}
                        <span class="name name-{i}">
                            {#each name.split('\\') as segement}
                                {segement}<wbr />
                            {/each}
                        </span>
                    {/each}
                    <span aria-hidden="true" class="animate-casl">{longestName}</span>
                </span>
            </h1>
        </div>
        <div class="info">
            <ul class="roles">
                {#snippet tag(name, content, href)}
                    <li>
                        <h2
                            class={name}
                            onmouseenter={() => animateWord(name)}
                            onmouseleave={() => endAnimateWord(name)}
                            ontouchend={() => endAnimateWord(name)}
                            ontouchstart={() => animateWord(name)}
                        >
                            {#if href}
                                <a {href} rel="me">
                                    {#each content.split('') as letter}
                                        <span class="letter animate-casl">
                                            {letter}
                                        </span>
                                    {/each}
                                </a>
                            {:else}
                                <span class="wrapper">
                                    {#each content.split('') as letter}
                                        <span class="letter animate-casl">
                                            {letter}
                                        </span>
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
            <ul class="contact">
                <li>
                    <Email aria-label="Email Logo" />
                    <a href="mailto:suyashtnt@gmail.com"> Suyashtnt@gmail.com </a>
                </li>
                <li>
                    <Discord aria-label="Discord Logo" />
                    <a
                        href="https://discord.com"
                        onclick={(e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText('wobbl.in');
                            alert('Copied to clipboard!');
                        }}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        @wobbl.in
                    </a>
                </li>
            </ul>
        </div>
    </section>

    <section>
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
    @media (prefers-color-scheme: light) {
        @property --from {
            inherits: false;

            /* primary */
            initial-value: lch(59% 51 299deg);
            syntax: '<color>';
        }

        @property --to {
            inherits: false;

            /* secondary */
            initial-value: (59% 40 251deg);
            syntax: '<color>';
        }
    }

    @media (prefers-color-scheme: dark) {
        @property --from {
            inherits: false;

            /* primary */
            initial-value: lch(70% 52 299deg);
            syntax: '<color>';
        }

        @property --to {
            inherits: false;

            /* secondary */
            initial-value: lch(70% 45 248deg);
            syntax: '<color>';
        }
    }

    .landing {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        justify-items: stretch;

        margin: 1.5rem;
        margin-top: 0;

        color: var(--base);
        background-color: var(--background);

        & > :first-child {
            --col: var(--background);
            --link: var(--blue-300);
            --visited: var(--purple-300);

            color: var(--col);
            @media (prefers-color-scheme: dark) {
                --col: var(--base);
                --link: var(--blue);
                --visited: var(--purple);
            }
            position: relative;

            display: flex;
            flex: 0 0 600px;
            flex-direction: column;
            gap: 1rem;
            align-items: center;

            padding: 0 1rem;
            padding: 1rem;
            border-radius: 1.2rem;

            background: var(--bg);
            background-position: center;
            background-size: cover;

            &::before {
                content: '';

                backdrop-filter: blur(4px) brightness(30%);
                position: absolute;
                top: 0;

                display: block;

                width: 100%;
                height: 100%;
                border-radius: 1rem;

                backdrop-filter: blur(4px) brightness(70%);

                @media (prefers-color-scheme: dark) {
                    backdrop-filter: blur(4px) brightness(30%);
                }
            }

            & > * {
                position: relative;
                z-index: 1;
            }

            .greeting {
                display: flex;
                gap: 1.25rem;
                place-items: center;
                justify-content: space-between;

                border-radius: 1rem;

                .image-container {
                    flex-grow: 1;

                    padding: 0.7rem;
                    border-radius: 1rem;

                    background: linear-gradient(225deg, var(--from), var(--to));

                    transition:
                        --from 5s,
                        --to 5s,
                        padding 600ms,
                        margin 600ms;

                    &:hover {
                        --from: var(--secondary);
                        --to: var(--primary);

                        margin: 0 0.2rem;
                        padding: 0.7rem 0.5rem;

                        enhanced\:img {
                            transform: scale(1.2);
                        }
                    }

                    enhanced\:img {
                        width: 9rem;
                        height: auto;
                        border-radius: 1rem;

                        vertical-align: middle;

                        object-fit: cover;

                        transition: all 500ms;
                    }
                }

                .hello {
                    font-size: 2.5rem;
                    line-height: 1.2;
                    text-align: center;

                    .names {
                        display: flex;
                        flex-direction: column;

                        &.browser {
                            display: grid;

                            > * {
                                grid-column: 1;
                                grid-row: 1;
                                opacity: 0;
                            }
                        }

                        .name {
                            display: inline;
                            background-image: linear-gradient(
                                60deg,
                                var(--primary),
                                var(--secondary)
                            );
                            background-clip: text;

                            -webkit-text-fill-color: transparent;
                        }

                        [aria-hidden] {
                            display: inline;
                            font-weight: 600;
                            visibility: hidden;
                        }
                    }

                    @media (width > 80rem) {
                        padding: inherit 0;
                        text-align: left;
                    }

                    @media (width > 90rem) {
                        &.browser {
                            font-size: 3rem;
                        }
                    }
                }

                @media (width > 52.125rem) {
                    gap: 1.5rem;
                }
            }

            .info {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;

                width: 100%;

                font-size: 1.25rem;

                .roles {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;

                    width: 100%;
                    padding-left: 0;

                    list-style: none;

                    li {
                        display: flex;
                        flex-grow: 1;
                        justify-content: center;

                        width: 100%;

                        list-style: none;

                        a {
                            display: flex;

                            color: var(--col);
                            text-decoration: underline var(--link);
                            text-underline-offset: 14;

                            transition: all 300ms;

                            &:visited {
                                color: var(--col);
                                text-decoration: underline var(--visited);
                            }

                            &:hover {
                                text-decoration: underline var(--link);
                                text-underline-offset: 14;

                                > span {
                                    color: var(--link);
                                }
                            }
                        }

                        .wrapper {
                            display: flex;
                            padding: 0 0.25rem;
                        }

                        .letter {
                            display: inline-block;
                        }
                    }

                    @media (width < 37.5rem) {
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                }

                .contact {
                    display: flex;
                    gap: 1ch;
                    align-items: center;

                    padding-left: 0;

                    font-size: 1.25rem;
                    line-height: 0;
                    list-style: none;

                    li {
                        display: flex;
                        gap: 1ch;
                        align-items: center;

                        a {
                            color: var(--col);

                            &:hover {
                                color: var(--link);
                                text-decoration: underline var(--link);
                            }

                            &:visited {
                                color: var(--col);
                                text-decoration: underline var(--visited);
                            }
                        }
                    }

                    @media (width > 64rem) {
                        align-items: start;
                    }

                    @media (width < 37.5rem) {
                        flex-direction: column;
                    }
                }
            }
        }

        & > :last-child {
            display: flex;
            flex-direction: row;
            place-items: center;
            font-size: 1.25rem;
        }

        .animate-casl {
            font-variation-settings:
                'CASL' var(--casl),
                'MONO' var(--casl);
        }

        @media (width > 1080px) {
            flex-direction: row;
        }
    }
</style>
