<script lang="ts">
    import type { PageData } from './$types';

    import Skill from './skill.svelte';

    interface Props {
        data: PageData;
    }
    const { data }: Props = $props();
</script>

<section class="bg:surface by:2|overlay" id="about">
    <h2 class="my:2x text:9x fg:primary ml:4x w:min ml:8x@md">Skills</h2>

    <div class="flex gap:4x px:6x pb:4x flex:col@<md">
        <ul class="flex gap:4x list-style:none my:0 flex:row flex:wrap pl:0 w:full">
            {#each data.skills as skill (skill.id)}
                <Skill {skill} />
            {/each}
        </ul>
    </div>
</section>
