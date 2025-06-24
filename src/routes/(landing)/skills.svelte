<script lang="ts">
    import type { PageData } from './$types';

    import Skill from './skill.svelte';

    interface Props {
        data: PageData;
    }
    const { data }: Props = $props();
</script>

<section>
    <h2>Skills</h2>

    <div>
        <ul>
            {#each data.skills as skill (skill.id)}
                <Skill {skill} />
            {/each}
        </ul>
    </div>
</section>

<style>
    section {
        border: solid var(--overlay);
        border-width: 2px 0;
        background: var(--surface);
    }

    h2 {
        width: min-content;
        margin: 0.5rem 0;
        margin-left: 1rem;

        font-size: 2.25rem;
        color: var(--primary);

        @media (width > 64rem) {
            margin-left: 2rem;
        }
    }

    div {
        display: flex;
        gap: 1rem;
        padding: 0 1.5rem;
        padding-bottom: 1rem;

        ul {
            display: flex;
            flex-flow: row wrap;
            gap: 1rem;

            width: 100%;
            padding-left: 0;

            list-style: none;
        }

        @media (width < 64rem) {
            flex-direction: column;
        }
    }
</style>
