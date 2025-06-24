<script module lang="ts">
    import type { Component } from 'svelte';

    export interface ISkill {
        /**
         * Very short description or tagline of the skill
         */
        description: string;
        /**
         * My experience with the skill. In HTML.
         */
        experience: string;
        /**
         * Preferably SVG, 1:1 aspect ratio
         */
        icon: Component;
        id: string;
        /**
         * Name of the skill
         */
        name: string;
        /**
         * My proficiency with the skill.
         */
        proficiency: 'Beginner' | 'Intermediate' | 'Skilled';
        /**
         * Type of skill
         */
        type: 'Backend' | 'Framework' | 'Frontend' | 'Language' | 'Other' | 'Tool';
        /**
         * URL to the skill's website or documentation
         */
        url?: string;
    }
</script>

<script lang="ts">
    interface Props {
        skill: ISkill;
    }

    const { skill }: Props = $props();

    import * as m from '$lib/paraglide/messages';

    const proficiency = $derived.by(() => {
        switch (skill.proficiency) {
            case 'Beginner':
                return m.skill_beginner();
            case 'Intermediate':
                return m.skill_intermediate();
            case 'Skilled':
                return m.skill_skilled();
        }
    });

    const type = $derived.by(() => {
        switch (skill.type) {
            case 'Backend':
                return m.skill_backend();
            case 'Framework':
                return m.skill_framework();
            case 'Frontend':
                return m.skill_frontend();
            case 'Language':
                return m.skill_language();
            case 'Other':
                return m.skill_other();
            case 'Tool':
                return m.skill_tool();
        }
    });
</script>

<details name="skill">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <summary>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html skill.icon}
        <hgroup>
            <h1>
                {skill?.name}
            </h1>
            <p>
                {skill?.description}
            </p>
        </hgroup>
    </summary>

    <article>
        <section class="chips">
            {#snippet chipContent(content)}
                <p>
                    {content}
                </p>
            {/snippet}

            <div
                class:green={skill?.proficiency === 'Beginner'}
                class:red={skill?.proficiency === 'Skilled'}
                class:orange={skill?.proficiency === 'Intermediate'}
            >
                {@render chipContent(proficiency)}
            </div>

            <div
                class:blue={skill?.type === 'Tool'}
                class:green={skill?.type === 'Language'}
                class:orange={skill?.type === 'Framework'}
                class:purple={skill?.type === 'Other' || skill?.type === 'Backend'}
                class:teal={skill?.type === 'Frontend'}
            >
                {@render chipContent(type)}
            </div>
        </section>
        <section class="experience">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html skill.experience}
        </section>
    </article>
</details>

<style>
    details {
        @supports (interpolate-size: allow-keywords) {
            &::details-content {
                block-size: 0;

                transition-timing-function: var(--m3-easing);
                transition-duration: 600ms;
                transition-property: block-size, content-visibility;

                transition-behavior: allow-discrete;
            }
        }

        overflow: hidden;
        flex: 1 1 80ch;
        gap: 1rem;
        align-items: center;

        padding: 0.5rem 1rem;
        border-radius: 1rem;

        text-decoration: none;

        background: var(--overlay);
        outline: 2px solid transparent;

        summary {
            display: flex;
            gap: 1rem;
            align-items: center;

            font-size: 1.25rem;
            list-style: none;

            &::after {
                content: '+';
            }

            hgroup {
                flex-grow: 1;

                h1 {
                    font-size: 1.75rem;
                    line-height: 1.2;
                }
            }
        }

        &[open] {
            outline-color: var(--primary);

            &::details-content {
                block-size: auto;
            }

            summary::after {
                content: '-';
            }
        }

        article {
            display: flex;
            flex: 1 70ch;
            flex-direction: column;
            gap: 1rem;

            padding: 1rem 0;
            border-radius: 1rem;

            .chips {
                display: flex;
                gap: 0.5rem;

                div {
                    display: flex;
                    place-items: center;

                    height: 2rem;
                    padding: 0.75rem;
                    border-radius: 1rem;

                    &.green {
                        background: var(--green);
                    }

                    &.red {
                        background: var(--red);
                    }

                    &.blue {
                        background: var(--blue);
                    }

                    &.purple {
                        background: var(--purple);
                    }

                    &.orange {
                        background: var(--orange);
                    }

                    &.teal {
                        background: var(--teal);
                    }
                }

                p {
                    font-size: 1.25rem;
                    color: var(--overlay);
                }
            }

            .experience {
                font-size: 1.25rem;

                :global(p) {
                    margin-bottom: 0.5rem;
                }
            }
        }
    }
</style>
