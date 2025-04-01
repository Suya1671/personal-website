<script module lang="ts">
    import type { Component } from 'svelte';

    import { localizeHref } from '$lib/paraglide/runtime';

    export interface ISkill {
        /**
         * Very short description or tagline of the skill
         */
        description: string;
        /**
         * My experience with the skill. In markdown.
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
        isSelected: boolean;
        skill: ISkill;
    }
    const { isSelected, skill }: Props = $props();

    let outline = isSelected ? 'outline:primary|solid' : 'outline:transparent';
</script>

<a
    class="flex align-items:center gap:4x outline:2 px:4x py:2x r:4x text-decoration:none text:overlay text:overlay:visited {outline}"
    data-sveltekit-noscroll
    href={localizeHref(`/?skill=${skill.id}`)}
>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html skill.icon}

    <h2 class="text:6x">
        {skill.name}
    </h2>
</a>
