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

<details
    class="bg:overlay flex:80ch|1|0 gap:4x overflow:hidden r:4x text-decoration:none px:4x py:2x align-items:center fg:overlay outline:2 outline:transparent outline:primary|solid[open] fg:overlay:visited"
    name="skill"
>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <summary class="flex gap:4x list-style:none text:5x align-items:center content:'+'::after">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html skill.icon}
        <hgroup class="flex-grow:1">
            <h1 class="my:0 text:7x line-height:1.2">
                {skill?.name}
            </h1>
            <p class="my:0">
                {skill?.description}
            </p>
        </hgroup>
    </summary>

    <article class="flex flex:1 gap:4x r:4x py:4x box:border flex-basis:70ch flex:col">
        <!-- chips -->
        <section class="flex gap:2x">
            {#snippet chipContent(content)}
                <p class="$text:base my:0 text:5x fg:var(--text)">
                    {content}
                </p>
            {/snippet}

            <div
                class="flex p:3x place-items:center r:4x h:8x"
                class:bg:green={skill?.proficiency === 'Beginner'}
                class:bg:red={skill?.proficiency === 'Skilled'}
                class:bg:yellow={skill?.proficiency === 'Intermediate'}
            >
                {@render chipContent(proficiency)}
            </div>

            <div
                class="flex p:3x place-items:center r:4x h:8x"
                class:bg:blue={skill?.type === 'Tool'}
                class:bg:green={skill?.type === 'Language'}
                class:bg:orange={skill?.type === 'Framework'}
                class:bg:purple={skill?.type === 'Other' || skill?.type === 'Backend'}
                class:bg:teal={skill?.type === 'Frontend'}
            >
                {@render chipContent(type)}
            </div>
        </section>
        <section class="text:5x mt:0>p:first-child">
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
                transition-property: block-size, content-visibility;
                transition-duration: 600ms;
                transition-timing-function: var(--m3-easing);
                transition-behavior: allow-discrete;
            }
        }

        &[open] {
            &::details-content {
                block-size: auto;
            }

            summary::after {
                content: '-';
            }
        }
    }
</style>
